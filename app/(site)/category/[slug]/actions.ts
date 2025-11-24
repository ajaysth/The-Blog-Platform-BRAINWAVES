"use server";

import prisma from "@/lib/prisma";

export async function getCategoryWithPosts(slug: string) {
  try {
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
      }));
      return { ...category, posts: postsWithCountsAndTags };
    }

    return null;
  } catch (error) {
    console.error("Error fetching category with posts:", error);
    throw new Error("Failed to fetch category with posts.");
  }
}
