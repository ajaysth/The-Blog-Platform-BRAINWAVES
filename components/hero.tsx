"use client";

import Image from "next/image";
import { ArrowRight, TrendingUp } from "lucide-react";
import { motion, useInView, animate } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef } from "react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/30 to-accent-soft py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Badge className="bg-accent text-accent-foreground rounded-full px-4 py-1.5 w-fit">
                <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                Featured Stories
              </Badge>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-foreground leading-tight text-balance"
            >
              Discover Stories That
              <span className="text-primary block mt-2">Inspire & Inform</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground max-w-xl text-balance leading-relaxed"
            >
              Explore thoughtful insights on technology, design, lifestyle, and
              culture. Join thousands of readers in our journey of discovery and
              growth.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary-glow text-primary-foreground rounded-full px-8 h-12 text-base font-semibold shadow-elegant hover:shadow-hover transition-smooth group"
              >
                Start Reading
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap gap-8 pt-4"
            >
              <Stat value={12000} label="Active Readers" />
              <Stat value={500} label="Articles Published" />
              <Stat value={50} label="Expert Writers" />
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--primary-glow)))] rounded-3xl blur-3xl opacity-20 animate-pulse" />
            <div className="relative rounded-3xl overflow-hidden shadow-elegant hover:shadow-hover transition-smooth group">
              <Image
                src="/hero-blog.jpg"
                alt="Modern blog writing workspace with laptop and coffee"
                width={800}
                height={600}
                className="w-full h-auto object-cover group-hover:scale-105 transition-smooth duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/20 to-transparent opacity-80" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Decorations */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
      />
    </section>
  );
};

const Stat = ({ value, label }: { value: number; label: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      animate(0, value, {
        duration: 2,
        onUpdate(latest) {
          if (ref.current) {
            ref.current.textContent =
              Intl.NumberFormat("en-US", {
                notation: "compact",
                compactDisplay: "short",
              }).format(latest) + "+";
          }
        },
      });
    }
  }, [isInView, value]);

  return (
    <div>
      <div ref={ref} className="text-3xl font-display font-bold text-primary" />
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
};

export default Hero;
