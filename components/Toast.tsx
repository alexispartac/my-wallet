'use client';

import React from 'react';

export function Toast({ message, visible }: { message: string; visible: boolean }) {
  if (!visible) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 90, left: '50%',
      transform: 'translateX(-50%)',
      background: '#1A3C5E', color: '#fff',
      padding: '10px 18px', borderRadius: 12,
      fontSize: 13, fontWeight: 600,
      zIndex: 500,
      animation: 'mfFade 200ms ease-out',
      boxShadow: '0 8px 24px rgba(15,23,42,0.2)',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
    }}>{message}</div>
  );
}

export function useToast() {
  const [state, setS] = React.useState({ message: '', visible: false });
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = React.useCallback((message: string, ms = 2200) => {
    if (timer.current) clearTimeout(timer.current);
    setS({ message, visible: true });
    timer.current = setTimeout(() => setS({ message: '', visible: false }), ms);
  }, []);
  return { toast: state, show };
}
