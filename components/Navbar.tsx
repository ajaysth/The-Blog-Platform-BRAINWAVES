"use client";

import { useState, useEffect, FC, useRef } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";

import {
  Menu,
  X,
  Code,
  Moon,
  Sun,
  Home,
  Palette,
  Zap,
  BookOpen,
  Grid3x3,
  FileText,
  PenSquare,
  ArrowRight,
  Sparkles,
  User,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const Navbar: FC = () => {
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
            <motion.div variants={{ hover: { rotate: 360, scale: 1.2 } }}>
              <Sparkles className="text-primary h-6 w-6" />
            </motion.div>
            <span className="text-lg font-semibold text-foreground">
              Brainwaves
            </span>
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
                    {/* Gradient border effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-xl opacity-50" />

                    <div className="relative p-3">
                      {/* Header */}
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

            <motion.a
              href="/create"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <button className="px-4 py-1.5 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-full transition-colors shadow-lg hover:shadow-primary/30">
                Create Post
              </button>
            </motion.a>

            <div className="lg:hidden">
              <motion.button
                onClick={() => setMenuOpen(!menuOpen)}
                whileTap={{ scale: 0.9 }}
              >
                <Menu />
              </motion.button>
            </div>
            <div>
              <Link href={"/login"}>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2 hover:shadow-soft transition-all"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Link href={"/register"}>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2 hover:shadow-soft transition-all"
                >
                  <User className="w-4 h-4 mr-2" />
                  Signup
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

const NavLink: FC<{
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ href, icon, children }) => {
  return (
    <a
      href={href}
      className="relative px-3 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
    >
      {icon}
      {children}
    </a>
  );
};

const CategoryCard: FC<{ category: any }> = ({ category }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xTransform = useTransform(x, [-100, 100], [-10, 10]);
  const yTransform = useTransform(y, [-100, 100], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      x.set(e.clientX - rect.left - rect.width / 2);
      y.set(e.clientY - rect.top - rect.height / 2);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      key={category.name}
      href={`/categories/${category.name.toLowerCase()}`}
      className="group relative block overflow-hidden rounded-xl"
      style={{
        rotateX: yTransform,
        rotateY: xTransform,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover="hover"
    >
      <div
        className="absolute inset-0"
        style={{ transform: "translateZ(8px)" }}
      >
        <motion.img
          src={category.image}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover"
          variants={{ hover: { scale: 1.2 } }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
      </div>
      <div
        className="absolute inset-0 p-4 flex flex-col justify-end"
        style={{ transform: "translateZ(16px)" }}
      >
        <h3 className="font-bold text-white text-shadow-lg">{category.name}</h3>
        <p className="text-xs text-white/80 text-shadow">{category.count}</p>
      </div>
      <motion.div
        className="absolute top-4 right-4 text-2xl opacity-80"
        style={{ transform: "translateZ(24px)" }}
        variants={{ hover: { scale: 1.2, rotate: 15 } }}
      >
        {category.icon}
      </motion.div>
    </motion.a>
  );
};

export default Navbar;
