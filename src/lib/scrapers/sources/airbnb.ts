import { ScrapingRequest } from "@/types/hotel"
import * as cheerio from 'cheerio';
import axios from 'axios'

export class AirbnbScraper {
  async scrape(request: ScrapingRequest) {
    try {
      const response = await axios.get(
        `https://www.airbnb.com/s/${encodeURIComponent(request.location)}/homes`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
          }
        }
      )

      const $ = cheerio.load(response.data)
      const properties: any[] = []

      // Select property cards and extract data
      $('[itemprop="itemListElement"]').each((_, element: any) => {
        const property = {
          name: $(element).find('[itemprop="name"]').text().trim(),
          price: $(element).find('[data-testid="price-element"]').text().trim(),
          rating: $(element).find('[aria-label*="rating"]').attr('aria-label'),
          image: $(element).find('img').attr('src'),
          location: $(element).find('[data-testid="listing-card-title"]').text().trim()
        }
        properties.push(property)
      })

      return {
        source: 'airbnb',
        location: request.location,
        timestamp: new Date().toISOString(),
        rawResults: properties,
        totalResults: properties.length
      }

    } catch (error: any) {
      console.error('Airbnb scraping error:', error)
      return {
        source: 'airbnb',
        location: request.location,
        timestamp: new Date().toISOString(),
        rawResults: [],
        totalResults: 0,
        error: error.message
      }
    }
  }
} 