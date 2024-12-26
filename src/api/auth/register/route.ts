// src/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { hash } from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const hashedPassword = await hash(data.password, 12);
    
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword
      }
    });

    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Registration failed' }, { status: 400 });
  }
}