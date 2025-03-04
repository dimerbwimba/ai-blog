"use client";  // Ensures this component runs only on the client

import dynamic from "next/dynamic";
import { PopularAccommodation } from "@/types/accommodation";

// Dynamically import Leaflet components with no SSR
const Map = dynamic(
  () => import("./map").then((mod) => mod.LeafletMap),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[400px] w-full rounded-lg bg-muted animate-pulse" />
    )
  }
);

interface AccommodationsMapProps {
  accommodations: PopularAccommodation;
}

export function AccommodationsMap({ accommodations }: AccommodationsMapProps) {
    return <Map accommodations={accommodations} />;
}
