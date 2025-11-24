// actions/follow.action.ts
"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NotificationHelpers } from "@/lib/services/notification.service"
import { revalidatePath } from "next/cache"

export async function toggleFollow(userId: string) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  if (userId === session.user.id) {
    throw new Error("Cannot follow yourself")
  }

  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: session.user.id,
        followingId: userId,
      },
    },
  })

  if (existingFollow) {
    // Unfollow
    await prisma.follow.delete({
      where: { id: existingFollow.id },
    })
    
    // Delete notification
    await prisma.notification.deleteMany({
      where: {
        userId,
        actorId: session.user.id,
        type: "FOLLOW",
      },
    })
  } else {
    // Follow
    await prisma.follow.create({
      data: {
        followerId: session.user.id,
        followingId: userId,
      },
    })
    
    // Create notification
    await NotificationHelpers.notifyOnFollow(userId, session.user.id)
  }

  revalidatePath(`/profile/${userId}`)
  return { success: true }
}