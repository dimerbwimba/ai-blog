import { DashboardLayout } from "@/components/dashboard/layout"
import { PostForm } from "@/components/dashboard/posts/post-form"
import { Suspense } from "react"
import { PostFormSkeleton } from "@/components/dashboard/posts/post-form-skeleton"

export default function CreatePostPage() {
  return (
    <DashboardLayout title="Create New Post">
      <Suspense fallback={<PostFormSkeleton />}>
        <PostForm />
      </Suspense>
    </DashboardLayout>
  )
} 