import { MetadataRoute } from 'next'
import { SitemapService } from '@/services/sitemap.service'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'

export async function GET(): Promise<Response> {
  try {
    const accommodations = await SitemapService.getAccommodations(BASE_URL)
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
      ${accommodations.map(acc => `
        <url>
          <loc>${acc.loc}</loc>
          <lastmod>${acc.lastmod}</lastmod>
          <changefreq>${acc.changefreq}</changefreq>
          <priority>${acc.priority}</priority>
          ${acc.images?.map(img => `
            <image:image>
              <image:loc>${img.loc}</image:loc>
              ${img.title ? `<image:title>${img.title}</image:title>` : ''}
              ${img.caption ? `<image:caption>${img.caption}</image:caption>` : ''}
            </image:image>
          `).join('') || ''}
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
    console.error('Error generating accommodations sitemap:', error)
    return new Response('Error generating sitemap', { status: 500 })
  }
} 