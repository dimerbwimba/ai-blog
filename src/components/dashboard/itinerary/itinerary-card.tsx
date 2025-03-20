"use client"

import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { MapPinIcon, CalendarIcon } from "lucide-react"
import { useItineraryStore } from "@/store/use-itinerary-store"
import { Itinerary } from "@/store/use-itinerary-store"

interface ItineraryCardProps {
  itinerary: Itinerary
}

export function ItineraryCard({ itinerary }: ItineraryCardProps) {
  const { setSelectedItinerary, openDetails } = useItineraryStore()

  const handleViewDetails = () => {
    setSelectedItinerary(itinerary)
    openDetails()
  }

  return (
    <div className="rounded-lg border p-4 space-y-4">
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">{itinerary.title}</h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            <span>{format(new Date(itinerary.startDate), "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPinIcon className="h-4 w-4" />
            <span>{itinerary.city}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewDetails}
        >
          View Details
        </Button>
      </div>
    </div>
  )
} 