import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard - BrainWaves",
  description: "Your personal dashboard",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Redirect to sign-in if not authenticated
  if (!session?.user) {
    redirect("/auth/signin");
  }

  return <div className="min-h-screen bg-background">{children}</div>;
}
