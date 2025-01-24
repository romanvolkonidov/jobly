
// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { rateLimiter } from '@/src/lib/rate-limit'
import type { NextRequestWithAuth } from "next-auth/middleware"

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl

    if (pathname.startsWith('/auth')) {
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'
      const { success, limit, reset, remaining } = await rateLimiter.limit(ip)
      
      if (!success) {
        return new NextResponse('Too Many Requests', {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          },
        })
      }
      return NextResponse.next()
    }

    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        return req.nextUrl.pathname.startsWith('/auth') || !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/profile/:path*', 
    '/settings/:path*'
  ]
}