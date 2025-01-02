import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/src/lib/prisma";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "text" },
        password: { type: "password" },
        token: { type: "text" }
      },
      async authorize(credentials) {
        if (!credentials) return null;

        if (credentials.token) {
          const user = await prisma.user.findUnique({
            where: { verificationToken: credentials.token }
          });
          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: { emailVerified: true }
            });
            return user;
          }
        }

        if (!credentials.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        
        if (!user || !user.password) return null;

        const isValid = await compare(credentials.password, user.password);
        return isValid ? user : null;
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: { strategy: "jwt" }
};