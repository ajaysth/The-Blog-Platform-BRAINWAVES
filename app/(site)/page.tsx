"use client";
import CategoryFilter from "@/components/explorebycategory";
import FeaturedAuthors from "@/components/featured-authors";
import Hero from "@/components/hero";
import HowItWorks from "@/components/howitworks";
import { useState } from "react";
import { motion } from "framer-motion";
import { blogPosts } from "@/data/blogPosts";
import BlogCard from "@/components/blog-card";
import Stats from "@/components/stats";
import Newsletter from "@/components/newsletter";
import CTA1 from "@/components/mvpblocks/cta-1";

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  featured?: boolean;
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts =
    activeCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === activeCategory);

  return (
    <main>
      <Hero />
      <HowItWorks />
      {/* Categories Filter */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
              Explore by Category
            </h2>
            <p className="text-muted-foreground">
              Find content that matches your interests
            </p>
          </div>

          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </section>
      <FeaturedAuthors />

      {/* Recent Posts Grid */}
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
              {activeCategory === "All"
                ? "Latest Articles"
                : `${activeCategory} Articles`}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Fresh perspectives and insights from our community of writers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredPosts.slice(0, 6).map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <BlogCard {...post} />
              </motion.div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">
                No articles found in this category yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
      <Stats />
      <Newsletter />
      <CTA1 />
    </main>
  );
}
