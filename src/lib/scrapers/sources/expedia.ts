import { ScrapingRequest } from "@/types/hotel"
import * as cheerio from 'cheerio';
import axios from 'axios'

export class ExpediaScraper {
  async scrape(request: ScrapingRequest) {
    try {
      const response = await axios.get(
        `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(request.location)}`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
          }
        }
      )

      const $ = cheerio.load(response.data)
      const hotels: any[] = []

      // Select hotel cards and extract data
      $('[data-stid="property-listing"]').each((_, element: any) => {
        const hotel = {
          name: $(element).find('[data-stid="property-name"]').text().trim(),
          price: $(element).find('[data-stid="price-lockup"]').text().trim(),
          rating: $(element).find('[data-stid="property-reviews-rating"]').text().trim(),
          image: $(element).find('img').attr('src'),
          location: $(element).find('[data-stid="location-info"]').text().trim()
        }
        hotels.push(hotel)
      })

      return {
        source: 'expedia',
        location: request.location,
        timestamp: new Date().toISOString(),
        rawResults: hotels,
        totalResults: hotels.length
      }

    } catch (error: any) {
      console.error('Expedia scraping error:', error)
      return {
        source: 'expedia',
        location: request.location,
        timestamp: new Date().toISOString(),
        rawResults: [],
        totalResults: 0,
        error: error.message
      }
    }
  }
} 