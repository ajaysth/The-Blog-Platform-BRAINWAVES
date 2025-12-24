"use client"

import React, { FC, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocialShareButtons } from "@/components/social-share-buttons";
import { LikeButton } from "@/components/ui/like-button"; // New import

import { Post } from "@prisma/client";
import { User } from "@/types/user";
import { Category } from "@/types/category"; // New import for Category
import { CommentWithAuthorAndReplies } from "@/types/comment";

// Update PostWithAuthorAndCategory type
type PostWithAuthorAndCategory = Post & {
  author: User;
  category: Category | null;
  tags: string[]; // Corrected to string[] to match the mapped data
  likes: number;
  comments: number;
  isLiked: boolean; // New property
  userId?: string; // New property
};

interface PostClientPageProps {
  post: PostWithAuthorAndCategory;
  comments: CommentWithAuthorAndReplies[];
}

export default function PostClientPage({ post, comments: initialComments }: PostClientPageProps) {
  const { data: session, status } = useSession();
  const [newCommentContent, setNewCommentContent] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [displayedComments, setDisplayedComments] = useState(initialComments);
  const router = useRouter();


  const handleSubmitComment = async (e: React.FormEvent) => {
    console.log("Session in handleSubmitComment:", session);
    e.preventDefault();
    if (!session?.user?.id) {
      toast.error("Please log in to leave a comment.");
      return;
    }
    if (!newCommentContent.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    setIsSubmittingComment(true);

    const commentPromise = fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: post.id,
        content: newCommentContent,
        parentId: replyingToCommentId,
      }),
    }).then(async (res) => {
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to submit comment");
      }
      return res.json();
    });

    toast.promise(commentPromise, {
      loading: replyingToCommentId ? "Submitting reply..." : "Submitting comment...",
      success: (newCommentData) => {
        const newFullComment: CommentWithAuthorAndReplies = {
          ...newCommentData,
          author: session.user as User,
          replies: [],
        };

        if (replyingToCommentId) {
          setDisplayedComments(prevComments => {
            const updateComments = (commentsArr: CommentWithAuthorAndReplies[]): CommentWithAuthorAndReplies[] => {
              return commentsArr.map(comment => {
                if (comment.id === replyingToCommentId) {
                  return {
                    ...comment,
                    replies: [...(comment.replies || []), newFullComment].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
                  };
                }
                if (comment.replies && comment.replies.length > 0) {
                  return {
                    ...comment,
                    replies: updateComments(comment.replies),
                  };
                }
                return comment;
              });
            };
            return updateComments(prevComments);
          });
        } else {
          setDisplayedComments(prevComments => [newFullComment, ...prevComments]);
        }
        
        setNewCommentContent("");
        setReplyingToCommentId(null);
        setIsSubmittingComment(false);
        return replyingToCommentId ? "Reply submitted successfully!" : "Comment submitted successfully!";
      },
      error: (err) => {
        setIsSubmittingComment(false);
        console.error("Failed to add comment:", err);
        return `Failed to submit comment: ${err.message || "Unknown error"}`;
      },
    });
  };


  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Image */}
        <div className="relative h-[50vh] lg:h-[60vh] overflow-hidden">
          <Image
            src={post.coverImage || "/hero-blog.jpg"}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        {/* Content */}
        <article className="container mx-auto px-4 -mt-32 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-card rounded-3xl shadow-elegant p-8 lg:p-12 mb-8">
              <Link
                href="/post"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-glow transition-smooth mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="font-semibold">Back to All Posts</span>
              </Link>

              {post.category && (
                <Badge className="bg-accent text-accent-foreground rounded-full px-4 py-1.5 mb-6">
                  {post.category.name}
                </Badge>
              )}

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8 pb-8 border-b border-border">
                <div className="flex items-center gap-3">
                  <Image
                    src={post.author.image || "/default-avatar.png"}
                    alt={post.author.name || "Author"}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-background"
                  />
                  <div>
                    <div className="font-semibold text-foreground">
                      {post.author.name}
                    </div>
                    <div className="text-sm">Contributing Writer</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(
                        post.publishedAt || post.createdAt
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime} min read</span>
                  </div>
                </div>

                <div className="ml-auto flex gap-2">
                  <SocialShareButtons title={post.title} url={typeof window !== 'undefined' ? window.location.href : ''} />
                   <LikeButton postId={post.id} isLiked={post.isLiked} />
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Article Content */}
              <div
                className="prose prose-lg max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Author Bio */}
            <div className="bg-secondary/50 rounded-3xl p-8 mb-16">
              <div className="flex gap-6 items-start">
                <Image
                  src={post.author.image || "/default-avatar.png"}
                  alt={post.author.name || "Author"}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-background"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-display font-bold text-foreground mb-2">
                    About {post.author.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {post.author.name} is a passionate writer and thought leader
                    in {post.category?.name?.toLowerCase() || "various topics"}.
                  </p>
                  <Button variant="outline" className="rounded-full">
                    Follow Author
                  </Button>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <section className="bg-card rounded-3xl shadow-elegant p-8 lg:p-12 mb-8">
              <h2 className="text-3xl font-display font-bold text-foreground mb-8">
                Comments ({displayedComments.length})
              </h2>

              {status === "loading" ? (
                <div className="text-center text-muted-foreground mb-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p>Loading session...</p>
                </div>
              ) : status === "authenticated" ? (
                <form onSubmit={handleSubmitComment} className="mb-8 p-4 bg-muted/20 rounded-lg">
                  <Textarea
                    placeholder={replyingToCommentId ? "Write a reply..." : "Write a comment..."}
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                    rows={3}
                    className="mb-4 bg-background"
                    disabled={isSubmittingComment}
                  />
                  <div className="flex justify-between items-center">
                    {replyingToCommentId && (
                      <Button variant="ghost" onClick={() => setReplyingToCommentId(null)} className="text-sm">
                        Cancel Reply
                      </Button>
                    )}
                    <Button type="submit" className="ml-auto" disabled={isSubmittingComment || !newCommentContent.trim()}>
                      {isSubmittingComment ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      {replyingToCommentId ? "Submit Reply" : "Submit Comment"}
                    </Button>
                  </div>
                </form>
              ) : (
                <p className="text-center text-muted-foreground mb-8">
                  <Link href="/api/auth/signin" className="text-primary hover:underline">Log in</Link> to leave a comment.
                </p>
              )}


              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="all">All Comments</TabsTrigger>
                  {session?.user && (
                    <TabsTrigger value="my">My Comments</TabsTrigger>
                  )}
                </TabsList>
                <TabsContent value="all" className="mt-6">
                  {displayedComments.length === 0 ? (
                    <p className="text-muted-foreground text-center">No comments yet. Be the first to comment!</p>
                  ) : (
                    <div className="space-y-6">
                      {displayedComments.map((comment) => (
                        <CommentItem key={comment.id} comment={comment} onReplyClick={setReplyingToCommentId} />
                      ))}
                    </div>
                  )}
                </TabsContent>
                {session?.user && (
                  <TabsContent value="my" className="mt-6">
                    {displayedComments.filter(c => c.author.id === session.user?.id).length === 0 ? (
                      <p className="text-muted-foreground text-center">You haven't posted any comments yet.</p>
                    ) : (
                      <div className="space-y-6">
                        {displayedComments.filter(c => c.author.id === session.user?.id).map((comment) => (
                          <CommentItem key={comment.id} comment={comment} onReplyClick={setReplyingToCommentId} />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                )}
              </Tabs>
            </section>
          </div>
        </article>
      </main>
    </div>
  );
}

interface CommentItemProps {
  comment: CommentWithAuthorAndReplies;
  onReplyClick: (commentId: string) => void;
}

const CommentItem: FC<CommentItemProps> = ({ comment, onReplyClick }) => {
  return (
    <div className="flex gap-4">
      <Image
        src={comment.author.image || "/default-avatar.png"}
        alt={comment.author.name || "Commenter"}
        width={40}
        height={40}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1 bg-muted/30 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-foreground">{comment.author.name}</span>
          <span className="text-sm text-muted-foreground">
            {new Date(comment.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <p className="text-muted-foreground mb-3">{comment.content}</p>
        <Button variant="ghost" size="sm" onClick={() => onReplyClick(comment.id)} className="text-xs">Reply</Button>
        {(comment.replies?.length ?? 0) > 0 && (
          <div className="ml-8 mt-4 space-y-4">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} onReplyClick={onReplyClick} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};