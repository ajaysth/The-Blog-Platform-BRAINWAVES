"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Search, User, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function AdminHeader() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setMounted(true);
  }, []);

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search posts, categories, tags..."
            className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-8">
        <motion.button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="relative h-8 w-8 flex items-center justify-center rounded-full hover:bg-accent/50 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={theme}
              initial={{ y: -20, opacity: 0, rotate: -90 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 20, opacity: 0, rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              {mounted && (theme === "light" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />)}
            </motion.div>
          </AnimatePresence>
        </motion.button>
        <button className="p-2 hover:bg-background rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
        </button>
        <button className="flex items-center gap-2 px-3 py-2 hover:bg-background rounded-lg transition-colors">
          <User className="w-5 h-5 text-foreground" />
          <span className="text-sm text-foreground max-sm:hidden">Profile</span>
        </button>
        <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors">
          <LogOut className="w-5 h-5 text-destructive" />
        </button>
      </div>
    </header>
  );
}
