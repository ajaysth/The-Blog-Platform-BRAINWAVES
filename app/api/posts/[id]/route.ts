import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
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
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = params.id;
    const body = await req.json();
    const { title, content, categoryId, published, featuredImage, slug } = body;
    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        published,
        categoryId,
        featuredImage,
        slug,
        authorId: session.user.id,
      },
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
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
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
