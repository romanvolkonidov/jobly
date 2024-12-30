// src/types/iron.d.ts

import 'iron-session';

declare module 'iron-session' {
  interface IronSessionData {
    userId: string; // Consistently required
  }
}
