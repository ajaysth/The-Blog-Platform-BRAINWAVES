"use client";

import { PostsManager } from "@/components/admin/posts-manager";

export default function PostsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-playfair-display font-bold text-foreground">
          Blog Posts
        </h1>
        <p className="text-muted-foreground mt-2">
          Create, edit, and manage your blog posts
        </p>
      </div>
      <PostsManager />
    </div>
  );
}
