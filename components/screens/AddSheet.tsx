'use client';

import React from 'react';
import { MF_CATEGORIES, MF_HELPERS } from '@/components/data';
import { useTransactions } from '@/components/TransactionsContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AddSheetProps {
  open: boolean;
  onClose: () => void;
}

export default function AddSheet({ open, onClose }: AddSheetProps) {
  const { addTransaction } = useTransactions();
  const [type, setType] = React.useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = React.useState('');
  const [catId, setCatId] = React.useState<string | null>(null);
  const [merchant, setMerchant] = React.useState('');
  const [note, setNote] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (open) {
      setAmount(''); setCatId(null); setMerchant('');
      setNote(''); setType('expense'); setError('');
    }
  }, [open]);

  const cats = MF_CATEGORIES.filter(c =>
    type === 'income' ? (c.id === 'salary' || c.id === 'free') : (c.id !== 'salary' && c.id !== 'free')
  );

  const press = (k: string) => {
    setAmount(prev => {
      if (k === 'back') return prev.slice(0, -1);
      if (k === '.' && prev.includes('.')) return prev;
      if (prev === '0' && k !== '.') return k;
      if (prev === '' && k === '.') return '0.';
      return prev + k;
    });
  };

  const handleSave = async () => {
    if (!amount || !catId || saving) return;
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    setSaving(true);
    setError('');
    try {
      const cat = MF_HELPERS.catById(catId);
      await addTransaction({
        type,
        catId,
        merchant: merchant.trim() || cat.name,
        amount: parsedAmount,
        date: new Date(),
        note: note.trim(),
      });
      onClose();
    } catch {
      setError('Eroare la salvare. Încearcă din nou.');
    } finally {
      setSaving(false);
    }
  };

  const canSave = !!amount && !!catId && !saving;
  const isIncome = type === 'income';

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="bottom"
        className="rounded-t-[28px] px-4 pb-[max(28px,env(safe-area-inset-bottom))] w-full max-w-[430px] !left-1/2 -translate-x-1/2 max-h-[92%] flex flex-col overflow-auto bg-card border-border"
      >
        <SheetHeader className="pb-3">
          <SheetTitle className="text-foreground text-left text-lg">Adaugă tranzacție</SheetTitle>
        </SheetHeader>

        {/* Type toggle */}
        <div className="flex bg-muted/50 p-1 rounded-[14px] gap-1 mb-3.5">
          {[
            { id: 'expense' as const, label: '💸 Cheltuială', activeColor: 'text-orange-400' },
            { id: 'income'  as const, label: '💰 Venit',      activeColor: 'text-emerald-400' },
          ].map(opt => {
            const active = type === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => { setType(opt.id); setCatId(null); }}
                className={cn(
                  'flex-1 py-2.5 px-2 rounded-[11px] border-none cursor-pointer text-[13px] font-bold transition-all',
                  active
                    ? `bg-card ${opt.activeColor} shadow-sm`
                    : 'bg-transparent text-muted-foreground'
                )}
              >{opt.label}</button>
            );
          })}
        </div>

        {/* Amount display */}
        <div className={cn(
          'rounded-[18px] p-4 text-center mb-3 border',
          isIncome ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-orange-500/10 border-orange-500/20'
        )}>
          <div className="text-[11px] font-semibold text-muted-foreground tracking-wide uppercase">Suma</div>
          <div className={cn(
            'text-[42px] font-bold tracking-tight mt-0.5 leading-tight',
            isIncome ? 'text-emerald-400' : 'text-orange-400'
          )}>
            {isIncome ? '+' : '−'}{amount || '0'}
            <span className="text-lg font-medium text-muted-foreground ml-1">lei</span>
          </div>
        </div>

        {/* Merchant input */}
        <div className="relative mb-3">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M3 9h18M9 9V3m6 6V3M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <Input
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            placeholder="Comerciant (ex: Mega Image)"
            className="pl-10 bg-muted/40 border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Category */}
        <div className="mb-3">
          <div className="text-xs font-semibold text-muted-foreground mb-1.5 px-1">Categorie</div>
          <div className="grid grid-cols-6 gap-1.5">
            {cats.slice(0, 12).map(c => {
              const active = catId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setCatId(c.id)}
                  className="rounded-xl py-2 px-1 cursor-pointer flex flex-col items-center gap-0.5 transition-all border-2"
                  style={{
                    background: active ? c.color + '22' : 'oklch(1 0 0 / 4%)',
                    borderColor: active ? c.color : 'transparent',
                  }}
                >
                  <span className="text-xl">{c.icon}</span>
                  <span className="text-[9px] font-semibold overflow-hidden text-ellipsis whitespace-nowrap max-w-full" style={{ color: active ? c.color : 'oklch(0.55 0.02 264)' }}>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Note input */}
        <div className="relative mb-3">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Notă (opțional)"
            className="pl-10 bg-muted/40 border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-1.5 mb-2.5">
          {['1','2','3','4','5','6','7','8','9','.','0','back'].map(k => (
            <button
              key={k}
              onClick={() => press(k)}
              className="bg-muted/40 border border-border/50 rounded-xl py-[11px] text-xl font-semibold text-foreground cursor-pointer flex items-center justify-center hover:bg-muted/70 active:bg-muted transition-colors"
            >
              {k === 'back' ? (
                <svg width="20" height="14" viewBox="0 0 23 17"><path d="M7 1h13a2 2 0 012 2v11a2 2 0 01-2 2H7l-6-7.5L7 1z" fill="none" stroke="oklch(0.55 0.02 264)" strokeWidth="1.6" strokeLinejoin="round"/><path d="M10 5l7 7M17 5l-7 7" stroke="oklch(0.55 0.02 264)" strokeWidth="1.6" strokeLinecap="round"/></svg>
              ) : k}
            </button>
          ))}
        </div>

        {error && (
          <p className="text-xs text-red-400 text-center mb-2 font-medium">{error}</p>
        )}

        <Button
          onClick={handleSave}
          disabled={!canSave}
          className={cn(
            'w-full h-12 text-sm font-bold rounded-[14px] border-none transition-all',
            canSave
              ? isIncome
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_6px_16px_oklch(0.65_0.17_155_/_30%)]'
                : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_6px_16px_oklch(0.62_0.21_264_/_30%)]'
              : 'bg-muted/60 text-muted-foreground cursor-not-allowed'
          )}
        >
          {saving ? 'Se salvează...' : 'Salvează tranzacția'}
        </Button>
      </SheetContent>
    </Sheet>
  );
}
