// hooks/use-realtime-notifications.ts
import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { supabase } from "@/lib/supabase/realtime"
import { toast } from "sonner"
import { NotificationsResponse } from "./use-notifications"

export function useRealtimeNotifications() {
  const queryClient = useQueryClient()
  const { data: session } = useSession()

  useEffect(() => {
    if (!session?.user?.id) return

    // Subscribe to notifications table changes
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${session.user.id}`,
        },
        (payload) => {
          console.log("New notification received:", payload)

          // Update the cache with the new notification
          queryClient.setQueriesData<NotificationsResponse>(
            { queryKey: ["notifications"] },
            (old) => {
              if (!old) return old

              return {
                ...old,
                notifications: [payload.new as any, ...old.notifications],
                unreadCount: old.unreadCount + 1,
              }
            }
          )

          // Update unread count
          queryClient.invalidateQueries({
            queryKey: ["notifications", "unread-count"],
          })

          // Show toast notification
          showNotificationToast(payload.new as any)
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${session.user.id}`,
        },
        (payload) => {
          console.log("Notification updated:", payload)

          // Update the cache
          queryClient.setQueriesData<NotificationsResponse>(
            { queryKey: ["notifications"] },
            (old) => {
              if (!old) return old

              return {
                ...old,
                notifications: old.notifications.map((n) =>
                  n.id === payload.new.id ? (payload.new as any) : n
                ),
              }
            }
          )
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${session.user.id}`,
        },
        (payload) => {
          console.log("Notification deleted:", payload)

          // Update the cache
          queryClient.setQueriesData<NotificationsResponse>(
            { queryKey: ["notifications"] },
            (old) => {
              if (!old) return old

              const deletedNotification = old.notifications.find(
                (n) => n.id === payload.old.id
              )

              return {
                ...old,
                notifications: old.notifications.filter(
                  (n) => n.id !== payload.old.id
                ),
                unreadCount: deletedNotification?.isRead
                  ? old.unreadCount
                  : Math.max(0, old.unreadCount - 1),
              }
            }
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [session?.user?.id, queryClient])
}

function showNotificationToast(notification: any) {
  const notificationMessages: Record<string, string> = {
    LIKE: "liked your post",
    COMMENT: "commented on your post",
    REPLY: "replied to your comment",
    FOLLOW: "started following you",
    MENTION: "mentioned you",
    SYSTEM: "",
  }

  const message = notificationMessages[notification.type] || ""

  toast(
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <p className="text-sm font-medium">
          {notification.actor?.name || "Someone"} {message}
        </p>
        {notification.content && (
          <p className="text-xs text-muted-foreground mt-1">
            {notification.content.substring(0, 50)}...
          </p>
        )}
      </div>
    </div>,
    {
      duration: 4000,
    }
  )
}