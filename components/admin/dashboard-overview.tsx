"use client";

import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  { name: "Mon", posts: 4, views: 240 },
  { name: "Tue", posts: 3, views: 321 },
  { name: "Wed", posts: 2, views: 235 },
  { name: "Thu", posts: 5, views: 418 },
  { name: "Fri", posts: 3, views: 365 },
  { name: "Sat", posts: 2, views: 290 },
  { name: "Sun", posts: 4, views: 380 },
];

const statCards = [
  { label: "Total Posts", value: "48", change: "+12%" },
  { label: "Categories", value: "8", change: "+2%" },
  { label: "Total Views", value: "12K", change: "+15%" },
  { label: "Published", value: "42", change: "+8%" },
];

export function DashboardOverview() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card
            key={stat.label}
            className="p-6 bg-card hover:bg-card/80 transition-colors"
          >
            <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold font-playfair-display text-foreground">
                {stat.value}
              </h3>
              <span className="text-xs text-accent">{stat.change}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card">
          <h3 className="text-lg font-semibold font-playfair-display text-foreground mb-4">
            Weekly Posts
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
              />
              <XAxis stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                }}
              />
              <Bar
                dataKey="posts"
                fill="var(--color-primary)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 bg-card">
          <h3 className="text-lg font-semibold font-playfair-display text-foreground mb-4">
            Blog Traffic
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
              />
              <XAxis stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                }}
              />
              <Line
                type="monotone"
                dataKey="views"
                stroke="var(--color-accent)"
                strokeWidth={2}
                dot={{ fill: "var(--color-accent)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6 bg-card">
        <h3 className="text-lg font-semibold font-playfair-display text-foreground mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {[
            {
              action: "New post published",
              author: "Sarah",
              time: "2 hours ago",
              type: "POST",
            },
            {
              action: "Category updated",
              author: "Mike",
              time: "4 hours ago",
              type: "CATEGORY",
            },
            {
              action: "Tag created",
              author: "Emma",
              time: "6 hours ago",
              type: "TAG",
            },
            {
              action: "Author invited",
              author: "Admin",
              time: "1 day ago",
              type: "USER",
            },
            {
              action: "Post scheduled",
              author: "Sarah",
              time: "2 days ago",
              type: "POST",
            },
          ].map((i, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-3 border-b border-border last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {i.action}
                </p>
                <p className="text-xs text-muted-foreground">
                  by {i.author} • {i.time}
                </p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                {i.type}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
