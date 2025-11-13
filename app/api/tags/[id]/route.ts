import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const awaitedParams = await params;
    const id = awaitedParams.id;
    await prisma.tag.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Tag deleted successfully" });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const awaitedParams = await params;
    const id = awaitedParams.id;
    const body = await req.json();
    const { name, slug } = body;
    const tag = await prisma.tag.update({
      where: { id },
      data: {
        name,
        slug,
      },
    });
    return NextResponse.json(tag);
  } catch (error) {
    console.error("Error updating tag:", error);
    return NextResponse.json(
      { error: "Failed to update tag" },
      { status: 500 }
    );
  }
}
