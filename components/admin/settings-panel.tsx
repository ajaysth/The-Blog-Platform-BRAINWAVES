"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

const settings = [
  {
    section: "General",
    items: [
      { label: "Site Name", value: "My CMS Site" },
      { label: "Site URL", value: "https://mysite.com" },
      { label: "Admin Email", value: "admin@mysite.com" },
    ],
  },
  {
    section: "Security",
    items: [
      { label: "Session Timeout", value: "30 minutes" },
      { label: "Two-Factor Auth", value: "Disabled" },
      { label: "Password Policy", value: "Standard" },
    ],
  },
  {
    section: "Performance",
    items: [
      { label: "Cache Duration", value: "1 hour" },
      { label: "Image Optimization", value: "Enabled" },
      { label: "CDN", value: "Active" },
    ],
  },
];

export function SettingsPanel() {
  return (
    <div className="space-y-6 max-w-4xl">
      {settings.map((section) => (
        <Card key={section.section} className="p-6 bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {section.section}
          </h3>
          <div className="space-y-4">
            {section.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between pb-4 border-b border-border last:border-0"
              >
                <label className="text-sm font-medium text-foreground">
                  {item.label}
                </label>
                <input
                  type="text"
                  value={item.value}
                  className="px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary max-w-xs"
                />
              </div>
            ))}
          </div>
        </Card>
      ))}

      <div className="flex justify-end">
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
