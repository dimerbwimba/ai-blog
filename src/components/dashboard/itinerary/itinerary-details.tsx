"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { useItineraryStore } from "@/store/use-itinerary-store";
import { Itinerary } from "@/store/use-itinerary-store";

interface HotelOption {
  hotelImageUrl: string;
  hotelName: string;
  hotelAddress: string;
  description: string;
  price: string;
  rating: string;
}

interface Activity {
  placeImageUrl: string;
  placeName: string;
  placeDetails: string;
  ticketPricing: string;
  travelTime: string;
}

export function ItineraryDetails() {
  const { selectedItinerary, isOpen, closeDetails } = useItineraryStore();

  if (!selectedItinerary) return null;

  const { title, description, startDate, endDate, city, travelType, body } =
    selectedItinerary as Itinerary;

  return (
    <Dialog open={isOpen} onOpenChange={closeDetails}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] mt-4">
          <div className="space-y-6 p-4">
            {/* Header Information */}
            <div className="space-y-2">
              <p className="text-muted-foreground">{description}</p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                    {format(new Date(startDate), "MMM d")} -{" "}
                    {format(new Date(endDate), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPinIcon className="h-4 w-4" />
                  <span>{city}</span>
                </div>
              </div>
            </div>

            {/* Travel Details */}
            <div className="grid gap-4 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Travel Style</span>
                <span className="text-muted-foreground capitalize">
                  {/* {travelType.toLowerCase()} */}
                </span>
              </div>
            </div>

            {/* Hotel Options */}
            {/* <div className="space-y-4">
              <h4 className="text-lg font-semibold">Hotel Options</h4>
              {body.hotels &&
                body.hotels.map((hotel: HotelOption, index: number) => (
                  <div key={index} className="flex gap-4 p-4 border rounded-lg">
                    <img
                      src={hotel.hotelImageUrl}
                      alt={hotel.hotelName}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium">{hotel.hotelName}</h5>
                      <p className="text-sm text-muted-foreground">
                        {hotel.address}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {hotel.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <span>Price: {hotel.price}</span>
                        <span>Rating: {hotel.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div> */}

            {/* Daily Itinerary */}
            {/* <h2 className="mt-6 text-xl font-semibold text-gray-800">
              Itinerary
            </h2>
            {Object.entries(body.itinerary).map(([day, activities]) => (
              <div key={day} className="mt-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  {day.toUpperCase()}
                </h3>
                <div className="space-y-3">
                  {activities.map((activity, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg flex gap-4"
                    >
                      <img
                        src={activity.placeImageUrl}
                        alt={activity.placeName}
                        width={100}
                        height={100}
                        className="rounded-md"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {activity.placeName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {activity.placeDetails}
                        </p>
                        <p className="text-sm text-gray-500">
                          Ticket: {activity.ticketPricing}
                        </p>
                        <p className="text-sm text-gray-500">
                          Travel Time: {activity.travelTime}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))} */}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
