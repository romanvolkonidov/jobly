// src/services/auth.service.ts
//this file works in the following way: it provides the auth service
import { RegisterData, RegisterResponse, LoginData, User } from '@/src/types/auth';

class AuthService {
  private readonly API_URL = '/api/auth';
 
  async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await fetch(`${this.API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': this.getCsrfToken()
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(await response.text());
    }
    
    return response.json();
  }
 
  async login(data: LoginData): Promise<{ user: User }> {
    const response = await fetch(`${this.API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': this.getCsrfToken()
      },
      body: JSON.stringify(data)
    });
 
    if (!response.ok) {
      throw new Error(await response.text());
    }
 
    return response.json();
  }
 
  async verify(token: string): Promise<void> {
    const response = await fetch(`${this.API_URL}/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': this.getCsrfToken()
      },
      body: JSON.stringify({ token })
    });
 
    if (!response.ok) {
      throw new Error(await response.text());
    }
  }
 
  private getCsrfToken(): string {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (!token) {
      throw new Error('CSRF token not found');
    }
    return token;
  }
 }
 
 export const authService = new AuthService();