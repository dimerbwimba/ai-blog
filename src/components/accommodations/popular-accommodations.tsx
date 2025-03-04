"use client";

import { useEffect, useState } from "react";
import { PopularAccommodation } from "@/types/accommodation";
import { PropertyCarousel } from "./property-carousel";
import { Skeleton } from "@/components/ui/skeleton";

export function PopularAccommodations() {
  const [accommodations, setAccommodations] = useState<PopularAccommodation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await fetch("/api/accommodations/public");
        const { data } = await response.json();
        setAccommodations(data);
      } catch (error) {
        console.error("Error fetching accommodations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, []);

  if (loading) {
    return (
      <div className="py-10 space-y-6">
        <h2 className="text-2xl font-bold">Popular Accommodations</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-[400px]">
              <Skeleton className="h-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 space-y-8">
      {accommodations.map((accommodation) => (
        <div key={accommodation.id} className="space-y-4">
          <h2 className="text-2xl font-bold">
            Best Accommodations in {accommodation.name}
          </h2>
          <PropertyCarousel properties={accommodation.properties} />
        </div>
      ))}
    </div>
  );
}
