"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";
import { Session } from "next-auth";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  session: Session;
}

const mainContentVariants = {
  expanded: {
    marginLeft: "256px",
    transition: { type: "tween", duration: 0.3, ease: "easeOut" },
  },
  collapsed: {
    marginLeft: "64px",
    transition: { type: "tween", duration: 0.3, ease: "easeOut" },
  },
};

export function AdminLayoutClient({
  children,
  session,
}: AdminLayoutClientProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AdminSidebar user={session.user} isOpen={isOpen} setIsOpen={setIsOpen} />
      <motion.div
        variants={mainContentVariants}
        animate={isOpen ? "expanded" : "collapsed"}
        className="flex-1 flex flex-col overflow-hidden"
      >
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
        <Toaster position="bottom-right" />
      </motion.div>
    </ThemeProvider>
  );
}
