// src/utils/password.utils.tsx
//this file works in the following way: it contains utility functions for password hashing and verification
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