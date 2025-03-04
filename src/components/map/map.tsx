"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { PopularAccommodation } from "@/types/accommodation";
import { PropertyCard } from "../accommodations/property-card";

interface LeafletMapProps {
  accommodations: PopularAccommodation;
}

export function LeafletMap({ accommodations }: LeafletMapProps) {
  useEffect(() => {
    // Fix for Leaflet marker icons in Next.js
    // delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/images/marker-icon-2x.png",
      iconUrl: "/images/marker-icon.png",
      shadowUrl: "/images/marker-shadow.png",
    });
  }, []);

  const center = accommodations.properties.reduce(
    (acc, property) => {
      acc[0] += property.gps_coordinates.latitude;
      acc[1] += property.gps_coordinates.longitude;
      return acc;
    },
    [0, 0]
  ).map(coord => coord / accommodations.properties.length);

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
          <PropertyCard property={property} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}