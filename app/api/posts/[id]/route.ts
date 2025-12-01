import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { deleteFromUploadcare } from "@/lib/uploadcare";
// import { deleteFromUploadcare } from "@/lib/uploadcare";

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
        tags: {
          select: {
            tagId: true,
          },
        },
      },
    });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    const postWithTagIds = {
        ...post,
        tags: post.tags.map(t => t.tagId),
    };
    return NextResponse.json(postWithTagIds);
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
    const { title, categoryId, status, coverImage, slug, content, excerpt } =
      body;

    const dataToUpdate: any = {
      title,
      slug,
      categoryId,
      coverImage,
      authorId: session.user.id,
      status,
      content,
      excerpt,
    };

    if (status === "PUBLISHED") {
      dataToUpdate.publishedAt = new Date();
    } else {
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
  context: { params: Promise<{ id:string }> }
) {
  try {
    const { id } = await context.params;

    // First, find the post to get the image URL
    const post = await prisma.post.findUnique({
      where: { id },
    });

    // If the post has a cover image, delete it from Uploadcare
    if (post && post.coverImage) {
      try {
        await deleteFromUploadcare(post.coverImage);
      } catch (uploadcareError) {
        console.error("Failed to delete image from Uploadcare, but proceeding with post deletion:", uploadcareError);
      }
    }

    // Then, delete the post from the database
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
