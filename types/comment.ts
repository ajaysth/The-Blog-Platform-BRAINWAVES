import { User } from "./user";

export interface Comment {
  id: string;
  createdAt: string;
  content: string;
  author: User;
  replies: Comment[];
  postId: string;
  authorId: string;
  parentId: string | null;
}

export type CommentWithAuthorAndReplies = Comment & {
  author: User;
  replies: CommentWithAuthorAndReplies[];
};
