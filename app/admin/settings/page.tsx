"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-playfair-display font-bold text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Configure your blog platform settings
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Blog Settings */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="font-playfair-display">
              Blog Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Blog Title
              </label>
              <input
                type="text"
                defaultValue="My Awesome Blog"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Blog Description
              </label>
              <textarea
                defaultValue="Sharing insights on web development and design"
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="font-playfair-display">
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-foreground">
                New comment notifications
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-foreground">Weekly digest</span>
            </label>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button className="bg-primary hover:bg-primary/90">
            Save Settings
          </Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </div>
    </div>
  );
}
