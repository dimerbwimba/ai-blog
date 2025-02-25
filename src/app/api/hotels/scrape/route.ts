import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { HotelService } from "@/services/hotel.service"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const data = await req.json()
    const hotels = await HotelService.scrapeAndProcessHotels(data)

    return NextResponse.json(hotels)
  } catch (error) {
    console.error("[HOTELS_SCRAPE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 