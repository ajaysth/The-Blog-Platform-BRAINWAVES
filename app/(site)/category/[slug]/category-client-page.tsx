"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, Loader2, Sparkles } from "lucide-react";
import { BlogPostCard } from "@/components/blog-post-card";
import { BlogPostFilters } from "@/components/blog-post-filters";
import { Category, Post, Tag, User } from "@prisma/client";

type PostWithRelations = Post & {
  author: User;
  tags: string[];
  likes: number;
  comments: number;
};

type CategoryWithPosts = Category & {
  posts: PostWithRelations[];
};

interface CategoryClientPageProps {
  category: CategoryWithPosts;
}

const ITEMS_PER_LOAD = 6;

const CategoryClientPage = ({ category }: CategoryClientPageProps) => {
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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 pt-24 pb-16">
        <div className="absolute inset-0 bg-grid-white/5" />
        <div className="container mx-auto px-4 relative z-10">
          <Link href="/category">
            <Button variant="ghost" className="mb-8 group -ml-4">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Categories
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div
              className={`inline-block h-2 w-32 rounded-full bg-gradient-to-r ${category.color} mb-6 shadow-lg`}
            />
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              {category.name}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover {category.posts.length} insightful articles curated for
              you
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-12">
        <div className="container mx-auto px-4">
          <BlogPostFilters posts={category.posts} loading={false}>
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
                            category={category}
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
      </main>
    </div>
  );
};

export default CategoryClientPage;
