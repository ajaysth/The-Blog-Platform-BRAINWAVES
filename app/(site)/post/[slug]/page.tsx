import { getPostBySlug, getCommentsForPost } from "./actions";
import PostClientPage from "./post-client-page";
import { notFound } from "next/navigation";

interface PostPageProps {
  params: {
    slug: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const resolvedParams = await params; // Await params
  const postData = await getPostBySlug(resolvedParams.slug); // Use resolvedParams.slug

  if (!postData) {
    notFound();
  }

  const comments = await getCommentsForPost(postData.id);

  return <PostClientPage post={postData} comments={comments} />;
}
