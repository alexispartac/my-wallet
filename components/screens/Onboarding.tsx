'use client';

import React from 'react';
import { MF_CATEGORIES } from '@/components/data';

interface OnboardingProps {
  onFinish: () => void;
}

export default function Onboarding({ onFinish }: OnboardingProps) {
  const [step, setStep] = React.useState(0);
  const [income, setIncome] = React.useState('');
  const [selected, setSelected] = React.useState(new Set(['food','trans','util','fun','cafe']));
  const [budgetTemplate, setBudgetTemplate] = React.useState('50-30-20');

  const slides = [
    {
      icon: '💰',
      bg: 'linear-gradient(160deg, #1A3C5E 0%, #2563EB 100%)',
      title: 'Bani sub control,\nfără efort',
      sub: 'MoneyFlow îți arată exact unde se duc banii tăi. Clar, rapid, fără complicații.',
    },
    {
      icon: '🎯',
      bg: 'linear-gradient(160deg, #15803D 0%, #16A34A 100%)',
      title: 'Setezi un buget\no dată pe lună',
      sub: 'Aplicația urmărește automat consumul și te avertizează când o categorie e aproape de limită.',
    },
    {
      icon: '📊',
      bg: 'linear-gradient(160deg, #C2410C 0%, #EA580C 100%)',
      title: 'Înțelegi obiceiurile\nfinanciare',
      sub: 'Grafice clare, comparații lună de lună, insight-uri care contează. Nu numere goale.',
    },
  ];

  const cats = MF_CATEGORIES.filter(c => c.id !== 'salary' && c.id !== 'free');

  if (step <= 2) {
    const s = slides[step];
    return (
      <div style={{
        position: 'absolute', inset: 0,
        background: s.bg,
        color: '#fff',
        display: 'flex', flexDirection: 'column',
        padding: '70px 28px 36px',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }}/>
        <div style={{ position: 'absolute', bottom: 120, left: -60, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}/>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => setStep(3)} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600,
          }}>Sari peste</button>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
          <div key={step} style={{
            fontSize: 80, marginBottom: 28,
            animation: 'mfFloat 600ms cubic-bezier(0.16, 1, 0.3, 1)',
            filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.25))',
          }}>{s.icon}</div>
          <div style={{
            fontSize: 30, fontWeight: 700, letterSpacing: -0.8, lineHeight: 1.15,
            whiteSpace: 'pre-line', marginBottom: 14,
          }}>{s.title}</div>
          <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, maxWidth: 280 }}>
            {s.sub}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 22 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: i === step ? 22 : 7, height: 7, borderRadius: 999,
              background: i === step ? '#fff' : 'rgba(255,255,255,0.35)',
              transition: 'all 300ms',
            }}/>
          ))}
        </div>

        <button onClick={() => setStep(step + 1)} style={{
          background: '#fff',
          border: 'none', borderRadius: 16,
          padding: '15px 20px',
          fontSize: 15, fontWeight: 700,
          color: step === 0 ? '#1A3C5E' : step === 1 ? '#15803D' : '#C2410C',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          {step < 2 ? 'Continuă' : 'Începem'}
          <svg width="16" height="16" viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
        </button>
      </div>
    );
  }

  if (step === 3) {
    const press = (k: string) => {
      setIncome(prev => {
        if (k === 'back') return prev.slice(0, -1);
        if (prev === '' && k === '.') return '0.';
        if (k === '.' && prev.includes('.')) return prev;
        return prev + k;
      });
    };
    return (
      <div style={{
        position: 'absolute', inset: 0, background: '#F8FAFC',
        display: 'flex', flexDirection: 'column',
        padding: '60px 20px 28px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
          <button onClick={() => setStep(2)} style={{
            background: '#fff', border: '1px solid #F1F5F9', borderRadius: 10,
            width: 32, height: 32, cursor: 'pointer', padding: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M9 2L4 7l5 5" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
          </button>
          <div style={{ flex: 1, height: 5, background: '#E2E8F0', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: '50%', height: '100%', background: 'linear-gradient(90deg, #2563EB, #16A34A)', borderRadius: 999, transition: 'width 400ms' }}/>
          </div>
          <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>1 / 2</div>
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: '#2563EB', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 4 }}>
          Configurare
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#1A3C5E', letterSpacing: -0.5, lineHeight: 1.2 }}>
          Care e venitul tău lunar?
        </div>
        <div style={{ fontSize: 13, color: '#64748B', marginTop: 6, lineHeight: 1.45 }}>
          Folosim suma asta ca punct de plecare pentru bugetul tău. Poți schimba oricând.
        </div>

        <div style={{
          background: 'linear-gradient(160deg, #1A3C5E 0%, #2563EB 100%)',
          borderRadius: 22, padding: '28px 18px',
          textAlign: 'center', margin: '20px 0',
          color: '#fff', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }}/>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5, textTransform: 'uppercase' }}>VENIT LUNAR</div>
          <div style={{
            fontSize: 48, fontWeight: 700, letterSpacing: -1.6, marginTop: 4,
            color: '#fff', lineHeight: 1.1, position: 'relative',
          }}>
            {income || '0'}
            <span style={{ fontSize: 18, fontWeight: 500, color: 'rgba(255,255,255,0.6)', marginLeft: 6 }}>lei</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 14, justifyContent: 'center' }}>
          {['4000', '6000', '8000', '10000'].map(v => (
            <button key={v} onClick={() => setIncome(v)} style={{
              padding: '6px 12px', borderRadius: 999,
              border: '1px solid #E2E8F0', background: '#fff',
              fontSize: 12, fontWeight: 600, color: '#64748B', cursor: 'pointer',
            }}>{v}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 14 }}>
          {['1','2','3','4','5','6','7','8','9','.','0','back'].map(k => (
            <button key={k} onClick={() => press(k)} style={{
              background: '#fff', border: '1px solid #F1F5F9',
              borderRadius: 14, padding: '14px 0',
              fontSize: 22, fontWeight: 600, color: '#1A3C5E',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 1px 2px rgba(15,23,42,0.03)',
            }}>
              {k === 'back' ? (
                <svg width="22" height="15" viewBox="0 0 23 17"><path d="M7 1h13a2 2 0 012 2v11a2 2 0 01-2 2H7l-6-7.5L7 1z" fill="none" stroke="#64748B" strokeWidth="1.6" strokeLinejoin="round"/><path d="M10 5l7 7M17 5l-7 7" stroke="#64748B" strokeWidth="1.6" strokeLinecap="round"/></svg>
              ) : k}
            </button>
          ))}
        </div>

        <button onClick={() => setStep(4)} disabled={!income || parseFloat(income) < 100} style={{
          background: (!income || parseFloat(income) < 100) ? '#E2E8F0' : 'linear-gradient(135deg, #2563EB, #1D4ED8)',
          border: 'none', borderRadius: 16, padding: '15px',
          fontSize: 15, fontWeight: 700, color: '#fff', cursor: 'pointer',
          boxShadow: (!income || parseFloat(income) < 100) ? 'none' : '0 8px 20px rgba(37,99,235,0.35)',
        }}>
          Continuă
        </button>
      </div>
    );
  }

  if (step === 4) {
    const toggle = (id: string) => {
      const next = new Set(selected);
      if (next.has(id)) next.delete(id); else next.add(id);
      setSelected(next);
    };
    const incomeN = parseFloat(income) || 6800;

    const templates = [
      { id: '50-30-20',    label: 'Regula 50/30/20', sub: 'Recomandat',  needs: 0.5,  wants: 0.3,  save: 0.2  },
      { id: 'conservator', label: 'Conservator',      sub: 'Economisesc mai mult', needs: 0.6, wants: 0.15, save: 0.25 },
      { id: 'custom',      label: 'Personalizat',     sub: 'Voi seta eu', needs: null, wants: null, save: null },
    ];
    const tpl = templates.find(t => t.id === budgetTemplate)!;

    return (
      <div style={{
        position: 'absolute', inset: 0, background: '#F8FAFC',
        display: 'flex', flexDirection: 'column',
        padding: '60px 20px 28px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
          <button onClick={() => setStep(3)} style={{
            background: '#fff', border: '1px solid #F1F5F9', borderRadius: 10,
            width: 32, height: 32, cursor: 'pointer', padding: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M9 2L4 7l5 5" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
          </button>
          <div style={{ flex: 1, height: 5, background: '#E2E8F0', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #2563EB, #16A34A)', borderRadius: 999, transition: 'width 400ms' }}/>
          </div>
          <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>2 / 2</div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', marginRight: -20, paddingRight: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#16A34A', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 4 }}>
            Aproape gata
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#1A3C5E', letterSpacing: -0.5, lineHeight: 1.2 }}>
            Alege un model de buget
          </div>
          <div style={{ fontSize: 13, color: '#64748B', marginTop: 6, lineHeight: 1.45 }}>
            Îți sugerăm un punct de plecare. Modifici oricând în secțiunea Buget.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
            {templates.map(t => {
              const active = budgetTemplate === t.id;
              return (
                <button key={t.id} onClick={() => setBudgetTemplate(t.id)} style={{
                  background: '#fff',
                  border: active ? '2px solid #2563EB' : '2px solid #F1F5F9',
                  borderRadius: 14, padding: '12px 14px',
                  cursor: 'pointer', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    border: active ? '6px solid #2563EB' : '2px solid #CBD5E1',
                    transition: 'all 150ms',
                  }}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1A3C5E' }}>{t.label}</div>
                    <div style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>{t.sub}</div>
                  </div>
                  {t.needs && (
                    <div style={{ display: 'flex', gap: 4 }}>
                      <div style={{ height: 6, borderRadius: 999, width: t.needs * 60, background: '#2563EB' }}/>
                      <div style={{ height: 6, borderRadius: 999, width: (t.wants ?? 0) * 60, background: '#EA580C' }}/>
                      <div style={{ height: 6, borderRadius: 999, width: (t.save ?? 0) * 60, background: '#16A34A' }}/>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {tpl.needs && (
            <div style={{
              background: '#fff', borderRadius: 14, padding: 14,
              marginTop: 12, border: '1px solid #F1F5F9',
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 8 }}>Bazat pe {incomeN.toLocaleString('ro-RO')} lei</div>
              {[
                { label: 'Necesități', color: '#2563EB', v: tpl.needs },
                { label: 'Plăceri',    color: '#EA580C', v: tpl.wants ?? 0 },
                { label: 'Economii',   color: '#16A34A', v: tpl.save ?? 0 },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: row.color }}/>
                    <div style={{ fontSize: 13, color: '#1A3C5E', fontWeight: 600 }}>{row.label}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>{Math.round(row.v * 100)}%</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: row.color, letterSpacing: -0.2 }}>
                    {Math.round(incomeN * row.v).toLocaleString('ro-RO')} lei
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1A3C5E' }}>Categoriile tale</div>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>{selected.size} selectate</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {cats.map(c => {
                const active = selected.has(c.id);
                return (
                  <button key={c.id} onClick={() => toggle(c.id)} style={{
                    background: active ? c.color + '22' : '#fff',
                    border: active ? `2px solid ${c.color}` : '2px solid #F1F5F9',
                    borderRadius: 12, padding: '10px 4px', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                    transition: 'all 150ms',
                  }}>
                    <div style={{ fontSize: 22 }}>{c.icon}</div>
                    <div style={{
                      fontSize: 10, fontWeight: 600, color: active ? c.color : '#64748B',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%',
                    }}>{c.name}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button onClick={onFinish} style={{
          marginTop: 12,
          background: 'linear-gradient(135deg, #16A34A, #15803D)',
          border: 'none', borderRadius: 16, padding: '15px',
          fontSize: 15, fontWeight: 700, color: '#fff', cursor: 'pointer',
          boxShadow: '0 8px 20px rgba(22,163,74,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          Intră în aplicație
          <svg width="16" height="16" viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
        </button>
      </div>
    );
  }

  return null;
}
