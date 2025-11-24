import { Skeleton } from "@/components/ui/skeleton";

export function NavbarSkeleton() {
  return (
    <div className="flex justify-between items-center h-16 px-4 bg-card border-b border-border">
      <Skeleton className="h-8 w-24" /> {/* Logo */}
      <div className="flex items-center space-x-4">
        <Skeleton className="h-8 w-16" /> {/* Nav Link */}
        <Skeleton className="h-8 w-16" /> {/* Nav Link */}
        <Skeleton className="h-8 w-8 rounded-full" /> {/* User Avatar */}
      </div>
    </div>
  );
}