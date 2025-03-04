import { NextRequest, NextResponse } from "next/server"
import { AccommodationService } from "@/services/accommodation.service"

export async function GET(req: NextRequest) {
    try {
      const searchParams = req.nextUrl.searchParams
      const page = parseInt(searchParams.get('page') || '1')
      const pageSize = parseInt(searchParams.get('pageSize') || '2')
  
      const result = await AccommodationService.getPaginated(page, pageSize)
      
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 500 }
        )
      }
  
      return NextResponse.json({
        success: true,
        ...result.data
      })
  
    } catch (error) {
      console.error("[PAGINATED_ACCOMMODATIONS_ERROR]", error)
      return NextResponse.json(
        { 
          success: false,
          error: "Failed to fetch accommodations" 
        },
        { status: 500 }
      )
    }
  } 