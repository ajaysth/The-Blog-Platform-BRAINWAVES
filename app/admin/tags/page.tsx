import { Suspense } from "react";
import { TagsManager } from "@/components/admin/tags-manager";
import { TableSkeleton } from "@/components/admin/table-skeleton";

export default function TagsPage() {
  return (
    <div className="p-8">
      <div className="mb-8"></div>
      <Suspense fallback={<TableSkeleton columns={3} />}>
        <TagsManager />
      </Suspense>
    </div>
  );
}
