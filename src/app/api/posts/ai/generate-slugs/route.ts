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

    const { title } = await req.json()
    
    if (!title) {
      return new NextResponse("Title is required", { status: 400 })
    }

    const slugs = await OpenAIService.generateSlugs(title)
    return NextResponse.json(slugs)
  } catch (error) {
    console.error("[GENERATE_SLUGS_ERROR]", error)
    return new NextResponse(
      "Failed to generate slugs",
      { status: 500 }
    )
  }
} 