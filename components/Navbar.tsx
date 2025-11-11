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
  Moon,
  Sun,
  Home,
  Grid3x3,
  FileText,
  PenSquare,
  ArrowRight,
  Sparkles,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

let categoryLeaveTimeout: NodeJS.Timeout;

const Navbar: FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCategoryMouseEnter = () => {
    clearTimeout(categoryLeaveTimeout);
    setCategoriesOpen(true);
  };

  const handleCategoryMouseLeave = () => {
    categoryLeaveTimeout = setTimeout(() => {
      setCategoriesOpen(false);
    }, 300); // Increased timeout
  };

  const categories = [
    {
      name: "Technology",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=350&fit=crop",
      count: "124 posts",
      icon: "⚡",
    },
    {
      name: "Design",
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=350&fit=crop",
      count: "89 posts",
      icon: "🎨",
    },
    {
      name: "Development",
      image:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=350&fit=crop",
      count: "156 posts",
      icon: "💻",
    },
    {
      name: "Business",
      image:
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&h=350&fit=crop",
      count: "67 posts",
      icon: "📊",
    },
    {
      name: "Lifestyle",
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&h=350&fit=crop",
      count: "92 posts",
      icon: "✨",
    },
    {
      name: "Science",
      image:
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&h=350&fit=crop",
      count: "78 posts",
      icon: "🔬",
    },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`sticky top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border/30"
          : "bg-transparent"
      }`}
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
              onMouseEnter={handleCategoryMouseEnter}
              onMouseLeave={handleCategoryMouseLeave}
            >
              <NavLink href="#" icon={<Grid3x3 />}>
                Categories
              </NavLink>
              <AnimatePresence>
                {categoriesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[720px] bg-background/80 backdrop-blur-xl border border-border/30 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        {categories.map((category) => (
                          <CategoryCard
                            key={category.name}
                            category={category}
                          />
                        ))}
                      </div>
                      <motion.a
                        href="/categories"
                        className="group relative"
                        whileHover="hover"
                      >
                        <div className="flex items-center justify-center space-x-2 w-full py-3 px-4 rounded-xl bg-secondary hover:bg-accent/50 transition-colors duration-300 border border-border/50">
                          <motion.span className="text-sm font-semibold text-secondary-foreground group-hover:text-accent-foreground transition-colors duration-300 relative z-10">
                            Browse All Categories
                            <motion.div
                              className="absolute bottom-0 left-0 h-[2px] bg-primary"
                              initial={{ scaleX: 0, originX: 0 }}
                              variants={{ hover: { scaleX: 1 } }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                            />
                          </motion.span>
                          <motion.div variants={{ hover: { x: 5 } }}>
                            <ArrowRight className="h-4 w-4 text-secondary-foreground/70 group-hover:text-accent-foreground transition-colors duration-300" />
                          </motion.div>
                        </div>
                      </motion.a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <NavLink href="/posts" icon={<FileText />}>
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
                  {theme === "light" ? <Sun /> : <Moon />}
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
