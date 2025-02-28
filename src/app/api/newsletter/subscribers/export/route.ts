import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const subscribers = await prisma.newsletter.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        source: true,
        ipAddress: true,
        createdAt: true,
        lastEmailSent: true,
        unsubscribedAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(subscribers)
  } catch (error) {
    console.error('[NEWSLETTER_EXPORT_ERROR]', error)
    return NextResponse.json(
      { error: 'Failed to export subscribers' },
      { status: 500 }
    )
  }
} 