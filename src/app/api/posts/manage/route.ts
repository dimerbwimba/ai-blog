import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { PostManagementService } from "@/services/post-management.service"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const posts = await PostManagementService.getPendingPosts()
    return NextResponse.json(posts)
  } catch (error) {
    console.error("[POSTS_MANAGE_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 