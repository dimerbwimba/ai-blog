import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { EmailVerificationService } from "@/services/email-verification.service"
import { RateLimitService } from "@/services/rate-limit.service"
import { isAuthorized } from "@/lib/auth-check"

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || !isAuthorized(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Check rate limit
    const { canSend, timeLeft } = await RateLimitService.canSendVerificationEmail(
      session.user.id
    )

    if (!canSend) {
      return NextResponse.json({
        error: "Rate limit exceeded",
        timeLeft
      }, { status: 429 })
    }

    // Create verification token
    const verificationToken = await EmailVerificationService.createVerificationToken(
      session.user.id
    )

    // Send verification email
    await EmailVerificationService.sendVerificationEmail(
      session.user.email,
      verificationToken.token
    )

    return NextResponse.json({ message: "Verification email sent" })
  } catch (error:any) {
    console.error("[SEND_VERIFICATION_ERROR]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 