// Transactions screen — list with filter chips + search

function TransactionsScreen() {
  const [filter, setFilter] = React.useState('all'); // all | income | expense
  const [catFilter, setCatFilter] = React.useState(null);
  const [search, setSearch] = React.useState('');

  const { catById, formatRON, dayLabel } = window.MF_HELPERS;
  const all = window.MF_TRANSACTIONS;

  let filtered = all;
  if (filter !== 'all') filtered = filtered.filter(t => t.type === filter);
  if (catFilter) filtered = filtered.filter(t => t.catId === catFilter);
  if (search.trim()) filtered = filtered.filter(t => t.merchant.toLowerCase().includes(search.toLowerCase()));

  filtered = [...filtered].sort((a, b) => b.date - a.date);

  // Group by day
  const groups = {};
  filtered.forEach(t => {
    const key = dayLabel(t.date);
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  });

  // Totals
  const totalIn  = filtered.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
  const totalOut = filtered.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);

  const cats = window.MF_CATEGORIES.filter(c => filtered.some(t => t.catId === c.id));

  return (
    <div style={{ paddingBottom: 120 }}>
      <ScreenHeader
        title="Tranzacții"
        subtitle="Mai 2026"
        right={
          <button style={{
            background: '#fff', border: '1px solid #E2E8F0',
            borderRadius: 12, padding: '8px 10px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 12, fontWeight: 600, color: '#1A3C5E',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M3 4h18l-7 9v5l-4 2v-7L3 4z" stroke="#1A3C5E" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
            Filtre
          </button>
        }
      />

      {/* Search */}
      <div style={{ padding: '4px 16px 12px' }}>
        <div style={{
          background: '#fff', borderRadius: 14, padding: '10px 14px',
          border: '1px solid #F1F5F9',
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 1px 2px rgba(15,23,42,0.03)',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#94A3B8" strokeWidth="2"/>
            <path d="M21 21l-5-5" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Caută Mega Image, Bolt..."
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: 14, color: '#1A3C5E', background: 'transparent',
            }}
          />
        </div>
      </div>

      {/* Type filter chips */}
      <div style={{ padding: '0 16px 10px', display: 'flex', gap: 6 }}>
        {[
          { id: 'all',     label: 'Toate',      count: all.length },
          { id: 'income',  label: 'Venituri',   count: all.filter(t => t.type === 'income').length },
          { id: 'expense', label: 'Cheltuieli', count: all.filter(t => t.type === 'expense').length },
        ].map(opt => {
          const active = filter === opt.id;
          return (
            <button key={opt.id} onClick={() => setFilter(opt.id)} style={{
              padding: '7px 14px',
              borderRadius: 999,
              border: 'none',
              background: active ? '#1A3C5E' : '#fff',
              color: active ? '#fff' : '#64748B',
              fontSize: 12, fontWeight: 600,
              cursor: 'pointer',
              boxShadow: active ? '0 2px 6px rgba(26,60,94,0.2)' : '0 1px 2px rgba(15,23,42,0.04)',
              border: active ? 'none' : '1px solid #F1F5F9',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {opt.label}
              <span style={{
                background: active ? 'rgba(255,255,255,0.2)' : '#F1F5F9',
                color: active ? '#fff' : '#94A3B8',
                fontSize: 10, padding: '1px 7px', borderRadius: 999, fontWeight: 700,
              }}>{opt.count}</span>
            </button>
          );
        })}
      </div>

      {/* Category chips horizontal scroll */}
      <div style={{ padding: '0 0 14px', position: 'relative' }}>
        <div style={{
          display: 'flex', gap: 6, overflowX: 'auto', padding: '0 16px',
          scrollbarWidth: 'none',
        }}>
          <button onClick={() => setCatFilter(null)} style={{
            padding: '6px 12px', borderRadius: 999,
            background: !catFilter ? '#EFF6FF' : 'transparent',
            color: !catFilter ? '#2563EB' : '#94A3B8',
            border: !catFilter ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
            flexShrink: 0,
          }}>Toate categoriile</button>
          {cats.map(c => {
            const active = catFilter === c.id;
            return (
              <button key={c.id} onClick={() => setCatFilter(active ? null : c.id)} style={{
                padding: '6px 12px', borderRadius: 999,
                background: active ? c.color + '1A' : 'transparent',
                color: active ? c.color : '#64748B',
                border: `1px solid ${active ? c.color + '55' : '#E2E8F0'}`,
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <span>{c.icon}</span>{c.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary card */}
      <div style={{ padding: '0 16px 12px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1px 1fr',
          background: '#fff', borderRadius: 16, padding: 14,
          boxShadow: '0 1px 2px rgba(15,23,42,0.03), 0 4px 14px rgba(15,23,42,0.04)',
          border: '1px solid #F1F5F9',
        }}>
          <div>
            <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500, letterSpacing: 0.3 }}>VENITURI</div>
            <div style={{ fontSize: 19, fontWeight: 700, color: '#16A34A', marginTop: 2, letterSpacing: -0.4 }}>
              +{totalIn.toLocaleString('ro-RO')} <span style={{ fontSize: 11, fontWeight: 500, color: '#94A3B8' }}>lei</span>
            </div>
          </div>
          <div style={{ background: '#F1F5F9' }}/>
          <div style={{ paddingLeft: 14 }}>
            <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500, letterSpacing: 0.3 }}>CHELTUIELI</div>
            <div style={{ fontSize: 19, fontWeight: 700, color: '#EA580C', marginTop: 2, letterSpacing: -0.4 }}>
              −{Math.round(totalOut).toLocaleString('ro-RO')} <span style={{ fontSize: 11, fontWeight: 500, color: '#94A3B8' }}>lei</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction groups */}
      <div style={{ padding: '0 16px' }}>
        {Object.entries(groups).map(([day, items]) => {
          const dayTotal = items.reduce((a, b) => a + (b.type === 'income' ? b.amount : -b.amount), 0);
          return (
            <div key={day} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 4px 6px' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B', letterSpacing: 0.3, textTransform: 'uppercase' }}>{day}</div>
                <div style={{
                  fontSize: 11, fontWeight: 600,
                  color: dayTotal >= 0 ? '#16A34A' : '#94A3B8',
                }}>{dayTotal >= 0 ? '+' : '−'}{Math.abs(dayTotal).toLocaleString('ro-RO', { minimumFractionDigits: 2 })} lei</div>
              </div>
              <Card style={{ padding: 4 }}>
                {items.map((t, i) => {
                  const cat = catById(t.catId);
                  return (
                    <div key={t.id} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '11px 12px',
                      borderBottom: i < items.length - 1 ? '1px solid #F1F5F9' : 'none',
                    }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: 11,
                        background: cat.color + '1A',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 17,
                      }}>{cat.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#1A3C5E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.merchant}</div>
                        <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>
                          {cat.name}{t.note && ` · ${t.note}`}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontSize: 14, fontWeight: 700, letterSpacing: -0.3,
                          color: t.type === 'income' ? '#16A34A' : '#1A3C5E',
                        }}>
                          {t.type === 'income' ? '+' : '−'}{t.amount.toLocaleString('ro-RO', { minimumFractionDigits: 2 })}
                        </div>
                        <div style={{ fontSize: 10, color: '#CBD5E1', fontWeight: 500 }}>lei</div>
                      </div>
                    </div>
                  );
                })}
              </Card>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#94A3B8', fontSize: 13 }}>
            Nicio tranzacție găsită
          </div>
        )}
      </div>
    </div>
  );
}

window.TransactionsScreen = TransactionsScreen;
