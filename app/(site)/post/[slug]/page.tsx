"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, Search } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { blogPosts, categories } from "@/data/blogPosts";
import { BlogPostCard } from "@/components/blog-post-card";
import { BlogPostFilters } from "@/components/blog-post-filters";
import { AnimatePresence, motion } from "framer-motion";

export default function BlogPost() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;
  const post = blogPosts.find((p) => p.slug === slug);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Simulate a 1.5 second loading time
    return () => clearTimeout(timer);
  }, []);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-display font-bold">Post Not Found</h1>
            <Button onClick={() => router.push("/")} className="rounded-full">
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Image */}
        <div className="relative h-[50vh] lg:h-[60vh] overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        {/* Content */}
        <article className="container mx-auto px-4 -mt-32 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-card rounded-3xl shadow-elegant p-8 lg:p-12 mb-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-glow transition-smooth mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="font-semibold">Back to Home</span>
              </Link>

              <Badge className="bg-accent text-accent-foreground rounded-full px-4 py-1.5 mb-6">
                {post.category}
              </Badge>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8 pb-8 border-b border-border">
                <div className="flex items-center gap-3">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-background"
                  />
                  <div>
                    <div className="font-semibold text-foreground">
                      {post.author.name}
                    </div>
                    <div className="text-sm">Contributing Writer</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <div className="ml-auto flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                  {post.excerpt}
                </p>

                <p className="mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit...
                </p>

                <h2 className="text-2xl font-display font-bold mt-8 mb-4">
                  Understanding the Impact
                </h2>

                <p className="mb-4">
                  Duis aute irure dolor in reprehenderit in voluptate velit
                  esse...
                </p>

                <p className="mb-4">
                  Sed ut perspiciatis unde omnis iste natus error sit
                  voluptatem...
                </p>

                <h2 className="text-2xl font-display font-bold mt-8 mb-4">
                  Key Takeaways
                </h2>

                <ul className="space-y-2 mb-6">
                  <li>Innovation drives progress in unexpected ways</li>
                  <li>Understanding context is crucial for success</li>
                  <li>Collaboration enhances creative outcomes</li>
                  <li>Continuous learning opens new opportunities</li>
                </ul>

                <p className="mb-4">
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut...
                </p>
              </div>
            </div>

            {/* Author Bio */}
            <div className="bg-secondary/50 rounded-3xl p-8 mb-16">
              <div className="flex gap-6 items-start">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-background"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-display font-bold text-foreground mb-2">
                    About {post.author.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {post.author.name} is a passionate writer and thought leader
                    in {post.category.toLowerCase()}.
                  </p>
                  <Button variant="outline" className="rounded-full">
                    Follow Author
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="max-w-7xl mx-auto mb-16">
              <h2 className="text-3xl font-display font-bold text-foreground mb-8">
                Related Articles
              </h2>
              <BlogPostFilters posts={relatedPosts} loading={loading}>
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
                            category={categories.find(
                              (c) => c.name === post.category
                            )}
                            selectedTags={[]}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </BlogPostFilters>
            </div>
          )}
        </article>
      </main>
    </div>
  );
}
