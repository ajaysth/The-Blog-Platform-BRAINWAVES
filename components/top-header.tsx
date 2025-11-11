"use client";

import { motion } from "framer-motion";
import { Mail, Users } from "lucide-react";

export const TopHeader = () => {
  return (
    <div className="relative border-b border-white/10 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 text-sm">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 text-white/80"
          >
            <Users className="w-4 h-4" />
            <span>Join 50,000+ writers and readers worldwide</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">Get weekly newsletter</span>
            <span className="sm:hidden">Newsletter</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
