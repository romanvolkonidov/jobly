import { authService } from '@/src/services/auth.service';
import type { RegisterData, User } from '@/src/types/auth';

export async function register(data: RegisterData): Promise<User> {
  return authService.register(data);
}