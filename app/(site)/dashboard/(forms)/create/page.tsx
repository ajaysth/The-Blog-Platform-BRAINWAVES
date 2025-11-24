"use client";

import { useQuery } from "@tanstack/react-query";
import CreatePostForm from "@/components/dashboard/create-post-form";
import { FormSkeleton } from "@/components/skeletons/form-skeleton";

async function getCategories() {
  const res = await fetch("/api/admin/categories?all=true");
  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }
  const { data } = await res.json();
  return data;
}

async function getTags() {
  const res = await fetch("/api/tags?all=true");
  if (!res.ok) {
    throw new Error("Failed to fetch tags");
  }
  const { tags } = await res.json();
  return tags;
}

export default function CreatePostPage() {
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const {
    data: tags,
    isLoading: isTagsLoading,
    isError: isTagsError,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
  });

  if (isCategoriesLoading || isTagsLoading) {
    return <FormSkeleton />;
  }

  if (isCategoriesError || isTagsError) {
    return <div>Error loading form data.</div>;
  }

  return (
    <CreatePostForm
      categories={categories || []}
      availableTags={tags || []}
    />
  );
}
