// Budget screen — per-category limits + progress

function BudgetScreen() {
  const { catById, formatRON } = window.MF_HELPERS;
  const txs = window.MF_TRANSACTIONS;
  const budgets = window.MF_BUDGETS;

  const spendByCat = {};
  txs.filter(t => t.type === 'expense').forEach(t => {
    spendByCat[t.catId] = (spendByCat[t.catId] || 0) + t.amount;
  });

  const items = budgets.map(b => ({
    ...b,
    used: spendByCat[b.catId] || 0,
    cat: catById(b.catId),
  })).sort((a, b) => (b.used / b.limit) - (a.used / a.limit));

  const totalLimit = items.reduce((a, b) => a + b.limit, 0);
  const totalUsed  = items.reduce((a, b) => a + b.used, 0);
  const remaining  = totalLimit - totalUsed;
  const pct = Math.round((totalUsed / totalLimit) * 100);

  // Big circular progress
  const size = 180, thickness = 14;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;

  const [reveal, setReveal] = React.useState(0);
  React.useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 1000);
      const eased = 1 - Math.pow(1 - p, 3);
      setReveal(eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ paddingBottom: 120 }}>
      <ScreenHeader
        title="Buget"
        subtitle="Mai 2026"
        right={
          <button style={{
            background: '#2563EB', border: 'none',
            borderRadius: 12, padding: '8px 12px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 12, fontWeight: 600, color: '#fff',
            boxShadow: '0 4px 10px rgba(37,99,235,0.3)',
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1v10M1 6h10" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
            Adaugă
          </button>
        }
      />

      {/* Big circular progress card */}
      <div style={{ padding: '0 16px 14px' }}>
        <Card style={{
          background: 'linear-gradient(160deg, #F0F9FF 0%, #fff 60%)',
          padding: 22,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
              <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E0E7FF" strokeWidth={thickness}/>
                <circle cx={size/2} cy={size/2} r={r} fill="none"
                  stroke="url(#bgGrad)" strokeWidth={thickness} strokeLinecap="round"
                  strokeDasharray={`${c * (totalUsed/totalLimit) * reveal} ${c}`}
                />
                <defs>
                  <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#2563EB"/>
                    <stop offset="100%" stopColor="#16A34A"/>
                  </linearGradient>
                </defs>
              </svg>
              <div style={{
                position: 'absolute', inset: 0, display: 'flex',
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ fontSize: 36, fontWeight: 700, color: '#1A3C5E', letterSpacing: -1 }}>{Math.round(pct * reveal)}%</div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500, marginTop: -2 }}>utilizat</div>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500, letterSpacing: 0.3 }}>RĂMAS</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#16A34A', letterSpacing: -0.6, marginTop: 2 }}>
                {remaining.toLocaleString('ro-RO', { maximumFractionDigits: 0 })}
                <span style={{ fontSize: 13, fontWeight: 500, color: '#94A3B8' }}> lei</span>
              </div>
              <div style={{ marginTop: 12, padding: '8px 10px', background: '#fff', borderRadius: 10, border: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>Buget total</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1A3C5E', marginTop: 1 }}>
                  {totalLimit.toLocaleString('ro-RO')} lei
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Insight pill */}
      <div style={{ padding: '0 16px 14px' }}>
        <div style={{
          background: '#F0FDF4', border: '1px solid #BBF7D0',
          borderRadius: 14, padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4M12 22a10 10 0 110-20 10 10 0 010 20z" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#166534' }}>Ești pe drumul cel bun!</div>
            <div style={{ fontSize: 11, color: '#15803D', marginTop: 1 }}>
              Ai economisit {(totalLimit - totalUsed).toLocaleString('ro-RO', { maximumFractionDigits: 0 })} lei din buget până acum.
            </div>
          </div>
        </div>
      </div>

      {/* Category list */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#1A3C5E', padding: '4px 4px 10px' }}>
          Pe categorii
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((item, i) => {
            const pct = (item.used / item.limit) * 100;
            const over = pct > 100;
            const warn = pct >= 80 && !over;
            const color = over ? '#DC2626' : warn ? '#EA580C' : item.cat.color;

            return (
              <Card key={item.catId} style={{ padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 12,
                    background: item.cat.color + '1A',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20,
                  }}>{item.cat.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#1A3C5E' }}>{item.cat.name}</div>
                      <div style={{
                        fontSize: 11, fontWeight: 700,
                        padding: '2px 7px', borderRadius: 999,
                        background: over ? '#FEE2E2' : warn ? '#FFEDD5' : '#F0FDF4',
                        color: over ? '#DC2626' : warn ? '#EA580C' : '#16A34A',
                      }}>
                        {Math.round(pct)}%
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                      <span style={{ fontWeight: 600, color: '#1A3C5E' }}>
                        {item.used.toLocaleString('ro-RO', { maximumFractionDigits: 0 })} lei
                      </span>
                      {' '}/ {item.limit.toLocaleString('ro-RO')} lei
                    </div>
                  </div>
                </div>
                <ProgressBar value={Math.min(item.used, item.limit)} max={item.limit} color={color} height={7}/>
                {over && (
                  <div style={{ marginTop: 8, fontSize: 11, color: '#DC2626', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" stroke="#DC2626" strokeWidth="1.5" fill="none"/><path d="M6 3v4M6 8.5v.5" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    Buget depășit cu {(item.used - item.limit).toLocaleString('ro-RO', { maximumFractionDigits: 0 })} lei
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Add category button */}
        <button style={{
          width: '100%', marginTop: 12,
          background: '#fff', border: '2px dashed #E2E8F0',
          borderRadius: 14, padding: '14px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          cursor: 'pointer',
          fontSize: 13, fontWeight: 600, color: '#64748B',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 1v12M1 7h12" stroke="#64748B" strokeWidth="2" strokeLinecap="round"/></svg>
          Adaugă categorie de buget
        </button>
      </div>
    </div>
  );
}

window.BudgetScreen = BudgetScreen;
