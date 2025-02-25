import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const LoadingCard = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-[150px]" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[125px] w-full" />
      </CardContent>
    </Card>
  )
} 