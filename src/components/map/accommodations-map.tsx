"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { PopularAccommodation } from "@/types/accommodation";
import { PropertyCard } from "../accommodations/property-card";

// Fix for default marker icons in Leaflet with Next.js


interface AccommodationsMapProps {
  accommodations: PopularAccommodation;
}

export function AccommodationsMap({ accommodations }: AccommodationsMapProps) {
  // Calculate center point from all properties
  const center = accommodations.properties.reduce(
    (acc, property) => {
      acc[0] += property.gps_coordinates.latitude;
      acc[1] += property.gps_coordinates.longitude;
      return acc;
    },
    [0, 0]
  ).map(coord => coord / accommodations.properties.length);

  useEffect(() => {
    (async () => {
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/images/marker-icon-2x.png",
        iconUrl: "/images/marker-icon.png",
        shadowUrl: "/images/marker-shadow.png",
      });
    })();
  }, []);

  return (
    <MapContainer
      center={[center[0], center[1]]}
      zoom={8}
      scrollWheelZoom={false}
      className="h-[400px] w-full rounded-lg z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {accommodations.properties.map((property) => (
        <Marker
          key={property.name}
          position={[
            property.gps_coordinates.latitude,
            property.gps_coordinates.longitude
          ]}
        >
          <Popup>
          <PropertyCard
                key={property.name}
                property={{
                  ...property,
                }}
              />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
} 