import { DashboardLayout } from "@/components/dashboard/layout"
import { PostsManagement } from "@/components/dashboard/manage/posts/posts-management"
import { Suspense } from "react"
import { PostsManagementSkeleton } from "@/components/dashboard/manage/posts/posts-management-skeleton"

export default async function ManagePostsPage() {
  return (
    <DashboardLayout title="Posts Management">
      <Suspense fallback={<PostsManagementSkeleton />}>
        <PostsManagement />
      </Suspense>
    </DashboardLayout>
  )
} 