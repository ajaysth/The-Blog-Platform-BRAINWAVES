"use server";

import prisma from "@/lib/prisma";

export async function getAllPosts() {
  try {
    const posts = await prisma.post.findMany({
      
      where: {
        status: "PUBLISHED",
      },
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
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return posts.map((post) => ({
      ...post,
      likes: post._count.likes,
      comments: post._count.comments,
      tags: post.tags.map((postTag) => postTag.tag.name),
    }));
  } catch (error) {
    console.error("Error fetching all posts:", error);
    throw new Error("Failed to fetch posts.");
  }
}
