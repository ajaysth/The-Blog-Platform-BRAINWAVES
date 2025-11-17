"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import flogoblack from "@/public/flogo-black.png";
import flogowhite from "@/public/flogo-white.png";
import { useTheme } from "next-themes";
import {
  Mail,
  Send,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  Heart,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FooterLink {
  name: string;
  href: string;
}

interface Category {
  name: string;
  count: number;
  href: string;
}

interface SocialLink {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  href: string;
  label: string;
  color: string;
}

export default function Footer() {
  const [email, setEmail] = useState<string>("");
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  const footerLinks: Record<string, FooterLink[]> = {
    company: [
      { name: "About Us", href: "/about" },
      { name: "Our Team", href: "/team" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
    ],
    resources: [
      { name: "Blog", href: "/blog" },
      { name: "Newsletter", href: "/newsletter" },
      { name: "Documentation", href: "/docs" },
      { name: "Support", href: "/support" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Disclaimer", href: "/disclaimer" },
    ],
  };

  const categories: Category[] = [
    { name: "Technology", count: 156, href: "/category/technology" },
    { name: "Design", count: 89, href: "/category/design" },
    { name: "Business", count: 124, href: "/category/business" },
    { name: "Lifestyle", count: 67, href: "/category/lifestyle" },
    { name: "Health", count: 45, href: "/category/health" },
    { name: "Travel", count: 78, href: "/category/travel" },
  ];

  const socialLinks: SocialLink[] = [
    {
      icon: Twitter,
      href: "https://twitter.com",
      label: "Twitter",
      color: "hover:text-[#1DA1F2]",
    },
    {
      icon: Facebook,
      href: "https://facebook.com",
      label: "Facebook",
      color: "hover:text-[#4267B2]",
    },
    {
      icon: Instagram,
      href: "https://instagram.com",
      label: "Instagram",
      color: "hover:text-[#E4405F]",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com",
      label: "LinkedIn",
      color: "hover:text-[#0077B5]",
    },
    {
      icon: Github,
      href: "https://github.com",
      label: "GitHub",
      color: "hover:text-foreground",
    },
    {
      icon: Youtube,
      href: "https://youtube.com",
      label: "YouTube",
      color: "hover:text-[#FF0000]",
    },
  ];

  return (
    <footer className="relative bg-background border-t border-border/50  overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-accent/10 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Brand Section */}
            <motion.div
              className="lg:col-span-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 mb-4 group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full group-hover:bg-accent/30 transition-all" />
                  {mounted && <Image src={theme === 'light' ? flogoblack : flogowhite} alt="Logo" width={40} height={40} />}
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
                  BRAINWAVES
                </span>
              </Link>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                Exploring ideas, sharing insights, and inspiring minds through
                thoughtful content and meaningful conversations.
              </p>

              {/* Social Links */}
              <div className="flex flex-wrap gap-2">
                <TooltipProvider>
                  {socialLinks.map((social, index) => (
                    <Tooltip key={social.label}>
                      <TooltipTrigger asChild>
                        <motion.a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-2 rounded-lg bg-muted/50 hover:bg-accent/10 text-muted-foreground ${social.color} transition-all duration-300 hover:scale-110`}
                          aria-label={social.label}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          whileHover={{ y: -2 }}
                        >
                          <social.icon className="w-5 h-5" />
                        </motion.a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{social.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                Company
                <div className="h-px flex-1 bg-gradient-to-r from-accent/50 to-transparent" />
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-accent transition-colors duration-200 inline-flex items-center gap-1 group"
                    >
                      <ArrowRight className="w-0 h-4 group-hover:w-4 transition-all duration-200 opacity-0 group-hover:opacity-100" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Resources */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                Resources
                <div className="h-px flex-1 bg-gradient-to-r from-accent/50 to-transparent" />
              </h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-accent transition-colors duration-200 inline-flex items-center gap-1 group"
                    >
                      <ArrowRight className="w-0 h-4 group-hover:w-4 transition-all duration-200 opacity-0 group-hover:opacity-100" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Newsletter Section */}
            <motion.div
              className="lg:col-span-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-accent" />
                Newsletter
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Subscribe to get the latest articles and insights delivered to
                your inbox.
              </p>

              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pr-12 bg-muted/50 border-border/50 focus:border-accent transition-all"
                    required
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                {isSubscribed && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-accent flex items-center gap-1"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                    Thanks for subscribing!
                  </motion.p>
                )}
              </form>

              {/* Popular Categories */}
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">
                  Popular Categories
                </h4>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 4).map((category, index) => (
                    <motion.div
                      key={category.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Link href={category.href}>
                        <Badge
                          variant="secondary"
                          className="hover:bg-accent/10 hover:text-accent hover:border-accent/50 transition-all cursor-pointer"
                        >
                          {category.name}
                          <span className="ml-1 text-xs opacity-70">
                            ({category.count})
                          </span>
                        </Badge>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Bottom Bar */}
        <motion.div
          className="py-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} Brainwaves. All rights reserved. Made
              with{" "}
              <Heart className="w-4 h-4 inline text-accent fill-current animate-pulse" />{" "}
              by the Brainwaves team.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-accent transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 p-3 bg-accent text-accent-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -2 }}
        aria-label="Scroll to top"
      >
        <ArrowRight className="w-5 h-5 -rotate-90" />
      </motion.button>
    </footer>
  );
}
