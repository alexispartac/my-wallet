// Reports screen — donut + line + top categories

function ReportsScreen() {
  const { catById } = window.MF_HELPERS;
  const txs = window.MF_TRANSACTIONS;
  const cats = window.MF_CATEGORIES;
  const history = window.MF_HISTORY;

  // Spend per category
  const spendByCat = {};
  txs.filter(t => t.type === 'expense').forEach(t => {
    spendByCat[t.catId] = (spendByCat[t.catId] || 0) + t.amount;
  });

  const donutData = Object.entries(spendByCat)
    .map(([catId, value]) => {
      const cat = catById(catId);
      return { label: cat.name, value, color: cat.color, icon: cat.icon, catId };
    })
    .sort((a, b) => b.value - a.value);

  const total = donutData.reduce((a, b) => a + b.value, 0);

  // Income vs spending comparison
  const lastMonth = history[history.length - 2];
  const thisMonth = history[history.length - 1];
  const diff = ((thisMonth.expense - lastMonth.expense) / lastMonth.expense) * 100;

  return (
    <div style={{ paddingBottom: 120 }}>
      <ScreenHeader
        title="Rapoarte"
        subtitle="Mai 2026"
        right={
          <div style={{ display: 'flex', gap: 4, background: '#fff', padding: 3, borderRadius: 11, border: '1px solid #F1F5F9' }}>
            {['Lună', '6 luni', 'An'].map((p, i) => (
              <button key={p} style={{
                padding: '5px 10px', borderRadius: 8, border: 'none',
                background: i === 0 ? '#1A3C5E' : 'transparent',
                color: i === 0 ? '#fff' : '#64748B',
                fontSize: 11, fontWeight: 600, cursor: 'pointer',
              }}>{p}</button>
            ))}
          </div>
        }
      />

      {/* Donut card */}
      <div style={{ padding: '0 16px 14px' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1A3C5E' }}>Distribuție cheltuieli</div>
            <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>{donutData.length} categorii</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 0 14px' }}>
            <DonutChart data={donutData} size={200} thickness={24}/>
          </div>
          {/* Legend */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {donutData.slice(0, 6).map(d => {
              const pct = Math.round((d.value / total) * 100);
              return (
                <div key={d.catId} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.label}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1A3C5E' }}>{pct}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Line chart card */}
      <div style={{ padding: '0 16px 14px' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1A3C5E' }}>Evoluție 6 luni</div>
              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500, marginTop: 2 }}>Venituri vs. Cheltuieli</div>
            </div>
            <div style={{
              padding: '4px 8px', borderRadius: 999,
              background: diff < 0 ? '#F0FDF4' : '#FEF3C7',
              color: diff < 0 ? '#16A34A' : '#92400E',
              fontSize: 11, fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 3,
            }}>
              {diff < 0 ? '↓' : '↑'} {Math.abs(diff).toFixed(0)}%
            </div>
          </div>
          <div style={{ margin: '6px -2px 0' }}>
            <LineChart data={history} width={302} height={150}/>
          </div>
          {/* legend */}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748B' }}>
              <div style={{ width: 14, height: 3, background: '#16A34A', borderRadius: 2 }}/>
              Venituri
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748B' }}>
              <div style={{ width: 14, height: 3, background: '#EA580C', borderRadius: 2 }}/>
              Cheltuieli
            </div>
          </div>
        </Card>
      </div>

      {/* Top categories list */}
      <div style={{ padding: '0 16px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 4px 10px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1A3C5E' }}>Top categorii</div>
          <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>Mai 2026</div>
        </div>
        <Card style={{ padding: 4 }}>
          {donutData.slice(0, 5).map((d, i) => {
            const pct = (d.value / total) * 100;
            return (
              <div key={d.catId} style={{
                padding: '12px 14px',
                borderBottom: i < 4 ? '1px solid #F1F5F9' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 7 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: d.color + '1A',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16,
                  }}>{d.icon}</div>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1A3C5E' }}>{d.label}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{Math.round(pct)}% din total</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1A3C5E', letterSpacing: -0.3 }}>
                      {d.value.toLocaleString('ro-RO', { maximumFractionDigits: 0 })} <span style={{ fontSize: 11, fontWeight: 500, color: '#94A3B8' }}>lei</span>
                    </div>
                  </div>
                </div>
                <div style={{ paddingLeft: 48 }}>
                  <ProgressBar value={pct} max={100} color={d.color} height={5}/>
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Insights card */}
      <div style={{ padding: '0 16px' }}>
        <Card style={{
          background: 'linear-gradient(135deg, #1A3C5E 0%, #2563EB 100%)',
          color: '#fff', border: 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14,
            }}>💡</div>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.3 }}>INSIGHT</div>
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.4, marginBottom: 8 }}>
            Cheltuielile pentru <span style={{ background: 'rgba(255,255,255,0.2)', padding: '1px 6px', borderRadius: 6 }}>Mâncare</span> au scăzut cu 12% față de luna trecută. Felicitări! 🎉
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>
            Continuă în acest ritm și vei economisi ~480 lei până la finalul anului.
          </div>
        </Card>
      </div>
    </div>
  );
}

window.ReportsScreen = ReportsScreen;
