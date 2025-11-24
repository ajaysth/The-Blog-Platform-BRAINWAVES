import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { OptimizedNotificationService } from "@/lib/services/notification.service.optimized"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const unreadOnly = searchParams.get("unreadOnly") === "true"
    const type = searchParams.get("type")

    const result = await OptimizedNotificationService.getUserNotifications({
      userId: session.user.id,
      page,
      limit,
      unreadOnly,
    })

    // Filter by type if specified
    if (type && type !== "all") {
      result.notifications = result.notifications.filter(
        (n) => n.type.toLowerCase() === type.toLowerCase()
      )
    }

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "private, s-maxage=30, stale-while-revalidate=60",
        "CDN-Cache-Control": "private",
      },
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    )
  }
}