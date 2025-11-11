"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";

const mockCategories = [
  {
    id: 1,
    name: "Development",
    slug: "development",
    posts: 12,
    color: "hsl(160 60% 35%)",
  },
  { id: 2, name: "Design", slug: "design", posts: 8, color: "hsl(35 85% 60%)" },
  {
    id: 3,
    name: "React",
    slug: "react",
    posts: 15,
    color: "hsl(0 84.2% 60.2%)",
  },
  { id: 4, name: "CSS", slug: "css", posts: 6, color: "hsl(160 60% 50%)" },
];

export function CategoriesManager() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Create and organize content categories
        </p>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus size={16} className="mr-2" />
          New Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCategories.map((category) => (
          <Card
            key={category.id}
            className="p-6 bg-card hover:shadow-lg transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg"
                  style={{
                    backgroundColor: `${category.color}30`,
                    borderLeft: `4px solid ${category.color}`,
                  }}
                />
                <div>
                  <h3 className="font-semibold text-foreground">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {category.slug}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-muted-foreground">
                {category.posts} posts
              </span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <Edit size={16} />
                </button>
                <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
