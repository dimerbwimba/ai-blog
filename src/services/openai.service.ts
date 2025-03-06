import { AIPostContent, AIPostPrompt, ResearchResult } from "@/types/ai";
import OpenAI from "openai";
import { Hotel } from "@/types/hotel";
import { TavilyService } from "./tavily.service";
import { slugify } from "@/lib/utils";
// import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
// import { AzureKeyCredential } from "@azure/core-auth";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.AI_BASE_URL,
});

// const client = ModelClient(
//   "https://models.github.ai/inference",
//   new AzureKeyCredential(process.env.OPENAI_API_KEY || "")
// );

export const OpenAIService = {
  async generateTitles(topic: string): Promise<string[]> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a travel blog title generator. Create engaging, SEO-friendly titles that are compelling and accurate. Each title should be unique and follow best practices for travel content.",
          },
          {
            role: "user",
            content: `Generate 4 unique, engaging titles for a travel blog post about: ${topic}. 
            The titles should be:
            - SEO-friendly
            - Include numbers or specific value propositions where appropriate
            - Be between 40-60 characters
            - Compelling but not clickbait
            - Each title should be different in structure and appeal`,
          },
        ],
        temperature: 0.7,
        max_tokens: 256,
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error("No titles generated");

      // Parse the response into an array of titles
      const titles = content
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => line.replace(/^\d+\.\s*/, "").trim())
        .slice(0, 4);

      return titles;
    } catch (error) {
      console.error("[OPENAI_GENERATE_TITLES_ERROR]", error);
      throw new Error("Failed to generate titles");
    }
  },
  async generateDescriptions(title: string): Promise<string[]> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are an SEO expert specializing in meta descriptions for travel content. Create compelling, SEO-optimized descriptions that accurately summarize the content and encourage clicks.",
          },
          {
            role: "user",
            content: `Generate 4 unique, SEO-friendly meta descriptions for a travel blog post titled: "${title}"
            
            The descriptions should:
            - Be between 150-160 characters
            - Include relevant keywords naturally
            - Be compelling and action-oriented
            - Accurately represent the content
            - Use active voice
            - Include a clear value proposition
            Guidelines:
            - Gets straight to the point
            - Hook the Reader
            - Show Relevance
            - Establish Credibility
            - State the Purpose
            - Engage with SEO
            - Invoke Emotion or Curiosity
            - Promise Value
            - Write in a professional but engaging tone
            - Pull quotes and highlights
            - Add Relevant Tables
            - Relevant external links to authoritative sources
            - Images from research placed contextually with alt text. with a source link
            - Include relevant examples and explanations
            - Make sure the content flows naturally between subsections
            - Format the content with proper HTML tags
            - Keep each subsection focused and concise
            - Include transition sentences between subsections
            - Improved readability 
            - Increased engagement
            - Attention-grabbing
            - Quick information retrieval
            - Increased retention
            - Emphasized important information
            - Use numbers
            - Ask questions
            - Use power words
            - Include keywords
            - Create a sense of urgency
            - Make it concise and clear
            - Use emotional triggers
            - Use strong adjectives
            - Make it unique
            Each description should be different in structure and appeal`,
          },
        ],
        temperature: 0.7,
        max_tokens: 256,
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error("No descriptions generated");

      const descriptions = content
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => line.replace(/^\d+\.\s*/, "").trim())
        .slice(0, 4);

      return descriptions;
    } catch (error) {
      console.error("[OPENAI_GENERATE_DESCRIPTIONS_ERROR]", error);
      throw new Error("Failed to generate descriptions");
    }
  },
  async generateSlugs(
    title: string
  ): Promise<{ slug: string; seoSlug: string }> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are an SEO expert specializing in URL optimization. Generate SEO-friendly URLs that are both user-friendly and optimized for search engines. Return only the JSON response without any additional text.",
          },
          {
            role: "user",
            content: `Generate two URL slugs for a travel blog post titled: "${title}".
            Return as JSON with two properties:
            - "slug": A clean, concise URL (max 60 chars)
            - "seoSlug": An SEO-optimized version ending with "-travel-guide" (max 80 chars)
            
            Example format:
            {"slug": "bali-hidden-beaches", "seoSlug": "best-bali-hidden-beaches-travel-guide"}`,
          },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
        max_tokens: 256,
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error("No slugs generated");

      const result = JSON.parse(content);

      if (!result.slug || !result.seoSlug) {
        throw new Error("Invalid slug format");
      }

      return {
        slug: this.generateSlug(result.slug).slice(0, 60),
        seoSlug: this.generateSlug(result.seoSlug).slice(0, 80),
      };
    } catch (error) {
      console.error("[OPENAI_GENERATE_SLUGS_ERROR]", error);
      const baseSlug = slugify(title).slice(0, 60);
      return {
        slug: baseSlug,
        seoSlug: `${baseSlug}-travel-guide`.slice(0, 80),
      };
    }
  },
  async generateTagsAndKeywords(data: {
    title: string;
    description: string;
  }): Promise<{ tags: string[]; keywords: string[] }> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are an SEO expert specializing in travel content. Generate relevant tags and keywords that will help with content discovery and SEO. Return only the JSON response.",
          },
          {
            role: "user",
            content: `Generate tags and keywords for a travel blog post:
            Title: "${data.title}"
            Description: "${data.description}"
            
            Requirements:
            - Generate 5-8 relevant tags
            - Generate 8-12 SEO-optimized keywords
            - Tags should be broad categories
            - Keywords should be specific search terms
            - Include location-based keywords
            - Include activity-based keywords
            - All in lowercase
            
            Return as JSON:
            {
              "tags": ["tag1", "tag2"],
              "keywords": ["keyword1", "keyword2"]
            }`,
          },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
        max_tokens: 512,
      });
      const content = response.choices[0].message.content;
      if (!content) throw new Error("No tags generated");

      const result = JSON.parse(content);

      if (!result.tags?.length || !result.keywords?.length) {
        throw new Error("Invalid tags/keywords format");
      }

      return {
        tags: result.tags.map((tag: string) => tag.toLowerCase()),
        keywords: result.keywords.map((keyword: string) => keyword.toLowerCase()),
      };
    } catch (error) {
      throw new Error("Failed to generate tags and keywords");
    }
  },
  async generateOutline({
    title,
    description,
    keywords,
  }: {
    title: string;
    description: string;
    keywords: string[];
  }): Promise<string[]> {
    try {
       // 1. Research the topic
    const research: ResearchResult = await TavilyService.researchTopic(
       title
    )
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              `You are an expert travel blog outline generator focused on high-quality, SEO-friendly content. 
        Your goal is to generate well-structured and detailed outlines that maximize readability, keyword relevance, 
        and search ranking potential. Ensure the outline follows a logical hierarchy, using descriptive and keyword-rich headings.
        
        If the topic is about travel budgets or costs, follow this general structure as a guideline but feel free to expand as needed:
        
        **Introduction**
        - Brief overview of [Destination Name] as a travel destination  
        - Key attractions and experiences  
        - Purpose of the guide (help travelers budget their trip)  

        **How much does it cost to travel to [Destination Name]?**  
        - Overview of average daily travel expenses  
        - Factors that influence costs (season, travel style, etc.)  

        **Understanding Travel Budgets**  
        - Importance of planning expenses  
        - How different travelers spend differently  

        **Defining Travel Styles**  
        - Budget, mid-range, and luxury travelers  
        - What each style includes in terms of accommodations, activities, and dining  

        **Average Travel Costs in [Destination Name]**  

        **Provide a breakdown of typical daily expenses**  
        - Accommodation  
        - Food  
        - Transportation  
        - Activities  
        - Miscellaneous expenses  

        **Accommodation Costs**  
        - Price comparisons (budget, mid-range, luxury)  
        - Best areas to stay  

        **Food and Dining Costs**  
        - Street food vs. casual dining vs. fine dining  
        - Cost-saving food tips  

        **Transportation Costs**  
        - Public transport, taxis, rideshares, rentals  

        **Entertainment and Sightseeing Costs**  
        - Entry fees, tour costs, free activities  

        **Nightlife and Alcohol Costs**  
        - Drink prices, nightlife experiences  

        **Travel Costs for Different Trip Durations**  
        - Budget breakdown for one week, two weeks, and a month  

        **Budgeting Tips and Challenges**  
        - Best times to visit for lower prices  
        - Discount passes and cost-saving strategies  

        If the question is **not** about budget or cost, generate a high-quality outline based on best SEO practices, ensuring clear structure, engaging subtopics, and relevant keyword-rich headings. Return only a JSON array without additional formatting or markdown.`,
          },
          {
            role: "user",
            content: `Generate a detailed outline for a travel blog post with the following details:

              Title: ${title}
              Description: ${description}
              Keywords: ${keywords.join(", ")}
              Get some imspirations from this Research data find relevant topics that people search for and include them in the outline:
              ${research.answer} 
              ${research.results.map((r) => r.rowContent).join("\n")} 
              ${research.results.map((r) => `- ${r.content}`).join("\n")} 
              ${research.images.map((i) => `- ${i.url}`).join("\n")}
              at the end
                   Generate a JSON object without additional formatting or markdown syntax. Here is the structure:
              [
                  {
                    "h2": "Entertainment and Sightseeing Costs",
                    "h3": [
                      "Entertainment and Activity Expenses",
                      "Cost of Sightseeing & Entertainment",
                      "Nightlife and Alcohol Costs"
                    ]
                  },
              ]
          Note : Generate a JSON object without additional formatting or markdown syntax. Here is the structure:
              [
                  {
                    "h2": "Entertainment and Sightseeing Costs",
                    "h3": [
                      "Entertainment and Activity Expenses",
                      "Cost of Sightseeing & Entertainment",
                      "Nightlife and Alcohol Costs"
                    ]
                  },
              ]
              `,
          },
        ],
      });

      const outline = JSON.parse(response.choices[0].message.content || "[]");
      return outline;
    } catch (error) {
      console.error("[GENERATE_OUTLINE_ERROR]", error);
      throw new Error("Failed to generate outline");
    }
  },
  
  async generateBlogPost(
    prompt: AIPostPrompt,
    research: ResearchResult
  ): Promise<AIPostContent> {
    try {
      // Generate the main content
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a professional travel writer. Write in a ${prompt.tone} tone.
            Use the provided research to create accurate, engaging content.
            Include specific details, local insights, and practical tips, do not stop until you reach 2000 words of content`,
          },
          {
            role: "user",
            content: `Write a comprehensive travel blog post about ${prompt.topic} in ${prompt.destination}.
            Additional context: ${prompt.additionalInfo || "None provided"}
            
            Research data:
            ${research.answer} 
            ${research.results.map((r) => r.rowContent).join("\n")} 
            ${research.results.map((r) => `- ${r.content}`).join("\n")} 
            ${research.images.map((i) => `- ${i.url}`).join("\n")}
            
            Generate a complete blog post including:
            1. An engaging title
            3. SEO-friendly description 
            4. SEO-friendly slug
            5. SEO-friendly content with proper HTML formatting, including:
               - At least 2000 words of original, well-researched content
               - The research data is the base of the content
               - Properly structured h2, h3 headings
               - Images from research placed contextually with alt text
               - Relevant external links to authoritative sources
               - Comparison tables where appropriate
               - Lists and bullet points for easy scanning
               - Meta description and title tags
               - Schema markup for better SEO
               - Internal links to related content
               - Proper paragraph structure with topic sentences
               - Pull quotes and highlights
               - Mobile-friendly formatting
            6. Relevant tags and keywords
            7. At least 10 FAQs
            8. SEO-friendly seo_slug

            Generate a JSON object without additional formatting or markdown syntax. Here is the structure:
                {
                "title": "string",
                "image": "string",
                "description": "string",
                "slug": "string",
                "seo_slug": "string",
                "content": "string",
                "tags": ["string"],
                "keywords": ["string"],
                "faqs": [{
                    "question": "string",
                    "answer": "string"
                }]
            }`,
          },
        ],
      });
      const content = JSON.parse(completion.choices[0].message.content || "{}");

      //Validate the generated content
      if (!content.title || !content.content) {
        throw new Error("Invalid content generated");
      }

      return {
        title: content.title,
        content: content.content,
        description: content.description,
        slug: this.generateSlug(content.title),
        seo_slug: this.generateSEOSlug(content.title),
        tags: content.tags || [],
        keywords: content.keywords || [],
        faqs: content.faqs || [],
        image: content.image || "",
      };
    } catch (error) {
      console.error("[OPENAI_GENERATE_ERROR]", error);
      throw new Error("Failed to generate blog post");
    }
  },
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  },
  generateSEOSlug(title: string): string {
    return `${this.generateSlug(title)}-travel-guide`;
  },
  async processHotelData(
    rawData: any[]
  ): Promise<Omit<Hotel, "id" | "createdAt" | "updatedAt">[]> {
    const prompt = `
      Process and organize the following hotel data into a consistent format.
      Select the top 10 hotels based on rating and value.
      For each hotel, provide:
      - Detailed description
      - Key amenities
      - Standardized room types
      - Normalized pricing
      Raw data: ${JSON.stringify(rawData)}
    `;

    const response = await openai.chat.completions.create({
      model: "klusterai/Meta-Llama-3.1-8B-Instruct-Turbo",
      max_completion_tokens: 600,
      messages: [
        {
          role: "system",
          content:
            "You are a hotel data processing assistant. Format data consistently and select the best options.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  },
  async generateSectionContent(params: {
    title: string
    subsections: string[]
    context: {
      title: string
      description: string
      keywords: string[]
    }
  }): Promise<string> {

    // 1. Research the topic
    const research = await TavilyService.researchTopic(
      params.context.title+":"+ params.title ,
    )
    const prompt = `
      Write a Gets straight to the point section for a blog post about "${params.context.title}".
      
      This section's title is: "${params.title}"
      Base yourself of these Research data:
            ${research.answer} 
            ${research.results.map((r) => r.rowContent).join("\n")} 
            ${research.results.map((r) => `- ${r.content}`).join("\n")} 
            ${research.images.map((i) => `- ${i.url}`).join("\n")}
      Include the following subsections:
      ${params.subsections.map(sub => `- ${sub}`).join('\n')}
      
      Context:
      - Main post title: ${params.context.title}
      - Post description: ${params.context.description}
      - Keywords to include: ${params.context.keywords.join(', ')}
      - remember this is just a section of a bigger article
      
      Guidelines:
      - Gets straight to the point
      - Hook the Reader
      - Show Relevance
      - Establish Credibility
      - State the Purpose
      - Engage with SEO
      - Invoke Emotion or Curiosity
      - Promise Value
      - Write in a professional but engaging tone
      - Pull quotes and highlights
      - Add Relevant Tables
      - Relevant external links to authoritative sources
      - Images from research placed contextually with alt text. with a source link
      - Include relevant examples and explanations
      - Make sure the content flows naturally between subsections
      - Format the content with proper HTML tags
      - Keep each subsection focused and concise
      - Include transition sentences between subsections
      - Improved readability 
      - Increased engagement
      - Attention-grabbing
      - Quick information retrieval
      - Increased retention
      - Emphasized important information
      - Use numbers
      - Ask questions
      - Use power words
      - Include keywords
      - Create a sense of urgency
      - Make it concise and clear
      - Use emotional triggers
      - Use strong adjectives
      - Make it unique

      
      Return only the HTML content without any additional formatting or metadata.
    `

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert content writer specializing in travel blog posts. You write engaging, informative content with proper HTML formatting."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    return response.choices[0].message.content || ''
  },
  async generateFAQs(params: {
    title: string
    description: string
    keywords: string[]
    content: string
  }): Promise<{ question: string; answer: string }[]> {
    const prompt = `
      Generate a list of frequently asked questions (FAQs) for a blog post about "${params.title}".
      
      Context:
      - Title: ${params.title}
      - Description: ${params.description}
      - Keywords: ${params.keywords.join(', ')}
      - content: ${params.content}
      
      Guidelines:
      - Generate 5-8 relevant and insightful questions
      - Provide clear, concise answers
      - Focus on key aspects of the topic
      - Include questions that address common concerns
      - Make answers informative and helpful
      
      Return the FAQs in JSON format as an array of objects with 'question' and 'answer' properties.
    `

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert content writer specializing in creating FAQs for travel blog posts. Generate relevant questions and clear answers."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    })

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.faqs;
  }
};
