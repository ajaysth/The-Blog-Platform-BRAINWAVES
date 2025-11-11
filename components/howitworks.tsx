"use client";

import { motion } from "framer-motion";
import { UserPlus, PenTool, Share2, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Account",
    description:
      "Sign up in seconds and join our community of writers and readers",
    color: "text-emerald-600",
  },
  {
    icon: PenTool,
    title: "Write & Publish",
    description:
      "Use our intuitive editor to craft and publish beautiful stories",
    color: "text-blue-600",
  },
  {
    icon: Share2,
    title: "Share & Engage",
    description:
      "Connect with readers and build your audience across the platform",
    color: "text-purple-600",
  },
  {
    icon: TrendingUp,
    title: "Grow Together",
    description:
      "Watch your reach expand as your content resonates with readers",
    color: "text-amber-600",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start your writing journey in four simple steps
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-1/4 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ y: -8 }}
                className="relative"
              >
                <div className="bg-card border border-border rounded-2xl p-6 text-center h-full transition-smooth hover:shadow-elegant hover:border-primary/20">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 mb-6 ${step.color}`}
                  >
                    <Icon className="h-8 w-8" />
                  </motion.div>

                  {/* Step Number */}
                  <div className="mb-3 flex items-center justify-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
                      {index + 1}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-xl text-foreground mb-3">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
