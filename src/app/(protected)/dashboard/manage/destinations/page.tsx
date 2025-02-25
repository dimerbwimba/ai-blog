import { DashboardLayout } from "@/components/dashboard/layout"
import { DestinationsOverview } from "@/components/dashboard/destinations/destinations-overview"
import { Suspense } from "react"
import { DestinationsOverviewSkeleton } from "@/components/dashboard/destinations/destinations-overview-skeleton"


export default async function DestinationsPage() {
  return (
    <DashboardLayout title="Destinations Overview">
      <Suspense fallback={<DestinationsOverviewSkeleton />}>
        <DestinationsOverview />
      </Suspense>
    </DashboardLayout>
  )
} 