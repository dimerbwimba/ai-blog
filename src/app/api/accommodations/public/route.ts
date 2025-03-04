import { NextRequest, NextResponse } from "next/server"
import { AccommodationService } from "@/services/accommodation.service"

export async function GET(req: NextRequest) {
  try {
    const result = await AccommodationService.getPopularAccommodations()
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data
    })

  } catch (error) {
    console.error("[POPULAR_ACCOMMODATIONS_ERROR]", error)
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch popular accommodations" 
      },
      { status: 500 }
    )
  }
} 