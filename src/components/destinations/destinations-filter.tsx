"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  ArrowDownAZ, 
  ArrowUpAZ, 
  MapPin
} from "lucide-react"

const sortOptions = [
  {
    value: "name-asc",
    label: "Name (A-Z)",
    icon: ArrowDownAZ
  },
  {
    value: "name-desc",
    label: "Name (Z-A)",
    icon: ArrowUpAZ
  },
  {
    value: "country-asc",
    label: "Country (A-Z)",
    icon: MapPin
  },
  {
    value: "country-desc",
    label: "Country (Z-A)",
    icon: MapPin
  }
]

export function DestinationsFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSort = (value: string) => {
    const [sortBy, order] = value.split('-')
    const params = new URLSearchParams(searchParams)
    params.set('sortBy', sortBy)
    params.set('order', order)
    params.set('page', '1')
    router.push(`/destinations?${params.toString()}`)
  }

  const currentSort = `${searchParams.get('sortBy') || 'name'}-${searchParams.get('order') || 'asc'}`

  return (
    <Select defaultValue={currentSort} onValueChange={handleSort}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort destinations" />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => {
          const Icon = option.icon
          return (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="flex items-center gap-2"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span>{option.label}</span>
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
} 