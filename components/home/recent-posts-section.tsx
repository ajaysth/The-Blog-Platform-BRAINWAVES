"use client";

import { motion } from "framer-motion";
import BlogCard from "@/components/blog-card";
import { StaticImageData } from "next/image";

interface FormattedPost {
  id: string;
  title: string;
  excerpt: string;
  image: string | StaticImageData;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  featured?: boolean;
  isLiked: boolean;
  userId?: string;
}

interface RecentPostsSectionProps {
  formattedPosts: FormattedPost[];
  userId?: string;
}

export default function RecentPostsSection({
  formattedPosts,
  userId,
}: RecentPostsSectionProps) {
  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            Latest Articles
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fresh perspectives and insights from our community of writers
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {formattedPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <BlogCard {...post} userId={userId} isLiked={post.isLiked} />
            </motion.div>
          ))}
        </div>

        {formattedPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              No articles found yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
