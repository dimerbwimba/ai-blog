import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { NewsletterStatus, Prisma } from "@prisma/client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'ALL'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Build where clause based on filters
    const where: Prisma.NewsletterWhereInput = {
      ...(search && {
        email: {
          contains: search,
          mode: 'insensitive' as Prisma.QueryMode
        }
      }),
      ...(status !== 'ALL' && {
        status: status as NewsletterStatus
      })
    }

    // Get total count for pagination
    const total = await prisma.newsletter.count({ where })

    // Get paginated and filtered subscribers
    const subscribers = await prisma.newsletter.findMany({
      where,
      select: {
        id: true,
        email: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit,
    })

    return NextResponse.json({
      subscribers,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit
      }
    })
  } catch (error) {
    console.error('[NEWSLETTER_SUBSCRIBERS_ERROR]', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    )
  }
} 