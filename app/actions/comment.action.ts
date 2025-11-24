// actions/comment.action.ts
"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NotificationHelpers } from "@/lib/services/notification.service"
import { revalidatePath } from "next/cache"

export async function createComment({
  postId,
  content,
  parentId,
}: {
  postId: string
  content: string
  parentId?: string
}) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      postId,
      authorId: session.user.id,
      parentId,
    },
  })

  // Create notification
  if (parentId) {
    // It's a reply
    await NotificationHelpers.notifyOnReply(
      parentId,
      session.user.id,
      content,
      comment.id
    )
  } else {
    // It's a new comment
    await NotificationHelpers.notifyOnComment(
      postId,
      session.user.id,
      content,
      comment.id
    )
  }

  // Check for mentions in the comment
  const mentionRegex = /@(\w+)/g
  const mentions = content.match(mentionRegex)
  
  if (mentions) {
    const usernames = mentions.map((m) => m.slice(1))
    const mentionedUsers = await prisma.user.findMany({
      where: {
        name: { in: usernames },
      },
      select: { id: true },
    })

    for (const user of mentionedUsers) {
      await NotificationHelpers.notifyOnMention(
        user.id,
        session.user.id,
        postId,
        comment.id
      )
    }
  }

  revalidatePath(`/post/${postId}`)
  return { success: true, comment }
}
