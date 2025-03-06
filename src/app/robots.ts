import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/dashboard/',
        '/admin/',
        '/private/',
      ]
    },
    sitemap: [
      `${BASE_URL}/sitemap.xml`,
      `${BASE_URL}/sitemap-static.xml`,
      `${BASE_URL}/sitemap-posts.xml`,
      `${BASE_URL}/sitemap-accommodations.xml`,
      `${BASE_URL}/sitemap-destinations.xml`
    ]
  }
} 