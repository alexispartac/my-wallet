'use client';

import React from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError]       = React.useState('');
  const [loading, setLoading]   = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError('Email sau parolă incorecte');
    } else {
      router.push('/');
    }
  }

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, #0F172A 0%, #1A3C5E 50%, #2563EB 100%)',
      padding: '24px 20px',
      fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
    }}>
      <div style={{
        width: '100%', maxWidth: 400,
        background: '#fff', borderRadius: 24,
        padding: '32px 28px',
        boxShadow: '0 24px 64px rgba(15,23,42,0.3)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, #1A3C5E 0%, #2563EB 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px', fontSize: 24,
          }}>💰</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#1A3C5E', letterSpacing: -0.5 }}>MoneyFlow</div>
          <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>Conectează-te la contul tău</div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', letterSpacing: 0.3, display: 'block', marginBottom: 6 }}>
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="andrei@exemplu.com"
              required
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 12,
                border: '1.5px solid #E2E8F0', fontSize: 14, color: '#1A3C5E',
                outline: 'none', boxSizing: 'border-box',
                background: '#F8FAFC', transition: 'border 150ms',
              }}
              onFocus={e => e.target.style.borderColor = '#2563EB'}
              onBlur={e => e.target.style.borderColor = '#E2E8F0'}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', letterSpacing: 0.3, display: 'block', marginBottom: 6 }}>
              PAROLĂ
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Parola ta"
              required
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 12,
                border: '1.5px solid #E2E8F0', fontSize: 14, color: '#1A3C5E',
                outline: 'none', boxSizing: 'border-box',
                background: '#F8FAFC', transition: 'border 150ms',
              }}
              onFocus={e => e.target.style.borderColor = '#2563EB'}
              onBlur={e => e.target.style.borderColor = '#E2E8F0'}
            />
          </div>

          <div style={{ textAlign: 'right', marginTop: -6 }}>
            <Link href="/forgot-password" style={{ fontSize: 12, color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>
              Ai uitat parola?
            </Link>
          </div>

          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: 10,
              background: '#FEF2F2', border: '1px solid #FECACA',
              fontSize: 13, color: '#DC2626', fontWeight: 500,
            }}>{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 4, padding: '14px', borderRadius: 12, border: 'none',
              background: loading ? '#94A3B8' : 'linear-gradient(135deg, #1A3C5E 0%, #2563EB 100%)',
              color: '#fff', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 150ms',
            }}
          >
            {loading ? 'Se conectează...' : 'Conectează-te'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#64748B' }}>
          Nu ai cont?{' '}
          <Link href="/register" style={{ color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}>
            Creează unul
          </Link>
        </div>
      </div>
    </div>
  );
}
