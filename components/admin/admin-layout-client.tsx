"use client";

import { motion } from "framer-motion";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Session } from "next-auth";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  session: Session;
}

export function AdminLayoutClient({
  children,
  session,
}: AdminLayoutClientProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex h-screen bg-background">
        <AdminSidebar user={session.user} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader user={session.user} />
          <main className="flex-1 overflow-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {children}
            </motion.div>
          </main>
          <Toaster />
        </div>
      </div>
    </ThemeProvider>
  );
}
