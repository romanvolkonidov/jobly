// src/middleware/csrf.ts
//this file works in the following way: it provides CSRF protection for the app
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Tokens from 'csrf';

const tokens = new Tokens();
const secret = process.env.CSRF_SECRET || tokens.secretSync();

export function generateCsrfToken() {
 return tokens.create(secret);
}

export function csrfProtection(handler: (req: NextRequest) => Promise<NextResponse>) {
 return async function(req: NextRequest): Promise<NextResponse> {
   // Skip CSRF check for GET requests
   if (req.method === 'GET') {
     return handler(req);
   }

   const csrfToken = req.headers.get('x-csrf-token');
   
   // Validate token
   if (!csrfToken || !tokens.verify(secret, csrfToken)) {
     return NextResponse.json(
       { error: 'Invalid or missing CSRF token' },
       { status: 403 }
     );
   }

   return handler(req);
 };
}

// Export config for middleware usage  
export const csrfConfig = {
 headerName: 'x-csrf-token',
 secret
};