"use client";

import { UserManager } from "@/components/admin/user-manager";

export default function UsersPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-playfair-display font-bold text-foreground">
          Authors
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage blog authors and permissions
        </p>
      </div>
      <UserManager />
    </div>
  );
}
