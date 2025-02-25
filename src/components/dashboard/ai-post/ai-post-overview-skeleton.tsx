import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function AIPostOverviewSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
        <Skeleton className="h-10 w-[120px]" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-5 w-[100px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-5 w-[120px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </Card>
      </div>
    </div>
  )
} 