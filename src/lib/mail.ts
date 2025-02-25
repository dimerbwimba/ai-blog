import { Resend } from 'resend'
import { VerificationEmail } from '@/components/email-template/verification-email'
import { renderAsync } from '@react-email/render'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(
  email: string, 
  verificationUrl: string
) {
  const username = email.split('@')[0]
  
  const html = await renderAsync(
    VerificationEmail({
      verificationUrl,
      username
    })
  )

  await resend.emails.send({
    from: 'TravelKaya <next191996@gmail.com>',
    to: email,
    subject: 'Travel Kaya - Verify your email',
    html
  })
} 