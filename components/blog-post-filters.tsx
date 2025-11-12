"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  SlidersHorizontal,
  X,
  TrendingUp,
  Calendar,
  Heart,
  MessageCircle,
} from "lucide-react";
import { blogPosts } from "@/data/blogPosts";

import SkeletonCard from "@/components/skeleton-card";
// import SkeletonCard from './skeleton-card';

type BlogPost = (typeof blogPosts)[0];
type SortOption = "latest" | "popular" | "comments";

interface BlogPostFiltersProps {
  posts: BlogPost[];
  children: (filteredPosts: BlogPost[]) => React.ReactNode;
  loading: boolean;
}

export function BlogPostFilters({
  posts,
  children,
  loading,
}: BlogPostFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let filtered = posts;

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase().slice(0, 100);
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((post) =>
        selectedTags.some((tag) => post.tags.includes(tag))
      );
    }

    const sorted = [...filtered];
    switch (sortBy) {
      case "popular":
        sorted.sort((a, b) => b.likes - a.likes);
        break;
      case "comments":
        sorted.sort((a, b) => b.comments - a.comments);
        break;
      case "latest":
      default:
        sorted.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
    }

    return sorted;
  }, [posts, searchQuery, selectedTags, sortBy]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setSortBy("latest");
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-12"
      >
        <div className="bg-card border rounded-2xl shadow-lg p-6 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                maxLength={100}
                className="pl-11 h-12 bg-background border-2 focus:border-primary transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort */}
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortOption)}
            >
              <SelectTrigger className="w-full lg:w-[220px] h-12 bg-background border-2">
                <SelectValue placeholder="Sort by'" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-2 z-50">
                <SelectItem value="latest">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Latest First</span>
                  </div>
                </SelectItem>
                <SelectItem value="popular">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span>Most Popular</span>
                  </div>
                </SelectItem>
                <SelectItem value="comments">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>Most Commented</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Filter Toggle */}
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-6"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              {selectedTags.length > 0 && (
                <Badge className="ml-2 bg-accent">{selectedTags.length}</Badge>
              )}
            </Button>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-6 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      Filter by Tags
                    </h3>
                    {(selectedTags.length > 0 || searchQuery) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-xs"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Clear All
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <motion.button
                        key={tag}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleTag(tag)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all border-2 ${
                          selectedTags.includes(tag)
                            ? "bg-primary text-primary-foreground border-primary shadow-lg"
                            : "bg-muted hover:bg-muted/80 border-transparent"
                        }`}
                      >
                        #{tag}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Summary */}
          {(selectedTags.length > 0 || searchQuery) && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span>
                  Showing {filteredPosts.length} of {posts.length} articles
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        children(filteredPosts)
      )}
    </div>
  );
}
