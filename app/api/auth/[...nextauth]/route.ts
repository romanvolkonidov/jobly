import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/src/lib/prisma";
import { verifyPassword } from "@/src/utils/password.utils";

async function testConnection() {
  try {
    await prisma.$connect()
    console.log('Database connected')
  } catch (e) {
    console.error('Database connection failed:', e)
  }
}

const handler = NextAuth({
  secret: "test-secret-temporary", // Temporary for testing

  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await testConnection() // Add this line

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          throw new Error("Invalid email or password");
        }
        console.log('Found user:', user) // Before password check


        const isValid = await verifyPassword(credentials.password, user.password);
        console.log('Password valid:', isValid)

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
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60 // 24 hours
  }
});

export { handler as GET, handler as POST };