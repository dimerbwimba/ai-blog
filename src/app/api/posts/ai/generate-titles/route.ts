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

    const { topic } = await req.json()
    
    if (!topic) {
      return new NextResponse("Topic is required", { status: 400 })
    }

    const titles = await OpenAIService.generateTitles(topic)
    return NextResponse.json(titles)
  } catch (error) {
    console.error("[GENERATE_TITLES_ERROR]", error)
    return new NextResponse(
      "Failed to generate titles",
      { status: 500 }
    )
  }
} 