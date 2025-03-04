import { prisma } from '@/lib/prisma'
import { subDays } from 'date-fns'
import { Prisma, Accommodation, Destination, Post, View } from '@prisma/client'

interface CreateAccommodationDTO {
  jsonData: Record<string, any>
  destinationId: string
}

interface AccommodationWithDestination {
  id: string
  jsonData: {
    properties: {
      name: string
      extracted_hotel_class:number,
      total_rate:{
        lowest:string,
        extracted_lowest:number,
        before_taxes_fees:string,
        extracted_before_taxes_fees:number
      },
      gps_coordinates:{
        latitude:number,
        longitude:number
      },
      check_in_time:string,
      check_out_time:string,
      nearby_places:{
        name:string,
        transportations:{
          type:string,
          duration:string
        }[]
      }[]
      type: string
      images: {
        thumbnail:string,
        original_image:string
      },
      rate_per_night: {
        lowest: string,
        extracted_lowest: number,
        before_taxes_fees: string,
        extracted_before_taxes_fees: number
      },
      location_rating:number,
      ratings:{
        stars:number,
        count:number
      },
      reviews_breakdown:{
        name:string,
        description:string,
        total_mentioned:number
        positive:number,
        negative:number
        neutral:number
      }
      hotel_class: string,
      overall_rating: number,
      reviews: number,
      amenities: string[],
      link: string
    }[]
  }
  destinationId: string
  createdAt: Date
  updatedAt: Date
  destination: {
    id: string
    name: string
    country: string
  }
}

type DestinationWithAccommodationsAndPosts = Destination & {
  accommodations: Accommodation[]
  posts: (Post & {
    views: View[]
  })[]
}

type PaginatedResponse<T> = {
  data: T[]
  metadata: {
    total: number
    pageSize: number
    currentPage: number
    totalPages: number
  }
}

