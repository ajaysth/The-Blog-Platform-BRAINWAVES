"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Layout,
  FileText,
  Folder,
  Tag,
  Users,
  Settings,
  Menu,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: Layout },
  { name: "Posts", href: "/admin/posts", icon: FileText },
  { name: "Categories", href: "/admin/categories", icon: Folder },
  { name: "Tags", href: "/admin/tags", icon: Tag },
  { name: "Authors", href: "/admin/users", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden max-sm:fixed max-sm:top-4 max-sm:left-4 max-sm:z-50 max-sm:p-2 max-sm:bg-primary max-sm:text-primary-foreground max-sm:rounded-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          ${isOpen ? "w-64" : "w-20"} 
          bg-sidebar border-r border-sidebar-border 
          transition-all duration-300 ease-out
          flex flex-col
          relative
          max-sm:fixed max-sm:left-0 max-sm:top-0 max-sm:h-full max-sm:z-40
          ${!isOpen && "max-sm:hidden"}
        `}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-sidebar-border">
          {isOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center text-sidebar-primary-foreground font-bold text-sm">
                B
              </div>
              <span className="font-playfair-display font-bold text-sidebar-foreground truncate">
                Blog
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <motion.div
                key={item.href}
                whileHover={{ scale: 1.05 }}
                className={`rounded-lg ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2"
                  title={!isOpen ? item.name : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isOpen && (
                    <span className="truncate text-sm font-medium">
                      {item.name}
                    </span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className={`border-t border-sidebar-border p-4 ${
            !isOpen && "text-center"
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold text-xs flex-shrink-0">
              A
            </div>
            {isOpen && (
              <div className="truncate">
                <p className="text-xs font-medium text-sidebar-foreground">
                  Admin User
                </p>
                <p className="text-xs text-muted-foreground">
                  admin@blog.local
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
