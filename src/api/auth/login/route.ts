// src/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';

// src/api/auth/login/route.ts
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('User not found');
    
    const isValid = await compare(password, user.password);
    if (!isValid) throw new Error('Invalid password');
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
    
    return NextResponse.json({ user, token });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Login failed' }, { status: 401 });
  }
}