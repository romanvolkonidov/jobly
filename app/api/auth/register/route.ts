import { prisma } from '@/src/lib/prisma';
import { sendVerificationEmail } from '@/src/utils/email.utils';
import { Prisma } from '@prisma/client';

export async function POST(req: Request) {
  try {
    // Test database connection first
    try {
      await prisma.$connect();
    } catch (error) {
      console.error('Database connection error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Database connection failed',
          details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined 
        }),
        { status: 500 }
      );
    }

    // Check if request body exists
    if (!req.body) {
      return new Response(
        JSON.stringify({ error: 'Request body is required' }),
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => null);
    
    // Validate parsed JSON
    if (!body) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400 }
      );
    }

    const { email, password, firstName, lastName } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return new Response(
        JSON.stringify({ error: 'All fields are required' }),
        { status: 400 }
      );
    }

    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return new Response(
          JSON.stringify({ error: 'Email already registered' }),
          { status: 400 }
        );
      }

      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const codeExpiration = new Date(Date.now() + 15 * 60 * 1000);

      await prisma.pendingUser.create({
        data: {
          email,
          password,
          firstName,
          lastName,
          verificationCode,
          verificationCodeExpires: codeExpiration,
        },
      });

      await sendVerificationEmail(email, verificationCode);
      
      return new Response(
        JSON.stringify({ message: 'Check your email for verification code' }),
        { status: 200 }
      );
    } finally {
      await prisma.$disconnect();
    }

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return new Response(
        JSON.stringify({ 
          error: 'Database error',
          code: error.code,
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}