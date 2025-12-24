// actions/like.action.ts
"use server"

import { auth } from "@/lib/auth" // Corrected import
import prisma from "@/lib/prisma"
import { NotificationHelpers } from "@/lib/services/notification.service"
import { revalidatePath } from "next/cache"

export async function toggleLike(postId: string) {
  const session = await auth() // Use auth() to get the session
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const existingLike = await prisma.like.findUnique({
    where: {
      postId_userId: {
        postId,
        userId: session.user.id,
      },
    },
  })

  if (existingLike) {
    // Unlike
    await prisma.like.delete({
      where: { id: existingLike.id },
    })
    
    // Optionally delete the notification
    await prisma.notification.deleteMany({
      where: {
        postId,
        actorId: session.user.id,
        type: "LIKE",
      },
    })
  } else {
    // Like
    await prisma.like.create({
      data: {
        postId,
        userId: session.user.id,
      },
    })
    
    // Create notification
    await NotificationHelpers.notifyOnLike(postId, session.user.id)
  }

  revalidatePath(`/post/${postId}`)
  revalidatePath('/dashboard/likes') // Added revalidation for dashboard/likes
  return { success: true }
}