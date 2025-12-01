// hooks/use-notifications.ts
import { useQuery, useMutation, useQueryClient, QueryKey } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

export type NotificationType = "like" | "comment" | "reply" | "follow" | "mention" | "system"

export interface Notification {
  id: string
  type: NotificationType
  content: string | null
  isRead: boolean
  createdAt: string
  actor: {
    id: string
    name: string | null
    image: string | null
  } | null
  post: {
    id: string
    title: string
    slug: string
  } | null
  comment: {
    id: string
    content: string
  } | null
}

interface NotificationsResponse {
  notifications: Notification[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  unreadCount: number
}

export function useNotifications(
  page = 1,
  limit = 20,
  unreadOnly = false,
  type: string = "all"
) {
  const { data: session } = useSession()

  return useQuery<NotificationsResponse>({
    queryKey: ["notifications", { page, limit, unreadOnly, type }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        unreadOnly: unreadOnly.toString(),
        type,
      })

      const res = await fetch(`/api/notifications?${params}`)
      if (!res.ok) throw new Error("Failed to fetch notifications")
      return res.json()
    },
    enabled: !!session?.user,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}

export function useUnreadCount() {
  const { data: session } = useSession()

  return useQuery<{ count: number }>({
    queryKey: ["unread-count"],
    queryFn: async () => {
      const res = await fetch("/api/notifications/unread-count")
      if (!res.ok) throw new Error("Failed to fetch unread count")
      return res.json()
    },
    enabled: !!session?.user,
    staleTime: 10 * 1000, // 10 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  })
}

export function useMarkAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const res = await fetch(`/api/notifications/${notificationId}`, {
        method: "PATCH",
      })
      if (!res.ok) throw new Error("Failed to mark as read")
      return res.json()
    },
    onMutate: async (notificationId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["notifications"] })
      await queryClient.cancelQueries({ queryKey: ["unread-count"] })


      // Snapshot the previous value
      const previousNotifications = queryClient.getQueriesData({
        queryKey: ["notifications"],
      })

      // Optimistically update to the new value
      queryClient.setQueriesData<NotificationsResponse>(
        { queryKey: ["notifications"] },
        (old) => {
          if (!old) return old
          return {
            ...old,
            notifications: old.notifications.map((n) =>
              n.id === notificationId ? { ...n, isRead: true } : n
            ),
            unreadCount: Math.max(0, old.unreadCount - 1),
          }
        }
      )

      return { previousNotifications }
    },
    onError: (err, notificationId, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        context.previousNotifications.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      toast.error("Failed to mark notification as read")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.invalidateQueries({ queryKey: ["unread-count"] })
    },
  })
}

export function useMarkAllAsRead(queryKey: QueryKey) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/notifications/mark-all-read", {
        method: "POST",
      })
      if (!res.ok) throw new Error("Failed to mark all as read")
      return res.json()
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })
      await queryClient.cancelQueries({ queryKey: ["unread-count"] })


      const previousNotifications = queryClient.getQueriesData({
        queryKey,
      })

      queryClient.setQueriesData<NotificationsResponse>(
        { queryKey },
        (old) => {
          if (!old) return old
          return {
            ...old,
            notifications: old.notifications.map((n) => ({
              ...n,
              isRead: true,
            })),
            unreadCount: 0,
          }
        }
      )

      return { previousNotifications }
    },
    onError: (err, variables, context) => {
      if (context?.previousNotifications) {
        context.previousNotifications.forEach(([key, data]) => {
          queryClient.setQueryData(key, data)
        })
      }
      toast.error("Failed to mark all as read")
    },
    onSuccess: () => {
      toast.success("All notifications marked as read")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: ["unread-count"] })
    },
  })
}

export function useDeleteNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const res = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete notification")
      return res.json()
    },
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] })
      await queryClient.cancelQueries({ queryKey: ["unread-count"] })


      const previousNotifications = queryClient.getQueriesData({
        queryKey: ["notifications"],
      })

      queryClient.setQueriesData<NotificationsResponse>(
        { queryKey: ["notifications"] },
        (old) => {
          if (!old) return old
          const notification = old.notifications.find((n) => n.id === notificationId)
          return {
            ...old,
            notifications: old.notifications.filter((n) => n.id !== notificationId),
            unreadCount: notification?.isRead
              ? old.unreadCount
              : Math.max(0, old.unreadCount - 1),
          }
        }
      )

      return { previousNotifications }
    },
    onError: (err, notificationId, context) => {
      if (context?.previousNotifications) {
        context.previousNotifications.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      toast.error("Failed to delete notification")
    },
    onSuccess: () => {
      toast.success("Notification deleted")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.invalidateQueries({ queryKey: ["unread-count"] })
    },
  })
}