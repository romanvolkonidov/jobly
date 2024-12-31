// app/api/auth/register/route.ts 
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { hash } from 'bcryptjs';
import { generateVerificationToken } from '@/src/utils/token.utils';
import { sendVerificationEmail } from '@/src/utils/email.utils';
import { validatePassword } from '@/src/utils/validation';
import { rateLimiterMiddleware } from '@/src/middleware/rateLimiter'
import { csrfProtection } from '@/src/middleware/csrf'

interface RegisterData {
 email: string;
 password: string;
 name: string;
 role: string;
}

export const POST = rateLimiterMiddleware(
  csrfProtection(async (req: Request) => {
    try {
      const data: RegisterData = await req.json();
      
      // Validate required fields
      if (!data.email || !data.password || !data.name) {
        return NextResponse.json({ 
          success: false, 
          message: 'All fields are required' 
        }, { status: 400 });
      }

      // Validate email format
      if (!/\S+@\S+\.\S+/.test(data.email)) {
        return NextResponse.json({ 
          success: false, 
          message: 'Invalid email format' 
        }, { status: 400 });
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      });

      if (existingUser) {
        return NextResponse.json(
          { success: false, message: 'Email already registered' }, 
          { status: 400 }
        );
      }

      // Password validation
      const passwordValidation = validatePassword(data.password);
      if (!passwordValidation.isValid) {
        return NextResponse.json({
          success: false,
          message: passwordValidation.errors.join('. ')
        }, { status: 400 });
      }

      const hashedPassword = await hash(data.password, 12);
      const verificationToken = generateVerificationToken();

      await prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
          verificationToken
        }
      });

      await sendVerificationEmail(data.email, verificationToken);

      return NextResponse.json({ 
        success: true,
        message: 'Registration successful. Please check your email to verify your account.'
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      return NextResponse.json({
        success: false, 
        message: error instanceof Error ? error.message : 'Registration failed'
      }, { status: 500 });
    }
  })
);