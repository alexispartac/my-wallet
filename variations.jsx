// Dashboard variations — 4 visual directions

const VAR_DATA = () => {
  const txs = window.MF_TRANSACTIONS;
  const { catById, dayLabel } = window.MF_HELPERS;
  const income  = txs.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
  const expense = txs.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
  const sold = income - expense;
  const recent = [...txs].sort((a, b) => b.date - a.date).slice(0, 4);
  return { sold, income, expense, recent, catById, dayLabel };
};

// ─────────────────────────────────────────────────────────────
// V1 — Classic Fintech (original, deep blue + green)
// ─────────────────────────────────────────────────────────────
function DashV1_Classic() {
  const { sold, income, expense, recent, catById, dayLabel } = VAR_DATA();
  return (
    <div style={{
      width: 390, height: 844, background: '#F8FAFC',
      fontFamily: "'Inter', system-ui", overflow: 'hidden',
      borderRadius: 48, position: 'relative',
      paddingTop: 48,
    }}>
      <div style={{
        background: 'linear-gradient(160deg, #1A3C5E 0%, #2563EB 100%)',
        padding: '14px 20px 30px', borderRadius: '0 0 28px 28px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }}/>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Bună dimineața, Andrei 👋</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: 500, marginTop: 14 }}>Sold disponibil</div>
        <div style={{ fontSize: 44, fontWeight: 700, color: '#fff', letterSpacing: -1.2, marginTop: 2 }}>
          {sold.toLocaleString('ro-RO', { maximumFractionDigits: 2 })}
          <span style={{ fontSize: 18, fontWeight: 500, color: 'rgba(255,255,255,0.7)', marginLeft: 6 }}>lei</span>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          {[
            { c: '#86EFAC', l: 'Venituri', v: income, p: '+' },
            { c: '#FDBA74', l: 'Cheltuieli', v: expense, p: '−' },
          ].map((x, i) => (
            <div key={i} style={{ flex: 1, background: 'rgba(255,255,255,0.12)', borderRadius: 14, padding: '10px 12px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>{x.l}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginTop: 4 }}>{x.p}{Math.round(x.v).toLocaleString('ro-RO')}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ background: '#fff', borderRadius: 18, padding: 16, border: '1px solid #F1F5F9', boxShadow: '0 1px 2px rgba(15,23,42,0.03)' }}>
          <div style={{ fontSize: 13, color: '#64748B' }}>Buget lunar</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1A3C5E', marginTop: 2 }}>3 858 <span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500 }}>/ 5 100 lei</span></div>
          <div style={{ background: '#F1F5F9', height: 10, borderRadius: 999, marginTop: 10, overflow: 'hidden' }}>
            <div style={{ width: '76%', height: '100%', background: 'linear-gradient(90deg, #16A34A, #22C55E)' }}/>
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1A3C5E', marginBottom: 10 }}>Ultimele tranzacții</div>
          <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #F1F5F9', overflow: 'hidden' }}>
            {recent.slice(0, 3).map((t, i) => {
              const cat = catById(t.catId);
              return (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderBottom: i < 2 ? '1px solid #F1F5F9' : 'none' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 11, background: cat.color + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>{cat.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1A3C5E' }}>{t.merchant}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>{dayLabel(t.date)} · {cat.name}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: t.type === 'income' ? '#16A34A' : '#1A3C5E' }}>
                    {t.type === 'income' ? '+' : '−'}{t.amount.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// V2 — Warm Daylight (cream + terracotta, soft, friendly)
// ─────────────────────────────────────────────────────────────
function DashV2_Warm() {
  const { sold, income, expense, recent, catById, dayLabel } = VAR_DATA();
  return (
    <div style={{
      width: 390, height: 844, background: '#FBF6EF',
      fontFamily: "'Geist', 'Inter', system-ui", overflow: 'hidden',
      borderRadius: 48, position: 'relative',
      paddingTop: 56, color: '#3D2C1F',
    }}>
      <div style={{ padding: '0 22px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12, color: '#A47C5B', fontWeight: 500 }}>Mai 2026</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 2, letterSpacing: -0.4 }}>Bună, Andrei.</div>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E8896B', border: '2px solid #FBF6EF', boxShadow: '0 4px 10px rgba(232,137,107,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>AP</div>
      </div>

      <div style={{ padding: '0 22px' }}>
        <div style={{
          background: 'linear-gradient(160deg, #FFE9D6 0%, #F5C9A1 100%)',
          borderRadius: 28, padding: 24, position: 'relative', overflow: 'hidden',
          border: '1px solid rgba(232,137,107,0.2)',
        }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(232,137,107,0.15)' }}/>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#A0623F', letterSpacing: 0.5, textTransform: 'uppercase' }}>Sold disponibil</div>
          <div style={{ fontSize: 42, fontWeight: 700, marginTop: 4, letterSpacing: -1.2, color: '#3D2C1F' }}>
            {Math.round(sold).toLocaleString('ro-RO')}
            <span style={{ fontSize: 18, fontWeight: 500, color: '#A0623F', marginLeft: 4 }}>lei</span>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.55)', borderRadius: 16, padding: '10px 12px' }}>
              <div style={{ fontSize: 11, color: '#A0623F' }}>↑ Venituri</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginTop: 3, color: '#5D8C3E' }}>+{Math.round(income).toLocaleString('ro-RO')}</div>
            </div>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.55)', borderRadius: 16, padding: '10px 12px' }}>
              <div style={{ fontSize: 11, color: '#A0623F' }}>↓ Cheltuieli</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginTop: 3, color: '#C04A1F' }}>−{Math.round(expense).toLocaleString('ro-RO')}</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16, background: '#fff', borderRadius: 22, padding: 18, border: '1px solid #F0E4D2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <div style={{ fontSize: 12, color: '#A47C5B' }}>Buget lunar</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginTop: 2 }}>3 858 <span style={{ fontSize: 12, color: '#A47C5B', fontWeight: 500 }}>/ 5 100 lei</span></div>
            </div>
            <div style={{ background: '#FFE9D6', color: '#C04A1F', padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>76%</div>
          </div>
          <div style={{ background: '#FBF6EF', height: 8, borderRadius: 999, marginTop: 12, overflow: 'hidden' }}>
            <div style={{ width: '76%', height: '100%', background: 'linear-gradient(90deg, #E8896B, #C04A1F)' }}/>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: '#3D2C1F' }}>Activitate recentă</div>
          <div style={{ background: '#fff', borderRadius: 22, border: '1px solid #F0E4D2', overflow: 'hidden' }}>
            {recent.slice(0, 3).map((t, i) => {
              const cat = catById(t.catId);
              return (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderBottom: i < 2 ? '1px solid #F5EDD8' : 'none' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 12, background: '#FBF6EF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{cat.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{t.merchant}</div>
                    <div style={{ fontSize: 11, color: '#A47C5B' }}>{dayLabel(t.date)}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: t.type === 'income' ? '#5D8C3E' : '#3D2C1F' }}>
                    {t.type === 'income' ? '+' : '−'}{t.amount.toFixed(0)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// V3 — Midnight (dark-first, neon accents, glassy)
// ─────────────────────────────────────────────────────────────
function DashV3_Midnight() {
  const { sold, income, expense, recent, catById, dayLabel } = VAR_DATA();
  return (
    <div style={{
      width: 390, height: 844,
      background: 'radial-gradient(ellipse at top, #1E1B3A 0%, #0A0817 100%)',
      fontFamily: "'Inter', system-ui", overflow: 'hidden',
      borderRadius: 48, position: 'relative',
      paddingTop: 48, color: '#fff',
    }}>
      {/* glow */}
      <div style={{ position: 'absolute', top: 100, left: -50, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, #6366F1 0%, transparent 70%)', opacity: 0.4, filter: 'blur(40px)' }}/>
      <div style={{ position: 'absolute', top: 60, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, #14B8A6 0%, transparent 70%)', opacity: 0.3, filter: 'blur(40px)' }}/>

      <div style={{ padding: '14px 22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
        <div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 500, letterSpacing: 0.3 }}>SOLD CURENT</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>Mai 2026</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2"/><path d="M21 21l-5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
            <div style={{ position: 'absolute', top: 8, right: 8, width: 7, height: 7, borderRadius: '50%', background: '#14B8A6', boxShadow: '0 0 8px #14B8A6' }}/>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 22px 0', position: 'relative' }}>
        <div style={{
          fontSize: 56, fontWeight: 700, letterSpacing: -2,
          background: 'linear-gradient(135deg, #14B8A6 0%, #6366F1 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          lineHeight: 1,
        }}>
          {Math.round(sold).toLocaleString('ro-RO')}
        </div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 4, fontWeight: 500 }}>lei disponibili</div>

        <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
          <div style={{ flex: 1, background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.3)', borderRadius: 16, padding: '12px 14px', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: 10, color: '#5EEAD4', letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600 }}>+ Venit</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4, color: '#fff' }}>{Math.round(income).toLocaleString('ro-RO')}</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(244,114,182,0.1)', border: '1px solid rgba(244,114,182,0.3)', borderRadius: 16, padding: '12px 14px', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: 10, color: '#F9A8D4', letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600 }}>− Cheltuit</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4, color: '#fff' }}>{Math.round(expense).toLocaleString('ro-RO')}</div>
          </div>
        </div>

        <div style={{ marginTop: 18, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 16, backdropFilter: 'blur(10px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Buget lunar</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#5EEAD4' }}>76%</div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 2 }}>3 858 <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>/ 5 100</span></div>
          <div style={{ background: 'rgba(255,255,255,0.08)', height: 6, borderRadius: 999, marginTop: 10, overflow: 'hidden' }}>
            <div style={{ width: '76%', height: '100%', background: 'linear-gradient(90deg, #14B8A6, #6366F1)', boxShadow: '0 0 12px rgba(20,184,166,0.6)' }}/>
          </div>
        </div>

        <div style={{ marginTop: 18, fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600 }}>Recent</div>
        <div style={{ marginTop: 8 }}>
          {recent.slice(0, 3).map((t, i) => {
            const cat = catById(t.catId);
            return (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>{cat.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{t.merchant}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{dayLabel(t.date)}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: t.type === 'income' ? '#5EEAD4' : '#fff' }}>
                  {t.type === 'income' ? '+' : '−'}{t.amount.toFixed(0)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// V4 — Editorial Banking (typographic, mono numbers, serif headlines)
// ─────────────────────────────────────────────────────────────
function DashV4_Editorial() {
  const { sold, income, expense, recent, catById, dayLabel } = VAR_DATA();
  return (
    <div style={{
      width: 390, height: 844, background: '#FAFAF7',
      fontFamily: "'Inter', system-ui", overflow: 'hidden',
      borderRadius: 48, position: 'relative',
      paddingTop: 56, color: '#111',
    }}>
      <div style={{ padding: '0 24px', borderBottom: '1px solid #E5E5E0', paddingBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>MoneyFlow</div>
        <div style={{ fontSize: 10, color: '#666', fontFamily: "'IBM Plex Mono', monospace" }}>24.05.2026</div>
      </div>

      <div style={{ padding: '32px 24px 0' }}>
        <div style={{ fontSize: 10, color: '#999', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>Sold disponibil — Mai 2026</div>
        <div style={{
          fontSize: 56, fontWeight: 300, letterSpacing: -2.5, marginTop: 8,
          fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1,
        }}>
          {Math.round(sold).toLocaleString('ro-RO').replace(/\s/g, ' ')}
        </div>
        <div style={{ fontSize: 13, color: '#666', marginTop: 6, fontFamily: "'IBM Plex Mono', monospace" }}>RON · Lei</div>

        <div style={{ borderTop: '1px solid #111', marginTop: 28, paddingTop: 18, display: 'grid', gridTemplateColumns: '1fr 1px 1fr' }}>
          <div>
            <div style={{ fontSize: 9, color: '#999', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>Venituri</div>
            <div style={{ fontSize: 22, fontWeight: 400, marginTop: 4, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: -0.5 }}>
              +{Math.round(income).toLocaleString('ro-RO')}
            </div>
            <div style={{ fontSize: 10, color: '#999', marginTop: 4, fontFamily: "'IBM Plex Mono', monospace" }}>2 surse</div>
          </div>
          <div style={{ background: '#E5E5E0' }}/>
          <div style={{ paddingLeft: 20 }}>
            <div style={{ fontSize: 9, color: '#999', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>Cheltuieli</div>
            <div style={{ fontSize: 22, fontWeight: 400, marginTop: 4, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: -0.5 }}>
              −{Math.round(expense).toLocaleString('ro-RO')}
            </div>
            <div style={{ fontSize: 10, color: '#999', marginTop: 4, fontFamily: "'IBM Plex Mono', monospace" }}>23 tranzacții</div>
          </div>
        </div>

        <div style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid #111', paddingBottom: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: -0.2 }}>Buget consumat</div>
            <div style={{ fontSize: 10, fontFamily: "'IBM Plex Mono', monospace" }}>76% / 100%</div>
          </div>
          <div style={{ display: 'flex', gap: 1, marginTop: 14 }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 28,
                background: i < 15 ? '#111' : '#E5E5E0',
              }}/>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <div style={{ fontSize: 10, color: '#666', fontFamily: "'IBM Plex Mono', monospace" }}>3 858 lei</div>
            <div style={{ fontSize: 10, color: '#666', fontFamily: "'IBM Plex Mono', monospace" }}>din 5 100 lei</div>
          </div>
        </div>

        <div style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid #111', paddingBottom: 8, marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: -0.2 }}>Tranzacții recente</div>
            <div style={{ fontSize: 10, color: '#666', fontFamily: "'IBM Plex Mono', monospace" }}>Vezi 23 →</div>
          </div>
          {recent.slice(0, 3).map((t, i) => {
            const cat = catById(t.catId);
            return (
              <div key={t.id} style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '12px 0', borderBottom: '1px solid #E5E5E0' }}>
                <div style={{ fontSize: 10, color: '#999', fontFamily: "'IBM Plex Mono', monospace", width: 30 }}>0{i+1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{t.merchant}</div>
                  <div style={{ fontSize: 11, color: '#666', marginTop: 2, fontFamily: "'IBM Plex Mono', monospace" }}>{dayLabel(t.date).toLowerCase()} · {cat.name.toLowerCase()}</div>
                </div>
                <div style={{ fontSize: 14, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500 }}>
                  {t.type === 'income' ? '+' : '−'}{t.amount.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DashV1_Classic, DashV2_Warm, DashV3_Midnight, DashV4_Editorial });
