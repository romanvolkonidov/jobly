// app/csrf.tsx
'use server';
import { generateCsrfToken } from '@/src/middleware/csrf';

export async function getCsrfToken() {
  return generateCsrfToken();
}
