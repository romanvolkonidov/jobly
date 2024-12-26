
import { RegisterData, LoginData, User } from '@/src/types/auth';

class AuthService {
  private readonly API_URL = '/api/auth';

  async register(data: RegisterData): Promise<User> {
    const response = await fetch(`${this.API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(await response.text());
    }
    
    return response.json();
  }

  async login(data: LoginData): Promise<{ user: User; token: string }> {
    const response = await fetch(`${this.API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async verify(token: string): Promise<void> {
    const response = await fetch(`${this.API_URL}/verify?token=${token}`, {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }
  }
}

export const authService = new AuthService();

