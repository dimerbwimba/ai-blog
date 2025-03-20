import { NextResponse } from "next/server"
import { ItineraryService } from "@/services/itinerary.service"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Helper function to check authorization
const checkAuthorization = async (itineraryId: string) => {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const itinerary = await ItineraryService.getItinerary(itineraryId)
  
  // Allow access if user is admin or the itinerary owner
  if (session.user.role !== "ADMIN" && itinerary.userId !== session.user.id) {
    throw new Error("Unauthorized")
  }

  return session
}

// GET /api/itineraries/[id]
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await checkAuthorization(params.id)
    const itinerary = await ItineraryService.getItinerary(params.id)
    
    return NextResponse.json(itinerary)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    )
  }
}

// PATCH /api/itineraries/[id]
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await checkAuthorization(params.id)
    const data = await req.json()
    
    const updatedItinerary = await ItineraryService.updateItinerary(params.id, data)
    
    return NextResponse.json(updatedItinerary)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    )
  }
}

// DELETE /api/itineraries/[id]
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await checkAuthorization(params.id)
    await ItineraryService.deleteItinerary(params.id)
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    )
  }
} 