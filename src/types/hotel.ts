export interface Hotel {
  id: string
  name: string
  description: string
  image: string
  rating: number
  price: {
    amount: number
    currency: string
  }
  location: {
    address: string
    city: string
    country: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  amenities: string[]
  roomTypes: {
    name: string
    description: string
    price: number
    capacity: number
  }[]
  source: string
  sourceUrl: string
  createdAt: Date
  updatedAt: Date
}

export type HotelSource = 'booking' | 'airbnb' | 'expedia'

export interface ScrapingRequest {
  source: HotelSource
  location: string
  checkIn?: string
  checkOut?: string
  guests?: number
} 