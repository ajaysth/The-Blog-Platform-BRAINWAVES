"use client";
import { motion } from "framer-motion";
import { DashboardOverview } from "@/components/admin/dashboard-overview";

export default function AdminDashboard() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="mb-8" variants={itemVariants}>
        <h1 className="text-4xl font-playfair-display font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your blog management system. Here's your content overview.
        </p>
      </motion.div>
      <motion.div variants={itemVariants}>
        <DashboardOverview />
      </motion.div>
    </motion.div>
  );
}
