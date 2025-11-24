"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Post, Category, User } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { Save, X, Upload, Loader2, ImageIcon } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { uploadToUploadcare } from "@/lib/uploadcare";
import TiptapEditor from "@/components/editor/tiptap-editor";
import { JSONContent } from "@tiptap/react";

// This is the DTO that the API expects
export interface PostFormData {
  title: string;
  content: JSONContent;
  categoryId: string;
  authorId: string;
  status: "DRAFT" | "PUBLISHED";
  slug: string;
  coverImage?: string | null;
}

interface PostFormProps {
  onSubmit: (postData: PostFormData) => void;
  initialData?: Post | null;
}

const PostForm = ({ onSubmit, initialData }: PostFormProps) => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState<JSONContent>({ type: "doc", content: [] });
  const [categoryId, setCategoryId] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [localCoverImagePreview, setLocalCoverImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setSlug(initialData.slug);
      setContent(initialData.content as JSONContent || { type: "doc", content: [] });
      setCategoryId(initialData.categoryId || "");
      setAuthorId(initialData.authorId);
      setStatus(initialData.status);
      setCoverImage(initialData.coverImage || null);
    }
  }, [initialData]);

  // Auto-generate slug from title
  useEffect(() => {
    const generatedSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generatedSlug);
  }, [title]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories?all=true");
        const data = await response.json();
        setCategories(data.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users?all=true");
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchCategories();
    fetchUsers();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Set local preview
    const previewUrl = URL.createObjectURL(file);
    setLocalCoverImagePreview(previewUrl);

    setUploading(true);
    try {
      const cdnUrl = await uploadToUploadcare(file);
      setCoverImage(cdnUrl);
      toast.success('Image uploaded successfully!');
      setLocalCoverImagePreview(""); // Clear local preview once CDN URL is available
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image.');
      setLocalCoverImagePreview(""); // Clear local preview on error
    } finally {
      setUploading(false);
      e.target.value = ''; // Clear file input
    }
  };

  const handleRemoveImage = () => {
    setCoverImage(null);
    setLocalCoverImagePreview(""); // Clear local preview if image is removed
    toast.success("Image removed");
  };

  // Effect to clean up the object URL when the component unmounts or localCoverImagePreview changes
  useEffect(() => {
    return () => {
      if (localCoverImagePreview) {
        URL.revokeObjectURL(localCoverImagePreview);
      }
    };
  }, [localCoverImagePreview]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      status,
      categoryId,
      authorId,
      coverImage,
      slug,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Cover Image</Label>
        {coverImage ? (
          <div className="space-y-3">
            <div className="relative w-full aspect-video max-w-md rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
              <Image src={localCoverImagePreview || coverImage || ''} alt="Cover image preview" fill className="object-cover" unoptimized />
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handleRemoveImage} className="w-full max-w-md">
              <X className="h-4 w-4 mr-2" /> Remove Image
            </Button>
          </div>
        ) : (
          <div className="max-w-md">
            <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <div className="space-y-3">
                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
                <label htmlFor="image-upload">
                  <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
                    <span className="cursor-pointer">
                      {uploading ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...</>
                      ) : (
                        <><Upload className="h-4 w-4 mr-2" /> Choose File</>
                      )}
                    </span>
                  </Button>
                </label>
                <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="Post Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" placeholder="post-slug-auto-generated" value={slug} className="bg-gray-100 dark:bg-gray-700/50 cursor-not-allowed" readOnly required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <TiptapEditor content={content} onChange={setContent} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select onValueChange={setCategoryId} value={categoryId}>
            <SelectTrigger id="category"><SelectValue placeholder="Select a category" /></SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Select onValueChange={setAuthorId} value={authorId}>
            <SelectTrigger id="author"><SelectValue placeholder="Select an author" /></SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input type="checkbox" id="status" checked={status === 'PUBLISHED'} onChange={(e) => setStatus(e.target.checked ? 'PUBLISHED' : 'DRAFT')} />
        <label htmlFor="status">Published</label>
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          {initialData ? "Update Post" : "Create Post"}
        </Button>
      </div>
    </form>
  );
};

export default PostForm;