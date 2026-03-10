import { Skeleton } from "@/components/ui/skeleton";

function EpisodeCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Skeleton className="aspect-video w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
      <div className="flex gap-3 px-3 pb-3">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        {/* Sidebar skeleton (hidden on small screens, matching FilterSidebar) */}
        <aside className="hidden w-72 shrink-0 border-r bg-card lg:flex lg:flex-col">
          <div className="border-b p-4">
            <Skeleton className="h-3 w-28" />
          </div>
          <div className="space-y-4 p-4">
            <Skeleton className="h-9 w-full rounded-md" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
            <Skeleton className="h-4 w-24" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={`cat-${i}`} className="h-4 w-full" />
              ))}
            </div>
          </div>
        </aside>

        {/* Main content skeleton */}
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-4 space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <EpisodeCardSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
