// src/utils/token.utils.ts

import { randomBytes } from 'crypto';
import { prisma } from '@/src/lib/prisma';

export const generateVerificationToken = (): string => {
  return randomBytes(32).toString('hex');
};

export const generateResetToken = (): string => {
  return randomBytes(32).toString('hex');
};

export const verifyEmailToken = async (token: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { verificationToken: token }
  });
  return !!user;
};

export const verifyResetToken = async (token: string): Promise<boolean> => {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() }
    }
  });
  return !!user;
};