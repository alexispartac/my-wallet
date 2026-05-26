'use client';

import React from 'react';
import { MF_CATEGORIES, MF_HELPERS } from '@/components/data';
import { ScreenHeader, Card } from '@/components/PhoneShell';
import { useTransactions } from '@/components/TransactionsContext';
import { Toast, useToast } from '@/components/Toast';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Transaction } from '@/components/data';

type SortKey = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'date-desc',   label: 'Dată (cele mai recente)' },
  { key: 'date-asc',    label: 'Dată (cele mai vechi)' },
  { key: 'amount-desc', label: 'Sumă (descrescător)' },
  { key: 'amount-asc',  label: 'Sumă (crescător)' },
];

export default function TransactionsScreen() {
  const [filter, setFilter] = React.useState('all');
  const [catFilter, setCatFilter] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState('');
  const [sortBy, setSortBy] = React.useState<SortKey>('date-desc');
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [selectedTx, setSelectedTx] = React.useState<Transaction | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const { transactions: all, loading, deleteTransaction } = useTransactions();
  const { toast, show } = useToast();
  const { catById, dayLabel } = MF_HELPERS;

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <span className="text-sm text-muted-foreground">Se încarcă...</span>
    </div>
  );

  let filtered = all;
  if (filter !== 'all') filtered = filtered.filter(t => t.type === filter);
  if (catFilter) filtered = filtered.filter(t => t.catId === catFilter);
  if (search.trim()) filtered = filtered.filter(t => t.merchant.toLowerCase().includes(search.toLowerCase()));

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'date-desc')   return b.date.getTime() - a.date.getTime();
    if (sortBy === 'date-asc')    return a.date.getTime() - b.date.getTime();
    if (sortBy === 'amount-desc') return b.amount - a.amount;
    return a.amount - b.amount;
  });

  const groups: Record<string, typeof filtered> = {};
  filtered.forEach(t => {
    const key = dayLabel(t.date);
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  });

  const totalIn  = filtered.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
  const totalOut = filtered.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
  const cats = MF_CATEGORIES.filter(c => filtered.some(t => t.catId === c.id));

  const handleDelete = async () => {
    if (!selectedTx || deleting) return;
    setDeleting(true);
    try {
      await deleteTransaction(selectedTx.id);
      setSelectedTx(null);
      show('Tranzacție ștearsă');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mf-screen">
      <ScreenHeader
        title="Tranzacții"
        subtitle="Mai 2026"
        right={
          <Button
            variant={sortBy !== 'date-desc' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold h-9"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M3 4h18l-7 9v5l-4 2v-7L3 4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
            Sortează
          </Button>
        }
      />

      {/* Search */}
      <div className="px-4 pb-3 pt-1">
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Caută Mega Image, Bolt..."
            className="pl-10 bg-muted/40 border-border text-foreground placeholder:text-muted-foreground"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground bg-none border-none cursor-pointer text-base leading-none hover:text-foreground">✕</button>
          )}
        </div>
      </div>

      {/* Type filter pills */}
      <div className="px-4 pb-3 flex gap-1.5">
        {[
          { id: 'all',     label: 'Toate',      count: all.length },
          { id: 'income',  label: 'Venituri',   count: all.filter(t => t.type === 'income').length },
          { id: 'expense', label: 'Cheltuieli', count: all.filter(t => t.type === 'expense').length },
        ].map(opt => {
          const active = filter === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setFilter(opt.id)}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all border',
                active
                  ? 'bg-primary text-primary-foreground border-transparent shadow-[0_2px_10px_oklch(0.62_0.21_264_/_30%)]'
                  : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted/70'
              )}
            >
              {opt.label}
              <span className={cn(
                'text-[10px] px-1.5 py-0.5 rounded-full font-bold',
                active ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
              )}>{opt.count}</span>
            </button>
          );
        })}
      </div>

      {/* Category chips */}
      {cats.length > 0 && (
        <div className="pb-3">
          <div className="flex gap-1.5 overflow-x-auto px-4 scrollbar-none">
            <button
              onClick={() => setCatFilter(null)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer shrink-0 border transition-all',
                !catFilter ? 'bg-primary/15 text-primary border-primary/30' : 'bg-transparent text-muted-foreground border-border hover:bg-muted/50'
              )}
            >Toate categoriile</button>
            {cats.map(c => {
              const active = catFilter === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setCatFilter(active ? null : c.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer shrink-0 border transition-all"
                  style={{
                    background: active ? c.color + '22' : 'transparent',
                    color: active ? c.color : 'oklch(0.55 0.02 264)',
                    borderColor: active ? c.color + '44' : 'oklch(1 0 0 / 8%)',
                  }}
                >
                  <span>{c.icon}</span>{c.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="px-4 pb-3">
        <div className="grid grid-cols-[1fr_1px_1fr] bg-card rounded-2xl p-3.5 border border-border">
          <div>
            <p className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">Venituri</p>
            <p className="text-lg font-bold text-emerald-400 mt-0.5 tracking-tight">
              +{totalIn.toLocaleString('ro-RO')} <span className="text-[11px] font-normal text-muted-foreground">lei</span>
            </p>
          </div>
          <div className="bg-border"/>
          <div className="pl-3.5">
            <p className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">Cheltuieli</p>
            <p className="text-lg font-bold text-orange-400 mt-0.5 tracking-tight">
              −{Math.round(totalOut).toLocaleString('ro-RO')} <span className="text-[11px] font-normal text-muted-foreground">lei</span>
            </p>
          </div>
        </div>
      </div>

      {/* Groups */}
      <div className="px-4">
        {Object.entries(groups).map(([day, items]) => {
          const dayTotal = items.reduce((a, b) => a + (b.type === 'income' ? b.amount : -b.amount), 0);
          return (
            <div key={day} className="mb-3.5">
              <div className="flex justify-between items-baseline px-1 pb-1.5">
                <span className="text-[11px] font-bold text-muted-foreground tracking-widest uppercase">{day}</span>
                <span className={cn('text-[11px] font-semibold', dayTotal >= 0 ? 'text-emerald-400' : 'text-muted-foreground')}>
                  {dayTotal >= 0 ? '+' : '−'}{Math.abs(dayTotal).toLocaleString('ro-RO', { minimumFractionDigits: 2 })} lei
                </span>
              </div>
              <Card style={{ padding: 4 }}>
                {items.map((t, i) => {
                  const cat = catById(t.catId);
                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTx(t)}
                      className={cn(
                        'flex items-center gap-3 py-[11px] px-3 cursor-pointer transition-colors hover:bg-muted/30 rounded-xl',
                        i < items.length - 1 && 'border-b border-border/50'
                      )}
                    >
                      <div className="w-[38px] h-[38px] rounded-xl flex items-center justify-center text-base shrink-0" style={{ background: cat.color + '22' }}>{cat.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{t.merchant}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{cat.name}{t.note && ` · ${t.note}`}</p>
                      </div>
                      <div className="text-right">
                        <p className={cn('text-sm font-bold tracking-tight', t.type === 'income' ? 'text-emerald-400' : 'text-foreground')}>
                          {t.type === 'income' ? '+' : '−'}{t.amount.toLocaleString('ro-RO', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-[10px] text-muted-foreground/50">lei</p>
                      </div>
                    </div>
                  );
                })}
              </Card>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">Nicio tranzacție găsită</div>
        )}
      </div>

      {/* Sort sheet */}
      <Sheet open={filterOpen} onOpenChange={(v) => !v && setFilterOpen(false)}>
        <SheetContent side="bottom" className="rounded-t-2xl w-full max-w-[430px] !left-1/2 -translate-x-1/2 bg-card border-border">
          <SheetHeader className="pb-3.5">
            <SheetTitle className="text-left text-foreground">Sortează după</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-1">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.key}
                onClick={() => { setSortBy(opt.key); setFilterOpen(false); }}
                className={cn(
                  'w-full border-none cursor-pointer py-3 px-3.5 rounded-xl flex items-center justify-between text-sm font-medium transition-colors',
                  sortBy === opt.key ? 'bg-primary/15 text-primary' : 'bg-transparent text-foreground hover:bg-muted/50'
                )}
              >
                {opt.label}
                {sortBy === opt.key && (
                  <svg width="16" height="16" viewBox="0 0 16 16"><path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                )}
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Transaction detail sheet */}
      {selectedTx && (() => {
        const cat = catById(selectedTx.catId);
        return (
          <Sheet open={!!selectedTx} onOpenChange={(v) => !v && setSelectedTx(null)}>
            <SheetContent side="bottom" className="rounded-t-2xl px-5 pb-[max(28px,env(safe-area-inset-bottom))] w-full max-w-[430px] !left-1/2 -translate-x-1/2 bg-card border-border">
              <SheetHeader className="pb-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ background: cat.color + '22' }}>{cat.icon}</div>
                  <div className="flex-1">
                    <SheetTitle className="text-foreground text-left text-[17px]">{selectedTx.merchant}</SheetTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">{cat.name}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn('text-[22px] font-bold tracking-tight', selectedTx.type === 'income' ? 'text-emerald-400' : 'text-orange-400')}>
                      {selectedTx.type === 'income' ? '+' : '−'}{selectedTx.amount.toLocaleString('ro-RO', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground">lei</p>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex flex-col gap-2 mb-5">
                {[
                  { label: 'Data', value: dayLabel(selectedTx.date) },
                  { label: 'Tip', value: selectedTx.type === 'income' ? 'Venit' : 'Cheltuială' },
                  ...(selectedTx.note ? [{ label: 'Notă', value: selectedTx.note }] : []),
                ].map(row => (
                  <div key={row.label} className="flex justify-between bg-muted/40 rounded-xl px-3.5 py-2.5">
                    <span className="text-sm text-muted-foreground font-medium">{row.label}</span>
                    <span className="text-sm font-semibold text-foreground">{row.value}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleDelete}
                disabled={deleting}
                variant="outline"
                className="w-full h-12 text-sm font-bold rounded-[14px] border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {deleting ? 'Se șterge...' : 'Șterge tranzacția'}
              </Button>
            </SheetContent>
          </Sheet>
        );
      })()}

      <Toast {...toast}/>
    </div>
  );
}
