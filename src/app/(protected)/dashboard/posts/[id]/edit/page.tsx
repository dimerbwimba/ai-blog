import { DashboardLayout } from "@/components/dashboard/layout"
import { EditPostForm } from "@/components/dashboard/posts/edit-post-form"

interface EditPostPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const {id} = await params
  return (
    <DashboardLayout title="Edit Post">
      <EditPostForm 
        id={id}
      />
    </DashboardLayout>
  )
} 