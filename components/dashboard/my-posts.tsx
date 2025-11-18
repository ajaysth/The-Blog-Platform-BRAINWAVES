"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Eye,
  Heart,
  Edit,
  Trash2,
  MoreVertical,
  Filter,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { TableSkeleton } from "@/components/admin/table-skeleton";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  viewCount: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
  category?: { name: string };
}

interface MyPostsProps {
  userId: string;
}

export default function MyPosts({ userId }: MyPostsProps) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "DRAFT" | "PUBLISHED">("ALL");
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [mutatingPostId, setMutatingPostId] = useState<string | null>(null);

  const {
    data: postsData,
    isLoading,
    isError,
    error,
  } = useQuery<Post[], Error>({
    queryKey: ["my-posts", userId],
    queryFn: async () => {
      const response = await fetch(`/api/posts?authorId=${userId}&all=true`);
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      return data.posts || [];
    },
  });

  const filteredPosts = (postsData || []).filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "ALL" || post.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    setMutatingPostId(id);
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete post");
      }

      toast.success("Post deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-posts", userId] });
    } catch (err: any) {
      toast.error(err.message || "An error occurred while deleting the post.");
    } finally {
      setPostToDelete(null);
      setMutatingPostId(null);
    }
  };

  if (isLoading) {
    return <TableSkeleton columns={6} />;
  }

  if (isError) {
    return (
      <Card className="p-12 text-center">
        <p className="text-destructive">Error: {error?.message || "Failed to load posts"}</p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["my-posts", userId] })} className="mt-4">Retry</Button>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Posts</h1>
            <p className="text-muted-foreground">
              Manage and edit your blog posts
            </p>
          </div>
          <Button asChild>
            <a href="/dashboard/create">Create New Post</a>
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {["ALL", "DRAFT", "PUBLISHED"].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  onClick={() => setFilterStatus(status as any)}
                  size="sm"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No posts found</p>
            <Button asChild>
              <a href="/dashboard/create">Create your first post</a>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPosts.map((post, index) => (
              <Card
                key={post.id}
                className={cn(
                  "p-6 hover:shadow-hover transition-all duration-300 relative", // Added relative positioning
                  "animate-in slide-in-from-bottom-4"
                )}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "backwards",
                }}
              >
                {mutatingPostId === post.id && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-10">
                    <Loader2 className="animate-spin h-8 w-8 text-primary" />
                    <p className="mt-2 text-sm font-semibold">Deleting...</p>
                  </div>
                )}
                <div className={cn("space-y-4", { "opacity-50": mutatingPostId === post.id })}>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1 truncate">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {post.category?.name || "Uncategorized"}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap",
                        post.status === "PUBLISHED"
                          ? "bg-primary/10 text-primary"
                          : post.status === "DRAFT"
                          ? "bg-muted text-muted-foreground"
                          : "bg-accent/10 text-accent"
                      )}
                    >
                      {post.status}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {post.viewCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={14} />
                      {post.likes}
                    </span>
                    <span className="ml-auto">
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      asChild
                      disabled={!!mutatingPostId}
                    >
                      <a href={`/dashboard/edit/${post.id}`}>
                        <Edit size={14} />
                        Edit
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      asChild
                      disabled={!!mutatingPostId}
                    >
                      <a href={`/post/${post.slug}`} target="_blank">
                        <Eye size={14} />
                        View
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPostToDelete(post)}
                      className="gap-2 text-destructive hover:text-destructive"
                      disabled={!!mutatingPostId}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <ConfirmationDialog
        open={!!postToDelete}
        onOpenChange={() => setPostToDelete(null)}
        onConfirm={() => {
          if (postToDelete) {
            handleDelete(postToDelete.id);
          }
        }}
        title="Delete Post?"
        description="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  );
}