import { DashboardLayout } from "@/components/dashboard/layout"
import { ManageOverview } from "@/components/dashboard/manage/manage-overview"
import { Suspense } from "react"
import { ManageOverviewSkeleton } from "@/components/dashboard/manage/manage-overview-skeleton"

export default async function ManagePage() {
  return (
    <DashboardLayout title="Management Overview">
      <Suspense fallback={<ManageOverviewSkeleton />}>
        <ManageOverview />
      </Suspense>
    </DashboardLayout>
  )
} 