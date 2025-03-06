import { MetadataRoute } from 'next'
import { SitemapService } from '@/services/sitemap.service'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'

export async function GET(): Promise<Response> {
  try {
    const staticPages = await SitemapService.getStaticPages(BASE_URL)
    
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <sitemap>
        <loc>${BASE_URL}/sitemap-static.xml</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </sitemap>
      <sitemap>
        <loc>${BASE_URL}/sitemap-posts.xml</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </sitemap>
      <sitemap>
        <loc>${BASE_URL}/sitemap-accommodations.xml</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </sitemap>
      <sitemap>
        <loc>${BASE_URL}/sitemap-destinations.xml</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </sitemap>
    </sitemapindex>`

    return new Response(sitemapIndex, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    })
  } catch (error) {
    console.error('Error generating sitemap index:', error)
    return new Response('Error generating sitemap', { status: 500 })
  }
} 