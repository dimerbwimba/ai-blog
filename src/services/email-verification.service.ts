import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { sendVerificationEmail } from '@/lib/mail'

export const EmailVerificationService = {
  async createVerificationToken(userId: string) {
    try {
      // Generate token
      const token = crypto.randomBytes(32).toString('hex')
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      // Save token
      const verificationToken = await prisma.verificationToken.create({
        data: {
          token,
          expires,
          userId
        }
      })

      return verificationToken
    } catch (error) {
      console.error("[CREATE_VERIFICATION_TOKEN_ERROR]", error)
      throw new Error("Failed to create verification token")
    }
  },

  async sendVerificationEmail(email: string, token: string) {
    try {
      const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`
      
      await sendVerificationEmail(email, verificationUrl)
    } catch (error) {
      console.error("[SEND_VERIFICATION_EMAIL_ERROR]", error)
      throw new Error("Failed to send verification email")
    }
  },

  async verifyEmail(token: string) {
    try {
      // Find and validate token
      const verificationToken = await prisma.verificationToken.findUnique({
        where: { token },
        include: { user: true }
      })

      if (!verificationToken) throw new Error("Invalid token")
      if (verificationToken.expires < new Date()) throw new Error("Token expired")

      // Update user
      await prisma.user.update({
        where: { id: verificationToken.userId },
        data: { emailVerified: new Date() }
      })

      // Delete used token
      await prisma.verificationToken.delete({
        where: { id: verificationToken.id }
      })

      return verificationToken.user
    } catch (error) {
      console.error("[VERIFY_EMAIL_ERROR]", error)
      throw new Error("Failed to verify email")
    }
  }
} 