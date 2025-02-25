import { NextResponse } from "next/server"
import { DestinationService } from "@/services/destination.service"
import { z } from "zod"

const querySchema = z.object({
  page: z.string().transform(Number).default("1"),
  limit: z.string().transform(Number).default("12"),
  search: z.string().optional(),
  continent: z.string().optional(),
  country: z.string().optional(),
  sortBy: z.enum(['name', 'country', 'posts']).optional().default('name'),
  order: z.enum(['asc', 'desc']).optional().default('asc'),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const params = querySchema.parse(Object.fromEntries(searchParams))

    const { destinations, total } = await DestinationService.getAllPublicDestinations(params)
    
    const totalPages = Math.ceil(total / params.limit)
    const hasMore = params.page < totalPages
    
    return NextResponse.json({
      destinations,
      currentPage: params.page,
      nextPage: hasMore ? params.page + 1 : null,
      totalPages,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      )
    }

    console.error("[DESTINATIONS_GET_ALL_ERROR]", error)
    return new NextResponse(
      "Internal error",
      { status: 500 }
    )
  }
} 