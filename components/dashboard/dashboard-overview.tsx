"use client";

import { FileText, Heart, Eye, TrendingUp, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardStats {
  totalPosts: number;
  totalLikes: number;
  totalViews: number;
  publishedPosts: number;
}

interface RecentPost {
  id: string;
  title: string;
  status: string;
  views: number;
  likes: number;
  createdAt: string;
}

interface DashboardOverviewProps {
  stats: DashboardStats;
  recentPosts: RecentPost[];
  userName: string;
}

export default function DashboardOverview({
  stats,
  recentPosts,
  userName,
}: DashboardOverviewProps) {
  const statCards = [
    {
      label: "Total Posts",
      value: stats.totalPosts,
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
      change: "+2 this week",
    },
    {
      label: "Published",
      value: stats.publishedPosts,
      icon: TrendingUp,
      color: "text-accent",
      bgColor: "bg-accent/10",
      change: "Active",
    },
    {
      label: "Total Likes",
      value: stats.totalLikes,
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      change: "+12 this week",
    },
    {
      label: "Total Views",
      value: stats.totalViews,
      icon: Eye,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      change: "+156 this week",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
          Welcome back, {userName}
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your blog today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className={cn(
                "p-6 hover:shadow-hover transition-all duration-300 cursor-pointer",
                "animate-in slide-in-from-bottom-4",
                "border-border hover:border-primary/50"
              )}
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: "backwards",
              }}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {stat.change}
                  </p>
                </div>
                <div
                  className={cn(
                    "p-3 rounded-xl transition-transform hover:scale-110",
                    stat.bgColor
                  )}
                >
                  <Icon className={cn("w-6 h-6", stat.color)} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Posts Section */}
      <Card className="p-6 animate-in slide-in-from-bottom-4 delay-500">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Recent Posts</h2>
          <a
            href="/dashboard/posts"
            className="text-sm text-primary hover:underline"
          >
            View all
          </a>
        </div>

        <div className="space-y-4">
          {recentPosts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No posts yet</p>
              <a
                href="/dashboard/create"
                className="inline-block mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create your first post
              </a>
            </div>
          ) : (
            recentPosts.map((post, index) => (
              <div
                key={post.id}
                className={cn(
                  "p-4 rounded-xl border border-border hover:border-primary/50",
                  "transition-all duration-300 hover:shadow-card cursor-pointer",
                  "animate-in slide-in-from-left-4"
                )}
                style={{
                  animationDelay: `${600 + index * 100}ms`,
                  animationFillMode: "backwards",
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-2 truncate">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-md text-xs font-medium",
                          post.status === "PUBLISHED"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {post.status}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {post.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart size={14} />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}