"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, X, Upload, Loader2, ImageIcon } from "lucide-react";
import Image from "next/image";
import { uploadToUploadcare } from "@/lib/uploadcare";

type CategoryData = {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  catimage?: string | null;
};

type Props = {
  category?: CategoryData | null;
  onSave: (category: CategoryData) => void;
};

export function CategoryForm({ category, onSave }: Props) {
  const [categoryData, setCategoryData] = useState<CategoryData>({
    id: category?.id,
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    catimage: category?.catimage || null,
  });
  const [imageUrl, setImageUrl] = useState<string | null>(
    category?.catimage || null
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (category) {
      setCategoryData({
        id: category.id,
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        catimage: category.catimage || null,
      });
      setImageUrl(category.catimage || null);
    }
  }, [category]);

  // Auto-generate slug from name
  useEffect(() => {
    const generatedSlug = categoryData.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters except spaces and hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/^-+|-+$/g, ""); // Trim hyphens from start and end
    
    if (generatedSlug !== categoryData.slug) {
      setCategoryData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [categoryData.name]);

  const updateField = (field: keyof CategoryData, value: string | null) => {
    setCategoryData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const cdnUrl = await uploadToUploadcare(file);
      setImageUrl(cdnUrl);
      updateField("catimage", cdnUrl);
      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    updateField("catimage", null);
    toast.success("Image removed");
  };

  const handleSave = async () => {
    if (!categoryData.name || !categoryData.slug) {
      toast.error("Name and Slug are required.");
      return;
    }

    setSaving(true);

    const payload = {
      name: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description || "",
      catimage: imageUrl || null,
    };

    try {
      const url = categoryData.id
        ? `/api/admin/categories?id=${categoryData.id}`
        : "/api/admin/categories";
      const method = categoryData.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      
      if (!res.ok) {
        toast.error(result.error || "Failed to save category.");
        return;
      }

      toast.success(
        categoryData.id
          ? "✅ Category updated successfully!"
          : "✅ Category created successfully!"
      );
      onSave(result.category || result);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {category?.id ? "Edit Category" : "Create New Category"}
            </h3>
            <Button onClick={handleSave} disabled={saving} size="sm">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Category
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Category Image Upload */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Category Image
            </Label>
            
            {imageUrl ? (
              <div className="space-y-3">
                <div className="relative w-full aspect-video max-w-md rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <Image
                    src={imageUrl}
                    alt="Category preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="w-full max-w-md"
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove Image
                </Button>
              </div>
            ) : (
              <div className="max-w-md">
                <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 bg-gray-50/50 dark:bg-gray-900/50">
                  <div className="space-y-3">
                    <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Upload category image
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        PNG, JPG, or GIF (max 10MB)
                      </p>
                    </div>
                    
                    <label htmlFor="image-upload">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={uploading}
                        asChild
                      >
                        <span className="cursor-pointer">
                          {uploading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Choose File
                            </>
                          )}
                        </span>
                      </Button>
                    </label>
                    
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Category Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Category Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={categoryData.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="e.g. Handmade Bags"
              className="w-full"
              required
            />
          </div>
          
          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Slug <span className="text-red-500">*</span>
            </Label>
            <Input
              id="slug"
              value={categoryData.slug}
              placeholder="e.g. handmade-bags"
              className="w-full font-mono text-sm bg-gray-100 dark:bg-gray-700/50 cursor-not-allowed"
              readOnly
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              URL-friendly version (auto-generated from name)
            </p>
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </Label>
            <Textarea
              id="description"
              value={categoryData.description || ""}
              onChange={(e) => updateField("description", e.targe.value)}
              placeholder="A brief description of this category..."
              rows={4}
              className="w-full resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {categoryData.description?.length || 0}/500 characters
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}