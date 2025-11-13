
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all");
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const sort = searchParams.get("sort") || "createdAt";
  const direction = searchParams.get("direction") || "desc";
  const limit = 10;
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

    let categories;
    let totalCategories;

    if (all === "true") {
      categories = await prisma.category.findMany({
        where,
        include: {
          _count: {
            select: { posts: true },
          },
        },
        orderBy: {
          [sort]: direction,
        },
      });
      totalCategories = categories.length; // If fetching all, totalCategories is simply the count of fetched categories
    } else {
      categories = await prisma.category.findMany({
        where,
        include: {
          _count: {
            select: { posts: true },
          },
        },
        orderBy: {
          [sort]: direction,
        },
        skip: offset,
        take: limit,
      });
      totalCategories = await prisma.category.count({ where });
    }

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

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const name = data.get("name") as string;
    const slug = data.get("slug") as string;
    const description = data.get("description") as string;
    const imageFile: File | null = data.get("image") as unknown as File;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    let imageUrl: string | undefined = undefined;
    if (imageFile) {
      const uploadDir = join(process.cwd(), "public/uploads/catimg");
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${imageFile.name}`;
      const path = join(uploadDir, filename);
      await writeFile(path, buffer);
      imageUrl = `/uploads/catimg/${filename}`;
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        catimage: imageUrl,
      },
    });

    return NextResponse.json({ category: newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    const data = await req.formData();
    const name = data.get("name") as string;
    const slug = data.get("slug") as string;
    const description = data.get("description") as string;
    const imageFile: File | null = data.get("image") as unknown as File;

    let imageUrl: string | undefined = undefined;
    if (imageFile) {
      const uploadDir = join(process.cwd(), "public/uploads/catimg");
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${imageFile.name}`;
      const path = join(uploadDir, filename);
      await writeFile(path, buffer);
      imageUrl = `/uploads/catimg/${filename}`;
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        ...(imageUrl && { catimage: imageUrl }),
      },
    });

    return NextResponse.json({ category: updatedCategory });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
