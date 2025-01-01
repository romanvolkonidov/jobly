// src/types/iron.d.ts
//this file works in the following way: it extends the IronSessionData interface from the iron-session package
import 'iron-session';

declare module 'iron-session' {
  interface IronSessionData {
    userId?: string; // Optional for flexibility during session initialization
    isAuthenticated?: boolean; // A common addition for authentication checks
    role?: string; // Optional role field for role-based access control (e.g., "admin", "user")
  }
}
