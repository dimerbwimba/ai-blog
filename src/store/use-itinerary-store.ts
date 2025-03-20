import { create } from 'zustand'

// Define the Itinerary type
export interface Itinerary {
  id: string
  title: string
  description?: string
  startDate: string | Date
  endDate: string | Date
  city: string
  travelType: "BUDGET" | "STANDARD" | "LUXURY"
  duration: "1_DAY" | "3_DAYS" | "1_WEEK" | "2_WEEKS"
  isPublic: boolean
  destinationId: string
  body: {
    days?: Array<{
      activities: Array<{
        time: string
        description: string
        location?: string
      }>
    }>
    notes?: string
    budget?: {
      currency: string
      total: number
      categories?: Record<string, number>
    }
  }
}

interface ItineraryStore {
  selectedItinerary: Itinerary | null
  isOpen: boolean
  setSelectedItinerary: (itinerary: Itinerary | null) => void
  openDetails: () => void
  closeDetails: () => void
}

export const useItineraryStore = create<ItineraryStore>((set) => ({
  selectedItinerary: null,
  isOpen: false,
  setSelectedItinerary: (itinerary) => set({ selectedItinerary: itinerary }),
  openDetails: () => set({ isOpen: true }),
  closeDetails: () => {
    set({ isOpen: false })
    // Optional: Clear selected itinerary when closing
    // setTimeout(() => set({ selectedItinerary: null }), 300)
  },
})) 