import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { OpenAIService } from "@/services/openai.service"
import { isAuthorized } from "@/lib/auth-check"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || !isAuthorized(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { title, description } = await req.json()
    
    if (!title || !description) {
      return new NextResponse("Title and description are required", { status: 400 })
    }

    const result = await OpenAIService.generateTagsAndKeywords({ title, description })
    return NextResponse.json(result)
  } catch (error) {
    console.error("[GENERATE_TAGS_ERROR]", error)
    return new NextResponse(
      "Failed to generate tags and keywords",
      { status: 500 }
    )
  }
} 