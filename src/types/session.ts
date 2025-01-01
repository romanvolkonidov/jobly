// src/types/session.ts

export interface IronSessionData {
  userId: string;
}

declare module "iron-session" {
  interface IronSessionData {
    userId?: string; // Make this optional for flexibility during initialization
  }
}