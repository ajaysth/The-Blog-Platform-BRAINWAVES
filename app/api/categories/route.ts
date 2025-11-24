import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import  prisma from "@/lib/prisma";


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const sort = searchParams.get("sort") || "name";
  const direction = searchParams.get("direction") || "asc";
  const limit = 6;
  const offset = (page - 1) * limit;

  try {
    const where: Prisma.CategoryWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { slug: { contains: search, mode: "insensitive" } },
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

    return NextResponse.json({ data: categories, totalPages, totalCategories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
