"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PropertyCard } from "./property-card";
import { AccommodationsMap } from "../map/accommodations-map";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PopularAccommodation } from "@/types/accommodation";

interface PaginatedData {
  data: PopularAccommodation[];
  metadata: {
    total: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
  };
}

export function PaginatedAccommodations() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PaginatedData | null>(null);

  const currentPage = parseInt(searchParams.get("page") || "1");

  const fetchAccommodations = useCallback(async (page: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/accommodations/public/all?page=${page}`
      );
      const result = await response.json();

      if (result.success) {
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching accommodations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccommodations(currentPage);
  }, [currentPage, fetchAccommodations]);

  const handlePageChange = (page: number) => {
    router.push(`/accommodations?page=${page}`);
  };

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="h-[400px]">
            <Skeleton className="h-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8">
      {/* Add Map */}

      {/* Accommodations List */}
      <div className="flex flex-col gap-4">
        {data.data.map((accommodation) => (
          <div key={accommodation.id}>
            <h2 className="text-2xl my-3 border-b pb-1 font-bold">
              Top Accommodations in {accommodation.name}
            </h2>
            <h3 className="text-lg py-4 font-bold">
              Map of {accommodation.name} | Find the Best Accommodations Nearby
            </h3>
            {data && <AccommodationsMap accommodations={accommodation} />}
            <div className="grid gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-2">
              {accommodation.properties.map((property: any) => (
                <PropertyCard
                  key={property.name}
                  property={{
                    name: property.name,
                    ...property,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          disabled={currentPage <= 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>

        {[...Array(data.metadata.totalPages)].map((_, i) => (
          <Button
            key={i}
            variant={currentPage === i + 1 ? "default" : "outline"}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </Button>
        ))}

        <Button
          variant="outline"
          disabled={currentPage >= data.metadata.totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
