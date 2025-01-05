import { NextResponse } from 'next/server';
import { generateToken } from '@/src/lib/csrf';

export async function GET() {
  return NextResponse.json({ token: generateToken() });
}