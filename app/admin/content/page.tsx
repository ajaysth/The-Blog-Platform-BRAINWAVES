"use client";

import { ContentManager } from "@/components/admin/content-manager";

export default function ContentPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Content Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Create, edit, and manage your content
        </p>
      </div>
      <ContentManager />
    </div>
  );
}
