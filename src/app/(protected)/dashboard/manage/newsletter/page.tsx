import { Metadata } from "next"
import { NewsletterOverview } from "@/components/dashboard/manage/newsletter/newsletter-overview"
import { DashboardLayout } from "@/components/dashboard/layout"

export const metadata: Metadata = {
  title: "Newsletter Management",
  description: "Manage your newsletter subscribers and view analytics",
}

export default function NewsletterPage() {
  return (
    <DashboardLayout title="Newsletter Management">
      <div className="container max-w-xl mx-auto p-6">
        <NewsletterOverview />
      </div>
    </DashboardLayout>
  )
} 