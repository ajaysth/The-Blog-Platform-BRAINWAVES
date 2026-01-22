"use client"

import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Bell, Heart, MessageCircle, UserPlus, Star, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  useNotifications,
  useMarkAllAsRead,
  type NotificationType,
} from "@/hooks/use-notifications"
import { cn } from "@/lib/utils"

export function NotificationPanel() {
  const notificationsQuery = useNotifications(1, 5, true)
  const { data, isLoading, error } = notificationsQuery
  const markAllAsReadMutation = useMarkAllAsRead(notificationsQuery.queryKey)

  const notifications = data?.notifications || []
  const unreadCount = data?.unreadCount || 0

  const getIcon = (type: NotificationType) => {
    switch (type.toLowerCase()) {
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />
      case "comment":
        return <MessageCircle className="h-4 w-4 text-blue-500" />
      case "follow":
        return <UserPlus className="h-4 w-4 text-green-500" />
      case "system":
        return <Star className="h-4 w-4 text-yellow-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getNotificationText = (notification: any) => {
    const messages: Record<string, string> = {
      like: "liked your post",
      comment: "commented on your post",
      reply: "replied to you on",
      follow: "started following you",
      mention: "mentioned you",
      system: "",
    }
    return messages[notification.type.toLowerCase()] || ""
  }

  return (
    <div className="w-[350px] max-w-sm">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
            >
              {markAllAsReadMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              <span className="ml-2">Mark all as read</span>
            </Button>
          )}
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="p-4 text-center text-sm text-destructive">
            Failed to load notifications.
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            <Bell className="mx-auto h-8 w-8 mb-2" />
            No new notifications.
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "p-4 flex items-start gap-3 hover:bg-muted/50",
                  !notification.isRead && "bg-primary/5"
                )}
              >
                <div className="mt-1">{getIcon(notification.type)}</div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold">{notification.actor?.name || "Someone"}</span>{" "}
                    {getNotificationText(notification)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>
                {!notification.isRead && (
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-2 border-t">
        <Link href="/dashboard/notifications" className="block w-full">
          <Button variant="ghost" className="w-full">
            View all notifications
          </Button>
        </Link>
      </div>
    </div>
  )
}

