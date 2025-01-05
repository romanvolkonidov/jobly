// src/utils/auth.ts
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { cookies } from 'next/headers'
import { headers } from 'next/headers'

export async function requireAuth() {
  // Just call these functions without storing results
  headers()
  cookies()
  
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/login')
  }
  
  return session
}

export async function getSession() {
  // Just call these functions without storing results
  headers()
  cookies()
  
  return await getServerSession(authOptions)
}