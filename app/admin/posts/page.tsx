import PostsManager from "@/components/admin/posts-manager";
import { PageHeader } from "@/components/admin/page-header";
import { PageTransition } from "@/components/admin/page-transition";

const PostsPage = () => {
  return (
    <PageTransition>
      <PostsManager />
    </PageTransition>
  );
};

export default PostsPage;
