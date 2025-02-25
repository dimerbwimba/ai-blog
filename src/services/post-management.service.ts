import { prisma } from '@/lib/prisma'

interface ReviewPostParams {
  id: string
  status: 'APPROVED' | 'REJECTED'
  feedback: string
  reviewerId: string
}

export const PostManagementService = {
  async getPendingPosts() {
    try {
      return await prisma.post.findMany({
        where: {
          status: "PUBLISHED"
        },
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      })
    } catch (error) {
      console.error("[GET_PENDING_POSTS_ERROR]", error)
      throw new Error("Failed to fetch pending posts")
    }
  },

  async reviewPost({ id, status, feedback, reviewerId }: ReviewPostParams) {
    try {
      const post = await prisma.post.update({
        where: { id },
        data: { 
          status,
          reviewedAt: new Date(),
          reviewedBy: { connect: { id: reviewerId } },
          reviewFeedback: feedback
        },
        include: {
          author: {
            select: {
              email: true,
              name: true
            }
          }
        }
      })

      return post
    } catch (error) {
      console.error("[REVIEW_POST_ERROR]", error)
      throw new Error("Failed to review post")
    }
  }
} 