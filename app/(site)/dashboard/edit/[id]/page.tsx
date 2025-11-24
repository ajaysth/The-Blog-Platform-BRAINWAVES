"use client";

import { useQuery } from "@tanstack/react-query";
import CreatePostForm from "@/components/dashboard/create-post-form";
import { FormSkeleton } from "@/components/skeletons/form-skeleton";
import { notFound } from "next/navigation";
import React from 'react';

async function getPost(id: string) {
  const res = await fetch(`/api/posts/${id}`);
  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    throw new Error("Failed to fetch post");
  }
  return res.json();
}

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

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const { data: post, isLoading: isPostLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPost(id),
  });

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: tags, isLoading: isTagsLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
  });

  if (isPostLoading || isCategoriesLoading || isTagsLoading) {
    return <FormSkeleton />;
  }

  if (!post) {
    notFound();
  }

  return (
    <CreatePostForm
      categories={categories || []}
      availableTags={tags || []}
      initialData={post}
    />
  );
}
