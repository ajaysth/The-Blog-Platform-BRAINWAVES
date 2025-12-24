import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, Calendar, Clock, Heart, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input"; // Added Input import
import { Button } from "@/components/ui/button"; // Added Button import

function LikedPostSkeleton() {
  return (
    <div className="group relative flex flex-col bg-card border border-border rounded-xl overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <Skeleton className="h-3 w-20" />
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6 mb-4" />
        <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-1 text-xs">
              <Heart className="h-3.5 w-3.5" />
              <Skeleton className="h-3 w-4" />
            </div>
            <div className="flex items-center gap-1 text-xs">
              <MessageCircle className="h-3.5 w-3.5" />
              <Skeleton className="h-3 w-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default function LikedPostsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Liked Posts</h1>
          <p className="text-muted-foreground mt-1">Stories you've saved and loved.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search liked posts..."
              className="pl-9 bg-card"
              disabled
            />
          </div>
          <Button variant="outline" size="icon" disabled>
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <LikedPostSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
