'use client';

import React from 'react';
import { MF_HELPERS } from '@/components/data';
import { ScreenHeader, Card } from '@/components/PhoneShell';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTransactions } from '@/components/TransactionsContext';
import { useBudgets } from '@/components/BudgetsContext';
import AddBudgetSheet from '@/components/screens/AddBudgetSheet';
import type { BudgetItem } from '@/components/BudgetsContext';
import { cn } from '@/lib/utils';

export default function BudgetScreen() {
  const [reveal, setReveal] = React.useState(0);
  const [addOpen, setAddOpen] = React.useState(false);
  const [editBudget, setEditBudget] = React.useState<BudgetItem | null>(null);

  const { transactions: txs, loading: txLoading } = useTransactions();
  const { budgets, loading: budgetsLoading } = useBudgets();
  const loading = txLoading || budgetsLoading;

  React.useEffect(() => {
    if (loading) return;
    setReveal(0);
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1000);
      setReveal(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [loading]);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <span className="text-sm text-muted-foreground">Se încarcă...</span>
    </div>
  );

  const { catById } = MF_HELPERS;

  const spendByCat: Record<string, number> = {};
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
  const pct = totalLimit > 0 ? Math.round((totalUsed / totalLimit) * 100) : 0;

  const size = 180, thickness = 14;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div className="mf-screen">
      <ScreenHeader
        title="Buget"
        subtitle="Mai 2026"
        right={
          <Button
            onClick={() => setAddOpen(true)}
            size="sm"
            className="text-xs font-semibold shadow-[0_4px_14px_oklch(0.62_0.21_264_/_30%)] flex items-center gap-1"
          >
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Adaugă
          </Button>
        }
      />

      {/* Donut overview */}
      <div className="px-4 pb-3.5">
        <Card className="border-border/80" style={{ padding: 22 }}>
          <div className="flex items-center gap-5">
            <div className="relative shrink-0" style={{ width: size, height: size }}>
              <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="oklch(1 0 0 / 6%)" strokeWidth={thickness}/>
                <circle cx={size/2} cy={size/2} r={r} fill="none"
                  stroke="url(#dkGrad)" strokeWidth={thickness} strokeLinecap="round"
                  strokeDasharray={`${totalLimit > 0 ? c * (totalUsed/totalLimit) * reveal : 0} ${c}`}
                />
                <defs>
                  <linearGradient id="dkGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#3b82f6"/>
                    <stop offset="100%" stopColor="#10b981"/>
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-[36px] font-bold text-foreground tracking-tight leading-none">{Math.round(pct * reveal)}%</p>
                <p className="text-[11px] text-muted-foreground font-medium mt-0.5">utilizat</p>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-muted-foreground font-semibold tracking-widest uppercase">Rămas</p>
              <p className="text-[26px] font-bold text-emerald-400 tracking-tight mt-0.5">
                {remaining.toLocaleString('ro-RO', { maximumFractionDigits: 0 })}
                <span className="text-sm font-medium text-muted-foreground"> lei</span>
              </p>
              <div className="mt-3 bg-muted/40 rounded-xl px-3 py-2 border border-border/50">
                <p className="text-[10px] text-muted-foreground font-medium">Buget total</p>
                <p className="text-base font-bold text-foreground mt-0.5">{totalLimit.toLocaleString('ro-RO')} lei</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* On-track banner */}
      {remaining >= 0 && (
        <div className="px-4 pb-3.5">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 px-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4M12 22a10 10 0 110-20 10 10 0 010 20z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-400">Ești pe drumul cel bun!</p>
              <p className="text-xs text-emerald-500/80 mt-0.5">
                Ai economisit {remaining.toLocaleString('ro-RO', { maximumFractionDigits: 0 })} lei din buget până acum.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Category budgets */}
      <div className="px-4">
        <p className="text-sm font-bold text-foreground px-1 pb-2.5">Pe categorii</p>
        {items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">Niciun buget configurat</div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {items.map((item) => {
              const itemPct = (item.used / item.limit) * 100;
              const over = itemPct > 100;
              const warn = itemPct >= 80 && !over;
              const indicatorColor = over ? '#f87171' : warn ? '#fb923c' : item.cat.color;
              return (
                <Card
                  key={item.catId}
                  style={{ padding: 14 }}
                  onClick={() => setEditBudget(item)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-[42px] h-[42px] rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: item.cat.color + '22' }}>{item.cat.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-foreground">{item.cat.name}</span>
                        <Badge variant="outline" className={cn(
                          'text-[11px] font-bold',
                          over ? 'bg-red-500/10 text-red-400 border-red-500/30'
                            : warn ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        )}>{Math.round(itemPct)}%</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        <span className="font-semibold text-foreground">{item.used.toLocaleString('ro-RO', { maximumFractionDigits: 0 })} lei</span>
                        {' '}/ {item.limit.toLocaleString('ro-RO')} lei
                      </p>
                    </div>
                  </div>
                  <Progress
                    value={Math.min(itemPct, 100)}
                    className="h-1.5"
                    style={{ '--progress-color': indicatorColor } as React.CSSProperties}
                  />
                  {over && (
                    <p className="mt-2 text-xs text-red-400 font-semibold flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M6 3v4M6 8.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      Depășit cu {(item.used - item.limit).toLocaleString('ro-RO', { maximumFractionDigits: 0 })} lei
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        <button
          onClick={() => setAddOpen(true)}
          className="w-full mt-3 bg-transparent border border-dashed border-border rounded-2xl py-3.5 flex items-center justify-center gap-2 cursor-pointer text-sm font-semibold text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          Adaugă categorie de buget
        </button>
      </div>

      <AddBudgetSheet
        open={addOpen || !!editBudget}
        onClose={() => { setAddOpen(false); setEditBudget(null); }}
        editBudget={editBudget}
      />
    </div>
  );
}
