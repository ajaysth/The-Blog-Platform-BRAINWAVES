"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import flogoblack from "@/public/flogo-black.png";

import { categories } from "@/data/blogPosts";
import { ArrowRight, Layers, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const CategoriesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <main className="pt-24 pb-16 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-40 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          />
        </div>

        {/* Header */}
        <section className="container mx-auto px-4 mb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-full px-6 py-2 mb-6 backdrop-blur-sm"
            >
              <Image src={flogoblack} alt="Sparkle" width={16} height={16} className="w-4 h-4" />
              <span className="text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Explore by Category
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent leading-tight"
            >
              Browse Categories
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-muted-foreground"
            >
              Discover articles organized by topics that matter to you
            </motion.p>
          </motion.div>
        </section>

        {/* Categories Grid */}
        <section className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <Link href={`/category/${category.id}`}>
                  <Card className="group relative overflow-hidden h-full border-0 bg-gradient-to-br from-card via-card to-muted/20 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500">
                    {/* Animated gradient border */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    />

                    {/* Top accent line */}
                    <motion.div
                      className={`h-1 bg-gradient-to-r ${category.color}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                    />

                    {/* Glow effect on hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
                    />

                    <CardContent className="p-8 relative z-10">
                      <div className="flex items-start justify-between mb-6">
                        <motion.h3
                          className="text-2xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:from-primary group-hover:to-accent transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                        >
                          {category.name}
                        </motion.h3>
                        <motion.div
                          whileHover={{ x: 4, scale: 1.2 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                        </motion.div>
                      </div>

                      <p className="text-muted-foreground mb-6 group-hover:text-foreground/80 transition-colors duration-300">
                        Explore {category.count} carefully curated articles
                      </p>

                      <motion.div
                        className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-gradient-to-r ${category.color} text-white font-semibold shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Layers className="w-4 h-4" />
                        <span>{category.count} Articles</span>
                      </motion.div>
                    </CardContent>

                    {/* Corner accent */}
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CategoriesPage;
