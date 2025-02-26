import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isDashboardPage = req.nextUrl.pathname.startsWith('/dashboard')
    
    // Check if user is authorized (WRITER or ADMIN)
    const isAuthorized = 
      token?.role === "WRITER" || 
      token?.role === "ADMIN"

    // Redirect flows
    if (isDashboardPage) {
      if (!isAuth) {
        return NextResponse.redirect(new URL('/', req.url))
      }
      
      if (!isAuthorized) {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
      
      return NextResponse.next()
    }

    // Default: allow request
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

// Protect these paths
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*'
  ]
} 