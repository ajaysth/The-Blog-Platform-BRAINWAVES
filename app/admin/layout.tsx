import { Suspense } from "react";
import { AdminAuthHandler } from "@/components/admin/admin-auth-handler";
import { Infinity } from 'ldrs/react';
import 'ldrs/react/Infinity.css'; // Import the CSS for the spinner

export const metadata = {
  title: "Admin Panel - BrainWaves",
  description: "Admin dashboard for BrainWaves",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <Infinity
            size="55"
            stroke="4"
            strokeLength="0.15"
            bgOpacity="0.1"
            speed="1.3"
            color="hsl(var(--primary))"
          />
        </div>
      }
    >
      <AdminAuthHandler>{children}</AdminAuthHandler>
    </Suspense>
  );
}
