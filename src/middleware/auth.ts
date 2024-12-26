
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function authMiddleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const path = request.nextUrl.pathname;
  
  const publicPaths = ['/tasks', '/tasks/[id]'];
  const authRequired = ['/tasks/create/post', '/tasks/respond/submit'];
  
  const isPublicPath = publicPaths.some(p => path.startsWith(p));
  const requiresAuth = authRequired.some(p => path.includes(p));

  if (isPublicPath && !requiresAuth) {
    return NextResponse.next();
  }

  if (requiresAuth && !token) {
    const response = NextResponse.json(
      { message: 'Authentication required' },
      { status: 401 }
    );
    return response;
  }

  if (token?.role === 'worker' && path.includes('/tasks/create')) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}