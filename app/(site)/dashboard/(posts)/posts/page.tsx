import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import MyPosts from "@/components/dashboard/my-posts";
import { ToastNotifier } from "@/components/dashboard/toast-notifier";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import prisma from "@/lib/prisma";

export default async function PostsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["my-posts", session.user.id],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts?authorId=${session.user.id}&all=true`);
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      return data.posts || [];
    },
  });

  return (
    <>
      <ToastNotifier />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MyPosts userId={session.user.id} />
      </HydrationBoundary>
    </>
  );
}