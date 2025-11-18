import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import MyPosts from "@/components/dashboard/my-posts";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/admin/table-skeleton";
import { ToastNotifier } from "@/components/dashboard/toast-notifier";

export default async function PostsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <Suspense fallback={<TableSkeleton columns={6} />}>
      <ToastNotifier />
      <MyPosts userId={session.user.id} />
    </Suspense>
  );
}