import { auth } from "@/lib/auth";
import { OptimizedNotificationService } from "@/lib/services/notification.service.optimized";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await OptimizedNotificationService.markAllAsRead(session.user.id);
    return NextResponse.json({ message: "All notifications marked as read" }, { status: 200 });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return NextResponse.json(
      { message: "Failed to mark all notifications as read" },
      { status: 500 }
    );
  }
}
