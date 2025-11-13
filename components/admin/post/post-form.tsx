"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Post, Category, User } from "@prisma/client";

interface PostFormProps {
  onSubmit: (postData: Omit<Post, "id">) => void;
  initialData?: Post | null;
}

const PostForm = ({ onSubmit, initialData }: PostFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [published, setPublished] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content || "");
      setCategoryId(initialData.categoryId || "");
      setAuthorId(initialData.authorId);
      setPublished(initialData.published);
    }
  }, [initialData]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchCategories();
    fetchUsers();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      published,
      categoryId,
      authorId,
      featuredImage: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      slug: title.toLowerCase().replace(/\s+/g, "-"),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Textarea
        placeholder="Post Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Select onValueChange={setCategoryId} value={categoryId}>
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
      <Select onValueChange={setAuthorId} value={authorId}>
        <SelectTrigger>
          <SelectValue placeholder="Select an author" />
        </SelectTrigger>
        <SelectContent>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="published"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        <label htmlFor="published">Published</label>
      </div>
      <Button type="submit">
        {initialData ? "Update Post" : "Create Post"}
      </Button>
    </form>
  );
};

export default PostForm;