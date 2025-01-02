// app/api/csrf/route.ts
import { NextResponse } from 'next/server';
import { generateCsrfToken } from '@/src/middleware/csrf';

export async function GET() {
  return NextResponse.json({ token: generateCsrfToken() });
}
