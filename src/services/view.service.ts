import { prisma } from '@/lib/prisma'

interface TrackViewDTO {
  postId: string
  ip: string
  userAgent?: string | null
  referer?: string | null
  country?: string | null
  city?: string | null
}

export const ViewService = {
  async trackView({ postId, ip, userAgent, referer, country, city }: TrackViewDTO) {
    try {
      // Use transaction to ensure data consistency
      return await prisma.$transaction(async (tx) => {
        // Try to create a view record
        await tx.view.create({
          data: {
            postId,
            ip,
            userAgent,
            referer,
            country,
            city,
          },
        })

        // Update post view count
        const updatedPost = await tx.post.update({
          where: { id: postId },
          data: { viewCount: { increment: 1 } },
          select: { viewCount: true }
        })

        return { success: true, viewCount: updatedPost.viewCount }
      })
    } catch (error: any) {
      // If duplicate view, ignore error
      if (error.code === 'P2002') {
        return { success: true, duplicate: true }
      }
      console.error('[TRACK_VIEW_ERROR]', error)
      throw error
    }
  },

  async getPostViews(postId: string) {
    try {
      const [total, today] = await Promise.all([
        // Get total views
        prisma.view.count({ where: { postId } }),
        // Get today's views
        prisma.view.count({
          where: {
            postId,
            createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
          }
        })
      ])

      return { total, today }
    } catch (error) {
      console.error('[GET_POST_VIEWS_ERROR]', error)
      throw error
    }
  }
} 