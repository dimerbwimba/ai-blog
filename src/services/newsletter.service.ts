import { prisma } from '@/lib/prisma'
import { NewsletterStatus } from '@prisma/client'

interface CreateNewsletterDTO {
  email: string
  name?: string
  source?: string
  ipAddress?: string
}

export const NewsletterService = {
  async subscribe(data: CreateNewsletterDTO) {
    try {
      // Check if email already exists
      const existing = await prisma.newsletter.findUnique({
        where: { email: data.email }
      })

      if (existing) {
        // If unsubscribed, reactivate
        if (existing.status === 'UNSUBSCRIBED') {
          return await prisma.newsletter.update({
            where: { email: data.email },
            data: {
              status: 'ACTIVE',
              unsubscribedAt: null,
              updatedAt: new Date()
            }
          })
        }
        
        // If already subscribed and active, return error
        if (existing.status === 'ACTIVE') {
          throw new Error('Email already subscribed')
        }
      }

      // Create new subscription
      const subscription = await prisma.newsletter.create({
        data: {
          email: data.email,
          name: data.name,
          source: data.source,
          ipAddress: data.ipAddress,
          preferences: {
            frequency: 'weekly',
            categories: ['all']
          }
        }
      })

      return {
        success: true,
        data: subscription
      }
    } catch (error) {
      console.error('[NEWSLETTER_SUBSCRIBE_ERROR]', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to subscribe'
      }
    }
  },

  async unsubscribe(email: string) {
    try {
      const subscription = await prisma.newsletter.update({
        where: { email },
        data: {
          status: 'UNSUBSCRIBED',
          unsubscribedAt: new Date()
        }
      })

      return {
        success: true,
        data: subscription
      }
    } catch (error) {
      console.error('[NEWSLETTER_UNSUBSCRIBE_ERROR]', error)
      return {
        success: false,
        error: 'Failed to unsubscribe'
      }
    }
  },

  async verifyEmail(email: string) {
    try {
      const subscription = await prisma.newsletter.update({
        where: { email },
        data: {
          verified: true
        }
      })

      return {
        success: true,
        data: subscription
      }
    } catch (error) {
      console.error('[NEWSLETTER_VERIFY_ERROR]', error)
      return {
        success: false,
        error: 'Failed to verify email'
      }
    }
  }
} 