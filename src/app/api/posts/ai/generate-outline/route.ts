import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { OpenAIService } from "@/services/openai.service"
import { isAuthorized } from "@/lib/auth-check"
import { outlineSchema } from "@/types/ai"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || !isAuthorized(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { title, description, keywords } = await req.json()
    
    if (!title || !description) {
      return new NextResponse("Title and description are required", { status: 400 })
    }

    const outline = await OpenAIService.generateOutline({ title, description, keywords })
    
    // Validate outline format
    try {
      outlineSchema.parse(outline)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Invalid outline format", details: error.errors },
          { status: 422 }
        )
      }
    }

    return NextResponse.json(outline)
  } catch (error) {
    console.error("[GENERATE_OUTLINE_ERROR]", error)
    return new NextResponse(
      "Failed to generate outline",
      { status: 500 }
    )
  }
} 