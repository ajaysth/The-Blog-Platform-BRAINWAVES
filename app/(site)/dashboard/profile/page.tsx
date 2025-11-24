import { redirect } from "next/navigation";
import { auth } from "@/lib/auth"; // Import the auth function directly
import prisma from "@/lib/prisma";
import ProfileEditForm from "@/components/dashboard/profile-edit-form";

export default async function ProfilePage() {
  const session = await auth(); // Use the auth() function to get the session

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Fetch user profile
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: true,
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  const profileData = {
    name: user.name || "",
    email: user.email || "",
    bio: user.bio || "",
    phoneNumber: user.profile?.phoneNumber || "",
    dateOfBirth: user.profile?.dateOfBirth?.toISOString().split("T")[0] || "",
    gender: user.profile?.gender || "",
    location: user.profile?.location || "",
    occupation: user.profile?.occupation || "",
    company: user.profile?.company || "",
    website: user.profile?.website || "",
    githubUrl: user.profile?.githubUrl || "",
    linkedinUrl: user.profile?.linkedinUrl || "",
    twitterUrl: user.profile?.twitterUrl || "",
    instagramUrl: user.profile?.instagramUrl || "",
    facebookUrl: user.profile?.facebookUrl || "",
    youtubeUrl: user.profile?.youtubeUrl || "",
    image: user.image || "",
  };

  async function handleSave(data: typeof profileData) {
    "use server";
    
    // Update user and profile
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        email: data.email,
        bio: data.bio,
        image: data.image,
      },
    });

    // Upsert profile
    await prisma.profile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        phoneNumber: data.phoneNumber,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        location: data.location,
        occupation: data.occupation,
        company: data.company,
        website: data.website,
        githubUrl: data.githubUrl,
        linkedinUrl: data.linkedinUrl,
        twitterUrl: data.twitterUrl,
        instagramUrl: data.instagramUrl,
        facebookUrl: data.facebookUrl,
        youtubeUrl: data.youtubeUrl,
      },
      update: {
        phoneNumber: data.phoneNumber,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        location: data.location,
        occupation: data.occupation,
        company: data.company,
        website: data.website,
        githubUrl: data.githubUrl,
        linkedinUrl: data.linkedinUrl,
        twitterUrl: data.twitterUrl,
        instagramUrl: data.instagramUrl,
        facebookUrl: data.facebookUrl,
        youtubeUrl: data.youtubeUrl,
      },
    });
  }

  return <ProfileEditForm profile={profileData} onSave={handleSave} />;
}