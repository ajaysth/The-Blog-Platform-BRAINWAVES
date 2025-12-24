import LikedPosts from "@/components/dashboard/liked-posts"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import type { Post } from "@/types/post"

export const metadata = {
  title: "Liked Posts | Brainwaves",
  description: "View your liked posts and saved stories.",
}

export default async function LikedPostsPage() {
  const session = await auth()
  const userId = session?.user?.id

  let posts: Post[] = []

  if (userId) {
    const likedPosts = await prisma.like.findMany({
      where: {
        userId: userId,
      },
      include: {
        post: {
          include: {
            author: true,
            category: true,
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    posts = likedPosts.map((like) => ({
      id: like.post.id,
      title: like.post.title,
      slug: like.post.slug,
      excerpt: like.post.excerpt || "",
      coverImage: like.post.coverImage || "/hero-blog.jpg",
      author: {
        name: like.post.author.name || "Unknown",
        image: like.post.author.image || "/placeholder-avatar.jpg",
      },
      category: like.post.category?.name || "Uncategorized",
      readTime: `${like.post.readTime || 5} min read`,
      publishedAt: new Date(like.post.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      likes: like.post._count.likes,
      comments: like.post._count.comments,
    }))
  }

  return <LikedPosts posts={posts} />
}
