"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

const mockTags = [
  { id: 1, name: "javascript", count: 23 },
  { id: 2, name: "typescript", count: 18 },
  { id: 3, name: "react", count: 15 },
  { id: 4, name: "nextjs", count: 12 },
  { id: 5, name: "tailwind", count: 10 },
  { id: 6, name: "web-development", count: 8 },
  { id: 7, name: "tutorial", count: 14 },
  { id: 8, name: "performance", count: 6 },
];

export function TagsManager() {
  const [tags, setTags] = useState(mockTags);

  const removeTag = (id: number) => {
    setTags(tags.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">Manage tags for your blog posts</p>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus size={16} className="mr-2" />
          New Tag
        </Button>
      </div>

      <Card className="p-6 bg-card">
        <h3 className="text-lg font-semibold font-playfair-display text-foreground mb-4">
          All Tags
        </h3>
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => removeTag(tag.id)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 transition-colors group"
            >
              <span className="text-sm font-medium">{tag.name}</span>
              <span className="text-xs opacity-70">({tag.count})</span>
              <X
                size={14}
                className="opacity-0 group-hover:opacity-100 transition-opacity ml-1"
              />
            </button>
          ))}
        </div>
        <div className="mt-6 p-4 rounded-lg border border-dashed border-border bg-muted/30">
          <p className="text-sm text-muted-foreground">
            Create new tags to organize your content better
          </p>
        </div>
      </Card>
    </div>
  );
}
