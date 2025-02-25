import { ScrapingRequest } from "@/types/hotel"
import { chromium } from 'playwright'

export class BookingComScraper {
  async scrape(request: ScrapingRequest) {
    let browser = null;
    try {
      browser = await chromium.launch({
        headless: false,
      })
      
      const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        viewport: { width: 1280, height: 720 },
      })

      const page = await context.newPage()

      // Set longer timeout and different wait strategy
      await page.goto('https://www.booking.com', { 
        timeout: 60000,
        waitUntil: 'domcontentloaded'
      })

      // Wait for the search box to be visible
      await page.waitForSelector('#ss, [name="ss"]', { 
        timeout: 60000,
        state: 'visible' 
      })

      // Type location directly into search box
      await page.fill('#ss, [name="ss"]', request.location)
      await page.waitForTimeout(2000)

      // Press Enter to search
      await page.keyboard.press('Enter')
      
      // Wait for results page to load
      await page.waitForSelector('[data-testid="property-card"]', {
        timeout: 60000,
        state: 'visible'
      })

      // Extract hotel data
      const hotels = await page.evaluate(() => {
        const propertyCards = Array.from(document.querySelectorAll('[data-testid="property-card"]')).slice(0, 10)
        
        return propertyCards.map(card => {
          return {
            name: card.querySelector('[data-testid="title"]')?.textContent?.trim(),
            price: card.querySelector('[data-testid="price-and-discounted-price"]')?.textContent?.trim(),
            image: card.querySelector('img')?.getAttribute('src'),
            rating: card.querySelector('[data-testid="rating-stars"]')?.getAttribute('aria-label'),
            address: card.querySelector('[data-testid="address"]')?.textContent?.trim(),
            score: card.querySelector('[data-testid="review-score"]')?.textContent?.trim(),
            type: card.querySelector('[data-testid="property-type-badge"]')?.textContent?.trim() || 'Hotel',
            url: card.querySelector('a[data-testid="title-link"]')?.getAttribute('href')
          }
        })
      })

      console.log(`Found ${hotels.length} hotels`)

      // Process and categorize results
      const processedHotels = hotels.filter(hotel => hotel.name && hotel.price)
      const breakdown = {
        hotels: processedHotels.filter(h => h.type?.toLowerCase().includes('hotel')).length,
        resorts: processedHotels.filter(h => h.type?.toLowerCase().includes('resort')).length,
        apartments: processedHotels.filter(h => h.type?.toLowerCase().includes('apartment')).length,
        fiveStarHotels: processedHotels.filter(h => h.rating?.includes('5')).length
      }

      return {
        source: 'booking.com',
        location: request.location,
        timestamp: new Date().toISOString(),
        rawResults: processedHotels,
        totalResults: processedHotels.length,
        breakdown
      }

    } catch (error: any) {
      console.error('Booking.com scraping error:', error)
      return {
        source: 'booking.com',
        location: request.location,
        timestamp: new Date().toISOString(),
        rawResults: [],
        totalResults: 0,
        error: error.message,
        breakdown: {
          hotels: 0,
          resorts: 0,
          apartments: 0,
          fiveStarHotels: 0
        }
      }
    } finally {
      if (browser) {
        await browser.close()
      }
    }
  }
} 