import { PrismaClient } from '@prisma/client';
import { hash, compare } from 'bcryptjs';
import { RegisterData, User } from '../types/auth';
import crypto from 'crypto';

const prisma = new PrismaClient();

export const authService = {
  async register(data: RegisterData) {
    const hashedPassword = await hash(data.password, 12);
    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        emailVerified: false,
        verificationToken: crypto.randomBytes(32).toString('hex'),
      }
    });
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('User not found');
    
    const isValid = await compare(password, user.password);
    if (!isValid) throw new Error('Invalid password');

    if (!user.emailVerified) {
      throw new Error('Please verify your email');
    }

    return user;
  },

  async verifyEmail(token: string) {
    const user = await prisma.user.findFirst({
      where: { verificationToken: token }
    });
    if (!user) throw new Error('Invalid token');

    return prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verificationToken: null }
    });
  },

  async validateAuth(path: string, user: User | null) {
    if (path.includes('/tasks/create')) {
      return {
        canStart: true,
        canFinish: !!user,
        message: user ? null : "Want get it done? It's simple. Just register. Less than 5 min"
      };
    }

    if (path.includes('/tasks/respond')) {
      return {
        canView: true,
        canRespond: !!user,
        message: user ? null : "Want to become a freelancer? It's simple. Just fill out a profile. Less than 5 min"
      };
    }
  }
};