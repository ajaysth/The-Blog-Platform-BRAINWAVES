"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlogPostCard } from "@/components/blog-post-card";
import { BlogPostFilters } from "@/components/blog-post-filters";
import { Search, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import flogoblack from "@/public/flogo-black.png";
import { Post, User, Category, Tag } from "@prisma/client";

type PostWithRelations = Post & {
  author: User;
  tags: string[];
  likes: number;
  comments: number;
  category: Category | null;
};

interface BlogsPageProps {
  posts: PostWithRelations[];
}

const ITEMS_PER_LOAD = 6;

const BlogsPageClient = ({ posts }: BlogsPageProps) => {
  const [postsToShow, setPostsToShow] = useState(ITEMS_PER_LOAD);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      // Simulate network delay
      setPostsToShow((prev) => prev + ITEMS_PER_LOAD);
      setLoadingMore(false);
    }, 500);
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
                <Image
                  src={flogoblack}
                  alt="Sparkle"
                  width={16}
                  height={16}
                  className="h-4 w-4"
                />
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
                  className="bg-primary bg-clip-text text-transparent"
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
            </motion.div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <BlogPostFilters posts={posts} loading={false}>
              {(filteredPosts) => {
                const displayedPosts = filteredPosts.slice(0, postsToShow);
                const hasMorePosts = postsToShow < filteredPosts.length;

                return (
                  <AnimatePresence mode="wait">
                    {filteredPosts.length === 0 ? (
                      <motion.div
                        key="no-results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center py-20"
                      >
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                          <Search className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">
                          No articles found
                        </h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                          Try adjusting your search or filters to find what
                          you&apos;re looking for.
                        </p>
                        <Button variant="outline">Clear Filters</Button>
                      </motion.div>
                    ) : (
                      <>
                        <motion.div
                          key="results"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                          {displayedPosts.map((post) => (
                            <BlogPostCard
                              key={post.id}
                              post={post}
                              category={post.category || undefined}
                              selectedTags={[]}
                            />
                          ))}
                        </motion.div>
                        {hasMorePosts && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex justify-center mt-12"
                          >
                            <Button
                              onClick={handleLoadMore}
                              disabled={loadingMore}
                              className="px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                              {loadingMore ? (
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                              ) : (
                                <Sparkles className="h-5 w-5 mr-2" />
                              )}
                              {loadingMore ? "Loading..." : "Load More"}
                            </Button>
                          </motion.div>
                        )}
                      </>
                    )}
                  </AnimatePresence>
                );
              }}
            </BlogPostFilters>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BlogsPageClient;
