'use client';

import React from 'react';
import { MF_HELPERS } from '@/components/data';
import { Card } from '@/components/PhoneShell';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTransactions } from '@/components/TransactionsContext';
import { useBudgets } from '@/components/BudgetsContext';
import { cn } from '@/lib/utils';

interface DashboardScreenProps {
  onNav: (tab: string) => void;
  onAdd: () => void;
}

export default function DashboardScreen({ onNav, onAdd }: DashboardScreenProps) {
  const [notifOpen, setNotifOpen] = React.useState(false);
  const { transactions: txs, loading: txLoading } = useTransactions();
  const { budgets, loading: budgetsLoading } = useBudgets();
  const loading = txLoading || budgetsLoading;

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <span className="text-sm text-muted-foreground">Se încarcă...</span>
    </div>
  );

  const { formatRON, catById, dayLabel } = MF_HELPERS;

  const income  = txs.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
  const expense = txs.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
  const sold = income - expense;

  const spendByCat: Record<string, number> = {};
  txs.filter(t => t.type === 'expense').forEach(t => {
    spendByCat[t.catId] = (spendByCat[t.catId] || 0) + t.amount;
  });

  const totalBudget = budgets.reduce((a, b) => a + b.limit, 0);
  const budgetUsed  = budgets.reduce((a, b) => a + (spendByCat[b.catId] || 0), 0);
  const budgetPct   = totalBudget > 0 ? Math.round((budgetUsed / totalBudget) * 100) : 0;

  const alerts = budgets
    .map(b => ({ ...b, used: spendByCat[b.catId] || 0, cat: catById(b.catId) }))
    .filter(b => (b.used / b.limit) >= 0.8)
    .sort((a, b) => (b.used / b.limit) - (a.used / a.limit));

  const recent = [...txs].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 4);

  return (
    <div className="mf-screen">
      {/* Hero */}
      <div className="relative overflow-hidden px-5 pt-4 pb-8 rounded-b-[28px]"
        style={{ background: 'linear-gradient(160deg, #0f1d3a 0%, #1e3a8a 60%, #2563EB 100%)' }}>
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/[0.04]"/>
        <div className="absolute -bottom-12 -left-8 w-32 h-32 rounded-full bg-blue-400/[0.08]"/>

        <div className="flex justify-between items-center mb-5 relative">
          <div>
            <p className="text-xs text-white/60 font-medium">Bună ziua, Andrei 👋</p>
            <p className="text-sm text-white/80 font-semibold mt-0.5">Mai 2026</p>
          </div>
          <button
            onClick={() => setNotifOpen(v => !v)}
            className={cn(
              'w-9 h-9 rounded-full border border-white/15 cursor-pointer flex items-center justify-center relative transition-colors',
              notifOpen ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'
            )}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {alerts.length > 0 && (
              <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-orange-400 border border-[#1e3a8a]"/>
            )}
          </button>
        </div>

        <p className="text-[11px] text-white/50 font-medium tracking-widest uppercase relative">Sold disponibil</p>
        <p className="text-[46px] font-bold text-white tracking-tight leading-none mt-1 relative">
          {formatRON(sold).replace(' lei', '')}
          <span className="text-xl font-medium text-white/50 ml-2">lei</span>
        </p>

        <div className="flex gap-2.5 mt-5 relative">
          {[
            { label: 'Venituri', value: `+${income.toLocaleString('ro-RO')}`, color: '#4ade80', bg: 'rgba(74,222,128,0.12)' },
            { label: 'Cheltuieli', value: `−${Math.round(expense).toLocaleString('ro-RO')}`, color: '#fb923c', bg: 'rgba(251,146,60,0.12)' },
          ].map(item => (
            <div key={item.label}
              className="flex-1 rounded-2xl p-3 border border-white/10"
              style={{ background: item.bg }}>
              <p className="text-[10px] font-semibold tracking-wide" style={{ color: item.color + 'CC' }}>{item.label}</p>
              <p className="text-[17px] font-bold text-white mt-1 tracking-tight">
                {item.value}
                <span className="text-[11px] font-normal text-white/40 ml-1">lei</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications panel */}
      {notifOpen && (
        <>
          <div onClick={() => setNotifOpen(false)} className="fixed inset-0 z-50"/>
          <div className="fixed top-20 right-4 z-[51] w-72 bg-card border border-border rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-[mfFade_180ms_ease-out]">
            <div className="px-4 pt-3 pb-2 text-xs font-bold text-foreground border-b border-border flex items-center gap-2 uppercase tracking-wider">
              Notificări
              {alerts.length > 0 && (
                <Badge variant="secondary" className="text-[10px] px-1.5 h-4 bg-orange-500/20 text-orange-400 border-orange-500/30">
                  {alerts.length}
                </Badge>
              )}
            </div>
            {alerts.length === 0 ? (
              <div className="px-4 py-5 text-sm text-muted-foreground text-center">Totul e în regulă! 🎉</div>
            ) : alerts.map((a, i) => {
              const pct = Math.round((a.used / a.limit) * 100);
              const over = pct >= 100;
              return (
                <div
                  key={i}
                  onClick={() => { onNav('budget'); setNotifOpen(false); }}
                  className={cn('px-4 py-2.5 cursor-pointer flex items-center gap-2.5 hover:bg-muted/50 transition-colors', i < alerts.length - 1 && 'border-b border-border/50')}
                >
                  <span className="text-xl">{a.cat.icon}</span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-foreground">{a.cat.name}</p>
                    <p className={cn('text-[11px] font-medium', over ? 'text-red-400' : 'text-orange-400')}>
                      {over ? `Depășit cu ${(a.used - a.limit).toLocaleString('ro-RO', { maximumFractionDigits: 0 })} lei` : `${pct}% utilizat`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Budget overview */}
      <div className="px-4 pt-4">
        <Card onClick={() => onNav('budget')}>
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Buget lunar</p>
              <p className="text-[22px] font-bold text-foreground mt-0.5 tracking-tight">
                {Math.round(budgetUsed).toLocaleString('ro-RO')}
                <span className="text-sm font-medium text-muted-foreground"> / {totalBudget.toLocaleString('ro-RO')} lei</span>
              </p>
            </div>
            <Badge variant="outline" className={cn(
              'text-xs font-bold border',
              budgetPct >= 80
                ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            )}>
              {budgetPct}%
            </Badge>
          </div>
          <Progress value={budgetPct} className="h-2" style={{ '--progress-color': budgetPct >= 80 ? '#f97316' : '#10b981' } as React.CSSProperties} />
          <div className="flex justify-between mt-2">
            <span className="text-[11px] text-muted-foreground">În ritm bun pentru luna asta 🎯</span>
            <span className="text-[11px] text-emerald-400 font-semibold">
              +{Math.round(totalBudget - budgetUsed).toLocaleString('ro-RO')} lei rămas
            </span>
          </div>
        </Card>
      </div>

      {/* Alerts strip */}
      {alerts.length > 0 && (
        <div className="pt-3.5 px-4">
          <p className="text-sm font-bold text-foreground mb-2 px-1">Atenție 🚨</p>
          <div className="flex gap-2 overflow-x-auto pb-1 -mr-4 pr-4 scrollbar-none">
            {alerts.map((a, i) => {
              const pct = Math.round((a.used / a.limit) * 100);
              const over = pct >= 100;
              return (
                <div
                  key={i}
                  onClick={() => onNav('budget')}
                  className={cn(
                    'min-w-[172px] shrink-0 cursor-pointer rounded-2xl p-3 border transition-colors',
                    over
                      ? 'bg-red-500/10 border-red-500/20 hover:bg-red-500/15'
                      : 'bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/15'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-[10px] flex items-center justify-center text-base" style={{ background: a.cat.color + '22' }}>{a.cat.icon}</div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">{a.cat.name}</p>
                      <p className={cn('text-sm font-bold', over ? 'text-red-400' : 'text-orange-400')}>{pct}%</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Progress value={Math.min(pct, 100)} className="h-1" style={{ '--progress-color': over ? '#f87171' : '#fb923c' } as React.CSSProperties} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="px-4 pt-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: '💸', label: 'Cheltuială', color: 'text-orange-400', bg: 'bg-orange-500/10 hover:bg-orange-500/15', onClick: onAdd },
            { icon: '💰', label: 'Venit',       color: 'text-emerald-400', bg: 'bg-emerald-500/10 hover:bg-emerald-500/15', onClick: onAdd },
            { icon: '🎯', label: 'Buget',        color: 'text-primary',  bg: 'bg-primary/10 hover:bg-primary/15',   onClick: () => onNav('budget') },
          ].map((q, i) => (
            <button
              key={i}
              onClick={q.onClick}
              className={cn('rounded-2xl py-3.5 px-1.5 border-none cursor-pointer flex flex-col items-center gap-1.5 transition-colors', q.bg)}
            >
              <span className="text-2xl">{q.icon}</span>
              <span className={cn('text-[11px] font-semibold', q.color)}>{q.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="px-4 pt-5">
        <div className="flex justify-between items-center mb-2.5 px-1">
          <span className="text-sm font-bold text-foreground">Ultimele tranzacții</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNav('transactions')}
            className="text-primary text-xs font-semibold h-auto py-0 px-0 hover:text-primary/80 hover:bg-transparent"
          >
            Vezi toate →
          </Button>
        </div>
        <Card style={{ padding: 4 }}>
          {recent.length === 0 ? (
            <div className="py-5 text-center text-sm text-muted-foreground">Nicio tranzacție încă</div>
          ) : recent.map((t, i) => {
            const cat = catById(t.catId);
            return (
              <div
                key={t.id}
                className={cn('flex items-center gap-3 px-3.5 py-3', i < recent.length - 1 && 'border-b border-border/50')}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: cat.color + '22' }}>{cat.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{t.merchant}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{dayLabel(t.date)} · {cat.name}</p>
                </div>
                <span className={cn('text-sm font-bold tracking-tight', t.type === 'income' ? 'text-emerald-400' : 'text-foreground')}>
                  {t.type === 'income' ? '+' : '−'}{t.amount.toLocaleString('ro-RO', { minimumFractionDigits: 2 })}
                </span>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}
