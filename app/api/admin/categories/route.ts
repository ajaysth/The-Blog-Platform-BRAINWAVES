import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { deleteFromUploadcare } from "@/lib/uploadcare";
import { revalidateTag } from "next/cache";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all");

  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      ...(all ? {} : { take: 10 }),
    });
    return NextResponse.json({ data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name, slug, description, catimage } = await req.json();

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        catimage: catimage || null,
      },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    revalidateTag("categories");
    return NextResponse.json({ category: newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    const { name, slug, description, catimage } = await req.json();

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || null,
        catimage: catimage || null,
      },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    revalidateTag("categories");
    return NextResponse.json({ category: updatedCategory });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // First, find the category to get the image URL
    const category = await prisma.category.findUnique({
      where: { id },
    });

    // If the category has an image, delete it from Uploadcare
    if (category && category.catimage) {
      try {
        await deleteFromUploadcare(category.catimage);
      } catch (uploadcareError) {
        console.error("Failed to delete image from Uploadcare, but proceeding with category deletion:", uploadcareError);
      }
    }

    // Then, delete the category from the database
    await prisma.category.delete({
      where: {
        id: id,
      },
    });

    revalidateTag("categories");
    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}