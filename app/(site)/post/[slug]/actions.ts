"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth"; // New import

export async function getPostBySlug(slug: string) {
  try {
    const session = await auth(); // Fetch session
    const userId = session?.user?.id;

    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        likes: userId // Only include likes if userId exists
          ? {
              where: { userId: userId },
              select: { userId: true },
            }
          : undefined, // Don't fetch likes if no user
      },
    });

    if (!post) {
      return null;
    }

    // Manually transform the post to match the client-side expectations
    const postWithCountsAndTags = {
      ...post,
      likes: post._count.likes,
      comments: post._count.comments,
      tags: post.tags.map((postTag) => postTag.tag.name),
      isLiked: userId ? post.likes.length > 0 : false, // Determine isLiked status
    };

    return { ...postWithCountsAndTags, userId: userId }; // Return userId also
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    throw new Error("Failed to fetch post.");
  }
}

export async function getCommentsForPost(postId: string) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentId: null, // Only fetch top-level comments
      },
      include: {
        author: true,
        replies: {
          include: {
            author: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return comments;
  } catch (error) {
    console.error("Error fetching comments for post:", error);
    throw new Error("Failed to fetch comments.");
  }
}
