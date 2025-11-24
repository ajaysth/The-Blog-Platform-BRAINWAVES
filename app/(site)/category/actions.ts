"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";


export async function getAllCategoriesWithPostCount() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
    return categories;
  } catch (error) {
    console.error("Error fetching all categories with post count:", error);
    throw new Error("Failed to fetch all categories.");
  }
}

export async function getCategoriesWithPostCount({
  page = 1,
  limit = 6,
  search = "",
  sort = "name",
  direction = "asc",
}: {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  direction?: string;
}) {
  const offset = (page - 1) * limit;

  try {
    const where: Prisma.CategoryWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const categories = await prisma.category.findMany({
      where,
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy:
        sort === "posts"
          ? { posts: { _count: direction as "asc" | "desc" } }
          : { [sort]: direction as "asc" | "desc" },
      skip: offset,
      take: limit,
    });

    const totalCategories = await prisma.category.count({ where });
    const totalPages = Math.ceil(totalCategories / limit);

    return { categories, totalPages, totalCategories };
  } catch (error) {
    console.error("Error fetching categories with post count:", error);
    throw new Error("Failed to fetch categories.");
  }
}
