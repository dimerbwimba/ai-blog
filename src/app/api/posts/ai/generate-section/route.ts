import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { OpenAIService } from "@/services/openai.service"
import { isAuthorized } from "@/lib/auth-check"
import { z } from "zod"

const generateSectionSchema = z.object({
  title: z.string(),
  subsections: z.array(z.string()),
  context: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string())
  })
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!isAuthorized(session.user.role)) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const json = await req.json()
    const body = generateSectionSchema.parse(json)

    const content = await OpenAIService.generateSectionContent(body)
    return NextResponse.json({ content })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      )
    }

    console.error("[GENERATE_SECTION_ERROR]", error)
    return new NextResponse(
      "Internal error",
      { status: 500 }
    )
  }
} 