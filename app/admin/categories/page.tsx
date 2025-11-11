"use client";

import { CategoriesManager } from "@/components/admin/categories-manager";

export default function CategoriesPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-playfair-display font-bold text-foreground">
          Categories
        </h1>
        <p className="text-muted-foreground mt-2">
          Organize your content into categories
        </p>
      </div>
      <CategoriesManager />
    </div>
  );
}
