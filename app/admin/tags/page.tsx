"use client";

import { TagsManager } from "@/components/admin/tags-manager";

export default function TagsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-playfair-display font-bold text-foreground">
          Tags
        </h1>
        <p className="text-muted-foreground mt-2">
          Create and manage content tags
        </p>
      </div>
      <TagsManager />
    </div>
  );
}
