import { prisma } from '@/lib/prisma'
import { subDays } from 'date-fns'

interface AnalyticsOverview {
  totalViews: number
  uniqueVisitors: number
  topPosts: Array<{
    id: string
    title: string
    views: number
    uniqueViews: number
  }>
}

export const AnalyticsService = {
  async getOverviewStats(period: "7d" | "30d" | "all"): Promise<{
    success: boolean
    data?: AnalyticsOverview
    error?: string
  }> {
    try {
      const dateFilter = period !== "all" ? {
        createdAt: {
          gte: subDays(new Date(), period === "7d" ? 7 : 30)
        }
      } : {}

      const [
        totalViews,
        uniqueVisitors,
        topPosts,
      ] = await Promise.all([
        // Total views
        prisma.view.count({
          where: dateFilter
        }),

        // Unique visitors
        prisma.view.groupBy({
          by: ['ip'],
          where: dateFilter,
          _count: true
        }),

        // Top posts
        prisma.post.findMany({
          take: 5,
          orderBy: {
            viewCount: 'desc'
          },
          select: {
            id: true,
            title: true,
            viewCount: true,
            views: {
              where: dateFilter,
              select: {
                ip: true
              },
              distinct: ['ip']
            }
          }
        }),

       
      ])

      return {
        success: true,
        data: {
          totalViews,
          uniqueVisitors: uniqueVisitors.length,
          topPosts: topPosts.map(post => ({
            id: post.id,
            title: post.title,
            views: post.viewCount,
            uniqueViews: post.views.length
          })),
        }
      }
    } catch (error) {
      console.error('[ANALYTICS_SERVICE_ERROR]', error)
      return {
        success: false,
        error: 'Failed to fetch analytics'
      }
    }
  }
} 