import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const [total, active, unsubscribed, bounced, complained] = await Promise.all([
      prisma.newsletter.count(),
      prisma.newsletter.count({
        where: { status: 'ACTIVE' }
      }),
      prisma.newsletter.count({
        where: { status: 'UNSUBSCRIBED' }
      }),
      prisma.newsletter.count({
        where: { status: 'BOUNCED' }
      }),
      prisma.newsletter.count({
        where: { status: 'COMPLAINED' }
      })
    ])

    return NextResponse.json({
      total,
      active,
      unsubscribed,
      bounced,
      complained
    })
  } catch (error) {
    console.error('[NEWSLETTER_STATS_ERROR]', error)
    return NextResponse.json(
      { error: 'Failed to fetch newsletter stats' },
      { status: 500 }
    )
  }
} 