import { Metadata } from "next"
import { DashboardLayout } from "@/components/dashboard/layout"
import { ItineraryOverview } from "@/components/dashboard/itinerary/itinerary-overview"

export const metadata: Metadata = {
  title: "Travel Itineraries | Dashboard",
  description: "Create and manage your travel itineraries",
}

export default function ItineraryPage() {
  return (
    <DashboardLayout title="Travel Itineraries">
      <ItineraryOverview />
    </DashboardLayout>
  )
} 