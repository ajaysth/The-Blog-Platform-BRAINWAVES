"use client";

import { useState } from "react";
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

interface PostData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  categoryId: string;
  tags: string[];
  status: "DRAFT" | "PUBLISHED";
}

interface CreatePostFormProps {
  categories: Array<{ id: string; name: string }>;
  availableTags: Array<{ id: string; name: string }>;
  onSave: (data: PostData) => Promise<void>;
}

export default function CreatePostForm({
  categories,
  availableTags,
  onSave,
}: CreatePostFormProps) {
  const [post, setPost] = useState<PostData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    categoryId: "",
    tags: [],
    status: "DRAFT",
  });

  const [loadingState, setLoadingState] = useState<"idle" | "drafting" | "publishing">("idle");
  const [previewMode, setPreviewMode] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = (status: "DRAFT" | "PUBLISHED") => {
    if (loadingState !== 'idle') return;
    setLoadingState(status === 'DRAFT' ? 'drafting' : 'publishing');
    // Fire and forget the server action. The redirect will handle navigation.
    // This prevents the client from catching the redirect as an error.
    onSave({ ...post, status });
  };

  const updateField = (field: keyof PostData, value: any) => {
    setPost((prev) => ({ ...prev, [field]: value }));

    if (field === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setPost((prev) => ({ ...prev, slug }));
    }
  };

  const toggleTag = (tagId: string) => {
    setPost((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter((id) => id !== tagId)
        : [...prev.tags, tagId],
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const cdnUrl = await uploadToUploadcare(file);
      updateField("coverImage", cdnUrl);
      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = () => {
    updateField("coverImage", "");
    toast.success("Image removed");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Create New Post</h1>
          <p className="text-muted-foreground">
            Share your thoughts with the world
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
            disabled={loadingState !== 'idle'}
            className="gap-2"
          >
            {loadingState === 'drafting' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {loadingState === 'drafting' ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button
            onClick={() => handleSubmit("PUBLISHED")}
            disabled={loadingState !== 'idle'}
            className="gap-2"
          >
            {loadingState === 'publishing' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <FileText size={16} />
            )}
            {loadingState === 'publishing' ? 'Publishing...' : 'Publish'}
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
                    className="h-8"
                  />
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
                      <Image src={post.coverImage} alt="Cover preview" fill className="object-cover" unoptimized />
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
            /* Preview Mode - Replace the existing preview section with this */
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
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm transition-all duration-200",
                    post.tags.includes(tag.id)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  )}
                >
                  {tag.name}
                </button>
              ))}
            </div>
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
                  {Math.ceil(post.content.split(" ").length / 200)} min
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}