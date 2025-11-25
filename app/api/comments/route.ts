import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { NotificationHelpers } from "@/lib/services/notification.service";

export async function POST(req: NextRequest) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId, content, parentId } = await req.json();

    if (!postId || !content) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        const comment = await prisma.comment.create({
            data: {
                content,
                postId,
                authorId: session.user.id,
                parentId,
            },
            include: {
                author: true,
                replies: {
                    include: {
                        author: true,
                    },
                },
            }
        });

        // Create notification
        if (parentId) {
            // It's a reply
            await NotificationHelpers.notifyOnReply(
                parentId,
                session.user.id,
                content,
                comment.id
            );
        } else {
            // It's a new comment
            await NotificationHelpers.notifyOnComment(
                postId,
                session.user.id,
                content,
                comment.id
            );
        }

        // Check for mentions in the comment
        const mentionRegex = /@(\w+)/g;
        const mentions = content.match(mentionRegex);

        if (mentions) {
            const usernames = mentions.map((m: any) => m.slice(1));
            const mentionedUsers = await prisma.user.findMany({
                where: {
                    name: { in: usernames },
                },
                select: { id: true },
            });

            for (const user of mentionedUsers) {
                await NotificationHelpers.notifyOnMention(
                    user.id,
                    session.user.id,
                    postId,
                    comment.id
                );
            }
        }

        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
    }
}
