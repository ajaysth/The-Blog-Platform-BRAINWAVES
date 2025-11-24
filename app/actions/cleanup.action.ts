// Example: Bulk notification cleanup (run as a cron job)
// actions/cleanup.action.ts
"use server"

import { prisma } from "@/lib/prisma"

export async function cleanupOldNotifications() {
  // Delete read notifications older than 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const result = await prisma.notification.deleteMany({
    where: {
      isRead: true,
      createdAt: {
        lt: thirtyDaysAgo,
      },
    },
  })

  console.log(`Cleaned up ${result.count} old notifications`)
  return result
}