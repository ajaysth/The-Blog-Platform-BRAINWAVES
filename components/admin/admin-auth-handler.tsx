import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminLayoutClient } from "@/components/admin/admin-layout-client";

export async function AdminAuthHandler({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Redirect to sign-in if not authenticated
  if (!session?.user) {
    // Using a relative path is more robust
    redirect("/auth/signin");
  }

  return <AdminLayoutClient session={session}>{children}</AdminLayoutClient>;
}
