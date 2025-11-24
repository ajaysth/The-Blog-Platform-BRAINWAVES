import { redirect } from "next/navigation";
import { getCachedSession } from "@/lib/session";
import DashboardLayout from "@/components/dashboard/dashboard-layout";

export default async function DashboardAuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCachedSession();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <DashboardLayout user={session.user}>
      {children}
    </DashboardLayout>
  );
}
