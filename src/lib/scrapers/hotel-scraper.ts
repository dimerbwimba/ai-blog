import { HotelSource, ScrapingRequest } from '@/types/hotel'
import { BookingComScraper } from './sources/booking-com'
import { AirbnbScraper } from './sources/airbnb'
import { ExpediaScraper } from './sources/expedia'

export class HotelScraper {
  private scraper: any

  constructor(source: HotelSource) {
    switch (source) {
      case 'booking':
        this.scraper = new BookingComScraper()
        break
      case 'airbnb':
        this.scraper = new AirbnbScraper()
        break
      case 'expedia':
        this.scraper = new ExpediaScraper()
        break
      default:
        throw new Error(`Unsupported source: ${source}`)
    }
  }

  async scrape(request: ScrapingRequest) {
    return await this.scraper.scrape(request)
  }
} 