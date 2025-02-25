import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { PostService } from '@/services/post.service'
import { isAuthorized } from '@/lib/auth-check'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || !isAuthorized(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const post = await PostService.publishPost(params.id)
    
    return NextResponse.json(post)
  } catch (error) {
    console.error("[POST_PUBLISH_ERROR]", error)
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error",
      { status: 500 }
    )
  }
} 