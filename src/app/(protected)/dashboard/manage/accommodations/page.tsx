import { checkRole } from "@/lib/auth-check"
import { DashboardLayout } from "@/components/dashboard/layout"
import { AccommodationsOverview } from "@/components/dashboard/accommodations/accommodations-overview"

export default async function AccommodationsPage() {
  await checkRole()

  return (
    <DashboardLayout title="Accommodations">
      <AccommodationsOverview />
    </DashboardLayout>
  )
} 