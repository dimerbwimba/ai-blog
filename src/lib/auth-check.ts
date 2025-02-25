import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"

export async function checkAuth() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/")
  }
  
  return session
}

export async function checkRole() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/")
  }
  
  if (session.user.role !== "WRITER" && session.user.role !== "ADMIN") {
    redirect("/unauthorized")
  }
  
  return session
}

export function isAuthorized(role: string | undefined) {
  return role === "WRITER" || role === "ADMIN"
} 