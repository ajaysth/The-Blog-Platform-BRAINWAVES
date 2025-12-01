"use client";

import { useState, useEffect, FC } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import logoBlack from "@/public/logo-black.png";
import logoWhite from "@/public/logo-white.png";
import flogoblack from "@/public/flogo-black.png";
import flogowhite from "@/public/flogo-white.png";
import ltWhite from "@/public/lt-white.png";
import ltBlack from "@/public/lt-black.png";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { toast } from "react-hot-toast";

import Image from "next/image";
import {
  Menu,
  Code,
  Moon,
  Sun,
  Home,
  Palette,
  Zap,
  BookOpen,
  Grid3x3,
  FileText,
  User,
  ChevronDown,
  LogOut,
  Settings,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import { Bookmark } from "lucide-react";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationBell } from "./ui/notification-bell";


interface NavbarClientProps {
  session: Session | null;
}

export const NavbarClient: FC<NavbarClientProps> = ({ session }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCategoryMouseEnter = () => {
    setActiveDropdown("posts");
  };

  const handleCategoryMouseLeave = () => {
    setActiveDropdown(null);
  };

  const handleSignOut = async () => {
    const promise = signOut({ callbackUrl: "/" });
    toast.promise(promise, {
      loading: "Signing out...",
      success: "Signed out successfully!",
      error: "Failed to sign out.",
    });
  };

  const handleSignIn = () => {
    signIn("google");
  };

  const postsCategories = [
    { name: "Technology", icon: Code, href: "/posts/technology" },
    { name: "Design", icon: Palette, href: "/posts/design" },
    { name: "Development", icon: Zap, href: "/posts/development" },
    { name: "Tutorials", icon: BookOpen, href: "/posts/tutorials" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 bg-background/80 backdrop-blur-lg border-b border-border/30`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.a
            href="/"
            className="flex items-center space-x-2"
            whileHover="hover"
          >
            {mounted && (
              <motion.div
                className="flex items-center space-x-2"
                variants={{ hover: { scale: 1.1 } }}
              >
                <motion.div variants={{ hover: { rotate: 360 } }}>
                  <Image
                    src={theme === 'light' ? logoBlack : logoWhite}
                    alt="Logo"
                    className="h-12 w-14"
                  />
                </motion.div>

                <motion.div >
                  <Image
                    src={theme === 'light' ? ltBlack : ltWhite}
                    alt="Logo 2"
                    className="h-6 w-40"
                  />
                </motion.div>
              </motion.div>
            )}

          
          </motion.a>

          <div className="hidden lg:flex items-center space-x-2 bg-secondary/50 p-1 rounded-full border border-border/30">
            <NavLink href="/" icon={<Home />}>
              Home
            </NavLink>
            <div
              className="relative"
              onMouseEnter={handleCategoryMouseEnter}
              onMouseLeave={handleCategoryMouseLeave}
            >
              <NavLink href="/category" icon={<Grid3x3 />}>
                Categories
              </NavLink>
              <AnimatePresence>
                {activeDropdown === "posts" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-0 mt-2 w-64 bg-background/95 backdrop-blur-xl border border-border/30 rounded-xl shadow-2xl shadow-black/10 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-xl opacity-50" />

                    <div className="relative p-3">
                      <div className="flex items-center gap-2 mb-3 px-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Blog Categories
                        </span>
                      </div>

                      {postsCategories.map((category, index) => (
                        <motion.div
                          key={category.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            href={category.href}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 transition-all duration-200 group"
                          >
                            <category.icon className="w-4 h-4 text-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-200" />
                            <span className="text-sm font-medium group-hover:text-primary transition-colors">
                              {category.name}
                            </span>
                            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                              <ChevronDown className="w-3 h-3 rotate-[-90deg] text-primary" />
                            </div>
                          </Link>
                        </motion.div>
                      ))}

                      <div className="border-t border-border/30 my-3" />

                      <Link
                        href="/category"
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 transition-all duration-200 text-primary font-medium text-sm border border-primary/20 hover:border-primary/30"
                      >
                        <span>Browse All Categories</span>
                        <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <NavLink href="/post" icon={<FileText />}>
              Posts
            </NavLink>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
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
                  {mounted && (theme === "light" ? <Sun /> : <Moon />)}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {/* Create Post Button - Only show when logged in */}
            {session && (
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link href="/dashboard/create">
                  <button className="px-4 py-1.5 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-full transition-colors shadow-lg hover:shadow-primary/30">
                    Create Post
                  </button>
                </Link>
              </motion.div>
            )}

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden">
              <motion.button
                onClick={() => setMenuOpen(!menuOpen)}
                whileTap={{ scale: 0.9 }}
              >
                <Menu />
              </motion.button>
            </div>

            {/* Auth Section */}
            <div className="hidden lg:flex items-center gap-2">
              {session ? (
                // Logged In - Show User Menu
                <>
                  <NotificationBell />
                  <Link href="/dashboard/bookmarks">
                    <Button variant="ghost" size="icon" className="relative">
                      <Bookmark className="h-5 w-5" />
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 px-3 py-2 rounded-full bg-secondary/50 hover:bg-secondary transition-all border border-border/30"
                      >
                        <Avatar className="w-7 h-7">
                          <AvatarImage
                            src={session.user?.image || ""}
                            alt={session.user?.name || ""}
                          />
                          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                            {session.user?.name?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium max-w-[100px] truncate">
                          {session.user?.name}
                        </span>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      </motion.button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">
                            {session.user?.name}
                          </p>
                          <p  className="text-xs text-muted-foreground truncate">
                            {session.user?.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="cursor-pointer">
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/dashboard/profile"
                          className="cursor-pointer"
                        >
                          <User className="w-4 h-4 mr-2" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/dashboard/settings"
                          className="cursor-pointer"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                // Not Logged In - Show Login/Signup Buttons
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:shadow-soft transition-all"
                    onClick={handleSignIn}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/30 transition-all"
                    onClick={handleSignIn}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border/30 bg-background/95 backdrop-blur-xl"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              <MobileNavLink href="/" icon={<Home />}>
                Home
              </MobileNavLink>
              <MobileNavLink href="/category" icon={<Grid3x3 />}>
                Categories
              </MobileNavLink>
              <MobileNavLink href="/post" icon={<FileText />}>
                Posts
              </MobileNavLink>

              {session ? (
                <>
                  <div className="border-t border-border/30 my-2 pt-2">
                    <div className="flex items-center gap-3 px-4 py-2">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={session.user?.image || ""}
                          alt={session.user?.name || ""}
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {session.user?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {session.user?.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {session.user?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <MobileNavLink href="/dashboard" icon={<LayoutDashboard />}>
                    Dashboard
                  </MobileNavLink>
                  <MobileNavLink href="/dashboard/profile" icon={<User />}>
                    Profile
                  </MobileNavLink>
                  <MobileNavLink href="/dashboard/settings" icon={<Settings />}>
                    Settings
                  </MobileNavLink>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="border-t border-border/30 my-2 pt-2 space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="lg"
                    onClick={handleSignIn}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                  <Button className="w-full" size="lg" onClick={handleSignIn}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const NavLink: FC<{
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ href, icon, children }) => {
  return (
    <Link
      href={href}
      className="relative px-3 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
    >
      {icon}
      {children}
    </Link>
  );
};

const MobileNavLink: FC<{
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ href, icon, children }) => {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
    >
      {icon}
      {children}
    </Link>
  );
};
