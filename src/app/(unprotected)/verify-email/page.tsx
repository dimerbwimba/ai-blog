import { EmailVerificationService } from "@/services/email-verification.service"
import { redirect } from "next/navigation"

interface VerifyEmailPageProps {
  searchParams: Promise<{
    token?: string
  }>
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const { token } = await searchParams

  if (!token) {
    redirect("/dashboard")
  }

  try {
    await EmailVerificationService.verifyEmail(token)
    redirect("/dashboard?verified=true")
  } catch {
    redirect("/dashboard?verified=false")
  }
} 