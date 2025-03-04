"use client"

import { useState, useEffect } from "react"
import { AccommodationForm } from "./accommodation-form"
import { AccommodationsList } from "./accommodations-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { toast } from "sonner"

export function AccommodationsOverview() {
  const [showForm, setShowForm] = useState(false)
  const [accommodations, setAccommodations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await fetch('/api/accommodations')
        const data = await response.json()
        setAccommodations(data)
      } catch (error) {
        console.error('Error fetching accommodations:', error)
        toast.error('Failed to load accommodations')
      } finally {
        setLoading(false)
      }
    }

    fetchAccommodations()
  }, [])

  if (loading) {
    return <div className="text-center py-10">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Accommodations</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? 'Cancel' : 'Add Accommodation'}
        </Button>
      </div>

      {showForm ? (
        <AccommodationForm />
      ) : (
        <AccommodationsList accommodations={accommodations} />
      )}
    </div>
  )
} 