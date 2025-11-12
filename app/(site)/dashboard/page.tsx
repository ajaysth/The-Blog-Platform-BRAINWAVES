import { auth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Heart,
  MessageSquare,
  TrendingUp,
  Settings,
  PenSquare,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  const stats = [
    {
      label: "Total Posts",
      value: "12",
      icon: FileText,
      color: "text-blue-500",
    },
    { label: "Total Likes", value: "234", icon: Heart, color: "text-red-500" },
    {
      label: "Comments",
      value: "89",
      icon: MessageSquare,
      color: "text-green-500",
    },
    {
      label: "Views",
      value: "1.2k",
      icon: TrendingUp,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={session?.user?.image || ""}
                alt={session?.user?.name || ""}
              />
              <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                {session?.user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold font-playfair-display">
                Welcome back, {session?.user?.name?.split(" ")[0]}!
              </h1>
              <p className="text-muted-foreground">{session?.user?.email}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/create">
              <Button className="gap-2">
                <PenSquare className="w-4 h-4" />
                New Post
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline" className="gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>Your latest published articles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                <div className="flex-1">
                  <h3 className="font-medium">
                    Getting Started with Next.js 14
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Published 2 days ago
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" /> 45
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" /> 12
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                <div className="flex-1">
                  <h3 className="font-medium">
                    Understanding React Server Components
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Published 5 days ago
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" /> 89
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" /> 23
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/posts">
                <Button variant="outline" className="w-full">
                  View All Posts
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your content and profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/create">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-12"
                >
                  <PenSquare className="w-5 h-5" />
                  Create New Post
                </Button>
              </Link>
              <Link href="/posts">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-12"
                >
                  <FileText className="w-5 h-5" />
                  Manage Posts
                </Button>
              </Link>
              <Link href="/profile">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-12"
                >
                  <Settings className="w-5 h-5" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
