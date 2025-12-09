"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, Variants } from "framer-motion";
import {
  Layout,
  FileText,
  Folder,
  Tag,
  Users,
  Settings,
  Menu,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: Layout },
  { name: "Posts", href: "/admin/posts", icon: FileText },
  { name: "Categories", href: "/admin/categories", icon: Folder },
  { name: "Tags", href: "/admin/tags", icon: Tag },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const sidebarVariants: Variants = {
  expanded: {
    width: "256px",
    transition: {
      type: "tween",
      duration: 0.3,
      ease: "easeOut",
    },
  },
  collapsed: {
    width: "64px",
    transition: {
      type: "tween",
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export function AdminSidebar({ user, isOpen, setIsOpen }: AdminSidebarProps) {
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
      <motion.aside
        variants={sidebarVariants}
        animate={isOpen ? "expanded" : "collapsed"}
        className="bg-primary text-white border-sidebar-border flex flex-col fixed left-0 top-0 h-full z-40 overflow-hidden"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {/* Logo Section */}
        <div className={`h-16 flex items-center ${isOpen ? "justify-between px-6" : "justify-center px-3"} border-b border-sidebar-border`}>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center text-sidebar-primary-foreground font-bold text-sm ${!isOpen && "w-10 h-10"}`}>
              B
            </div>
            {isOpen && (
              <span className="font-playfair-display font-bold text-sidebar-foreground truncate">
                BrainWaves
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 ${isOpen ? "px-3" : "px-2"} py-4 space-y-2`}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <motion.div
                key={item.href}
                whileHover={{ scale: 1.05,  transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className={`rounded-lg ${
                  isActive
                    ? "bg-black/20 text-white"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 ${isOpen ? "px-3" : "justify-center px-3"} py-2 group relative`}
                  title={!isOpen ? item.name : undefined}
                >
                  <Icon className="w-5 h-5 shrink-0 text-white" />
                  {isOpen && (
                    <span className="truncate text-sm font-medium">
                      {item.name}
                    </span>
                  )}
                   <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></div>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Footer - User Profile */}
        <div
          className={`border-t border-sidebar-border p-4 ${
            !isOpen && "text-center"
          }`}
        >
          <div className={`flex items-center gap-2 ${!isOpen && "justify-center"}`}>
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            {isOpen && (
              <div className="truncate flex-1 min-w-0">
                <p className="text-xs font-medium text-sidebar-foreground truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
}
