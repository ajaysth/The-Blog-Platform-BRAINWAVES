import { Heart, Clock, Calendar, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { LikedPost, removeLikedPost } from "@/lib/likedPosts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { format } from "date-fns";

interface LikedPostCardProps {
  post: LikedPost;
  onRemove: (postId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const LikedPostCard = ({ post, onRemove, className, style }: LikedPostCardProps) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      removeLikedPost(post.id);
      onRemove(post.id);
    }, 300);
  };

  return (
    <article
      className={cn(
        "group relative bg-card rounded-xl overflow-hidden shadow-card transition-all duration-500",
        "hover:shadow-hover hover:-translate-y-2",
        isRemoving && "opacity-0 scale-95 -translate-y-4",
        className
      )}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cover Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={post.coverImage}
          alt={post.title}
          className={cn(
            "w-full h-full object-cover transition-transform duration-700",
            isHovered && "scale-110"
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        
        {/* Category Badge */}
        <Badge 
          className="absolute top-4 left-4 bg-primary/90 text-primary-foreground backdrop-blur-sm border-0"
        >
          {post.category}
        </Badge>

        {/* Remove Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemove}
          className={cn(
            "absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground",
            "transition-all duration-300",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          )}
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        {/* Liked Heart Icon */}
        <div className="absolute bottom-4 right-4">
          <div className="flex items-center gap-1.5 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-like">
            <Heart className="h-4 w-4 fill-[hsl(var(--like))] text-[hsl(var(--like))]" />
            <span className="text-xs font-medium text-foreground">Liked</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Author */}
        <div className="flex items-center gap-3 mb-3">
          {post.authorAvatar ? (
            <img 
              src={post.authorAvatar} 
              alt={post.author}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">
                {post.author.charAt(0)}
              </span>
            </div>
          )}
          <span className="text-sm font-medium text-muted-foreground">{post.author}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {post.excerpt}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{post.readTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>Liked {format(new Date(post.likedAt), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </div>
    </article>
  );
};
