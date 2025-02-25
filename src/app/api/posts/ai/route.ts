import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AIPostService } from '@/services/ai-post.service'
import { isAuthorized } from '@/lib/auth-check'
import { z } from 'zod'

const aiPostSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  destination: z.string().min(1, "Destination is required"),
  tone: z.string().min(1, "Tone is required"),
  additionalInfo: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || !isAuthorized(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const validatedData = aiPostSchema.parse(body)

    const post = await AIPostService.generatePost(validatedData, session.user.id)

    return NextResponse.json(post)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      )
    }

    console.error("[AI_POST_ERROR]", error)
    return new NextResponse(
      "Internal error",
      { status: 500 }
    )
  }
} 