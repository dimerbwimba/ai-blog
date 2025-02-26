import { ResearchResult } from '@/types/ai'
import { tavily } from "@tavily/core"
export const TavilyService = {
  async researchTopic(topic: string): Promise<ResearchResult> {
    try {
      const client =  tavily({
        apiKey: process.env.TAVILY_API_KEY || "",
      })

      const results = await client.search(
        `${topic}`,
        {
          searchDepth: "advanced",
          maxResults: 5,
          includeDomains: [
            "nomadicmatt.com",
            "budgetyourtrip.com",
            "tripadvisor.com", 
            "lonelyplanet.com", 
            "timeout.com",
            "wikitravel.org",
            "travel.usnews.com",
            "cntraveler.com",
            "theguardian.com",
            "theworldtravelguy.com",
            "theculturetrip.com",
            "theblondeabroad.com",
            "theplanetd.com",
            "thepointsguy.com",
            "thelocal.com",
            "thetravel.com",
          ],
          includeAnswer: true, // Get a summarized answer
          includeRawContent: true, // Get full content when available
          includeImages: true, // Get related images
          excludeDomains: [
            "instagram.com",
            "facebook.com",
            "youtube.com",
            "wikipedia.org",
            "reddit.com",
            "quora.com",
            "linkedin.com",
            "twitter.com",
            "tiktok.com",
            "pinterest.com",

          ],
        }
      )      
      // Process and structure the results
      return results as unknown as ResearchResult
    } catch (error) {
      console.error('[TAVILY_RESEARCH_ERROR]', error)
      throw new Error('Failed to research topic')
    }
  },

  async getRelatedTopics(topic: string, destination: string): Promise<string[]> {
    try {
      const client =  tavily({
        apiKey: process.env.TAVILY_API_KEY || "",
      })

      const results = await client.search(
        `What are popular topics and activities related to ${topic} in ${destination}?`,
        {
          searchDepth: "basic",
          maxResults: 5,
          includeAnswer: true
        })

      return results as unknown as string[]
    } catch (error) {
      console.error('[TAVILY_RELATED_TOPICS_ERROR]', error)
      return []
    }
  }
} 