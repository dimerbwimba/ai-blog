import { NextRequest, NextResponse } from "next/server"
import { PostService } from "@/services/post.service"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '3', 10)

    // Validate limit
    if (isNaN(limit) || limit < 1 || limit > 10) {
      return NextResponse.json(
        { error: 'Invalid limit parameter. Must be between 1 and 10' },
        { status: 400 }
      )
    }

    const result = await PostService.getLatestPosts(limit)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error('[LATEST_POSTS_API_ERROR]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 