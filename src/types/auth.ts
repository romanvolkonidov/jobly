export interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'worker';
  isVerified: boolean;
  createdAt: Date;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'client' | 'worker';
}

export interface LoginData {
  email: string;
  password: string;
}