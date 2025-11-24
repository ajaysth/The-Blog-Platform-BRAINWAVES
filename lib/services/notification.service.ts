// lib/services/notification.service.ts
import { prisma } from "@/lib/prisma"
import { NotificationType } from "@prisma/client"

export class NotificationService {
  /**
   * Create a notification
   */
  static async create({
    userId,
    actorId,
    type,
    content,
    postId,
    commentId,
    metadata,
  }: {
    userId: string
    actorId?: string
    type: NotificationType
    content?: string
    postId?: string
    commentId?: string
    metadata?: any
  }) {
    // Don't notify users about their own actions
    if (userId === actorId) return null

    // Check if a similar notification already exists (deduplication)
    const existingNotification = await prisma.notification.findFirst({
      where: {
        userId,
        actorId,
        type,
        postId,
        commentId,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    })

    if (existingNotification) {
      return existingNotification
    }

    return await prisma.notification.create({
      data: {
        userId,
        actorId,
        type,
        content,
        postId,
        commentId,
        metadata,
      },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        comment: {
          select: {
            id: true,
            content: true,
          },
        },
      },
    })
  }

  /**
   * Get user notifications with pagination
   */
  static async getUserNotifications({
    userId,
    page = 1,
    limit = 20,
    unreadOnly = false,
  }: {
    userId: string
    page?: number
    limit?: number
    unreadOnly?: boolean
  }) {
    const skip = (page - 1) * limit

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: {
          userId,
          ...(unreadOnly && { isRead: false }),
        },
        include: {
          actor: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          post: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
          comment: {
            select: {
              id: true,
              content: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.notification.count({
        where: {
          userId,
          ...(unreadOnly && { isRead: false }),
        },
      }),
      prisma.notification.count({
        where: {
          userId,
          isRead: false,
        },
      }),
    ])

    return {
      notifications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      unreadCount,
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string, userId: string) {
    return await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        isRead: true,
      },
    })
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(userId: string) {
    return await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    })
  }

  /**
   * Delete notification
   */
  static async delete(notificationId: string, userId: string) {
    return await prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId,
      },
    })
  }

  /**
   * Delete all notifications
   */
  static async deleteAll(userId: string) {
    return await prisma.notification.deleteMany({
      where: {
        userId,
      },
    })
  }

  /**
   * Get unread count
   */
  static async getUnreadCount(userId: string) {
    return await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    })
  }
}

// Helper functions for specific notification types
export const NotificationHelpers = {
  async notifyOnLike(postId: string, likerId: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true, title: true },
    })

    if (!post) return null

    return NotificationService.create({
      userId: post.authorId,
      actorId: likerId,
      type: "LIKE",
      postId,
    })
  },

  async notifyOnComment(postId: string, commenterId: string, content: string, commentId: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    })

    if (!post) return null

    return NotificationService.create({
      userId: post.authorId,
      actorId: commenterId,
      type: "COMMENT",
      postId,
      commentId,
      content: content.substring(0, 100),
    })
  },

  async notifyOnReply(parentCommentId: string, replierId: string, content: string, replyId: string) {
    const parentComment = await prisma.comment.findUnique({
      where: { id: parentCommentId },
      select: { authorId: true, postId: true },
    })

    if (!parentComment) return null

    return NotificationService.create({
      userId: parentComment.authorId,
      actorId: replierId,
      type: "REPLY",
      postId: parentComment.postId,
      commentId: replyId,
      content: content.substring(0, 100),
    })
  },

  async notifyOnFollow(followedUserId: string, followerId: string) {
    return NotificationService.create({
      userId: followedUserId,
      actorId: followerId,
      type: "FOLLOW",
    })
  },

  async notifyOnMention(mentionedUserId: string, mentionerId: string, postId: string, commentId?: string) {
    return NotificationService.create({
      userId: mentionedUserId,
      actorId: mentionerId,
      type: "MENTION",
      postId,
      commentId,
    })
  },
}