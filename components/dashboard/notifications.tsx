"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  Check,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "system";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

interface NotificationsProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onMarkAllAsRead: () => Promise<void>;
}

export default function Notifications({
  notifications: initialNotifications,
  onMarkAsRead,
  onDelete,
  onMarkAllAsRead,
}: NotificationsProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filteredNotifications = notifications.filter((n) =>
    filter === "all" ? true : !n.read
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "like":
        return <Heart className="text-red-500" size={20} />;
      case "comment":
        return <MessageCircle className="text-blue-500" size={20} />;
      case "follow":
        return <UserPlus className="text-primary" size={20} />;
      default:
        return <Bell className="text-muted-foreground" size={20} />;
    }
  };

  const handleMarkAsRead = async (id: string) => {
    await onMarkAsRead(id);
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleDelete = async (id: string) => {
    await onDelete(id);
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleMarkAllAsRead = async () => {
    await onMarkAllAsRead();
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${
                  unreadCount > 1 ? "s" : ""
                }`
              : "You're all caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            onClick={handleMarkAllAsRead}
            className="gap-2"
          >
            <Check size={16} />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            onClick={() => setFilter("unread")}
            size="sm"
          >
            Unread ({unreadCount})
          </Button>
        </div>
      </Card>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card className="p-12 text-center">
          <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No notifications</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification, index) => (
            <Card
              key={notification.id}
              className={cn(
                "p-4 transition-all duration-300 cursor-pointer",
                "hover:shadow-card",
                "animate-in slide-in-from-bottom-4",
                !notification.read && "border-l-4 border-l-primary bg-accent/5"
              )}
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: "backwards",
              }}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="p-2 rounded-full bg-muted flex-shrink-0">
                  {getIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h4 className="font-semibold">{notification.title}</h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {notification.message}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {notification.actionUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="text-xs"
                      >
                        <a href={notification.actionUrl}>View</a>
                      </Button>
                    )}
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-xs gap-1"
                      >
                        <Check size={12} />
                        Mark as read
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(notification.id)}
                      className="text-xs text-destructive hover:text-destructive gap-1"
                    >
                      <Trash2 size={12} />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}