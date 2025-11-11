"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Shield, Edit, Trash2 } from "lucide-react";

const users = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@blog.com",
    role: "Admin",
    posts: 24,
    joined: "2024-01-15",
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike@blog.com",
    role: "Editor",
    posts: 18,
    joined: "2024-02-20",
  },
  {
    id: 3,
    name: "Emma Davis",
    email: "emma@blog.com",
    role: "Author",
    posts: 12,
    joined: "2024-03-10",
  },
  {
    id: 4,
    name: "James Wilson",
    email: "james@blog.com",
    role: "Author",
    posts: 8,
    joined: "2024-04-05",
  },
];

export function UserManager() {
  const getRoleBgColor = (role: string) => {
    const colors: Record<string, string> = {
      Admin: "bg-accent/20 text-accent",
      Editor: "bg-primary/20 text-primary",
      Author: "bg-muted text-muted-foreground",
    };
    return colors[role] || colors["Author"];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Blog Authors</h2>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          Invite Author
        </Button>
      </div>

      <Card className="bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                  Name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                  Email
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                  Role
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                  Posts
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                  Joined
                </th>
                <th className="text-right py-3 px-4 font-semibold text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="py-4 px-4 font-medium">{user.name}</td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    {user.email}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${getRoleBgColor(
                        user.role
                      )}`}
                    >
                      {user.role === "Admin" && <Shield size={12} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm">{user.posts}</td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    {user.joined}
                  </td>
                  <td className="py-4 px-4 flex justify-end gap-2">
                    <button className="p-2 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-destructive/10 rounded transition-colors">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
