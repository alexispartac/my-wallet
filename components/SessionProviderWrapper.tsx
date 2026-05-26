'use client';

import { SessionProvider, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

function SessionExpiryWatcher() {
  const { status } = useSession();
  useEffect(() => {
    if (status === 'unauthenticated') {
      const isAuthPage = ['/login', '/register', '/forgot-password'].some(p =>
        window.location.pathname.startsWith(p)
      );
      if (!isAuthPage) signOut({ callbackUrl: '/login' });
    }
  }, [status]);
  return null;
}

export default function SessionProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={true} refetchInterval={5 * 60}>
      <SessionExpiryWatcher />
      {children}
    </SessionProvider>
  );
}
