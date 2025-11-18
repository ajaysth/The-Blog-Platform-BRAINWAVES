import { Suspense } from "react";
import { CategoriesManagerClient } from "./categories-manager-client";
import { TableSkeleton } from "./table-skeleton";

type Row = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  catimage: string | null;
  createdAt: string;
  _count: {
    posts: number;
  };
};

async function getCategories() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const url = `${baseUrl}/api/admin/categories?all=true`;

  try {
    const response = await fetch(url, {
      next: {
        tags: ["categories"],
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch categories:", await response.text());
      return [];
    }

    const data = await response.json();
    return data.data as Row[];
  } catch (error) {
    console.error("An error occurred while fetching categories:", error);
    return [];
  }
}

export async function CategoriesManager() {
  const initialCategories = await getCategories();
  return <CategoriesManagerClient initialCategories={initialCategories} />;
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<TableSkeleton columns={6} />}>
      <CategoriesManager />
    </Suspense>
  );
}