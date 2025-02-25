import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

interface Destination {
  name: string
  description: string
  image: string
  country: string
  continent: string
  region?: string | null
}

interface GetAllPublicDestinationsParams {
  page: number
  limit: number
  search?: string
  continent?: string
  country?: string
  sortBy?: 'name' | 'country' | 'posts'  // Add this type definition
  order?: 'asc' | 'desc'
}

export const DestinationService = {
  async getAllDestinations() {
    return await prisma.destination.findMany({
      include:{
        _count:{
          select:{
            posts:true
          }
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  },
  async getDestinationByName(slug: string) {
    return await prisma.destination.findFirst({
      where: { slug },
    
    })
  },
  async createDestination(data: Destination) {
    return await prisma.destination.create({
      data: {
        ...data,
        slug: slugify(data.name),
        country_slug: slugify(data.country),
        continent_slug: slugify(data.continent),
        region_slug: data.region ? slugify(data.region) : null,
      },
    })
  },

  async deleteDestination(id: string) {
    const destination = await prisma.destination.findUnique({
      where: { id }
    })

    if (!destination) {
      throw new Error('Destination not found')
    }
    return await prisma.destination.delete({
      where: { id }
    })
  },

  async getDestinationById(id: string) {
    return await prisma.destination.findUnique({
      where: { id }
    })
  },


  async updateDestination(id: string, data: Destination) {
    return await prisma.destination.update({
      where: { id },
      data: {
        ...data,
        slug: slugify(data.name),
        country_slug: slugify(data.country),
        continent_slug: slugify(data.continent),
        region_slug: data.region ? slugify(data.region) : null,
      }
    })
  },

  async getPopularDestinations(limit = 4) {
    try {
      const destinations = await prisma.destination.findMany({
        take: limit,
        select: {
          id: true,
          name: true,
          image: true,
          country: true,
          slug: true,
          _count: {
            select: {
              posts: true // Count related posts
            }
          }
        },
        orderBy: {
          posts: {
            _count: 'desc' // Order by number of posts
          }
        }
      })

      return destinations.map(dest => ({
        id: dest.id,
        name: dest.name,
        country: dest.country,
        image: dest.image,
        slug: dest.slug,
        count: dest._count.posts
      }))
    } catch (error) {
      console.error("[GET_POPULAR_DESTINATIONS_ERROR]", error)
      throw new Error("Failed to fetch popular destinations")
    }
  },

  async getAllPublicDestinations({
    page,
    limit,
    search,
    continent,
    country,
    sortBy = 'name',
    order = 'asc'
  }: GetAllPublicDestinationsParams) {
    try {
      const where = {
        AND: [
          search ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { country: { contains: search, mode: 'insensitive' as const } },
              { description: { contains: search, mode: 'insensitive' as const } }
            ]
          } : {},
          continent ? { continent } : {},
          country ? { country } : {}
        ]
      }

      const [destinations, total] = await Promise.all([
        prisma.destination.findMany({
          where,
          select: {
            id: true,
            name: true,
            description: true,
            image: true,
            country: true,
            continent: true,
            region: true,
            slug: true,
            posts: {
              take: 3,
              orderBy: {
                post: {
                  createdAt: 'desc'
                }
              },
              select: {
                post: {
                  select: {
                    id: true,
                    title: true,
                    slug: true,
                    seo_slug: true,
                    description: true,
                    image: true,
                    createdAt: true,
                    author: {
                      select: {
                        name: true,
                        image: true
                      }
                    }
                  },
                }
              }
            },
            _count: {
              select: {
                posts: true
              }
            }
          },
          orderBy: sortBy === 'posts' 
            ? {
                posts: {
                  _count: order
                }
              }
            : {
                [sortBy]: order
              },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.destination.count({ where })
      ])

      const cleanedDestinations = destinations.map(dest => ({
        id: dest.id,
        name: dest.name,
        description: dest.description,
        image: dest.image,
        country: dest.country,
        continent: dest.continent,
        region: dest.region,
        slug: dest.slug,
        postsCount: dest._count.posts,
        posts: dest.posts.map(p => ({
          id: p.post.id,
          title: p.post.title,
          slug: p.post.slug,
          seoSlug: p.post.seo_slug,
          description: p.post.description,
          image: p.post.image,
          createdAt: p.post.createdAt,
          author: {
            name: p.post.author.name,
            image: p.post.author.image
          }
        }))
      }))

      return { 
        destinations: cleanedDestinations, 
        total 
      }
    } catch (error) {
      console.error("[GET_ALL_PUBLIC_DESTINATIONS_ERROR]", error)
      throw new Error("Failed to fetch destinations")
    }
  },  
  async getDestinationBySlug(slug: string, page: number = 1, limit: number = 10) {
    if (!slug) return null;

    try {
      // First get the destination with basic info and total posts count
      const destination = await prisma.destination.findUnique({
        where: { slug },
        include: {
          _count: {
            select: {
              posts: true
            }
          }
        }
      });

      if (!destination) return null;

      // Then get paginated posts
      const posts = await prisma.destinationOnPosts.findMany({
        where: {
          destinationId: destination.id
        },
        include: {
          post: {
            include: {
              author: {
                select: {
                  name: true,
                  image: true,
                }
              },
              categories: {
                include: {
                  category: true,
                }
              },
            }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          post: {
            createdAt: 'desc'
          }
        }
      });

      return {
        ...destination,
        posts,
        pagination: {
          total: destination._count.posts,
          pages: Math.ceil(destination._count.posts / limit),
          currentPage: page,
          perPage: limit
        }
      };
    } catch (error) {
      console.error("[GET_DESTINATION_BY_SLUG_ERROR]", error);
      throw error;
    }
  }, 
} 