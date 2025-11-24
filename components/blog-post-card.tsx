import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Heart, MessageCircle } from "lucide-react";
import { Post, User, Category } from "@prisma/client";

type BlogPost = Post & {
  author: User;
  tags: string[];
  likes: number;
  comments: number;
};

interface BlogPostCardProps {
  post: BlogPost;
  category: Category | undefined;
  selectedTags: string[];
}

export function BlogPostCard({
  post,
  category,
  selectedTags,
}: BlogPostCardProps) {
  return (
    <motion.div
      key={post.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      layout
    >
      <Link href={`/post/${post.slug}`}>
        <Card className="group hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/50 overflow-hidden h-full bg-card backdrop-blur-sm hover:-translate-y-2">
          <div className="relative overflow-hidden aspect-video">
            <Image
              src={post.coverImage || "/hero-blog.jpg"}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              placeholder="blur"
              blurDataURL="/placeholder-blur.jpg"
            />
            <div
              className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${
                category ? category.color : ""
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-3">
              <Badge
                className={`bg-accent hover:bg-accent/80 ${
                  category ? category.color : ""
                } text-white border-0`}
              >
                {category ? category.name : ""}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(
                  post.publishedAt || post.createdAt
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
              {post.title}
            </h3>

            <p className="text-muted-foreground mb-4 line-clamp-2 text-sm leading-relaxed">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-primary/20 text-primary font-semibold"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime} min read</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
