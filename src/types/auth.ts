// src/types/auth.ts

export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
 }
 
 export interface RegisterData {
  email: string;
  password: string;
  name: string;
 }
 
 export interface LoginData {
  email: string;
  password: string;
 }
 
 export interface ResetPasswordData {
  email: string;
  token: string;
  newPassword: string;
 }
 
 export interface RegisterResponse {
  success: boolean;
  message: string;
 }
 
 export interface SessionData {
  userId: string;
 }

 declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add `id` to the user object
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}