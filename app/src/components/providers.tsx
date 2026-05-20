'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { AuthProvider } from '@/lib/auth-context';
import { LenisProvider } from '@/components/lenis-provider';
import { CursorGlow } from '@/components/cursor-glow';
import { ScrollProgress } from '@/components/scroll-progress';
import { PageTransition } from '@/components/page-transition';

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60_000, refetchOnWindowFocus: false },
        },
      })
  );
  return (
    <QueryClientProvider client={client}>
      <AuthProvider>
        <LenisProvider>
          <ScrollProgress />
          <CursorGlow />
          <PageTransition>{children}</PageTransition>
        </LenisProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
