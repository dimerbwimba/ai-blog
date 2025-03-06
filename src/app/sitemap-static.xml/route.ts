import { MetadataRoute } from 'next'
import { SitemapService } from '@/services/sitemap.service'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'

export async function GET(): Promise<Response> {
  try {
    const staticPages = await SitemapService.getStaticPages(BASE_URL)
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPages.map(page => `
        <url>
          <loc>${page.loc}</loc>
          <changefreq>${page.changefreq}</changefreq>
          <priority>${page.priority}</priority>
        </url>
      `).join('')}
    </urlset>`

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    })
  } catch (error) {
    console.error('Error generating static sitemap:', error)
    return new Response('Error generating sitemap', { status: 500 })
  }
} 