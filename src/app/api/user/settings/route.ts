import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { UserService } from "@/services/user.service"
import { isAuthorized } from "@/lib/auth-check"

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || !isAuthorized(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { name, email, image, currentEmail } = body

    const user = await UserService.updateUser({
      id: session.user.id,
      name,
      email,
      image,
      currentEmail
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("[USER_SETTINGS_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 