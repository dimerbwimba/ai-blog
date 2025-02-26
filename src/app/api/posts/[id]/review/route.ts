import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { PostManagementService } from "@/services/post-management.service"
import { z } from "zod"

const reviewSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  feedback: z.string().min(1, "Feedback is required"),
})

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { status, feedback } = reviewSchema.parse(body)

    const post = await PostManagementService.reviewPost({
      id,
      status,
      feedback,
      reviewerId: session.user.id
    })

    return NextResponse.json(post)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      )
    }

    console.error("[POST_REVIEW_ERROR]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 