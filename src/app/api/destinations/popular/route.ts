import { NextResponse } from "next/server"
import { DestinationService } from "@/services/destination.service"

export async function GET() {
  try {
    const destinations = await DestinationService.getPopularDestinations()
    return NextResponse.json(destinations)
  } catch (error:any) {
    console.error("[POPULAR_DESTINATIONS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 