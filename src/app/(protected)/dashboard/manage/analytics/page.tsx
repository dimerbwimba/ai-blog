import { AnalyticsOverview } from "@/components/dashboard/analytics/analytics-overview"
import { DashboardLayout } from "@/components/dashboard/layout"
import { Suspense } from "react"

export const metadata = {
  title: "Analytics | Dashboard",
  description: "View your content performance metrics",
}

export default function AnalyticsPage() {
  return (
    <DashboardLayout title="Analytics">
      <Suspense fallback={<div>Loading...</div>}>
        <AnalyticsOverview />
      </Suspense>
    </DashboardLayout>
  )
} 