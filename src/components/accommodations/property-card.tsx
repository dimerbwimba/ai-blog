"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock } from "lucide-react";
import { PopularAccommodation } from "@/types/accommodation";

interface PropertyCardProps {
  property: PopularAccommodation['properties'][0];
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Ensure we have default values for all potentially undefined properties
  const {
    name = "Unnamed Property",
    type = "Accommodation",
    images = [],
    rate_per_night = { lowest: "N/A" },
    hotel_class = "Unrated",
    overall_rating = 0,
    reviews = 0,
    location_rating = 0,
    check_in_time = "N/A",
    check_out_time = "N/A",
    nearby_places = [],
    reviews_breakdown = [],
    amenities = [],
    total_rate = { lowest: "N/A" },
    link = "#"
  } = property || {};

  return (
    <>
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="p-0">
          <div className="relative h-48 overflow-hidden">
            <Image
              src={images[0]?.original_image || '/placeholder.jpg'}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-2 left-2 right-2 text-white">
              <Badge variant="secondary" className="mb-1">
                {type}
              </Badge>
              <h3 className="font-semibold truncate">{name}</h3>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">
                  {overall_rating?.toFixed(1) || "N/A"}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({reviews || 0})
                </span>
              </div>
              <Badge variant="outline" className="font-normal">
                {hotel_class}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{location_rating?.toFixed(1) || "N/A"} Location rating</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Check-in: {check_in_time}</span>
              </div>
              <span className="font-semibold">
                {rate_per_night?.lowest || "N/A"}/night
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button 
            variant="secondary" 
            className="w-full"
            onClick={() => setShowDetails(true)}
          >
            View Details
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            {/* Image Gallery */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {images.slice(1, 7).map((image, index) => (
                  <div key={index} className="relative aspect-video">
                    <Image
                      src={image.original_image || '/placeholder.jpg'}
                      alt={`${name} - Image ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Property Details */}
            <div className="grid gap-4">
              {nearby_places.length > 0 && (
                <div className="grid gap-2">
                  <h3 className="font-semibold">Location & Transportation</h3>
                  <div className="grid gap-1">
                    {nearby_places.map((place, index) => (
                      <div key={index} className="text-sm flex justify-between">
                        <span>{place.name}</span>
                        <span className="text-muted-foreground">
                          {place.transportations?.[0]?.type}: {place.transportations?.[0]?.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Breakdown */}
              {reviews_breakdown.length > 0 && (
                <div className="grid gap-2">
                  <h3 className="font-semibold">Reviews Breakdown</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {reviews_breakdown.map((review, index) => (
                      <div key={index} className="text-sm">
                        <div className="flex justify-between">
                          <span>{review.name}</span>
                          <span className="text-muted-foreground">
                            {review.total_mentioned} mentions
                          </span>
                        </div>
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <span className="text-green-500">+{review.positive}</span>
                          <span className="text-red-500">-{review.negative}</span>
                          <span>•{review.neutral}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {amenities.length > 0 && (
                <div className="grid gap-2">
                  <h3 className="font-semibold">Amenities</h3>
                  <div className="flex flex-wrap gap-1">
                    {amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking Information */}
              <div className="grid gap-2">
                <h3 className="font-semibold">Booking Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Check-in</p>
                    <p>{check_in_time}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Check-out</p>
                    <p>{check_out_time}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rate per night</p>
                    <p className="font-semibold">{rate_per_night?.lowest || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total rate</p>
                    <p className="font-semibold">{total_rate?.lowest || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              className="w-full"
              onClick={() => window.open(link, '_blank')}
            >
              Book Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 