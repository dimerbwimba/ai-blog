import { prisma } from '@/lib/prisma'
import { Prisma } from "@prisma/client"

interface CreateItineraryDTO {
  title: string
  description?: string
  startDate: Date
  endDate: Date
  userId: string
  destinationId: string  // Changed from destinations array to single destinationId
  isPublic?: boolean
  body: any // JSON data containing days, activities, etc.
}

interface UpdateItineraryDTO extends Partial<CreateItineraryDTO> {
  id: string
}

export const ItineraryService = {
  async createItinerary(data: CreateItineraryDTO) {
    try {
      // Ensure body is a valid JSON object
      const bodyData = data.body || {}
      console.log('[BODY_DATA]', bodyData);
      
      // First, check if the destination exists
      const destination = await prisma.destination.findUnique({
        where: { id: data.destinationId }
      });
      
      if (!destination) {
        return {
          success: false,
          error: 'Destination not found'
        };
      }
      
      const itinerary = await prisma.itinerary.create({
        data: {
          title: data.title,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
          userId: data.userId,
          destinationId: data.destinationId,
          isPublic: data.isPublic || false,
          body: bodyData
        }
      })

      return {
        success: true,
        data: itinerary
      }
    } catch (error) {
      console.error('[CREATE_ITINERARY_ERROR]', error)
      return {
        success: false,
        error: 'Failed to create itinerary'
      }
    }
  },

  async getUserItineraries(userId: string) {
    try {
      const itineraries = await prisma.itinerary.findMany({
        where: {
          userId
        },
        include: {
          destination: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return {
        success: true,
        data: itineraries
      }
    } catch (error) {
      console.error('[GET_USER_ITINERARIES_ERROR]', error)
      return {
        success: false,
        error: 'Failed to fetch itineraries'
      }
    }
  },

  async getItinerary(id: string) {
    if (!id) throw new Error("Itinerary ID is required")

    const itinerary = await prisma.itinerary.findUnique({
      where: { id },
      include: {
        destination: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      }
    })

    if (!itinerary) throw new Error("Itinerary not found")
    return itinerary
  },

  async updateItinerary(id: string, data: Prisma.ItineraryUpdateInput) {
    if (!id) throw new Error("Itinerary ID is required")

    const updatedItinerary = await prisma.itinerary.update({
      where: { id },
      data,
      include: {
        destination: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      }
    })

    return updatedItinerary
  },

  async deleteItinerary(id: string) {
    if (!id) throw new Error("Itinerary ID is required")

    await prisma.itinerary.delete({
      where: { id }
    })

    return { success: true }
  },

  async getPublicItineraries(limit = 10) {
    try {
      const itineraries = await prisma.itinerary.findMany({
        where: {
          isPublic: true
        },
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: {
            select: {
              name: true,
              image: true
            }
          },
          destination: {
            select: {
              name: true,
              image: true
            }
          }
        }
      })

      return {
        success: true,
        data: itineraries
      }
    } catch (error) {
      console.error('[GET_PUBLIC_ITINERARIES_ERROR]', error)
      return {
        success: false,
        error: 'Failed to fetch public itineraries'
      }
    }
  },

  async getItinerariesByDestination(destinationId: string, limit = 10) {
    try {
      const itineraries = await prisma.itinerary.findMany({
        where: {
          destinationId,
          isPublic: true
        },
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: {
            select: {
              name: true,
              image: true
            }
          }
        }
      })

      return {
        success: true,
        data: itineraries
      }
    } catch (error) {
      console.error('[GET_DESTINATION_ITINERARIES_ERROR]', error)
      return {
        success: false,
        error: 'Failed to fetch destination itineraries'
      }
    }
  }
} 