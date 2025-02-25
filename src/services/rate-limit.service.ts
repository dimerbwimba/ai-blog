import { prisma } from '@/lib/prisma'

const WAIT_TIME = 10 * 60 * 1000 // 10 minutes in milliseconds

export const RateLimitService = {
  async canSendVerificationEmail(userId: string): Promise<{ 
    canSend: boolean; 
    timeLeft?: number 
  }> {
    try {
      const lastToken = await prisma.verificationToken.findFirst({
        where: { 
          userId,
          createdAt: {
            gte: new Date(Date.now() - WAIT_TIME)
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      if (!lastToken) {
        return { canSend: true }
      }

      const timeLeft = WAIT_TIME - (Date.now() - lastToken.createdAt.getTime())
      
      return {
        canSend: timeLeft <= 0,
        timeLeft: Math.max(0, timeLeft)
      }
    } catch (error) {
      console.error("[RATE_LIMIT_CHECK_ERROR]", error)
      throw new Error("Failed to check rate limit")
    }
  }
} 