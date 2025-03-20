"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { CalendarIcon, MapPinIcon, Clock } from "lucide-react"
import { useItineraryStore } from "@/store/use-itinerary-store"

export function ItineraryDetails() {
  const { selectedItinerary, isDetailsOpen, closeDetails } = useItineraryStore()

  if (!selectedItinerary) return null

  return (
    <Dialog open={isDetailsOpen} onOpenChange={closeDetails}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {selectedItinerary.title}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] mt-4">
          <div className="space-y-6 p-4">
            {/* Header Information */}
            <div className="space-y-2">
              <p className="text-muted-foreground">{selectedItinerary.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                    {format(new Date(selectedItinerary.startDate), "MMM d")} - {format(new Date(selectedItinerary.endDate), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPinIcon className="h-4 w-4" />
                  <span>{selectedItinerary.city}</span>
                </div>
              </div>
            </div>

            {/* Travel Details */}
            <div className="grid gap-4 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Travel Style</span>
                <span className="text-muted-foreground capitalize">
                  {selectedItinerary.travelType.toLowerCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Duration</span>
                <span className="text-muted-foreground">
                  {selectedItinerary.duration.replace("_", " ").toLowerCase()}
                </span>
              </div>
              {selectedItinerary.body.budget && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Estimated Budget</span>
                  <span className="text-muted-foreground">
                    {selectedItinerary.body.budget.currency} {selectedItinerary.body.budget.total}
                  </span>
                </div>
              )}
            </div>

            {/* Daily Itinerary */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Daily Schedule</h3>
              {selectedItinerary.body.days?.map((day: any, index: number) => (
                <div key={index} className="rounded-lg border p-4">
                  <h4 className="font-medium mb-3">Day {index + 1}</h4>
                  <div className="space-y-3">
                    {day.activities?.map((activity: any, actIndex: number) => (
                      <div key={actIndex} className="flex gap-3 text-sm">
                        <div className="flex items-center gap-1 min-w-[100px] text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{activity.time}</span>
                        </div>
                        <div>
                          <p>{activity.description}</p>
                          {activity.location && (
                            <p className="text-muted-foreground text-sm mt-1">
                              📍 {activity.location}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Notes */}
            {selectedItinerary.body.notes && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Notes</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {selectedItinerary.body.notes}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 