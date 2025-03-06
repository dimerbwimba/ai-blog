import { SitemapService } from '@/services/sitemap.service'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'

export async function GET(): Promise<Response> {
  try {
    const destinations = await SitemapService.getDestinations(BASE_URL)
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
      ${destinations.map(dest => `
        <url>
          <loc>${dest.loc}</loc>
          <lastmod>${dest.lastmod}</lastmod>
          <changefreq>${dest.changefreq}</changefreq>
          <priority>${dest.priority}</priority>
          ${dest.images?.map(img => `
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
    console.error('Error generating destinations sitemap:', error)
    return new Response('Error generating sitemap', { status: 500 })
  }
} 