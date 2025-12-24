import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import DashboardOverview from "@/components/dashboard/dashboard-overview";
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";

async function DashboardData() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Fetch user stats
  const [posts, totalLikes, totalViews] = await Promise.all([
    prisma.post.findMany({
      where: { authorId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        _count: {
          select: { likes: true },
        },
      },
    }),
    prisma.like.count({
      where: {
        post: {
          authorId: session.user.id,
        },
      },
    }),
    prisma.post.aggregate({
      where: { authorId: session.user.id },
      _sum: {
        viewCount: true,
      },
    }),
  ]);

  const stats = {
    totalPosts: posts.length,
    totalLikes,
    totalViews: totalViews._sum.viewCount || 0,
    publishedPosts: posts.filter((p) => p.status === "PUBLISHED").length,
  };

  const recentPosts = posts.map((post) => ({
    id: post.id,
    title: post.title,
    status: post.status,
    views: post.viewCount,
    likes: post._count.likes,
    createdAt: post.createdAt.toISOString(),
  }));

  return (
    <DashboardOverview
      stats={stats}
      recentPosts={recentPosts}
      userName={session.user.name || "User"}
    />
  );
}

export default async function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardData />
    </Suspense>
  );
}