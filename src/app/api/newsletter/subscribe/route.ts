import { NextRequest, NextResponse } from "next/server"
import { NewsletterService } from "@/services/newsletter.service"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, name, source } = body

    // Get IP address from request
    const ipAddress = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') ||
                     '0.0.0.0'

    const result = await NewsletterService.subscribe({
      email,
      name,
      source,
      ipAddress: ipAddress.split(',')[0]
    })

    if (!result) {
      return NextResponse.json(
        { error: result },
        { status: 400 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('[NEWSLETTER_API_ERROR]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 