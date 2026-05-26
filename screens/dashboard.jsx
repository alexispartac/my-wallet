// Dashboard screen

function DashboardScreen({ onNav, onAdd }) {
  const txs = window.MF_TRANSACTIONS;
  const cats = window.MF_CATEGORIES;
  const budgets = window.MF_BUDGETS;
  const { formatRON, catById, dayLabel } = window.MF_HELPERS;

  const income  = txs.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
  const expense = txs.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
  const sold = income - expense;

  // Spend per category (expense only)
  const spendByCat = {};
  txs.filter(t => t.type === 'expense').forEach(t => {
    spendByCat[t.catId] = (spendByCat[t.catId] || 0) + t.amount;
  });

  const totalBudget = budgets.reduce((a, b) => a + b.limit, 0);
  const budgetUsed = budgets.reduce((a, b) => a + (spendByCat[b.catId] || 0), 0);
  const budgetPct  = Math.round((budgetUsed / totalBudget) * 100);

  // Alerts: categories ≥ 80%
  const alerts = budgets
    .map(b => ({ ...b, used: spendByCat[b.catId] || 0, cat: catById(b.catId) }))
    .filter(b => (b.used / b.limit) >= 0.8)
    .sort((a, b) => (b.used / b.limit) - (a.used / a.limit));

  const recent = [...txs].sort((a, b) => b.date - a.date).slice(0, 4);

  return (
    <div style={{ paddingBottom: 120 }}>
      {/* Gradient hero */}
      <div style={{
        background: 'linear-gradient(160deg, #1A3C5E 0%, #2563EB 100%)',
        padding: '14px 20px 30px',
        borderRadius: '0 0 28px 28px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* decorative orbs */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }}/>
        <div style={{ position: 'absolute', bottom: -50, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}/>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Bună dimineața, Andrei 👋</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', fontWeight: 600, marginTop: 2 }}>Mai 2026</div>
          </div>
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.2)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="18" cy="6" r="3" fill="#EA580C" stroke="#fff" strokeWidth="1.5"/>
            </svg>
          </div>
        </div>

        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: 500, letterSpacing: 0.3 }}>
          Sold disponibil
        </div>
        <div style={{
          fontSize: 44, fontWeight: 700, color: '#fff', letterSpacing: -1.2,
          marginTop: 2, lineHeight: 1.05,
        }}>
          {formatRON(sold).replace(' lei', '')}
          <span style={{ fontSize: 18, fontWeight: 500, color: 'rgba(255,255,255,0.7)', marginLeft: 6 }}>lei</span>
        </div>

        {/* Income / Expense pills */}
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <div style={{
            flex: 1,
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(10px)',
            borderRadius: 14, padding: '10px 12px',
            border: '1px solid rgba(255,255,255,0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: 'rgba(34,197,94,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="11" height="11" viewBox="0 0 12 12"><path d="M6 9V3M3 6l3-3 3 3" stroke="#86EFAC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>Venituri</div>
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginTop: 4, letterSpacing: -0.3 }}>
              +{income.toLocaleString('ro-RO')} <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>lei</span>
            </div>
          </div>
          <div style={{
            flex: 1,
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(10px)',
            borderRadius: 14, padding: '10px 12px',
            border: '1px solid rgba(255,255,255,0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: 'rgba(251,146,60,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="11" height="11" viewBox="0 0 12 12"><path d="M6 3v6M3 6l3 3 3-3" stroke="#FDBA74" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>Cheltuieli</div>
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginTop: 4, letterSpacing: -0.3 }}>
              −{Math.round(expense).toLocaleString('ro-RO')} <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>lei</span>
            </div>
          </div>
        </div>
      </div>

      {/* Budget progress card */}
      <div style={{ padding: '16px 16px 0' }}>
        <Card onClick={() => onNav('budget')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Buget lunar</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#1A3C5E', marginTop: 2, letterSpacing: -0.5 }}>
                {Math.round(budgetUsed).toLocaleString('ro-RO')}
                <span style={{ fontSize: 14, fontWeight: 500, color: '#94A3B8' }}> / {totalBudget.toLocaleString('ro-RO')} lei</span>
              </div>
            </div>
            <div style={{
              padding: '4px 10px',
              borderRadius: 999,
              background: budgetPct >= 80 ? '#FEF3C7' : '#DCFCE7',
              color: budgetPct >= 80 ? '#92400E' : '#166534',
              fontSize: 12, fontWeight: 700,
            }}>
              {budgetPct}%
            </div>
          </div>
          <ProgressBar value={budgetUsed} max={totalBudget} color="linear-gradient(90deg, #16A34A, #22C55E)" height={10}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>În ritm bun pentru luna asta 🎯</div>
            <div style={{ fontSize: 11, color: '#16A34A', fontWeight: 600 }}>
              Mai ai {Math.round(totalBudget - budgetUsed).toLocaleString('ro-RO')} lei
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div style={{ padding: '14px 16px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '0 4px' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1A3C5E' }}>Atenție 🚨</div>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4, marginRight: -16, paddingRight: 16, scrollbarWidth: 'none' }}>
            {alerts.map((a, i) => {
              const pct = Math.round((a.used / a.limit) * 100);
              const over = pct >= 100;
              return (
                <div key={i} style={{
                  minWidth: 180, flexShrink: 0,
                  background: over ? '#FEF2F2' : '#FFF7ED',
                  border: `1px solid ${over ? '#FECACA' : '#FED7AA'}`,
                  borderRadius: 16, padding: 12,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 10,
                      background: a.cat.color + '22',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16,
                    }}>{a.cat.icon}</div>
                    <div>
                      <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>{a.cat.name}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: over ? '#DC2626' : '#EA580C' }}>{pct}% utilizat</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <ProgressBar value={a.used} max={a.limit} color={over ? '#DC2626' : '#EA580C'} height={5}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div style={{ padding: '14px 16px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            { icon: '💸', label: 'Cheltuială', color: '#EA580C', bg: '#FFF7ED', onClick: onAdd },
            { icon: '💰', label: 'Venit', color: '#16A34A', bg: '#F0FDF4', onClick: onAdd },
            { icon: '🎯', label: 'Buget', color: '#2563EB', bg: '#EFF6FF', onClick: () => onNav('budget') },
          ].map((q, i) => (
            <button key={i} onClick={q.onClick} style={{
              background: q.bg, border: 'none', borderRadius: 14,
              padding: '12px 6px', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            }}>
              <div style={{ fontSize: 22 }}>{q.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: q.color }}>{q.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent transactions */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, padding: '0 4px' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1A3C5E' }}>Ultimele tranzacții</div>
          <button onClick={() => onNav('transactions')} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 600, color: '#2563EB',
          }}>Vezi toate →</button>
        </div>
        <Card style={{ padding: 4 }}>
          {recent.map((t, i) => {
            const cat = catById(t.catId);
            return (
              <div key={t.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px',
                borderBottom: i < recent.length - 1 ? '1px solid #F1F5F9' : 'none',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: cat.color + '1A',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18,
                }}>{cat.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1A3C5E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.merchant}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{dayLabel(t.date)} · {cat.name}</div>
                </div>
                <div style={{
                  fontSize: 14, fontWeight: 700, letterSpacing: -0.3,
                  color: t.type === 'income' ? '#16A34A' : '#1A3C5E',
                }}>
                  {t.type === 'income' ? '+' : '−'}{t.amount.toLocaleString('ro-RO', { minimumFractionDigits: 2 })}
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}

window.DashboardScreen = DashboardScreen;
