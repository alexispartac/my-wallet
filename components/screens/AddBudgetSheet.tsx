'use client';

import React from 'react';
import { MF_CATEGORIES } from '@/components/data';
import { useBudgets, type BudgetItem } from '@/components/BudgetsContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AddBudgetSheetProps {
  open: boolean;
  onClose: () => void;
  editBudget?: BudgetItem | null;
}

export default function AddBudgetSheet({ open, onClose, editBudget }: AddBudgetSheetProps) {
  const { budgets, upsertBudget, deleteBudget } = useBudgets();
  const [catId, setCatId] = React.useState<string | null>(null);
  const [amount, setAmount] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      if (editBudget) {
        setCatId(editBudget.catId);
        setAmount(String(editBudget.limit));
      } else {
        setCatId(null);
        setAmount('');
      }
    }
  }, [open, editBudget]);

  const existingCatIds = new Set(budgets.map(b => b.catId));
  const availableCats = MF_CATEGORIES.filter(c =>
    c.id !== 'salary' && c.id !== 'free' &&
    (editBudget ? c.id === editBudget.catId : !existingCatIds.has(c.id))
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
    if (!catId || !amount || saving) return;
    const limit = parseFloat(amount);
    if (isNaN(limit) || limit <= 0) return;
    setSaving(true);
    try {
      await upsertBudget(catId, limit, editBudget?.id);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editBudget || saving) return;
    setSaving(true);
    try {
      await deleteBudget(editBudget.id);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const canSave = !!catId && !!amount && parseFloat(amount) > 0 && !saving;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="bottom"
        className="rounded-t-[28px] px-4 pb-[max(28px,env(safe-area-inset-bottom))] w-full max-w-[430px] !left-1/2 -translate-x-1/2 max-h-[92%] flex flex-col overflow-auto bg-card border-border"
      >
        <SheetHeader className="pb-3">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-foreground text-left text-lg">
              {editBudget ? 'Editează buget' : 'Adaugă buget'}
            </SheetTitle>
            {editBudget && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={saving}
                className="text-xs h-8 border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300"
              >
                Șterge
              </Button>
            )}
          </div>
        </SheetHeader>

        {/* Category grid */}
        <div className="mb-3.5">
          <div className="text-xs font-semibold text-muted-foreground mb-1.5 px-1">Categorie</div>
          {availableCats.length === 0 && !editBudget ? (
            <p className="text-center py-4 text-sm text-muted-foreground">Toate categoriile au deja un buget.</p>
          ) : (
            <div className="grid grid-cols-5 gap-1.5">
              {availableCats.map(c => {
                const active = catId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => !editBudget && setCatId(c.id)}
                    className={cn(
                      'rounded-xl py-2 px-1 flex flex-col items-center gap-0.5 transition-all border-2',
                      editBudget ? 'cursor-default' : 'cursor-pointer',
                    )}
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
          )}
        </div>

        {/* Amount display */}
        <div className="bg-primary/10 rounded-[18px] py-3.5 px-4 text-center mb-3 border border-primary/20">
          <div className="text-[11px] font-semibold text-muted-foreground tracking-wide uppercase">Limită buget</div>
          <div className="text-[38px] font-bold tracking-tight mt-0.5 text-primary leading-tight">
            {amount || '0'}
            <span className="text-lg font-medium text-muted-foreground ml-1">lei</span>
          </div>
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

        <Button
          onClick={handleSave}
          disabled={!canSave}
          className={cn(
            'w-full h-12 text-sm font-bold rounded-[14px] border-none transition-all',
            canSave
              ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_6px_16px_oklch(0.62_0.21_264_/_30%)]'
              : 'bg-muted/60 text-muted-foreground cursor-not-allowed'
          )}
        >
          {saving ? 'Se salvează...' : editBudget ? 'Salvează modificările' : 'Adaugă buget'}
        </Button>
      </SheetContent>
    </Sheet>
  );
}
