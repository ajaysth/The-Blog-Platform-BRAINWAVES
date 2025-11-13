import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function POST(request: Request) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, content, categoryId, published, featuredImage, slug } =
      body;

    const dataToCreate: {
      title: string;
      content: string;
      categoryId: string;
      featuredImage?: string;
      slug: string;
      authorId: string;
      status?: "PUBLISHED" | "DRAFT" | "ARCHIVED";
      publishedAt?: Date | null;
    } = {
      title,
      content,
      categoryId,
      featuredImage,
      slug,
      authorId: session.user.id,
    };

    if (published === true) {
      dataToCreate.status = "PUBLISHED";
      dataToCreate.publishedAt = new Date();
    } else {
      dataToCreate.status = "DRAFT";
      dataToCreate.publishedAt = null;
    }

    const post = await prisma.post.create({
      data: dataToCreate,
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all");
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const sort = searchParams.get("sort") || "createdAt";
  const direction = searchParams.get("direction") || "desc";
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    const where: Prisma.PostWhereInput = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
            { author: { name: { contains: search, mode: "insensitive" } } },
            { category: { name: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {};

    let posts;
    let totalPosts;

    if (all === "true") {
      posts = await prisma.post.findMany({
        where,
        include: {
          category: true,
          author: true,
        },
        orderBy: {
          [sort]: direction,
        },
      });
      totalPosts = posts.length; // If fetching all, totalPosts is simply the count of fetched posts
    } else {
      posts = await prisma.post.findMany({
        where,
        include: {
          category: true,
          author: true,
        },
        orderBy: {
          [sort]: direction,
        },
        skip: offset,
        take: limit,
      });
      totalPosts = await prisma.post.count({ where });
    }

    const totalPages = Math.ceil(totalPosts / limit);

    return NextResponse.json({ posts, totalPages, totalPosts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
