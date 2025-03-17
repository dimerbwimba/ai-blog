import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

interface GenerateItineraryParams {
  city: string;
  travelType: "BUDGET" | "STANDARD" | "LUXURY";
  duration: "1_DAY" | "3_DAYS" | "1_WEEK" | "2_WEEKS";
}

export const GeminiService = {
  async generateItinerary({ city, travelType, duration }: GenerateItineraryParams) {
    try {
      // Get the model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Convert duration to days for prompt clarity
      let durationInDays = 1;
      switch (duration) {
        case "1_DAY": durationInDays = 1; break;
        case "3_DAYS": durationInDays = 3; break;
        case "1_WEEK": durationInDays = 7; break;
        case "2_WEEKS": durationInDays = 14; break;
      }

      // Create a detailed prompt for the AI
      const prompt = `
       Generate Travel Plan for Location: ${city}, for ${durationInDays} Days for ${travelType.toLowerCase()} budget. Give me a Hotels options list with Hotel Name, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with place Name, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, Time to travel each of the location for ${durationInDays} days with each day plan with best time to visit in JSON.
       don't add any other text or additional text in response just return the JSON.
       `;

      // Generate content
      const result = await model.generateContent(prompt);
      const response = await result.response;
      console.log('[GEMINI_GENERATE_ITINERARY_RESPONSE]', response.text());
      const text = response.text();
      
      // Extract the JSON from the response
      // This handles cases where the AI might add markdown code blocks or explanatory text
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/) || text.match(/{[\s\S]*?}/);
      
      let itineraryData;
      if (jsonMatch) {
        // If JSON is in a code block, extract it
        const jsonString = jsonMatch[0].replace(/```json\n|```\n|```/g, '');
        itineraryData = JSON.parse(jsonString);
      } else {
        // Otherwise try to parse the whole response
        itineraryData = JSON.parse(text);
      }

      return {
        success: true,
        data: itineraryData
      };
    } catch (error) {
      console.error('[GEMINI_GENERATE_ITINERARY_ERROR]', error);
      return {
        success: false,
        error: 'Failed to generate itinerary'
      };
    }
  }
}; 