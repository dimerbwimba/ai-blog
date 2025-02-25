import { NextResponse } from "next/server"
import { PostService } from "@/services/post.service"
import { z } from "zod"

const querySchema = z.object({
  page: z.string().transform(Number).default("1"),
  limit: z.string().transform(Number).default("9"),
})

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const { page, limit } = querySchema.parse(Object.fromEntries(url.searchParams))

    const { posts, total } = await PostService.getPublicPosts({
      page,
      limit,
    })

    const totalPages = Math.ceil(total / limit)
    const hasMore = page < totalPages
    
    return NextResponse.json({
      posts,
      currentPage: page,
      nextPage: hasMore ? page + 1 : null,
      totalPages,
    })
  } catch (error) {
    console.error("[POSTS_PUBLIC_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 