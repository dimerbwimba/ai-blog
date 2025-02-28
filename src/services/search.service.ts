import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

interface SearchResult {
  id: string
  title: string
  description: string
  image: string
  seo_slug: string
  createdAt: Date
  author: {
    name: string
    image: string | null
  }
  categories: {
    name: string
    slug: string | null
  }[]
  _relevance: number
}

interface SearchOptions {
  query: string
  page?: number
  limit?: number
  categories?: string[]
}

export const SearchService = {
  async searchPosts({ query, page = 1, limit = 10, categories }: SearchOptions) {
    try {
      const where: Prisma.PostWhereInput = {
        OR: [
          { title: { contains: query, mode: Prisma.QueryMode.insensitive } },
          { description: { contains: query, mode: Prisma.QueryMode.insensitive } },
          { content: { contains: query, mode: Prisma.QueryMode.insensitive } },
          { tags: { hasSome: query.split(' ') } },
          { keywords: { hasSome: query.split(' ') } }
        ],
        status: "APPROVED",
        ...(categories?.length ? {
          categories: {
            some: {
              category: {
                slug: { in: categories }
              }
            }
          }
        } : {})
      }

      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          where,
          select: {
            id: true,
            title: true,
            description: true,
            image: true,
            seo_slug: true,
            createdAt: true,
            author: {
              select: {
                name: true,
                image: true
              }
            },
            categories: {
              select: {
                category: {
                  select: {
                    name: true,
                    slug: true
                  }
                }
              }
            }
          },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            createdAt: 'desc'
          }
        }),
        prisma.post.count({ where })
      ])

      // Calculate relevance score for each post
      const results = posts.map(post => {
        const titleMatch = post.title.toLowerCase().includes(query.toLowerCase())
        const descMatch = post.description.toLowerCase().includes(query.toLowerCase())
        const categoryMatch = post.categories.some((c: { category: { name: string } }) => 
          c.category.name.toLowerCase().includes(query.toLowerCase())
        )

        const relevance = (titleMatch ? 3 : 0) + (descMatch ? 2 : 0) + (categoryMatch ? 1 : 0)

        return {
          ...post,
          categories: post.categories.map((c: { category: { name: string, slug: string | null } }) => c.category),
          _relevance: relevance
        }
      })

      // Sort by relevance
      results.sort((a, b) => b._relevance - a._relevance)

      return {
        results,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          page,
          limit
        }
      }
    } catch (error) {
      console.error('[SEARCH_POSTS_ERROR]', error)
      throw new Error('Failed to search posts')
    }
  }
}