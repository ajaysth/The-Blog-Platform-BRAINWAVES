import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Prisma } from "@prisma/client";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export async function POST(request: Request) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, content, categoryId, status, coverImage, slug, tags, newTags, excerpt } =
      body;

    let finalSlug = slug;
    // Check for slug uniqueness and append a short id if needed
    const existingPost = await prisma.post.findUnique({
      where: { slug: finalSlug },
    });

    if (existingPost) {
      finalSlug = `${finalSlug}-${Math.random().toString(36).substring(2, 7)}`;
    }

    const allTagIds = [...(tags || [])];

    if (newTags && newTags.length > 0) {
      const newTagObjects = await Promise.all(
        newTags.map(async (tagName: string) => {
          return prisma.tag.create({
            data: {
              name: tagName,
              slug: slugify(tagName),
            },
          });
        })
      );
      allTagIds.push(...newTagObjects.map(tag => tag.id));
    }
    
    // rough estimate of read time
    const readTime = Math.ceil(content.replace(/<[^>]*>?/gm, '').split(/\s+/).length / 200);

    const dataToCreate: any = {
      title,
      content,
      excerpt,
      categoryId,
      coverImage,
      slug: finalSlug,
      authorId: session.user.id,
      status,
      readTime,
    };

    if (status === "PUBLISHED") {
      dataToCreate.publishedAt = new Date();
    }

    const post = await prisma.post.create({
      data: dataToCreate,
    });

    // Create post tags
    if (allTagIds.length > 0) {
      await prisma.postTag.createMany({
        data: allTagIds.map((tagId: string) => ({
          postId: post.id,
          tagId,
        })),
      });
    }

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
  const authorId = searchParams.get("authorId");
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    const where: Prisma.PostWhereInput = {
      ...(authorId && { authorId }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { author: { name: { contains: search, mode: "insensitive" } } },
          { category: { name: { contains: search, mode: "insensitive" } } },
        ],
      }),
    };

    let posts;
    let totalPosts;

    const commonInclude = {
        category: true,
        author: true,
        _count: {
            select: { likes: true },
        },
    };

    if (all === "true") {
      posts = await prisma.post.findMany({
        where,
        include: commonInclude,
        orderBy: {
          [sort]: direction,
        },
      });
      totalPosts = posts.length;
    } else {
      posts = await prisma.post.findMany({
        where,
        include: commonInclude,
        orderBy: {
          [sort]: direction,
        },
        skip: offset,
        take: limit,
      });
      totalPosts = await prisma.post.count({ where });
    }

    const postsWithLikes = posts.map(post => ({
        ...post,
        likes: post._count.likes,
    }));


    const totalPages = Math.ceil(totalPosts / limit);

    return NextResponse.json({ posts: postsWithLikes, totalPages, totalPosts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
