"use client";

import { MediaLibrary } from "@/components/admin/media-library";

export default function MediaPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Media Library</h1>
        <p className="text-muted-foreground mt-2">
          Upload and manage your media assets
        </p>
      </div>
      <MediaLibrary />
    </div>
  );
}
