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
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Post } from "@prisma/client";
import PostForm, { PostFormData } from "./post/post-form";
import HeroTable from "./hero-table";
import { PageTransition } from "./page-transition";
import { PageHeader } from "./page-header";
import toast from "react-hot-toast";
import { useDebounce } from "@/hooks/use-debounce";

type PostWithRelations = Post & {
  author: { name: string };
  category: { name: string };
};

// Utility function to get nested property
const getNestedProperty = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

const ITEMS_PER_PAGE_CLIENT_SIDE = 10; // Define how many items to show per page client-side

const PostsManager = () => {
  const [allPosts, setAllPosts] = useState<PostWithRelations[]>([]); // Stores all posts fetched from server
  const [filteredAndSortedPosts, setFilteredAndSortedPosts] = useState<
    PostWithRelations[]
  >([]); // Posts currently displayed in the table
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedPost, setSelectedPost] =
    useState<PostWithRelations | null>(null);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState<{
    column: string;
    direction: "asc" | "desc";
  } | null>({ column: "createdAt", direction: "desc" });

  const debouncedSearch = useDebounce(search, 500);

  // Fetch all posts initially from the server
  const fetchAllPosts = useCallback(async () => {
    setLoading(true);
    try {
      // Request all posts from the API, or a very large number if "all" is too much
      // The API should still return total count for proper pagination calculation
      const response = await fetch(`/api/posts?all=true`); // Assuming API can handle an 'all' parameter
      const data = await response.json();
      setAllPosts(data.posts);
      // totalPages will be calculated client-side based on filteredAndSortedPosts length
    } catch (error) {
      console.error("Failed to fetch all posts:", error);
      toast.error("Failed to fetch all posts.");
    }
    finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllPosts();
  }, [fetchAllPosts]);

  // Client-side filtering, sorting, and pagination
  useEffect(() => {
    let processedPosts = [...allPosts];

    // 1. Apply client-side search
    if (debouncedSearch) {
      processedPosts = processedPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          post.content
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase()) ||
          post.author.name
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase()) ||
          post.category.name
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase())
      );
    }

    // 2. Apply client-side sort
    if (sort) {
      processedPosts.sort((a, b) => {
        const aValue = getNestedProperty(a, sort.column);
        const bValue = getNestedProperty(b, sort.column);

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sort.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sort.direction === "asc" ? aValue - bValue : bValue - aValue;
        }
        // Handle boolean for 'published'
        if (typeof aValue === "boolean" && typeof bValue === "boolean") {
          if (sort.direction === "asc") {
            return aValue === bValue ? 0 : aValue ? 1 : -1;
          } else {
            return aValue === bValue ? 0 : aValue ? -1 : 1;
          }
        }
        // Fallback for other types or if values are null/undefined
        return 0;
      });
    }

    // 3. Apply client-side pagination
    const startIndex = (page - 1) * ITEMS_PER_PAGE_CLIENT_SIDE;
    const endIndex = startIndex + ITEMS_PER_PAGE_CLIENT_SIDE;
    setFilteredAndSortedPosts(processedPosts.slice(startIndex, endIndex));
    setTotalPages(
      Math.ceil(processedPosts.length / ITEMS_PER_PAGE_CLIENT_SIDE)
    );
  }, [allPosts, debouncedSearch, page, sort]); // Dependencies for client-side processing

  const handleFormSubmit = async (postData: PostFormData) => {
    const toastId = toast.loading(
      selectedPost ? "Updating post..." : "Creating post..."
    );
    try {
      const response = await fetch(
        selectedPost ? `/api/posts/${selectedPost.id}` : "/api/posts",
        {
          method: selectedPost ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postData),
        }
      );

      if (response.ok) {
        fetchAllPosts(); // Re-fetch all posts to update client-side store
        setIsDialogOpen(false);
        setSelectedPost(null);
        toast.success(
          selectedPost
            ? "Post updated successfully."
            : "Post created successfully.",
          { id: toastId }
        );
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to save post.", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error("Failed to save post:", error);
      toast.error("Failed to save post.", { id: toastId });
    }
  };

  const handleEdit = (post: PostWithRelations) => {
    setSelectedPost(post);
    setIsDialogOpen(true);
  };

  const handleDelete = (post: PostWithRelations) => {
    setPostToDelete(post.id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (postToDelete) {
      const toastId = toast.loading("Deleting post...");
      try {
        const response = await fetch(`/api/posts/${postToDelete}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchAllPosts(); // Re-fetch all posts to update client-side store
          setIsConfirmOpen(false);
          setPostToDelete(null);
          toast.success("Post deleted successfully.", { id: toastId });
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || "Failed to delete post.", {
            id: toastId,
          });
        }
      } catch (error) {
        console.error("Failed to delete post:", error);
        toast.error("Failed to delete post.", { id: toastId });
      }
    }
  };

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Author", accessor: "author.name" },
    { header: "Category", accessor: "category.name" },
    { header: "Status", accessor: "status" },
    { header: "Created At", accessor: "createdAt" },
  ];

  return (
    <PageTransition>
      <div className="p-4">
        <PageHeader title="Posts" className="font-playfair-display" />
        <div className="flex justify-end mb-4">
          {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setSelectedPost(null);
                  setIsDialogOpen(true);
                }}
              >
                Add New Post
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedPost ? "Edit Post" : "Add New Post"}
                </DialogTitle>
              </DialogHeader>
              <PostForm
                onSubmit={handleFormSubmit}
                initialData={selectedPost}
              />
            </DialogContent>
          </Dialog> */}
        </div>
        <HeroTable
          columns={columns}
          data={filteredAndSortedPosts} // Use client-side processed data
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          title=""
          createButtonText="Add New Post"
          createButtonAction={() => {
            setSelectedPost(null);
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
          onOpenChange={() => setIsConfirmOpen(false)}
          onConfirm={confirmDelete}
          title="Are you sure?"
          description="This action cannot be undone. This will permanently delete the post."
        />
      </div>
    </PageTransition>
  );
};

export default PostsManager;
