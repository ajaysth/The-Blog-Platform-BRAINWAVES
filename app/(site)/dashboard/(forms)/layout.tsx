import { Suspense } from "react";
import { FormSkeleton } from "@/components/skeletons/form-skeleton";

export default function FormsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<FormSkeleton />}>
      {children}
    </Suspense>
  );
}
