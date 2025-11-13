import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { slug: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    let tags;
    let totalTags;

    if (all === "true") {
      tags = await prisma.tag.findMany({
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
      totalTags = tags.length; // If fetching all, totalTags is simply the count of fetched tags
    } else {
      tags = await prisma.tag.findMany({
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
      totalTags = await prisma.tag.count({ where });
    }

    const totalPages = Math.ceil(totalTags / limit);

    return NextResponse.json({ tags, totalPages, totalTags });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug } = body;
    const tag = await prisma.tag.create({
      data: {
        name,
        slug,
      },
    });
    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    );
  }
}
