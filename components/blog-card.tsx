"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LikeButton } from "@/components/ui/like-button"; // New import

import { StaticImageData } from "next/image";

interface BlogCardProps {
  id: string;
  title: string;
  slug: string;
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
  isLiked: boolean; // New prop
  userId?: string; // New optional prop
}

const BlogCard = ({
  id,
  title,
  excerpt,
  slug,
  image,
  category,
  author,
  date,
  readTime,
  featured = false,
  isLiked, // Destructure new prop
  userId, // Destructure new prop
}: BlogCardProps) => {
  return (
    <Card
      className={`group overflow-hidden border-border bg-card shadow-card hover:shadow-hover transition-smooth ${
        featured ? "lg:col-span-2" : ""
      }`}
    >
      <Link href={`/post/${slug}`} className="block">
        <div className="relative overflow-hidden aspect-video">
          <Image
            src={image}
            alt={title}
            width={800}
            height={450}
            className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />

          <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground rounded-full px-3 py-1">
            {category}
          </Badge>

          {userId && ( // Conditionally render if userId exists
            <div className="absolute top-4 right-4 z-10">
              <LikeButton postId={id} isLiked={isLiked} />
            </div>
          )}
        </div>

        <div className="p-6 space-y-4">
          {/* Author & Meta */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Image
              src={author.avatar}
              alt={author.name}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-background"
            />
            <span className="font-medium text-foreground">{author.name}</span>
            <span className="text-border">•</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{date}</span>
            </div>
            <span className="text-border">•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{readTime}</span>
            </div>
          </div>

          {/* Title & Excerpt */}
          <div className="space-y-2">
            <h3
              className={`font-display font-bold text-foreground group-hover:text-primary transition-smooth line-clamp-2 ${
                featured ? "text-2xl lg:text-3xl" : "text-xl lg:text-2xl"
              }`}
            >
              {title}
            </h3>

            <p
              className={`text-muted-foreground leading-relaxed ${
                featured
                  ? "text-base lg:text-lg line-clamp-3"
                  : "text-sm lg:text-base line-clamp-2"
              }`}
            >
              {excerpt}
            </p>
          </div>

          {/* Read More Link */}
          <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-smooth">
            <span>Read More</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default BlogCard;
