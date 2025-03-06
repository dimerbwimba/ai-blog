import { prisma } from '@/lib/prisma'
import { Post, Accommodation, Destination } from '@prisma/client'

interface SitemapField {
  loc: string
  lastmod?: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
  images?: Array<{
    loc: string
    title?: string
    caption?: string
  }>
}

export const SitemapService = {
  async getStaticPages(baseUrl: string): Promise<SitemapField[]> {
    return [
      { loc: `${baseUrl}/`, priority: 1.0, changefreq: 'daily' },
      { loc: `${baseUrl}/about`, priority: 0.8, changefreq: 'monthly' },
      { loc: `${baseUrl}/contact`, priority: 0.8, changefreq: 'monthly' },
      { loc: `${baseUrl}/getting-started`, priority: 1.0, changefreq: 'monthly' },
      { loc: `${baseUrl}/accommodations`, priority: 0.9, changefreq: 'daily' },
      { loc: `${baseUrl}/destinations`, priority: 0.9, changefreq: 'daily' },
      { loc: `${baseUrl}/privacy`, priority: 0.5, changefreq: 'monthly' },
      { loc: `${baseUrl}/terms`, priority: 0.5, changefreq: 'monthly' },
      { loc: `${baseUrl}/cookies`, priority: 0.5, changefreq: 'monthly' },
    ]
  },

  async getBlogPosts(baseUrl: string): Promise<SitemapField[]> {
    const posts = await prisma.post.findMany({
      where: {
        status: 'APPROVED',
      },
      select: {
        slug: true,
        seo_slug: true,
        title: true,
        description: true,
        image: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })


    return posts.map(post => ({
      loc: `${baseUrl}/travel/${post.seo_slug || post.slug}`,
      lastmod: post.updatedAt.toISOString(),
      priority: 0.7,
      changefreq: 'weekly',
      images: post.image ? [{
        loc: post.image,
        title: post.title,
        caption: post.description
      }] : undefined
    }))
  },

  async getAccommodations(baseUrl: string): Promise<SitemapField[]> {
    const accommodations = await prisma.accommodation.findMany({
      select: {
        id: true,
        jsonData: true,
        updatedAt: true
      },
    })


    return accommodations.map(acc => {
      const data = acc.jsonData as any
      return {
        loc: `${baseUrl}/accommodations/${acc.id}`,
        lastmod: acc.updatedAt.toISOString(),
        priority: 0.6,
        changefreq: 'weekly',
        images: data?.properties?.map((prop: any) => ({
          loc: prop.images?.[0]?.original_image,
          title: prop.name,
          caption: prop.description
        })).filter((img: any) => img && img.loc) || []
      }
    })
  },

  async getDestinations(baseUrl: string): Promise<SitemapField[]> {
    const destinations = await prisma.destination.findMany({
      select: {
        slug: true,
        name: true,
        description: true,
        image: true,
        updatedAt: true
      }
    })

    return destinations.map(dest => ({
      loc: `${baseUrl}/destinations/${dest.slug}`,
      lastmod: dest.updatedAt.toISOString(),
      priority: 0.6,
      changefreq: 'weekly',
      images: dest.image ? [{
        loc: dest.image,
        title: dest.name,
        caption: dest.description
      }] : undefined
    }))
  }
} 