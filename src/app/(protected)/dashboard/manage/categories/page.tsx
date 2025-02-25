import { DashboardLayout } from "@/components/dashboard/layout"
import { CategoriesOverview } from "@/components/dashboard/categories/categories-overview"
import { Suspense } from "react"
import { CategoriesOverviewSkeleton } from "@/components/dashboard/categories/categories-overview-skeleton"

export default async function CategoriesPage() {

  return (
    <DashboardLayout title="Categories Overview">
      <Suspense fallback={<CategoriesOverviewSkeleton />}>
        <CategoriesOverview />
      </Suspense>
    </DashboardLayout>
  )
} 