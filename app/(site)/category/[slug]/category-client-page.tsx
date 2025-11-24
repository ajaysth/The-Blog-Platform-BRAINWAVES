"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";
import { BlogPostCard } from "@/components/blog-post-card";
import { BlogPostFilters } from "@/components/blog-post-filters";
import { Category, Post, Tag, User } from "@prisma/client";

type PostWithRelations = Post & {
  author: User;
  tags: Tag[];
};

type CategoryWithPosts = Category & {
  posts: PostWithRelations[];
};

interface CategoryClientPageProps {
  category: CategoryWithPosts;
}

const CategoryClientPage = ({ category }: CategoryClientPageProps) => {
  const categoryPosts = category.posts;

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
              className={`inline-block h-2 w-32 rounded-full bg-gradient-to-r from-primary to-secondary mb-6 shadow-lg`}
            />
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              {category.name}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover {categoryPosts.length} insightful articles curated for
              you
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-12">
        <div className="container mx-auto px-4">
          <BlogPostFilters posts={categoryPosts} loading={false}>
            {(filteredPosts) => (
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
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  >
                    {filteredPosts.map((post) => (
                      <BlogPostCard
                        key={post.id}
                        post={post}
                        category={category}
                        selectedTags={[]}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </BlogPostFilters>
        </div>
      </main>
    </div>
  );
};

export default CategoryClientPage;
