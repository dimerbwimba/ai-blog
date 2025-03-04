"use client"

import { useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PropertyCard } from "./property-card"
import { PopularAccommodation } from "@/types/accommodation"

interface PropertyCarouselProps {
  properties: PopularAccommodation['properties']
}

export function PropertyCarousel({ properties }: PropertyCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    skipSnaps: false,
    dragFree: true,
    containScroll: "trimSnaps",
    breakpoints: {
      "(min-width: 640px)": { slidesToScroll: 2 },
      "(min-width: 1024px)": { slidesToScroll: 2 }
    }
  })

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 py-4">
          {properties.map((property) => (
            <div key={property.name} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]">
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      </div>
      
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
        onClick={scrollNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
} 