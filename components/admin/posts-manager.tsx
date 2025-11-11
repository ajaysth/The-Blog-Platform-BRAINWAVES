"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Eye } from "lucide-react";

const mockPosts = [
  {
    id: 1,
    title: "Getting Started with Next.js 15",
    category: "Development",
    status: "Published",
    views: 1234,
    date: "Nov 10, 2024",
  },
  {
    id: 2,
    title: "Advanced React Patterns",
    category: "React",
    status: "Published",
    views: 892,
    date: "Nov 8, 2024",
  },
  {
    id: 3,
    title: "Tailwind CSS Best Practices",
    category: "CSS",
    status: "Draft",
    views: 0,
    date: "Nov 5, 2024",
  },
  {
    id: 4,
    title: "TypeScript Tips & Tricks",
    category: "Development",
    status: "Published",
    views: 2156,
    date: "Nov 1, 2024",
  },
];

export function PostsManager() {
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
              {mockPosts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="py-4 px-4 font-medium">{post.title}</td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    {post.category}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        post.status === "Published"
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm">
                    {post.views.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    {post.date}
                  </td>
                  <td className="py-4 px-4 flex justify-end gap-2">
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                      <Eye size={16} />
                    </button>
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive">
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