export const AccommodationService = {
  async create({ jsonData, destinationId }: CreateAccommodationDTO) {
    try {
      const accommodation = await prisma.accommodation.create({
        data: {
          jsonData: jsonData as Prisma.JsonObject,
          destinationId,
        },
        include: {
          destination: {
            select: {
              name: true,
              country: true,
            },
          },
        },
      })

      return {
        success: true,
        data: accommodation as AccommodationWithDestination,
      }
    } catch (error) {
      console.error('[CREATE_ACCOMMODATION_ERROR]', error)
      return {
        success: false,
        error: 'Failed to create accommodation',
      }
    }
  },

  async getAll(): Promise<{
    success: boolean
    data?: AccommodationWithDestination[]
    error?: string
  }> {
    try {
      const accommodations = await prisma.accommodation.findMany({
        include: {
          destination: {
            select: {
              name: true,
              country: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return {
        success: true,
        data: accommodations as AccommodationWithDestination[],
      }
    } catch (error) {
      console.error('[GET_ACCOMMODATIONS_ERROR]', error)
      return {
        success: false,
        error: 'Failed to fetch accommodations',
      }
    }
  },

  async getByDestination(destinationId: string) {
    try {
      const accommodations = await prisma.accommodation.findMany({
        where: {
          destinationId,
        },
        include: {
          destination: {
            select: {
              name: true,
              country: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return {
        success: true,
        data: accommodations as AccommodationWithDestination[],
      }
    } catch (error) {
      console.error('[GET_DESTINATION_ACCOMMODATIONS_ERROR]', error)
      return {
        success: false,
        error: 'Failed to fetch destination accommodations',
      }
    }
  },

  async delete(id: string) {
    try {
      await prisma.accommodation.delete({
        where: { id },
      })

      return {
        success: true,
      }
    } catch (error) {
      console.error('[DELETE_ACCOMMODATION_ERROR]', error)
      return {
        success: false,
        error: 'Failed to delete accommodation',
      }
    }
  },

  async getById(id: string) {
    try {
      const accommodation = await prisma.accommodation.findUnique({
        where: { id },
        include: {
          destination: {
            select: {
              name: true,
              country: true,
            },
          },
        },
      })

      if (!accommodation) {
        return {
          success: false,
          error: 'Accommodation not found',
        }
      }

      return {
        success: true,
        data: accommodation,
      }
    } catch (error) {
      console.error('[GET_ACCOMMODATION_ERROR]', error)
      return {
        success: false,
        error: 'Failed to fetch accommodation',
      }
    }
  },

  async update(id: string, data: { jsonData: Record<string, any> }) {
    try {
      const accommodation = await prisma.accommodation.update({
        where: { id },
        data: {
          jsonData: data.jsonData as Prisma.JsonObject,
        },
        include: {
          destination: {
            select: {
              name: true,
              country: true,
            },
          },
        },
      })

      return {
        success: true,
        data: accommodation,
      }
    } catch (error) {
      console.error('[UPDATE_ACCOMMODATION_ERROR]', error)
      return {
        success: false,
        error: 'Failed to update accommodation',
      }
    }
  },

  async getPopularAccommodations() {
    try {
      // Get latest 3 accommodations with their destinations
      const latestAccommodations = await prisma.accommodation.findMany({
        take: 3,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          destination: {
            select: {
              id: true,
              name: true,
              country: true,
              description: true,
              image: true
            }
          }
        }
      })

      // Format the response with specific jsonData properties
      const result = latestAccommodations.map(accommodation => {
        const jsonData = accommodation.jsonData as any
        return {
          id: accommodation.id,
          name: accommodation.destination.name,
          properties: jsonData.properties.map((property: any) => ({
            name: property.name,
            type: property.type,
            images: property.images,
            rate_per_night: property.rate_per_night,
            hotel_class: property.hotel_class,
            overall_rating: property.overall_rating,
            reviews: property.reviews,
            amenities: property.amenities,
            link: property.link,
            location_rating: property.location_rating,
            reviews_breakdown:property.reviews_breakdown,
            extracted_hotel_class:property.extracted_hotel_class,
            total_rate:property.total_rate,
            gps_coordinates:property.gps_coordinates,
            check_in_time:property.check_in_time,
            check_out_time:property.check_out_time,
            nearby_places:property.nearby_places,
            ratings:property.ratings,
          })),
          createdAt: accommodation.createdAt,
          updatedAt: accommodation.updatedAt
        }
      })

      return {
        success: true,
        data: result
      }

    } catch (error) {
      console.error('[GET_POPULAR_ACCOMMODATIONS_ERROR]', error)
      return {
        success: false,
        error: 'Failed to fetch popular accommodations'
      }
    }
  },

  async getPaginated(page = 1, pageSize = 9) {
    try {
      const skip = (page - 1) * pageSize
      
      const [total, accommodations] = await Promise.all([
        prisma.accommodation.count(),
        prisma.accommodation.findMany({
          skip,
          take: pageSize,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            destination: {
              select: {
                id: true,
                name: true,
                country: true,
                description: true,
                image: true
              }
            }
          }
        })
      ])

      const totalPages = Math.ceil(total / pageSize)

      // Format accommodations with specific jsonData properties
      const formattedAccommodations = accommodations.map(acc => {
        const jsonData = acc.jsonData as any
        return {
          id: acc.id,
          name: acc.destination.name,
          properties: jsonData.properties.map((property: any) => ({
            name: property.name,
            type: property.type,
            images: property.images,
            rate_per_night: property.rate_per_night,
            hotel_class: property.hotel_class,
            overall_rating: property.overall_rating,
            reviews: property.reviews,
            amenities: property.amenities,
            link: property.link,
            location_rating: property.location_rating,
            reviews_breakdown: property.reviews_breakdown,
            extracted_hotel_class: property.extracted_hotel_class,
            total_rate: property.total_rate,
            gps_coordinates: property.gps_coordinates,
            check_in_time: property.check_in_time,
            check_out_time: property.check_out_time,
            nearby_places: property.nearby_places,
            ratings: property.ratings,
          })),
          createdAt: acc.createdAt,
          updatedAt: acc.updatedAt
        }
      })

      return {
        success: true,
        data: {
          data: formattedAccommodations,
          metadata: {
            total,
            pageSize,
            currentPage: page,
            totalPages
          }
        }
      }
    } catch (error) {
      console.error('[GET_PAGINATED_ACCOMMODATIONS_ERROR]', error)
      return {
        success: false,
        error: 'Failed to fetch accommodations'
      }
    }
  }
}