'use client';

import React from 'react';
import { MF_HISTORY, MF_HELPERS } from '@/components/data';
import { ScreenHeader, Card } from '@/components/PhoneShell';
import { DonutChart, LineChart, ProgressBar } from '@/components/Charts';
import { useTransactions } from '@/components/TransactionsContext';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Period = 'month' | '6months' | 'year';

const PERIODS: { key: Period; label: string }[] = [
  { key: 'month',   label: 'Lună' },
  { key: '6months', label: '6 luni' },
  { key: 'year',    label: 'An' },
];

export default function ReportsScreen() {
  const [period, setPeriod] = React.useState<Period>('month');
  const { transactions: allTxs, loading } = useTransactions();
  const { catById } = MF_HELPERS;
  const history = MF_HISTORY;

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <span className="text-sm text-muted-foreground">Se încarcă...</span>
    </div>
  );

  const now = new Date();
  const txs = allTxs.filter(t => {
    if (period === 'month')   return t.date.getFullYear() === now.getFullYear() && t.date.getMonth() === now.getMonth();
    if (period === '6months') return t.date >= new Date(now.getFullYear(), now.getMonth() - 6, 1);
    return t.date.getFullYear() === now.getFullYear();
  });

  const spendByCat: Record<string, number> = {};
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

  const lastMonth = history[history.length - 2];
  const thisMonth = history[history.length - 1];
  const diff = lastMonth.expense > 0
    ? ((thisMonth.expense - lastMonth.expense) / lastMonth.expense) * 100
    : 0;

  return (
    <div className="mf-screen">
      <ScreenHeader
        title="Rapoarte"
        subtitle="Mai 2026"
        right={
          <div className="flex gap-1 bg-muted/40 p-[3px] rounded-[11px] border border-border/60">
            {PERIODS.map(p => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={cn(
                  'px-2.5 py-1 rounded-lg border-none text-[11px] font-semibold cursor-pointer transition-all',
                  period === p.key
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-transparent text-muted-foreground hover:text-foreground'
                )}
              >{p.label}</button>
            ))}
          </div>
        }
      />

      {/* Donut chart */}
      <div className="px-4 pb-3.5">
        <Card>
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-sm font-bold text-foreground">Distribuție cheltuieli</span>
            <span className="text-[11px] text-muted-foreground font-medium">{donutData.length} categorii</span>
          </div>
          {donutData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">Nicio cheltuială în această perioadă</div>
          ) : (
            <>
              <div className="flex items-center justify-center py-2 pb-3.5">
                <DonutChart data={donutData} size={200} thickness={24}/>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {donutData.slice(0, 6).map(d => {
                  const pct = Math.round((d.value / total) * 100);
                  return (
                    <div key={d.catId} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: d.color }}/>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] text-muted-foreground truncate">{d.label}</div>
                        <div className="text-xs font-bold text-foreground">{pct}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Line chart */}
      <div className="px-4 pb-3.5">
        <Card>
          <div className="flex justify-between items-start mb-1">
            <div>
              <div className="text-sm font-bold text-foreground">Evoluție 6 luni</div>
              <div className="text-[11px] text-muted-foreground font-medium mt-0.5">Venituri vs. Cheltuieli</div>
            </div>
            <Badge
              variant="outline"
              className={cn(
                'text-[11px] font-bold',
                diff < 0
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-orange-500/10 text-orange-400 border-orange-500/30'
              )}
            >
              {diff < 0 ? '↓' : '↑'} {Math.abs(diff).toFixed(0)}%
            </Badge>
          </div>
          <div className="mx-[-2px] mt-1.5">
            <LineChart data={history} height={150}/>
          </div>
          <div className="flex gap-3.5 justify-center mt-1">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <div className="w-3.5 h-[3px] bg-emerald-500 rounded"/>Venituri
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <div className="w-3.5 h-[3px] bg-orange-500 rounded"/>Cheltuieli
            </div>
          </div>
        </Card>
      </div>

      {donutData.length > 0 && (
        <>
          {/* Top categories */}
          <div className="px-4 pb-3.5">
            <div className="flex justify-between items-baseline px-1 pb-2.5">
              <span className="text-sm font-bold text-foreground">Top categorii</span>
              <span className="text-[11px] text-muted-foreground font-medium">Mai 2026</span>
            </div>
            <Card style={{ padding: 4 }}>
              {donutData.slice(0, 5).map((d, i) => {
                const pct = (d.value / total) * 100;
                return (
                  <div key={d.catId} className={cn('px-3.5 py-3', i < Math.min(donutData.length, 5) - 1 && 'border-b border-border/50')}>
                    <div className="flex items-center gap-3 mb-1.5">
                      <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-base shrink-0" style={{ background: d.color + '22' }}>{d.icon}</div>
                      <div className="flex-1 flex justify-between items-baseline">
                        <div>
                          <div className="text-sm font-bold text-foreground">{d.label}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">{Math.round(pct)}% din total</div>
                        </div>
                        <div className="text-sm font-bold text-foreground tracking-tight">
                          {d.value.toLocaleString('ro-RO', { maximumFractionDigits: 0 })} <span className="text-[11px] font-medium text-muted-foreground">lei</span>
                        </div>
                      </div>
                    </div>
                    <div className="pl-12">
                      <ProgressBar value={pct} max={100} color={d.color} height={5}/>
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>

          {/* Insight card */}
          <div className="px-4">
            <Card className="bg-gradient-to-br from-[#0f1d3a] to-blue-600 border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-[30px] h-[30px] rounded-full bg-white/15 flex items-center justify-center text-sm">💡</div>
                <span className="text-sm font-bold text-white tracking-wide">INSIGHT</span>
              </div>
              <div className="text-base font-semibold text-white leading-snug mb-2">
                Cheltuielile pentru <span className="bg-white/20 px-1.5 py-0.5 rounded">Mâncare</span> au scăzut cu 12% față de luna trecută. Felicitări! 🎉
              </div>
              <div className="text-xs text-white/70">
                Continuă în acest ritm și vei economisi ~480 lei până la finalul anului.
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
