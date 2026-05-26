'use client';

import React from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail]       = React.useState('');
  const [sent, setSent]         = React.useState(false);
  const [loading, setLoading]   = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    setSent(true);
  }

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, #0F172A 0%, #1A3C5E 50%, #2563EB 100%)',
      padding: '24px 20px',
      fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
    }}>
      <div style={{
        width: '100%', maxWidth: 400, background: '#fff',
        borderRadius: 24, padding: '32px 28px',
        boxShadow: '0 24px 64px rgba(15,23,42,0.3)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{sent ? '📬' : '🔑'}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#1A3C5E', letterSpacing: -0.5 }}>
            {sent ? 'Email trimis!' : 'Ai uitat parola?'}
          </div>
          <div style={{ fontSize: 13, color: '#64748B', marginTop: 6, lineHeight: 1.5 }}>
            {sent
              ? `Dacă ${email} are un cont, vei primi un link de resetare. Verifică și folderul Spam.`
              : 'Introdu emailul și îți trimitem un link de resetare.'}
          </div>
        </div>

        {!sent && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', letterSpacing: 0.3, display: 'block', marginBottom: 6 }}>EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="andrei@exemplu.com"
                required
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 12,
                  border: '1.5px solid #E2E8F0', fontSize: 14, color: '#1A3C5E',
                  outline: 'none', boxSizing: 'border-box', background: '#F8FAFC',
                }}
                onFocus={e => e.target.style.borderColor = '#2563EB'}
                onBlur={e => e.target.style.borderColor = '#E2E8F0'}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 4, padding: '14px', borderRadius: 12, border: 'none',
                background: loading ? '#94A3B8' : 'linear-gradient(135deg, #1A3C5E 0%, #2563EB 100%)',
                color: '#fff', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Se trimite...' : 'Trimite linkul'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#64748B' }}>
          <Link href="/login" style={{ color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}>
            ← Înapoi la autentificare
          </Link>
        </div>
      </div>
    </div>
  );
}
