import { getAllPosts } from "./actions";
import BlogsPageClient from "./post-client-page";

export default async function BlogsPage() {
  const posts = await getAllPosts();

  return <BlogsPageClient posts={posts} />;
}
