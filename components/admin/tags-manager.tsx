"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TagForm from "./tag/tag-form";
import { Tag } from "@prisma/client";
import toast from "react-hot-toast";
import HeroTable from "./hero-table";
import { ConfirmationDialog } from "../ui/confirmation-dialog";
import { useDebounce } from "@/hooks/use-debounce";
import { PageHeader } from "./page-header";
import { PageTransition } from "./page-transition";

type TagWithCount = Tag & {
  _count: {
    posts: number;
  };
};

// Utility function to get nested property
const getNestedProperty = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

const ITEMS_PER_PAGE_CLIENT_SIDE = 10; // Define how many items to show per page client-side

export function TagsManager() {
  const [allTags, setAllTags] = useState<TagWithCount[]>([]); // Stores all tags fetched from server
  const [filteredAndSortedTags, setFilteredAndSortedTags] = useState<TagWithCount[]>([]); // Tags currently displayed in the table
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<TagWithCount | null>(null);
  const [editingTag, setEditingTag] = useState<TagWithCount | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState<{
    column: string;
    direction: "asc" | "desc";
  } | null>({ column: "createdAt", direction: "desc" });

  const debouncedSearch = useDebounce(search, 500);

  // Fetch all tags initially from the server
  const fetchAllTags = useCallback(async () => {
    setLoading(true);
    try {
      // Request all tags from the API, or a very large number if "all" is too much
      // The API should still return total count for proper pagination calculation
      const response = await fetch(`/api/tags?all=true`); // Assuming API can handle an 'all' parameter
      const data = await response.json();
      setAllTags(data.tags);
      // totalPages will be calculated client-side based on filteredAndSortedTags length
    } catch (error) {
      console.error("Failed to fetch all tags:", error);
      toast.error("Failed to fetch all tags.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllTags();
  }, [fetchAllTags]);

  // Client-side filtering, sorting, and pagination
  useEffect(() => {
    let processedTags = [...allTags];

    // 1. Apply client-side search
    if (debouncedSearch) {
      processedTags = processedTags.filter(tag =>
        tag.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        tag.slug.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // 2. Apply client-side sort
    if (sort) {
      processedTags.sort((a, b) => {
        const aValue = getNestedProperty(a, sort.column);
        const bValue = getNestedProperty(b, sort.column);

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sort.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        // Fallback for other types or if values are null/undefined
        return 0;
      });
    }

    // 3. Apply client-side pagination
    const startIndex = (page - 1) * ITEMS_PER_PAGE_CLIENT_SIDE;
    const endIndex = startIndex + ITEMS_PER_PAGE_CLIENT_SIDE;
    setFilteredAndSortedTags(processedTags.slice(startIndex, endIndex));
    setTotalPages(Math.ceil(processedTags.length / ITEMS_PER_PAGE_CLIENT_SIDE));

  }, [allTags, debouncedSearch, page, sort]); // Dependencies for client-side processing

  const handleFormSubmit = async (tagData: Omit<Tag, "id" | "createdAt">) => {
    const toastId = toast.loading(
      editingTag ? "Updating tag..." : "Creating tag..."
    );
    try {
      const response = await fetch(
        editingTag ? `/api/tags/${editingTag.id}` : "/api/tags",
        {
          method: editingTag ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tagData),
        }
      );

      if (response.ok) {
        fetchAllTags(); // Re-fetch all tags to update client-side store
        setIsDialogOpen(false);
        setEditingTag(null);
        toast.success(
          editingTag
            ? "Tag updated successfully."
            : "Tag created successfully.",
          { id: toastId }
        );
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to save tag.", { id: toastId });
      }
    } catch (error) {
      console.error("Failed to save tag:", error);
      toast.error("Failed to save tag.", { id: toastId });
    }
  };

  const handleEdit = (tag: TagWithCount) => {
    setEditingTag(tag);
    setIsDialogOpen(true);
  };

  const handleDelete = (tag: TagWithCount) => {
    setTagToDelete(tag);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (tagToDelete) {
      const toastId = toast.loading("Deleting tag...");
      try {
        const response = await fetch(`/api/tags/${tagToDelete.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchAllTags(); // Re-fetch all tags to update client-side store
          toast.success("Tag deleted successfully.", { id: toastId });
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || "Failed to delete tag.", {
            id: toastId,
          });
        }
      } catch (error) {
        console.error("Failed to delete tag:", error);
        toast.error("Failed to delete tag.", { id: toastId });
      } finally {
        setIsConfirmOpen(false);
        setTagToDelete(null);
      }
    }
  };

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Slug", accessor: "slug" },
    { header: "Posts", accessor: "_count.posts" },
    { header: "Created At", accessor: "createdAt" },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader title="Tags" className="font-playfair-display" />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTag ? "Edit Tag" : "Add New Tag"}
              </DialogTitle>
            </DialogHeader>
            <TagForm
              onSubmit={handleFormSubmit}
              initialData={
                editingTag
                  ? { name: editingTag.name, slug: editingTag.slug }
                  : null
              }
            />
          </DialogContent>
        </Dialog>

        <HeroTable
          columns={columns}
          data={filteredAndSortedTags} // Use client-side processed data
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          title="Tags"
          createButtonText="New Tag"
          createButtonAction={() => {
            setEditingTag(null);
            setIsDialogOpen(true);
          }}
          search={search}
          setSearch={setSearch}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          sort={sort}
          setSort={setSort}
        />

        <ConfirmationDialog
          open={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          onConfirm={confirmDelete}
          title="Are you sure?"
          description="This action cannot be undone. This will permanently delete the tag."
        />
      </div>
    </PageTransition>
  );
}
