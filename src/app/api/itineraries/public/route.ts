import { NextRequest, NextResponse } from "next/server"
import { ItineraryService } from "@/services/itinerary.service"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')
    
    const result = await ItineraryService.getPublicItineraries(limit)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error("[PUBLIC_ITINERARIES_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to fetch public itineraries" },
      { status: 500 }
    )
  }
} 