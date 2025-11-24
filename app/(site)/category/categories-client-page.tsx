"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, ArrowDownAZ, ArrowUpAZ, Hash, Book, Loader2 } from "lucide-react";
import CardFlip from "@/components/ui/category-card";

type CategoryWithCount = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  catimage: string | null;
  _count: {
    posts: number;
  };
};

interface CategoriesClientPageProps {
  initialCategories: CategoryWithCount[];
  initialTotalPages: number;
}

const ITEMS_PER_PAGE = 6;

export default function CategoriesClientPage({
  initialCategories,
  initialTotalPages,
}: CategoriesClientPageProps) {
  const [categories, setCategories] = useState<CategoryWithCount[]>(initialCategories);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // We don't want to fetch categories on the initial render
    // as we already have the initial categories.
    if (currentPage === 1 && searchTerm === "" && sort === "name-asc") {
      return;
    }

    const fetchCategories = async () => {
      setLoading(true);
      try {
        const [sortKey, sortDirection] = sort.split("-");
        const res = await fetch(
          `/api/categories?page=${currentPage}&limit=${ITEMS_PER_PAGE}&search=${searchTerm}&sort=${sortKey}&direction=${sortDirection}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await res.json();
        setCategories(data.data);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Optionally show a toast error to the user
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [currentPage, searchTerm, sort]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <main className="pt-24 pb-16 container mx-auto px-4">
        {/* Header */}
        <section className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Explore Categories
          </h1>
          <p className="text-xl text-muted-foreground">
            Find topics that spark your interest.
          </p>
        </section>

        {/* Controls */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center p-4 rounded-lg bg-card border">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on new search
                }}
                className="pl-10"
              />
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">
                    <div className="flex items-center gap-2">
                      <ArrowDownAZ className="h-4 w-4" />
                      Name (A-Z)
                    </div>
                  </SelectItem>
                  <SelectItem value="name-desc">
                    <div className="flex items-center gap-2">
                      <ArrowUpAZ className="h-4 w-4" />
                      Name (Z-A)
                    </div>
                  </SelectItem>
                  <SelectItem value="posts-desc">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Posts (Most)
                    </div>
                  </SelectItem>
                  <SelectItem value="posts-asc">
                    <div className="flex items-center gap-2">
                      <Book className="h-4 w-4" />
                      Posts (Fewest)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="relative">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/category/${category.slug}`}>
                    <CardFlip
                      category={category}
                      postCount={category._count.posts}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg">No categories found.</p>
              <p>Try adjusting your search or sort parameters.</p>
            </div>
          )}
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <section className="flex justify-center items-center gap-4 mt-12">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || loading}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || loading}
            >
              Next
            </Button>
          </section>
        )}
      </main>
    </div>
  );
}
