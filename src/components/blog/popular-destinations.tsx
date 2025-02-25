"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

interface Destination {
  id: string
  name: string
  country: string
  image: string
  slug: string
  count: number
}

export function PopularDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDestinations() {
      try {
        const res = await fetch('/api/destinations/popular')
        const data = await res.json()
        setDestinations(data)
      } catch (error) {
        console.error("Failed to load destinations:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDestinations()
  }, [])

  if (loading) {
    return <PopularDestinations.Skeleton />
  }

  return (
    <section className="space-y-8 relative">
      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Top right circles */}
        <svg
          className="absolute -right-6 -top-8 h-[180px] w-[180px] stroke-gray-200 dark:stroke-gray-800"
          aria-hidden="true"
        >
          <circle cx="90" cy="90" r="69.5" fill="none" strokeWidth="3" strokeDasharray="4 4" />
          <circle cx="90" cy="90" r="55.5" fill="none" strokeWidth="3" strokeDasharray="4 4" />
          <circle cx="90" cy="90" r="39.5" fill="none" strokeWidth="3" strokeDasharray="4 4" />
        </svg>
        {/* Bottom left waves */}
        <svg
          className="absolute -left-6 -bottom-8 h-[170px] w-[170px] stroke-gray-200 dark:stroke-gray-800"
          aria-hidden="true"
        >
          <path
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="4 4"
            d="M0 128s34.5-35 80-35c41.6 0 70 35 70 35s-34.5 35-80 35c-41.6 0-70-35-70-35z"
          />
          <path
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="4 4"
            d="M20 108s34.5-35 80-35c41.6 0 70 35 70 35s-34.5 35-80 35c-41.6 0-70-35-70-35z"
          />
          <path
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="4 4"
            d="M40 88s34.5-35 80-35c41.6 0 70 35 70 35s-34.5 35-80 35c-41.6 0-70-35-70-35z"
          />
        </svg>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative">
          <h2 className="text-3xl font-bold">Popular Destinations</h2>
          <p className="text-muted-foreground mt-1">
            Explore our most visited travel destinations
          </p>
          {/* Decorative underline */}
          <svg
            className="absolute -bottom-2 left-0 h-1.5 w-24"
            aria-hidden="true"
          >
            <path
              className="fill-blue-600/20"
              d="M0 7c6 0 8-4 14-4s8 4 14 4 8-4 14-4 8 4 14 4 8-4 14-4 8 4 14 4 8-4 14-4 8 4 14 4"
            />
          </svg>
        </div>
        <Link 
          href="/destinations"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 group flex items-center gap-1"
        >
          View all
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
          >
            <path d="M6.75 3.25L10.25 8L6.75 12.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {destinations.map((destination) => (
          <Link 
            key={destination.id} 
            href={`/destinations/${destination.slug}`}
          >
            <Card className="group overflow-hidden bg-white dark:bg-gray-950 border-0 shadow-lg">
              <div className="relative h-48">
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-semibold text-lg">{destination.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{destination.country}</span>
                  </div>
                </div>
                <Badge 
                  variant="secondary" 
                  className="absolute top-4 right-4 bg-white/90 dark:bg-gray-950/90"
                >
                  {destination.count} stories
                </Badge>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

PopularDestinations.Skeleton = function PopularDestinationsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="relative h-48 bg-gray-200 dark:bg-gray-800 animate-pulse" />
          </Card>
        ))}
      </div>
    </div>
  )
} 