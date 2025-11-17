"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

const ITEMS_PER_PAGE_CLIENT_SIDE = 10;

interface TagsManagerClientProps {
  initialTags: TagWithCount[];
}

export function TagsManagerClient({ initialTags }: TagsManagerClientProps) {
  const router = useRouter();
  const [allTags, setAllTags] = useState<TagWithCount[]>(initialTags);
  const [filteredAndSortedTags, setFilteredAndSortedTags] = useState<TagWithCount[]>([]);
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

  // When initialTags changes (due to router.refresh()), update allTags state
  useEffect(() => {
    setAllTags(initialTags);
  }, [initialTags]);

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
        return 0;
      });
    }

    // 3. Apply client-side pagination
    const startIndex = (page - 1) * ITEMS_PER_PAGE_CLIENT_SIDE;
    const endIndex = startIndex + ITEMS_PER_PAGE_CLIENT_SIDE;
    setFilteredAndSortedTags(processedTags.slice(startIndex, endIndex));
    setTotalPages(Math.ceil(processedTags.length / ITEMS_PER_PAGE_CLIENT_SIDE));

  }, [allTags, debouncedSearch, page, sort]);

  const handleFormSubmit = async (tagData: Omit<Tag, "id" | "createdAt">) => {
    const promise = fetch(
      editingTag ? `/api/tags/${editingTag.id}` : "/api/tags",
      {
        method: editingTag ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tagData),
      }
    ).then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.error || "Failed to save tag.");
            });
        }
        return response.json();
    });

    toast.promise(promise, {
        loading: editingTag ? "Updating tag..." : "Creating tag...",
        success: () => {
            setIsDialogOpen(false);
            setEditingTag(null);
            router.refresh(); // Refresh server-side data
            return editingTag ? "Tag updated successfully." : "Tag created successfully."
        },
        error: (err) => err.message,
    });
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
      const promise = fetch(`/api/tags/${tagToDelete.id}`, {
        method: "DELETE",
      }).then(response => {
          if (!response.ok) {
              return response.json().then(errorData => {
                  throw new Error(errorData.error || "Failed to delete tag.");
              });
          }
      });

      toast.promise(promise, {
          loading: "Deleting tag...",
          success: () => {
              router.refresh(); // Refresh server-side data
              return "Tag deleted successfully.";
          },
          error: (err) => err.message,
      });

      setIsConfirmOpen(false);
      setTagToDelete(null);
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
          data={filteredAndSortedTags}
          loading={!initialTags} // Show loading only on initial server render if data isn't ready
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
