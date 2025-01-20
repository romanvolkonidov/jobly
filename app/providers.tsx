'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from "next-auth/react";
import { queryClient } from '@/src/lib/react-query';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
}
