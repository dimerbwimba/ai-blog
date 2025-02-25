import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DestinationsGridSkeleton() {
  return (
    <div className="space-y-8">
      {/* Featured Destination Skeleton */}
      <Card className="overflow-hidden border-none bg-white shadow-none">
        <div className="grid grid-cols-1 gap-8">
          <Skeleton className="aspect-[4/3] rounded-lg" />
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-9 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Regular Grid Skeleton */}
      <div className="grid grid-cols-1 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden bg-white border-none shadow-none">
            <Skeleton className="aspect-[3/2] rounded-lg mb-4" />
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="space-y-3 pt-2">
                <Skeleton className="h-4 w-32" />
                {Array.from({ length: 2 }).map((_, j) => (
                  <Skeleton key={j} className="h-8 w-full rounded" />
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 