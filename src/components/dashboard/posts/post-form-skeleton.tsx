import { Skeleton } from "@/components/ui/skeleton"

export function PostFormSkeleton() {
  return (
    <div className="">
      <div className="col-span-2 space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-[100px]" />
          <Skeleton className="h-9 w-[100px]" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-20 w-full" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    </div>
  )
} 