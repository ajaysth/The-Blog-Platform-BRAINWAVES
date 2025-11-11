"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Eye } from "lucide-react";

const contentItems = [
  {
    id: 1,
    title: "Welcome to Our Site",
    status: "Published",
    date: "2024-11-10",
    views: 1234,
  },
  {
    id: 2,
    title: "Getting Started Guide",
    status: "Draft",
    date: "2024-11-09",
    views: 0,
  },
  {
    id: 3,
    title: "Feature Announcement",
    status: "Published",
    date: "2024-11-08",
    views: 5678,
  },
  {
    id: 4,
    title: "Behind the Scenes",
    status: "Scheduled",
    date: "2024-11-12",
    views: 0,
  },
  {
    id: 5,
    title: "User Case Study",
    status: "Published",
    date: "2024-11-07",
    views: 2345,
  },
];

export function ContentManager() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Your Content</h2>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          New Post
        </Button>
      </div>

      <Card className="bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Views
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {contentItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {item.title}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        item.status === "Published"
                          ? "bg-chart-1/20 text-chart-1"
                          : item.status === "Draft"
                          ? "bg-muted text-muted-foreground"
                          : "bg-chart-4/20 text-chart-4"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {item.views}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-muted rounded transition-colors">
                        <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded transition-colors">
                        <Edit className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </button>
                      <button className="p-2 hover:bg-destructive/10 rounded transition-colors">
                        <Trash2 className="w-4 h-4 text-destructive hover:text-destructive/80" />
                      </button>
                    </div>
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
