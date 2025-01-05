//app/api/auth/[...nextauth]/route.ts

import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/src/lib/prisma";
import { verifyPassword } from "@/src/utils/password.utils";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"]
  }

  interface User {
    id: string;
    email: string;
    name: string;
  }
}

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Database connected');
  } catch (e) {
    console.error('Database connection failed:', e);
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "test-secret-temporary",
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await testConnection();

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          throw new Error("Invalid email or password");
        }

        const isValid = await verifyPassword(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        if (!user.emailVerified) {
          throw new Error("Please verify your email first");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login'
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 24 * 60 * 60
  }
};

const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;