import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { PostService } from '@/services/post.service'
import { isAuthorized } from '@/lib/auth-check'
import { z } from 'zod'

export type PostStatus = "DRAFTED" | "PUBLISHED" | "APPROVED" | "REJECTED"

const postCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string()
    .min(1, "Image is required")
    .refine((url) => url.startsWith('http://') || url.startsWith('https://'), {
      message: "Image URL must start with http:// or https://"
    }),
  status: z.enum(["DRAFTED", "PUBLISHED", "PENDING"]).default("DRAFTED"),
  featured: z.boolean().default(false),
  destinations: z.array(z.string()).min(1, "At least one destination is required"),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  tags: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  faqs: z.array(z.object({
    question: z.string().min(1, "Question is required"),
    answer: z.string().min(1, "Answer is required")
  })).min(3, "At least 3 FAQs are required"),
})

function CheckIfUserIsAdmin(session: any) {
  return session?.user?.role === 'ADMIN'
}
function CheckIfUserIsWriter(session: any) {
  return session?.user?.role === 'WRITER'
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || !isAuthorized(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const posts = await PostService.getUserPosts(
      session.user.id
    )
    return NextResponse.json(posts)
  } catch (error) {
    console.error("[POSTS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || (!CheckIfUserIsAdmin(session) && !CheckIfUserIsWriter(session))) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const body = postCreateSchema.parse(json)

    // Validate slug uniqueness
    const isSlugValid = await PostService.validateSlug(body.slug)
    if (!isSlugValid) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      )
    }

    const post = await PostService.createPost({
      ...body,
      authorId: session.user.id,
      status: body.status as PostStatus
    })

    return NextResponse.json(post)
  } catch (error:any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      )
    }

    console.error("[POSTS_POST]", error)
    return new NextResponse(
      "Internal error",
      { status: 500 }
    )
  }
} 