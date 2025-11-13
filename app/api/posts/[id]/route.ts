import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        category: true,
        author: true,
      },
    });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await req.json();
    const { title, content, categoryId, published, featuredImage, slug } =
      body;

    const dataToUpdate: {
      title: string;
      content: string;
      categoryId: string;
      featuredImage?: string;
      slug: string;
      authorId: string;
      status?: "PUBLISHED" | "DRAFT" | "ARCHIVED";
      publishedAt?: Date | null;
    } = {
      title,
      content,
      categoryId,
      featuredImage,
      slug,
      authorId: session.user.id,
    };

    if (published === true) {
      dataToUpdate.status = "PUBLISHED";
      dataToUpdate.publishedAt = new Date();
    } else if (published === false) {
      dataToUpdate.status = "DRAFT";
      dataToUpdate.publishedAt = null;
    }

    const post = await prisma.post.update({
      where: { id },
      data: dataToUpdate,
    });
    return NextResponse.json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await prisma.post.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
