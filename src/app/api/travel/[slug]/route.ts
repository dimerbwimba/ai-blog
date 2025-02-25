import { NextResponse } from 'next/server'
import { PostService } from '@/services/post.service'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await PostService.getPublicPostBySlug(params.slug)
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("[PUBLIC_POST_GET]", error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
} 