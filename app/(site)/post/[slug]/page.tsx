import { getPostBySlug, getCommentsForPost } from "./actions";
import PostClientPage from "./post-client-page";
import { notFound } from "next/navigation";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const comments = await getCommentsForPost(post.id);

  return <PostClientPage post={post} comments={comments} />;
}
