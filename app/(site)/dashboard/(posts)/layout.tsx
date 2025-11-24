import { Suspense } from "react";
import { TableSkeleton } from "@/components/admin/table-skeleton";

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<TableSkeleton columns={6} />}>
      {children}
    </Suspense>
  );
}
