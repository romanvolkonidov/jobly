// src/types/iron.d.ts

import 'iron-session';

declare module 'iron-session' {
  interface IronSessionData {
    userId?: string; // Optional for flexibility during session initialization
    isAuthenticated?: boolean; // A common addition for authentication checks
    role?: string; // Optional role field for role-based access control (e.g., "admin", "user")
  }
}
