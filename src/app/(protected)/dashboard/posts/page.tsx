
import { DashboardLayout } from "@/components/dashboard/layout"
import { PostsOverview } from "@/components/dashboard/posts/posts-overview"
import { Suspense } from "react"
import { PostsOverviewSkeleton } from "@/components/dashboard/posts/posts-overview-skeleton"

export default async function PostsPage() {

  return (
    <DashboardLayout
    
      title="Posts Overview"
    >
      <Suspense fallback={<PostsOverviewSkeleton />}>
        <PostsOverview />
      </Suspense>
    </DashboardLayout>
  )
} 