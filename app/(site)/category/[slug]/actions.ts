"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth"; // New import

export async function getCategoryWithPosts(slug: string) {
  try {
    const session = await auth(); // Fetch session
    const userId = session?.user?.id;

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        posts: {
          include: {
            author: true,
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
              : undefined, // Don't fetch likes if no user, or if userId is null
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (category) {
      // Manually transform the posts to match the client-side expectations
      const postsWithCountsAndTags = category.posts.map((post) => ({
        ...post,
        likes: post._count.likes,
        comments: post._count.comments,
        tags: post.tags.map((postTag) => postTag.tag.name),
        isLiked: userId ? post.likes.length > 0 : false, // Determine isLiked status
      }));
      return { ...category, posts: postsWithCountsAndTags, userId: userId }; // Pass userId also
    }

    return null;
  } catch (error) {
    console.error("Error fetching category with posts:", error);
    throw new Error("Failed to fetch category with posts.");
  }
}
