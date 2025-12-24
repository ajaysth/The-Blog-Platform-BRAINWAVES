"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleLike } from "@/app/actions/like.action";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

interface LikeButtonProps {
  postId: string;
  isLiked: boolean;
  className?: string;
}

export function LikeButton({ postId, isLiked, className }: LikeButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [liked, setLiked] = useState(isLiked);

  const handleClick = () => {
    startTransition(async () => {
      try {
        await toggleLike(postId);
        setLiked(!liked);
        toast.success(liked ? "Post unliked!" : "Post liked!");
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "flex items-center justify-center p-2 rounded-full transition-colors duration-200",
        "hover:bg-red-100 dark:hover:bg-red-900/20",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      <Heart
        className={cn(
          "w-6 h-6 transition-all duration-200",
          liked
            ? "text-red-500 fill-current"
            : "text-gray-500 dark:text-gray-400"
        )}
      />
    </button>
  );
}
