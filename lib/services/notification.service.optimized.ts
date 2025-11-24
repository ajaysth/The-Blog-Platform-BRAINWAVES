import { NotificationCache } from "@/lib/cache/redis"
import prisma from "@/lib/prisma"

export class OptimizedNotificationService {
  static async getUnreadCount(userId: string) {
    // Try cache first
    const cached = await NotificationCache.getUnreadCount(userId)
    if (cached !== null) return cached

    // Fallback to database
    const count = await prisma.notification.count({
      where: { userId, isRead: false },
    })

    // Update cache
    await NotificationCache.setUnreadCount(userId, count)
    
    return count
  }

  static async getUserNotifications(params: {
    userId: string
    page: number
    limit: number
    unreadOnly?: boolean
  }) {
    const cacheKey = `${params.userId}:${params.page}`
    
    // Try cache first (only for read-all notifications)
    if (!params.unreadOnly) {
      try {
        const cached = await NotificationCache.getNotifications(
          params.userId,
          params.page
        )
        if (cached) return JSON.parse(String(cached)) // Ensure explicit string conversion
      } catch (error) {
        console.error("Error parsing cached notifications, falling back to database:", error);
        // Fall through to fetch from database if cache parsing fails
      }
    }

    // Fetch from database
    const result = await this.fetchFromDatabase(params)

    // Cache the result
    if (!params.unreadOnly) {
      await NotificationCache.setNotifications(
        params.userId,
        params.page,
        result
      )
    }

    return result
  }

  private static async fetchFromDatabase(params: {
    userId: string
    page: number
    limit: number
    unreadOnly?: boolean
  }) {
    const skip = (params.page - 1) * params.limit

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: {
          userId: params.userId,
          ...(params.unreadOnly && { isRead: false }),
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
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: params.limit,
      }),
      prisma.notification.count({
        where: {
          userId: params.userId,
          ...(params.unreadOnly && { isRead: false }),
        },
      }),
      prisma.notification.count({
        where: {
          userId: params.userId,
          isRead: false,
        },
      }),
    ])

    return {
      notifications,
      pagination: {
        total,
        page: params.page,
        limit: params.limit,
        totalPages: Math.ceil(total / params.limit),
      },
      unreadCount,
    }
  }

  static async markAsRead(notificationId: string, userId: string) {
    await prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    })

    // Invalidate caches
    await Promise.all([
      NotificationCache.invalidateUnreadCount(userId),
      NotificationCache.invalidateNotifications(userId),
    ])
  }

  static async create(data: any) {
    const notification = await prisma.notification.create({
      data,
      include: {
        actor: {
          select: { id: true, name: true, image: true },
        },
        post: {
          select: { id: true, title: true, slug: true },
        },
      },
    })

    // Invalidate caches
    await Promise.all([
      NotificationCache.invalidateUnreadCount(data.userId),
      NotificationCache.invalidateNotifications(data.userId),
    ])

    return notification
  }
}