// app/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from '@/src/utils/password.utils';

// Initialize Prisma Client (Singleton Pattern)
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === "development") global.prisma = prisma;

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        // Map Google profile to user object in your DB
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          emailVerified: true,
        };
      },
    }),

    // Custom Credentials Provider
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Check for email and password credentials
        if (!credentials?.email || !credentials.password) return null;

        // Fetch user from the database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        // If no user found, return null
        if (!user) return null;

        // Verify password
        const isValid = await verifyPassword(credentials.password, user.password);

        // If password is valid, return user, otherwise return null
        return isValid ? user : null;
      }
    }),
  ],

  callbacks: {
    // Session callback to include user ID in the session
    async session({ session, user }) {
      session.user = {
        ...session.user,
        id: user.id,  // Attach user ID to session
      };
      return session;
    },
  },

  // You can add other configurations like pages, session options, etc.
  pages: {
    signIn: '/auth/signin',  // Custom sign-in page
    error: '/auth/error',    // Custom error page
  },

  session: {
    strategy: "jwt",  // Use JWT for session management
    maxAge: 24 * 60 * 60,  // Session max age in seconds (1 day)
  },

  secret: process.env.NEXTAUTH_SECRET,  // Secret for JWT encryption
});

export { handler as GET, handler as POST };
