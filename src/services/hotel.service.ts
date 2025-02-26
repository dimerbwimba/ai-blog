import { prisma } from '@/lib/prisma'
import { Hotel, ScrapingRequest } from '@/types/hotel'
import { HotelScraper } from '@/lib/scrapers/hotel-scraper'

export const HotelService = {
  async getAllHotels() {
    return await prisma.accommodation.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
  },

  async getHotelById(id: string) {
    return await prisma.accommodation.findUnique({
      where: { id }
    })
  },

  // async createHotel(data: Omit<Hotel, 'id' | 'createdAt' | 'updatedAt'>) {
  //   return await prisma.accommodation.create({
  //     data: {
  //       ...data,
  //       type: 'hotel'
  //     }
  //   })
  // },

  async scrapeAndProcessHotels(request: ScrapingRequest) {
    // 1. Scrape raw data
    const scraper = new HotelScraper(request.source)
    const rawData = await scraper.scrape(request)
    return rawData
    // 2. Process with OpenAI
    // const processedData = await OpenAIService.processHotelData(rawData)

    // 3. Save to database
    // const hotels = await Promise.all(
    //   processedData.map(hotel => this.createHotel(hotel))
    // )

    // return hotels
  }
} 