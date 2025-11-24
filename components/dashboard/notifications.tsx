"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Bell, Heart, MessageCircle, UserPlus, Star, Check, MoreHorizontal, Trash2, Settings, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
  type NotificationType,
} from "@/hooks/use-notifications"

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("all")
  const [page, setPage] = useState(1)

  const { data, isLoading, error } = useNotifications(
    page,
    20,
    activeTab === "unread",
    activeTab === "all" || activeTab === "unread" ? "all" : activeTab
  )

  const markAsReadMutation = useMarkAsRead()
  const markAllAsReadMutation = useMarkAllAsRead()
  const deleteNotificationMutation = useDeleteNotification()

  const notifications = data?.notifications || []
  const unreadCount = data?.unreadCount || 0
  const pagination = data?.pagination

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "like":
        return <Heart className="h-4 w-4 text-red-500 fill-red-500" />
      case "comment":
      case "reply":
        return <MessageCircle className="h-4 w-4 text-blue-500 fill-blue-500" />
      case "follow":
        return <UserPlus className="h-4 w-4 text-green-500" />
      case "system":
        return <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
      case "mention":
        return <Bell className="h-4 w-4 text-purple-500 fill-purple-500" />
    }
  }

  const getNotificationText = (notification: any) => {
    const messages: Record<string, string> = {
      like: "liked your post",
      comment: "commented on your post",
      reply: "replied to your comment",
      follow: "started following you",
      mention: "mentioned you",
      system: "",
    }
    return messages[notification.type] || ""
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-8 text-center">
          <p className="text-destructive">Failed to load notifications. Please try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay updated with what's happening on your posts.</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
              className="gap-2 bg-transparent"
            >
              {markAllAsReadMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Mark all as read
            </Button>
          )}
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 min-w-[1.25rem]">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="like">Likes</TabsTrigger>
          <TabsTrigger value="comment">Comments</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border rounded-xl">
              <div className="bg-muted/50 p-6 rounded-full mb-4">
                <Bell className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">No notifications</h3>
              <p className="text-muted-foreground mt-2">You're all caught up! Check back later for new updates.</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "group flex items-start gap-4 p-4 rounded-xl border transition-all duration-200",
                      notification.isRead
                        ? "bg-card border-border hover:border-primary/20"
                        : "bg-primary/5 border-primary/20 hover:bg-primary/10"
                    )}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="h-10 w-10 rounded-full overflow-hidden border border-border">
                        {notification.actor?.image ? (
                          <Image
                            src={notification.actor.image}
                            alt={notification.actor.name || "User"}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-muted flex items-center justify-center">
                            <span className="text-xs font-medium">
                              {notification.actor?.name?.[0] || "?"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 shadow-sm border border-border">
                        {getIcon(notification.type)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <p className="text-sm leading-relaxed">
                            <span className="font-semibold">
                              {notification.actor?.name || "Someone"}
                            </span>{" "}
                            <span className="text-muted-foreground">
                              {getNotificationText(notification)}
                            </span>{" "}
                            {notification.post && (
                              <Link
                                href={`/post/${notification.post.slug}`}
                                className="font-medium text-foreground hover:text-primary transition-colors"
                              >
                                {notification.post.title}
                              </Link>
                            )}
                          </p>
                          {notification.content && (
                            <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg border border-border/50 mt-2">
                              "{notification.content}"
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground pt-1">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!notification.isRead && (
                              <DropdownMenuItem
                                onClick={() => markAsReadMutation.mutate(notification.id)}
                                disabled={markAsReadMutation.isPending}
                              >
                                <Check className="mr-2 h-4 w-4" />
                                Mark as read
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => deleteNotificationMutation.mutate(notification.id)}
                              disabled={deleteNotificationMutation.isPending}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {!notification.isRead && (
                      <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                    )}
                  </div>
                ))}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}