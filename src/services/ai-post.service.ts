import { prisma } from '@/lib/prisma'
import { AIPostPrompt } from '@/types/ai'
import { TavilyService } from './tavily.service'
import { OpenAIService } from './openai.service'

export const AIPostService = {
  async generatePost(prompt: AIPostPrompt, userId: string) {
    try {
      // 1. Research the topic
      const research = await TavilyService.researchTopic(
        prompt.topic,
        prompt.destination
      )
      console.log(research)
      // 2. Generate the content
      const generatedContent = await OpenAIService.generateBlogPost(
        prompt,
        research
      )
      // 3. Save to database
      const post = await prisma.post.create({
        data: {
          title: generatedContent.title,
          content: generatedContent.content,
          description: generatedContent.description,
          slug: generatedContent.slug,
          seo_slug: generatedContent.seo_slug,
          tags: generatedContent.tags,
          keywords: generatedContent.keywords,
          image: generatedContent.image, // This would need to be handled separately
          status: "DRAFTED",
          generated_with_ai: true,
          authorId: userId,
          faqs: {
            create: generatedContent.faqs.map(faq => ({
              question: faq.question,
              answer: faq.answer,
              authorId: userId
            }))
          }
        }
      })

     return post

    } catch (error) {
      console.error('[AI_POST_GENERATE_ERROR]', error)
      throw new Error('Failed to generate and save post')
    }
  }
} 