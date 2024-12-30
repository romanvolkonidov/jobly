// src/utils/password.utils.tsx

import { hash, compare } from 'bcryptjs'
import crypto from 'crypto'

export const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex')
}

export const hashPassword = async (password: string) => {
  return await hash(password, 12)
}

export const verifyPassword = async (password: string, hashedPassword: string) => {
  return await compare(password, hashedPassword)
}