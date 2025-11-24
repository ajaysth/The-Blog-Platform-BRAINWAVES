import { Suspense } from "react";
import DashboardAuthWrapper from "@/components/dashboard/dashboard-auth-wrapper";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <DashboardAuthWrapper>
        {children}
      </DashboardAuthWrapper>
    </Suspense>
  );
}
