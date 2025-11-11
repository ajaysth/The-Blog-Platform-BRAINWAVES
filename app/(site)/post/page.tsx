"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import BlogCard from "@/components/blog-card";
import CategoryFilter from "@/components/explorebycategory";
import { blogPosts } from "@/data/blogPosts";
import {
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const BlogsPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 6;

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      activeCategory === "All" || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return (
          new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
        );
      case "oldest":
        return (
          new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime()
        );
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedPosts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedPosts = sortedPosts.slice(startIndex, endIndex);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSort = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.0, 0.0, 0.2, 1.0] as const, // Using cubic bezier for easeOut
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-secondary">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl"
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 12,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              style={{ willChange: "transform" }}
            />
            <motion.div
              className="absolute -bottom-32 -left-32 w-72 h-72 bg-gradient-to-tr from-accent/15 to-primary/15 rounded-full blur-3xl"
              animate={{
                y: [0, 20, 0],
              }}
              transition={{
                duration: 14,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              style={{ willChange: "transform" }}
            />
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-full px-4 py-2 mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary">
                  Explore Our Articles
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-balance mb-6 leading-tight">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="inline"
                >
                  Discover{" "}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="gradient-primary bg-clip-text text-transparent"
                >
                  Insights
                </motion.span>
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto"
              >
                Explore our complete collection of articles covering the latest
                trends, tips, and strategies
              </motion.p>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="relative max-w-xl mx-auto group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-lg group-hover:blur-xl transition-all opacity-0 group-focus-within:opacity-100" />
                <div className="relative flex items-center">
                  <Search className="absolute left-4 h-5 w-5 text-muted-foreground pointer-events-none" />
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-12 h-14 text-base rounded-full border-2 border-primary/20 focus:border-primary bg-white/50 backdrop-blur-sm transition-all hover:border-primary/40 focus:bg-white"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Category Filter and Sort Controls */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="py-12 bg-white/50 backdrop-blur-sm border-b border-primary/10  top-0 z-20"
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-8">
              {/* Category Filter */}
              <div className="overflow-x-auto">
                <CategoryFilter
                  activeCategory={activeCategory}
                  onCategoryChange={handleCategoryChange}
                />
              </div>

              <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-t border-primary/10 pt-4">
                <p className="text-sm font-medium text-foreground">
                  Found{" "}
                  <span className="font-bold text-primary">
                    {sortedPosts.length}
                  </span>{" "}
                  article
                  {sortedPosts.length !== 1 ? "s" : ""}
                </p>

                <div className="flex items-center gap-3">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  <Select value={sortBy} onValueChange={handleSort}>
                    <SelectTrigger className="w-44 border-primary/20 hover:border-primary/40 bg-white/50">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">Latest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="title-asc">Title (A - Z)</SelectItem>
                      <SelectItem value="title-desc">Title (Z - A)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Blog Grid */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            {sortedPosts.length > 0 ? (
              <>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16"
                >
                  {paginatedPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      variants={itemVariants}
                      whileHover={{ y: -8 }}
                    >
                      <BlogCard {...post} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="flex flex-wrap items-center justify-center gap-3 mt-12"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="flex items-center gap-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                    </motion.div>

                    <div className="flex items-center gap-2 flex-wrap justify-center">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <motion.div
                            key={page}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant={
                                currentPage === page ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className={`min-w-10 font-semibold transition-all ${
                                currentPage === page
                                  ? "bg-gradient-to-r from-primary to-accent text-white border-0"
                                  : "border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                              }`}
                            >
                              {page}
                            </Button>
                          </motion.div>
                        )
                      )}
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center py-20"
              >
                <p className="text-2xl font-bold text-foreground mb-2">
                  No articles found
                </p>
                <p className="text-muted-foreground">
                  Try adjusting your search or category filter
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default BlogsPage;
