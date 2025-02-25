import { DashboardLayout } from "@/components/dashboard/layout"
import { AIPostOverview } from "@/components/dashboard/ai-post/ai-post-overview"
import { Suspense } from "react"
import { AIPostOverviewSkeleton } from "@/components/dashboard/ai-post/ai-post-overview-skeleton"

export default async function AIPostPage() {
  return (
    <DashboardLayout title="Create Post with AI">
      <Suspense fallback={<AIPostOverviewSkeleton />}>
        <AIPostOverview />
      </Suspense>
    </DashboardLayout>
  )
} 