'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, #0F172A 0%, #1A3C5E 50%, #2563EB 100%)',
      padding: '24px 20px',
      fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
    }}>
      <div style={{
        width: '100%', maxWidth: 380, background: '#fff',
        borderRadius: 24, padding: '40px 28px', textAlign: 'center',
        boxShadow: '0 24px 64px rgba(15,23,42,0.3)',
      }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>⚠️</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#1A3C5E', marginBottom: 8 }}>Ceva a mers greșit</div>
        <div style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, marginBottom: 28 }}>
          A apărut o eroare neașteptată. Încearcă din nou sau reîncarcă pagina.
          {error.digest && (
            <div style={{ marginTop: 8, fontSize: 11, color: '#94A3B8' }}>Cod: {error.digest}</div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => reset()}
            style={{
              flex: 1, padding: '13px', borderRadius: 12, border: 'none',
              background: 'linear-gradient(135deg, #1A3C5E 0%, #2563EB 100%)',
              color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}
          >
            Încearcă din nou
          </button>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              flex: 1, padding: '13px', borderRadius: 12, border: 'none',
              background: '#F1F5F9', color: '#64748B', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}
          >
            Acasă
          </button>
        </div>
      </div>
    </div>
  );
}
