"use client"

import { useState, useEffect, useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, MessageCircle, Search, Filter, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "react-hot-toast"
import { toggleLike } from "@/app/actions/like.action"

interface LikedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  author: {
    name: string;
    image: string;
  };
  category: string;
  readTime: string;
  publishedAt: string;
  likes: number;
  comments: number;
}

interface LikedPostsProps {
  posts: LikedPost[];
}

export default function LikedPosts({ posts: initialPosts }: LikedPostsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [posts, setPosts] = useState<LikedPost[]>(initialPosts)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const handleUnlike = async (postId: string) => {
    startTransition(async () => {
      try {
        await toggleLike(postId);
        setPosts(posts.filter((post) => post.id !== postId));
        toast.success("Post unliked!");
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
      }
    });
  }

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Liked Posts</h1>
          <p className="text-muted-foreground mt-1">Stories you've saved and loved.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search liked posts..."
              className="pl-9 bg-card"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-muted/50 p-6 rounded-full mb-4">
            <Heart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">No liked posts found</h3>
          <p className="text-muted-foreground mt-2 max-w-md">
            {searchQuery
              ? "Try adjusting your search terms to find what you're looking for."
              : "When you like posts, they will appear here for easy access."}
          </p>
          {!searchQuery && (
            <Button className="mt-6" asChild>
              <Link href="/dashboard">Explore Posts</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="group relative flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={post.coverImage || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 z-10">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-destructive/10 hover:text-destructive transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      handleUnlike(post.id)
                    }}
                    disabled={isPending}
                  >
                    <Heart className="h-4 w-4 fill-destructive text-destructive" />
                    <span className="sr-only">Unlike</span>
                  </Button>
                </div>
                <Badge className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-foreground hover:bg-background/90">
                  {post.category}
                </Badge>
              </div>

              <div className="flex flex-col flex-1 p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{post.publishedAt}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <Link href={`/post/${post.slug}`} className="block group-hover:text-primary transition-colors">
                  <h3 className="text-lg font-semibold leading-tight mb-2 line-clamp-2">{post.title}</h3>
                </Link>

                <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">{post.excerpt}</p>

                <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="relative h-6 w-6 rounded-full overflow-hidden">
                      <Image
                        src={post.author.image || "/placeholder.svg"}
                        alt={post.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs font-medium">{post.author.name}</span>
                  </div>

                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="flex items-center gap-1 text-xs">
                      <Heart className="h-3.5 w-3.5" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
