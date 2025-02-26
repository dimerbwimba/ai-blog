import { authOptions } from "@/lib/auth";
import { isAuthorized } from "@/lib/auth-check";
import { PostService } from "@/services/post.service";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const postUpdateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().min(1, "Image is required"),
  status: z.enum(["DRAFTED", "PUBLISHED"]).default("DRAFTED"),
  featured: z.boolean().default(false),
  destinations: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  faqs: z.array(z.object({
    question: z.string().min(1, "Question is required"),
    answer: z.string().min(1, "Answer is required")
  })).min(3, "At least 3 FAQs are required"),
});


export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !isAuthorized(session.user.role)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { id } = await params
    await PostService.deletePost(id);
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("[POST_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || !isAuthorized(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify post exists and belongs to user
    const existingPost = await PostService.getPostById(id);
    if (!existingPost) {
      return new NextResponse("Post not found", { status: 404 });
    }
    if (existingPost.authorId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await request.json();
    const body = postUpdateSchema.parse(json);

    // If slug changed, validate new slug
    if (body.slug !== existingPost.slug) {
      const isSlugValid = await PostService.validateSlug(body.slug);
      if (!isSlugValid) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 400 }
        );
      }
    }

    const post = await PostService.updatePost({
      id,
      ...body,
      authorId: session.user.id,
    });

    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }

    console.error("[POST_PATCH]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error",
      { status: 500 }
    );
  }
}
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      const { id } = await params
      const session = await getServerSession(authOptions)
      
      if (!session?.user?.id || !isAuthorized(session.user.role)) {
        return new NextResponse("Unauthorized", { status: 401 })
      }
  
      const post = await PostService.getPostById(id)
      
      if (!post) {
        return new NextResponse("Post not found", { status: 404 })
      }
  
      return NextResponse.json(post)
    } catch (error) {
      console.error("[POST_GET]", error)
      return new NextResponse(
        "Internal error",
        { status: 500 }
      )
    }
  } 