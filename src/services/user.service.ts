import { prisma } from '@/lib/prisma'

interface UpdateUserParams {
  id: string
  name?: string
  email?: string
  image?: string
  currentEmail?: string
}

export const UserService = {
  async updateUser({ id, email, currentEmail, ...data }: UpdateUserParams) {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: {
          ...data,
          // If email is changed, set emailVerified to null
          ...(email && email !== currentEmail ? {
            email,
            emailVerified: null
          } : {
            email
          })
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          emailVerified: true,
        }
      })
      
      return user
    } catch (error) {
      console.error("[USER_SERVICE_UPDATE]", error)
      throw new Error("Failed to update user")
    }
  },

  async getUserById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
        }
      })
      
      return user
    } catch (error) {
      console.error("[USER_SERVICE_GET]", error)
      throw new Error("Failed to get user")
    }
  }
} 