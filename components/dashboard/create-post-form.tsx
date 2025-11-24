"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Save,
  Eye,
  Upload,
  X,
  ImageIcon,
  FileText,
  Tag,
  FolderOpen,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import toast from "react-hot-toast";
import { uploadToUploadcare } from "@/lib/uploadcare";
import TiptapEditor from "@/components/editor/tiptap-editor";
import CreatableSelect from 'react-select/creatable';
import { MultiValue } from 'react-select';

interface PostData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  categoryId: string;
  tags: string[];
  newTags?: string[];
  status: "DRAFT" | "PUBLISHED";
}

interface CreatePostFormProps {
  categories: Array<{ id: string; name: string }>;
  availableTags: Array<{ id: string; name: string }>;
  initialData?: Partial<PostData>;
}

type TagOption = {
  value: string;
  label: string;
};

const initialPostState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  categoryId: "",
  tags: [],
  status: "DRAFT" as "DRAFT" | "PUBLISHED",
};

export default function CreatePostForm({
  categories,
  availableTags,
  initialData,
}: CreatePostFormProps) {
  const [post, setPost] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    coverImage: initialData?.coverImage || "",
    categoryId: initialData?.categoryId || "",
    tags: initialData?.tags?.map(tagId => {
      const tag = availableTags.find(t => t.id === tagId);
      return { value: tagId, label: tag ? tag.name : '' };
    }).filter(t => t.label) || [],
    status: initialData?.status || "DRAFT",
  });
  const [localCoverImagePreview, setLocalCoverImagePreview] = useState<string>("");
  const [previewMode, setPreviewMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const isEditing = !!initialData;

  const mutation = useMutation({
    mutationFn: (newPost: PostData) => {
      const url = isEditing ? `/api/posts/${initialData?.id}` : '/api/posts';
      const method = isEditing ? 'PUT' : 'POST';
      return fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      }).then(res => {
        if (!res.ok) {
          throw new Error(`Failed to ${isEditing ? 'update' : 'create'} post`);
        }
        return res.json();
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['my-posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success(`Post ${isEditing ? 'updated' : 'created'} successfully!`);
      if (!isEditing) {
        setPost(initialPostState);
      }
      router.push('/dashboard/posts');
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (status: "DRAFT" | "PUBLISHED") => {
    if (mutation.isPending) return;
    
    const existingTags = post.tags.filter(tag => availableTags.some(at => at.id === tag.value)).map(tag => tag.value);
    const newTags = post.tags.filter(tag => !availableTags.some(at => at.id === tag.value)).map(tag => tag.label);

    mutation.mutate({
      id: initialData?.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      categoryId: post.categoryId,
      status,
      tags: existingTags,
      newTags: newTags
    });
  };

  const updateField = (field: keyof typeof post, value: any) => {
    setPost((prev) => ({ ...prev, [field]: value }));

    if (field === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setPost((prev) => ({ ...prev, slug }));
    }
  };

  const handleTagsChange = (selectedOptions: MultiValue<TagOption>) => {
    setPost(prev => ({ ...prev, tags: selectedOptions as TagOption[] }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Set local preview
    const previewUrl = URL.createObjectURL(file);
    setLocalCoverImagePreview(previewUrl);

    setUploading(true);
    try {
      const cdnUrl = await uploadToUploadcare(file);
      updateField("coverImage", cdnUrl);
      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image.');
      setLocalCoverImagePreview(""); // Clear local preview on error
    } finally {
      setUploading(false);
      e.target.value = ''; // Clear file input
    }
  };

  const handleRemoveImage = () => {
    updateField("coverImage", "");
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

  const tagOptions = availableTags.map(tag => ({ value: tag.id, label: tag.name }));

  const readTime = useMemo(() => {
    if (!post.content) return 0;
    // Create a temporary div to strip HTML tags
    const div = document.createElement("div");
    div.innerHTML = post.content;
    const text = div.textContent || div.innerText || "";
    return Math.ceil(text.trim().split(/\s+/).length / 200);
  }, [post.content]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
        <h1 className="text-3xl font-bold mb-2">{isEditing ? "Edit Post" : "Create New Post"}</h1>
          <p className="text-muted-foreground">
            {isEditing ? "Make changes to your existing post." : "Share your thoughts with the world"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
            className="gap-2"
          >
            <Eye size={16} />
            {previewMode ? "Edit" : "Preview"}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSubmit("DRAFT")}
            disabled={mutation.isPending}
            className="gap-2"
          >
            {mutation.isPending && mutation.variables?.status === 'DRAFT' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {mutation.isPending && mutation.variables?.status === 'DRAFT' ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button
            onClick={() => handleSubmit("PUBLISHED")}
            disabled={mutation.isPending}
            className="gap-2"
          >
            {mutation.isPending && mutation.variables?.status === 'PUBLISHED' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <FileText size={16} />
            )}
            {mutation.isPending && mutation.variables?.status === 'PUBLISHED' ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <Card className="lg:col-span-2 p-6 animate-in slide-in-from-left-4 delay-100">
          {!previewMode ? (
            <div className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-lg font-semibold">
                  Title
                </Label>
                <Input
                  id="title"
                  value={post.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Enter an engaging title..."
                  className="text-2xl font-bold border-none px-0 focus-visible:ring-0 h-auto"
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug" className="text-sm text-muted-foreground">
                  URL Slug
                </Label>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>yoursite.com/post/</span>
                  <Input
                    id="slug"
                    value={post.slug}
                    onChange={(e) => updateField("slug", e.target.value)}
                    placeholder="post-url-slug"
                    className="h-8 cursor-not-allowed"
                    readOnly />
                </div>
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <ImageIcon size={16} />
                  Cover Image
                </Label>
                {post.coverImage ? (
                  <div className="space-y-3">
                    <div className="relative w-full aspect-video max-w-md rounded-lg overflow-hidden border-2 border-border">
                      <Image src={localCoverImagePreview || post.coverImage} alt="Cover preview" fill className="object-cover" unoptimized />
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={handleRemoveImage} className="w-full max-w-md gap-2">
                      <X size={16} /> Remove Image
                    </Button>
                  </div>
                ) : (
                  <div className="max-w-md">
                    <div className="relative border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <div className="space-y-3">
                        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-muted">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <label htmlFor="image-upload">
                          <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
                            <span className="cursor-pointer gap-2">
                              {uploading ? (
                                <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</>
                              ) : (
                                <><Upload className="h-4 w-4" /> Choose File</>
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

              {/* Excerpt */}
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={post.excerpt}
                  onChange={(e) => updateField("excerpt", e.target.value)}
                  placeholder="Write a brief excerpt (optional)..."
                  rows={3}
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-lg font-semibold">
                  Content
                </Label>
                <TiptapEditor
                  content={post.content}
                  onChange={(newContent) => updateField("content", newContent)}
                />
              </div>
            </div>
          ) : (
            /* Preview Mode */
            <div className="prose prose-lg max-w-none animate-in fade-in duration-300">
              {post.coverImage && (
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-96 object-cover rounded-lg mb-8"
                />
              )}
              <h1 className="text-4xl font-bold mb-4">
                {post.title || "Untitled Post"}
              </h1>
              {post.excerpt && (
                <p className="text-xl text-muted-foreground mb-8">
                  {post.excerpt}
                </p>
              )}
              <div
                className="prose-headings:font-bold prose-a:text-primary prose-img:rounded-lg"
                dangerouslySetInnerHTML={{ __html: post.content || "<p>No content yet...</p>" }}
              />
            </div>
          )}
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category */}
          <Card className="p-6 animate-in slide-in-from-right-4 delay-200">
            <Label className="flex items-center gap-2 mb-4">
              <FolderOpen size={16} />
              Category
            </Label>
            <Select
              value={post.categoryId}
              onValueChange={(value) => updateField("categoryId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>

          {/* Tags */}
          <Card className="p-6 animate-in slide-in-from-right-4 delay-300">
            <Label className="flex items-center gap-2 mb-4">
              <Tag size={16} />
              Tags
            </Label>
            <CreatableSelect
              isMulti
              onChange={handleTagsChange}
              options={tagOptions}
              value={post.tags}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </Card>

          {/* Publishing Info */}
          <Card className="p-6 animate-in slide-in-from-right-4 delay-400">
            <h3 className="font-semibold mb-4">Publishing Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span
                  className={cn(
                    "font-medium",
                    post.status === "PUBLISHED"
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {post.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Visibility:</span>
                <span className="font-medium">Public</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Read time:</span>
                <span className="font-medium">
                  {readTime} min
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}