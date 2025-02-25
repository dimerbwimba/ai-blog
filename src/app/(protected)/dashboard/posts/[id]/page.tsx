import { DashboardLayout } from "@/components/dashboard/layout"
import { PostPreview } from "@/components/dashboard/posts/post-preview"

interface PostPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PostPage({ params }: PostPageProps) {
  const {id} = await params
  return (
    <DashboardLayout title="Post Preview">
      <PostPreview postId={id} />
    </DashboardLayout>
  )
} 