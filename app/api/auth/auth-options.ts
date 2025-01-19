import { DefaultSession, NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/src/lib/prisma';
import { verifyPassword } from '@/src/utils/password.utils';
import redis from '@/src/lib/redis';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email?: string | null;
      image?: string | null;
    }
  }

  interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    image?: string;
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            password: true,
            firstName: true,
            lastName: true,
            emailVerified: true,
          },
        });

        if (!user) {
          throw new Error('Invalid email or password');
        }

        const isValid = await verifyPassword(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Invalid email or password');
        }

        if (!user.emailVerified) {
          throw new Error('Please verify your email first');
        }

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.image = user.image;
        
        // Store in Redis with proper expiry
        await redis.setex(
          `user:${user.id}`,
          86400, // 24 hours in seconds
          JSON.stringify({
            ...token,
            lastUpdated: Date.now()
          })
        ).catch(console.error);
      }
      return token;
    },
    async session({ session, token }) {
      if (!token || !session?.user) {
        return session; // Return original session instead of null
      }
      
      try {
        // Verify redis session is still valid
        const redisSession = await redis.get(`user:${token.id}`);
        if (!redisSession) {
          return session; // Return original session instead of null
        }
        
        session.user.id = token.id as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.image = token.image as string;
        return session;
      } catch (error) {
        console.error('Session validation error:', error);
        return session; // Return original session instead of null
      }
    },
  },
  events: {
    async signOut({ token }) {
      try {
        // Clear all user-related data
        await redis.clearUserSession(token.id as string);
        await redis.del(`session:${token.sub}`);
      } catch (error) {
        console.error('Error clearing session:', error);
      }
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
};