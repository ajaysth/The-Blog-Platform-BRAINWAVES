"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { Post, Category, User } from "@prisma/client";

type PostWithRelations = Post & {
  category: Category | null;
  author: User;
};

export function PostsManager() {
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete post");
        }

        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } catch (error) {
        setError(error.message);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Manage and publish your blog posts
        </p>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus size={16} className="mr-2" />
          New Post
        </Button>
      </div>

      <Card className="bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                  Title
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                  Category
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                  Views
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                  Date
                </th>
                <th className="text-right py-3 px-4 font-semibold text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="py-4 px-4 font-medium">{post.title}</td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    {post.category?.name || "Uncategorized"}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        post.status === "PUBLISHED"
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm">
                    {post.viewCount.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 flex justify-end gap-2">
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                      <Eye size={16} />
                    </button>
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

