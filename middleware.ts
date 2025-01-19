import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'
import type { NextRequestWithAuth } from "next-auth/middleware"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
})

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'),
})

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl

    // Handle rate limiting for auth routes
    if (pathname.startsWith('/auth')) {
      const forwardedFor = req.headers.get('x-forwarded-for')
      const clientIp = (forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1')
      const { success, limit, reset, remaining } = await ratelimit.limit(clientIp)
      
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
      // Allow access to auth routes without token check
      return NextResponse.next()
    }

    // For non-auth routes, check authentication
    const token = req.nextauth.token
    
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow auth routes without token
        if (req.nextUrl.pathname.startsWith('/auth')) {
          return true
        }
        // Require token for all other protected routes
        return !!token
      },
    },
  }
)

// Update matcher to exclude login/signup pages from auth check
export const config = {
  matcher: [
    '/profile/:path*', 
    '/settings/:path*'  // Added this line
  ]
}