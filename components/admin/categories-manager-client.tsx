"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

interface CategoriesManagerClientProps {
  initialCategories: Row[];
}

// Utility function to get nested property
const getNestedProperty = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

const ITEMS_PER_PAGE_CLIENT_SIDE = 10;

export function CategoriesManagerClient({ initialCategories }: CategoriesManagerClientProps) {
  const router = useRouter();
  const [allCategories, setAllCategories] = useState<Row[]>(initialCategories);
  const [filteredAndSortedCategories, setFilteredAndSortedCategories] = useState<Row[]>([]);
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

  useEffect(() => {
    setAllCategories(initialCategories);
  }, [initialCategories]);

  // Client-side filtering, sorting, and pagination
  useEffect(() => {
    let processedCategories = [...allCategories];

    if (debouncedSearch) {
      processedCategories = processedCategories.filter(category =>
        category.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        category.slug.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(debouncedSearch.toLowerCase()))
      );
    }

    if (sort) {
      processedCategories.sort((a, b) => {
        const aValue = getNestedProperty(a, sort.column);
        const bValue = getNestedProperty(b, sort.column);
        if (aValue === null || aValue === undefined) return sort.direction === 'asc' ? -1 : 1;
        if (bValue === null || bValue === undefined) return sort.direction === 'asc' ? 1 : -1;
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sort.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        return 0;
      });
    }

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
    router.refresh();
  };

  const confirmDeleteCategory = async () => {
    if (!deleteCategory) return;
    try {
      const res = await fetch(`/api/admin/categories?id=${deleteCategory.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Category deleted successfully");
        router.refresh();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to delete category");
      }
    } catch (error) {
      toast.error("An error occurred while deleting category");
    } finally {
      setDeleteCategory(null);
    }
  };

  const columns = [
    {
      header: "Image",
      accessor: "catimage",
      sortable: false,
      cell: (item: Row) => (
        <div className="w-20 h-20 relative rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex-shrink-0">
          {item.catimage ? (
            <Image src={item.catimage} alt={item.name} fill sizes="80px" className="object-cover" unoptimized />
          ) : (
            <div className="w-full h-full flex items-center justify-center"><span className="text-xs text-gray-400">No image</span></div>
          )}
        </div>
      ),
    },
    { header: "Name", accessor: "name", sortable: true },
    { header: "Slug", accessor: "slug", sortable: true, cell: (item: Row) => <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{item.slug}</code> },
    { header: "Description", accessor: "description", sortable: false, cell: (item: Row) => <div className="max-w-xs truncate text-sm text-gray-600 dark:text-gray-400">{item.description || "-"}</div> },
    { header: "Posts", accessor: "_count.posts", sortable: true, cell: (item: Row) => <Badge variant="secondary" className="font-semibold">{item._count.posts}</Badge> },
    { header: "Created At", accessor: "createdAt", sortable: true, cell: (item: Row) => <span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(item.createdAt)}</span> },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader title="Categories" className="font-playfair-display" />
        {editingCategory && (
          <div className="mb-6"><CategoryForm category={editingCategory.id ? editingCategory : undefined} onSave={handleSave} /><div className="mt-4 flex justify-end max-w-3xl mx-auto"><Button variant="outline" onClick={handleCancel}>Cancel</Button></div></div>
        )}
        <HeroTable
          columns={columns}
          data={filteredAndSortedCategories}
          loading={false} // Loading is now handled by Suspense
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