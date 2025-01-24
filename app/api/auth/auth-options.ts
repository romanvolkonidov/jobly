// app/api/auth/auth-options.ts
import { DefaultSession, NextAuthOptions, Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/src/lib/prisma'
import { verifyPassword } from '@/src/utils/password.utils'
import { redis } from '@/src/lib/redis'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      firstName: string
      lastName: string
      email?: string | null
      image?: string | null
    }
  }

  interface JWT {
    id: string
    firstName: string
    lastName: string
    image?: string
    lastUpdated?: number
  }

  interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    image?: string
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
          throw new Error('Please enter your email and password')
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
        })

        if (!user || !await verifyPassword(credentials.password, user.password)) {
          throw new Error('Invalid email or password')
        }

        if (!user.emailVerified) {
          throw new Error('Please verify your email first')
        }

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const sessionData = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          lastUpdated: Date.now()
        }
        
        await redis.set(
          `session:${user.id}`,
          JSON.stringify(sessionData)
        )
        
        return { ...token, ...sessionData }
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          firstName: token.firstName as string,
          lastName: token.lastName as string,
          image: token.image as string | null
        }
        
        try {
          const cached = await redis.get(`session:${token.id}`)
          if (cached && typeof cached === 'string') {
            const data = JSON.parse(cached)
            session.user = { ...session.user, ...data }
          }
        } catch (error) {
          console.error('Redis session error:', error)
        }
      }
      return session
    }
  },
  events: {
    async signOut({ token }) {
      if (token?.id) {
        await redis.del(`session:${token.id}`)
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
}