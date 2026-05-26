// Profile screen

function ProfileScreen() {
  const sections = [
    {
      title: 'Contul tău',
      items: [
        { icon: '👤', label: 'Date personale',   color: '#2563EB', detail: 'Andrei Popescu' },
        { icon: '🔐', label: 'Securitate',        color: '#16A34A', detail: 'Face ID activ' },
        { icon: '🔔', label: 'Notificări',        color: '#EA580C', detail: '3 active' },
      ],
    },
    {
      title: 'Personalizare',
      items: [
        { icon: '🎨', label: 'Aspect',           color: '#8B5CF6', detail: 'Luminos' },
        { icon: '🏷️', label: 'Categorii',        color: '#0EA5E9', detail: '12 categorii' },
        { icon: '💱', label: 'Monedă',           color: '#F59E0B', detail: 'RON (lei)' },
        { icon: '🌍', label: 'Limbă',            color: '#14B8A6', detail: 'Română' },
      ],
    },
    {
      title: 'Date',
      items: [
        { icon: '📤', label: 'Exportă date',      color: '#6366F1', detail: 'CSV, PDF' },
        { icon: '☁️', label: 'Sincronizare cloud', color: '#0EA5E9', detail: 'Activată' },
        { icon: '🗂️', label: 'Tranzacții recurente', color: '#A16207', detail: '4 setate' },
      ],
    },
    {
      title: 'Despre',
      items: [
        { icon: '💬', label: 'Suport',           color: '#EC4899' },
        { icon: 'ℹ️', label: 'Despre MoneyFlow',  color: '#64748B', detail: 'v1.0.0' },
        { icon: '🚪', label: 'Deconectare',       color: '#DC2626' },
      ],
    },
  ];

  const txs = window.MF_TRANSACTIONS;
  const totalSaved = txs.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0)
                   - txs.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);

  return (
    <div style={{ paddingBottom: 120 }}>
      {/* Profile hero */}
      <div style={{
        background: 'linear-gradient(160deg, #1A3C5E 0%, #2563EB 100%)',
        padding: '20px 20px 70px',
        borderRadius: '0 0 28px 28px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
          <div style={{
            width: 70, height: 70, borderRadius: '50%',
            background: 'linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 700, color: '#fff',
            border: '3px solid rgba(255,255,255,0.3)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
          }}>AP</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Andrei Popescu</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>andrei.popescu@email.com</div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              marginTop: 6, padding: '3px 8px', borderRadius: 999,
              background: 'rgba(34,197,94,0.25)', border: '1px solid rgba(34,197,94,0.35)',
              fontSize: 10, fontWeight: 700, color: '#86EFAC',
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E' }}/>
              Premium · 8 luni
            </div>
          </div>
        </div>
      </div>

      {/* Floating stats card */}
      <div style={{ padding: '0 16px', marginTop: -50, position: 'relative', zIndex: 2 }}>
        <Card style={{ padding: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr 1px 1fr', gap: 8, alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#16A34A', letterSpacing: -0.5 }}>
                {Math.round(totalSaved).toLocaleString('ro-RO')}
              </div>
              <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500, marginTop: 1, letterSpacing: 0.2 }}>ECONOMII (LEI)</div>
            </div>
            <div style={{ background: '#F1F5F9', height: 28 }}/>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#1A3C5E', letterSpacing: -0.5 }}>{txs.length}</div>
              <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500, marginTop: 1, letterSpacing: 0.2 }}>TRANZACȚII</div>
            </div>
            <div style={{ background: '#F1F5F9', height: 28 }}/>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#2563EB', letterSpacing: -0.5 }}>8</div>
              <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500, marginTop: 1, letterSpacing: 0.2 }}>BUGETE</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Settings sections */}
      <div style={{ padding: '20px 16px 0' }}>
        {sections.map((sec, si) => (
          <div key={si} style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: 0.6, textTransform: 'uppercase', padding: '0 6px 8px' }}>
              {sec.title}
            </div>
            <Card style={{ padding: 4 }}>
              {sec.items.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 12px',
                  borderBottom: i < sec.items.length - 1 ? '1px solid #F1F5F9' : 'none',
                  cursor: 'pointer',
                }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 10,
                    background: item.color + '1A',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16,
                  }}>{item.icon}</div>
                  <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: item.label === 'Deconectare' ? '#DC2626' : '#1A3C5E' }}>
                    {item.label}
                  </div>
                  {item.detail && (
                    <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>{item.detail}</div>
                  )}
                  <svg width="7" height="12" viewBox="0 0 7 12">
                    <path d="M1 1l5 5-5 5" stroke="#CBD5E1" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              ))}
            </Card>
          </div>
        ))}

        <div style={{ textAlign: 'center', padding: '8px 0 4px', fontSize: 11, color: '#CBD5E1' }}>
          MoneyFlow • v1.0.0 • Made with 💙 in Romania
        </div>
      </div>
    </div>
  );
}

window.ProfileScreen = ProfileScreen;
