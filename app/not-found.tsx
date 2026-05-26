import Link from 'next/link';

export default function NotFound() {
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
        <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#1A3C5E', marginBottom: 8 }}>Pagina nu există</div>
        <div style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, marginBottom: 28 }}>
          Linkul accesat nu mai este valabil sau nu a existat niciodată.
        </div>
        <Link href="/" style={{
          display: 'block', padding: '13px', borderRadius: 12,
          background: 'linear-gradient(135deg, #1A3C5E 0%, #2563EB 100%)',
          color: '#fff', textDecoration: 'none',
          fontSize: 15, fontWeight: 700,
        }}>
          Înapoi la aplicație
        </Link>
      </div>
    </div>
  );
}
