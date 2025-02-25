"use client"

import { useEffect, useState } from "react"
import { Hotel } from "@/types/hotel"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate, formatPrice } from "@/lib/utils"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"

export function HotelList() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadHotels() {
      try {
        const res = await fetch('/api/hotels')
        const data = await res.json()
        setHotels(data)
      } catch (error) {
        console.error("Failed to load hotels:", error)
      } finally {
        setLoading(false)
      }
    }

    loadHotels()
  }, [])

  if (loading) {
    return <HotelList.Skeleton />
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Hotel</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Added</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hotels.map((hotel) => (
            <TableRow key={hotel.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-md">
                    <Image
                      src={hotel.image}
                      alt={hotel.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{hotel.name}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {hotel.description}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {hotel.location.city}, {hotel.location.country}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={hotel.rating >= 4.5 ? "default" : "secondary"}>
                  {hotel.rating.toFixed(1)}
                </Badge>
              </TableCell>
              <TableCell>
                {formatPrice(hotel.price.amount)}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {hotel.source}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm text-muted-foreground">
                  {formatDate(new Date(hotel.createdAt))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

HotelList.Skeleton = function HotelListSkeleton() {
  return (
    <Card>
      <div className="p-4">
        <div className="space-y-3">
          <Skeleton className="h-4 w-[250px]" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
} 