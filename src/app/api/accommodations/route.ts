import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AccommodationService } from "@/services/accommodation.service"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { jsonData, destinationId } = await req.json()
    const result = await AccommodationService.create({ jsonData, destinationId })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error("[ACCOMMODATION_CREATE_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to create accommodation" },
      { status: 500 }
    )
  }
}