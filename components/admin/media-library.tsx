"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Download, Trash2 } from "lucide-react";

const mediaItems = [
  {
    id: 1,
    name: "Hero Banner",
    type: "Image",
    size: "2.4 MB",
    date: "2024-11-10",
  },
  {
    id: 2,
    name: "Product Photo",
    type: "Image",
    size: "1.8 MB",
    date: "2024-11-09",
  },
  {
    id: 3,
    name: "Tutorial Video",
    type: "Video",
    size: "45 MB",
    date: "2024-11-08",
  },
  {
    id: 4,
    name: "Logo Assets",
    type: "Archive",
    size: "3.2 MB",
    date: "2024-11-07",
  },
  {
    id: 5,
    name: "Background Music",
    type: "Audio",
    size: "8.5 MB",
    date: "2024-11-06",
  },
  {
    id: 6,
    name: "Team Photo",
    type: "Image",
    size: "3.1 MB",
    date: "2024-11-05",
  },
];

export function MediaLibrary() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Media Assets</h2>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          Upload Media
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mediaItems.map((item) => (
          <Card
            key={item.id}
            className="p-4 bg-card hover:bg-card/80 transition-colors"
          >
            <div className="mb-4">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-xs font-medium">
                {item.type} Preview
              </div>
            </div>
            <h3 className="font-medium text-foreground truncate mb-1">
              {item.name}
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              {item.size} • {item.date}
            </p>
            <div className="flex gap-2">
              <button className="flex-1 p-2 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground text-xs font-medium">
                <Download className="w-4 h-4 inline mr-1" />
                Download
              </button>
              <button className="p-2 hover:bg-destructive/10 rounded transition-colors">
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
