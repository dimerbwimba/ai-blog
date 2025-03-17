import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ItineraryService } from "@/services/itinerary.service"
import { z } from "zod"

// Schema for creating an itinerary
const createItinerarySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startDate: z.string().transform(val => new Date(val)),
  endDate: z.string().transform(val => new Date(val)),
  destinationId: z.string().min(1, "Destination is required"),
  isPublic: z.boolean().optional().default(false),
  body: z.any() // JSON data containing days, activities, etc.
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = createItinerarySchema.parse(body)

    const result = await ItineraryService.createItinerary({
      ...validatedData,
      userId: session.user.id,
      body: validatedData.body
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json(result.data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      )
    }

    console.error("[ITINERARY_CREATE_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to create itinerary" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await ItineraryService.getUserItineraries(session.user.id)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error("[GET_ITINERARIES_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to fetch itineraries" },
      { status: 500 }
    )
  }
} 