"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag } from "@prisma/client";

interface TagFormProps {
  onSubmit: (tagData: Omit<Tag, "id" | "createdAt">) => void;
  initialData?: Omit<Tag, "id" | "createdAt"> | null;
}

const TagForm = ({ onSubmit, initialData }: TagFormProps) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setSlug(initialData.slug);
    }
  }, [initialData]);

  // Auto-generate slug from name
  useEffect(() => {
    const generatedSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters except spaces and hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/^-+|-+$/g, ""); // Trim hyphens from start and end
    setSlug(generatedSlug);
  }, [name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      slug,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Tag Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        placeholder="Tag Slug (auto-generated)"
        value={slug}
        className="bg-gray-100 dark:bg-gray-700/50 cursor-not-allowed"
        readOnly
        required
      />
      <Button type="submit">
        {initialData ? "Update Tag" : "Create Tag"}
      </Button>
    </form>
  );
};

export default TagForm;
