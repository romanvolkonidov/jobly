import { prisma } from '@/src/lib/prisma';
import { sendVerificationEmail } from '@/src/utils/email.utils';

export async function POST(req: Request) {
  const { email, password, firstName, lastName } = await req.json();

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
}