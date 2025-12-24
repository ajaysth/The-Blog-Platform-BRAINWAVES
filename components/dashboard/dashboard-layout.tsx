"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Heart,
  Bell,
  User,
  Settings,
  PenSquare,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const sidebarItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Posts",
    href: "/dashboard/posts",
    icon: FileText,
  },
  {
    label: "Create Post",
    href: "/dashboard/create",
    icon: PenSquare,
  },
  {
    label: "Liked Posts",
    href: "/dashboard/likes",
    icon: Heart,
  },
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function DashboardLayout({
  children,
  user,
}: DashboardLayoutProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 ease-in-out",
          "lg:translate-x-0",
          isExpanded ? "w-64" : "w-20",
          isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full",
          "lg:block"
        )}
        onMouseEnter={() => !isMobileOpen && setIsExpanded(true)}
        onMouseLeave={() => !isMobileOpen && setIsExpanded(false)}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-bold text-lg">
                  B
                </span>
              </div>
              <div
                className={cn(
                  "transition-all duration-300",
                  isExpanded || isMobileOpen
                    ? "opacity-100 w-auto"
                    : "opacity-0 w-0 overflow-hidden"
                )}
              >
                <h2 className="font-semibold text-lg whitespace-nowrap">
                  Brainwaves
                </h2>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {sidebarItems.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    "hover:bg-accent group relative",
                    isActive && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <Icon
                    size={20}
                    className={cn(
                      "flex-shrink-0",
                      isActive && "text-primary-foreground"
                    )}
                  />
                  <span
                    className={cn(
                      "whitespace-nowrap transition-all duration-300 font-medium",
                      isExpanded || isMobileOpen
                        ? "opacity-100 w-auto"
                        : "opacity-0 w-0 overflow-hidden"
                    )}
                  >
                    {item.label}
                  </span>

                  {isActive && (
                    <ChevronRight
                      size={16}
                      className={cn(
                        "ml-auto",
                        isExpanded || isMobileOpen ? "block" : "hidden"
                      )}
                    />
                  )}

                  {/* Tooltip for collapsed state */}
                  {!isExpanded && !isMobileOpen && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-popover text-popover-foreground rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-lg z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0 overflow-hidden">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={20} />
                )}
              </div>
              <div
                className={cn(
                  "transition-all duration-300",
                  isExpanded || isMobileOpen
                    ? "opacity-100 w-auto"
                    : "opacity-0 w-0 overflow-hidden"
                )}
              >
                <p className="font-medium text-sm whitespace-nowrap">
                  {user.name || "User"}
                </p>
                <p className="text-xs text-muted-foreground whitespace-nowrap truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Content */}
      <main
        className={cn(
          "transition-all duration-300",
          "pt-20 lg:pt-16", // Changed lg:pt-0 to lg:pt-16
          isExpanded ? "lg:ml-64" : "lg:ml-20"
        )}
      >
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}