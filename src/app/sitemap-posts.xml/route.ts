import { MetadataRoute } from 'next';
import { SitemapService } from '@/services/sitemap.service';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com';

// Manual function to escape special XML characters
const escapeXML = (str: string) =>
  str.replace(/&/g, "&amp;")
     .replace(/</g, "&lt;")
     .replace(/>/g, "&gt;")
     .replace(/"/g, "&quot;")
     .replace(/'/g, "&apos;");

export async function GET(): Promise<Response> {
  try {
    const posts = await SitemapService.getBlogPosts(BASE_URL);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
      ${posts
        .map(post => `
        <url>
          <loc>${escapeXML(post.loc)}</loc>
          <lastmod>${post.lastmod}</lastmod>
          <changefreq>${post.changefreq}</changefreq>
          <priority>${post.priority}</priority>
          ${post.images?.map(img => `
            <image:image>
              <image:loc>${escapeXML(img.loc)}</image:loc>
              ${img.title ? `<image:title>${escapeXML(img.title)}</image:title>` : ''}
              ${img.caption ? `<image:caption>${escapeXML(img.caption)}</image:caption>` : ''}
            </image:image>
          `).join('') || ''}
        </url>
      `)
        .join('')}
    </urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating posts sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}
