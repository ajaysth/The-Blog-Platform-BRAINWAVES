// app/api/uploadcare/delete/route.ts
// This is an OPTIONAL route if you want to delete files from Uploadcare when removing images

import { NextResponse } from "next/server";
import { deleteFromUploadcare } from "@/lib/uploadcare";

export async function POST(req: Request) {
  try {
    const { fileUrl } = await req.json();

    if (!fileUrl) {
      return NextResponse.json(
        { error: "File URL is required" },
        { status: 400 }
      );
    }

    // Delete from Uploadcare
    await deleteFromUploadcare(fileUrl);

    return NextResponse.json({ 
      success: true, 
      message: "File deleted successfully" 
    });
  } catch (error: any) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete file" },
      { status: 500 }
    );
  }
}