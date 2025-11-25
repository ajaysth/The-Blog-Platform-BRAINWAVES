import { User } from "./user";
import { Category } from "./category";

export interface Post {
    id: string;
    title: string;
    content: string;
    coverImage: string | null;
    publishedAt: string | null;
    createdAt: string;
    readTime: number;
    author: User;
    category: Category | null;
}
export type PostWithAuthorAndCategory = Post & {
    author: User;
    category: Category | null;
};
