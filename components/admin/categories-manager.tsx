"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import HeroTable from "@/components/admin/hero-table";
import { PageHeader } from "@/components/admin/page-header";
import { PageTransition } from "@/components/admin/page-transition";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

import { formatDate } from "@/lib/admin-utils";
import { CategoryForm } from "@/components/admin/category/category-form";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/use-debounce";

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

// Utility function to get nested property
const getNestedProperty = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

const ITEMS_PER_PAGE_CLIENT_SIDE = 10;

export default function CategoryPage() {
  const [allCategories, setAllCategories] = useState<Row[]>([]);
  const [filteredAndSortedCategories, setFilteredAndSortedCategories] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Row | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Row | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState<{ column: string; direction: "asc" | "desc" } | null>({ 
    column: "createdAt", 
    direction: "desc" 
  });

  const debouncedSearch = useDebounce(search, 500);

  // Fetch all categories initially from the server
  const fetchAllCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/categories?all=true`);
      const data = await response.json();
      setAllCategories(data.data);
    } catch (error) {
      console.error("Failed to fetch all categories:", error);
      toast.error("Failed to fetch all categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  // Client-side filtering, sorting, and pagination
  useEffect(() => {
    let processedCategories = [...allCategories];

    // 1. Apply client-side search
    if (debouncedSearch) {
      processedCategories = processedCategories.filter(category =>
        category.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        category.slug.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(debouncedSearch.toLowerCase()))
      );
    }

    // 2. Apply client-side sort
    if (sort) {
      processedCategories.sort((a, b) => {
        const aValue = getNestedProperty(a, sort.column);
        const bValue = getNestedProperty(b, sort.column);

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sort.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        return 0;
      });
    }

    // 3. Apply client-side pagination
    const startIndex = (page - 1) * ITEMS_PER_PAGE_CLIENT_SIDE;
    const endIndex = startIndex + ITEMS_PER_PAGE_CLIENT_SIDE;
    setFilteredAndSortedCategories(processedCategories.slice(startIndex, endIndex));
    setTotalPages(Math.ceil(processedCategories.length / ITEMS_PER_PAGE_CLIENT_SIDE));

  }, [allCategories, debouncedSearch, page, sort]);

  const handleAddCategory = () => setEditingCategory({} as Row);
  const handleEditCategory = (category: Row) => setEditingCategory(category);
  const handleCancel = () => setEditingCategory(null);

  const handleSave = async () => {
    setEditingCategory(null);
    // Re-fetch to ensure we have the latest data including new images
    await fetchAllCategories();
    toast.success("Table refreshed with latest data");
  };

  const confirmDeleteCategory = async () => {
    if (!deleteCategory) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${deleteCategory.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Category deleted successfully");
        await fetchAllCategories();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to delete category");
      }
      setDeleteCategory(null);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting category");
      setDeleteCategory(null);
    }
  };

  const columns = [
    {
      header: "Image",
      accessor: "catimage",
      cell: (item: Row) => (
        <div className="w-20 h-20 relative rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
          {item.catimage ? (
            <Image
              src={item.catimage}
              alt={item.name}
              fill
              className="object-cover"
              unoptimized={item.catimage.includes('ucarecdn.com')}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-xs text-gray-400">No image</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Name",
      accessor: "name",
      cell: (item: Row) => (
        <div className="font-medium text-gray-900 dark:text-white">
          {item.name}
        </div>
      ),
    },
    {
      header: "Slug",
      accessor: "slug",
      cell: (item: Row) => (
        <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
          {item.slug}
        </code>
      ),
    },
    {
      header: "Description",
      accessor: "description",
      cell: (item: Row) => (
        <div className="max-w-xs truncate text-sm text-gray-600 dark:text-gray-400">
          {item.description || "-"}
        </div>
      ),
    },
    {
      header: "Posts",
      accessor: "_count.posts",
      cell: (item: Row) => (
        <Badge variant="secondary" className="font-semibold">
          {item._count.posts}
        </Badge>
      ),
    },
    {
      header: "Created At",
      accessor: "createdAt",
      cell: (item: Row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(item.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader title="Categories" className="font-playfair-display" />

        {editingCategory && (
          <div className="mb-6">
            <CategoryForm
              category={editingCategory.id ? editingCategory : undefined}
              onSave={handleSave}
            />
            <div className="mt-4 flex justify-end max-w-3xl mx-auto">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        <HeroTable
          columns={columns}
          data={filteredAndSortedCategories}
          loading={loading}
          onEdit={handleEditCategory}
          onDelete={setDeleteCategory}
          title="Category Management"
          createButtonText="Add Category"
          createButtonAction={handleAddCategory}
          search={search}
          setSearch={setSearch}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          sort={sort}
          setSort={setSort}
        />

        <ConfirmationDialog
          open={!!deleteCategory}
          onOpenChange={() => setDeleteCategory(null)}
          onConfirm={confirmDeleteCategory}
          title="Delete Category?"
          description="Are you sure you want to delete this category? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
        />
      </div>
    </PageTransition>
  );
}