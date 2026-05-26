'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface BudgetItem {
  id: string;
  catId: string;
  limit: number;
}

interface BudgetsContextValue {
  budgets: BudgetItem[];
  loading: boolean;
  upsertBudget: (catId: string, limit: number, id?: string) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
}

const BudgetsContext = createContext<BudgetsContextValue | null>(null);

export function BudgetsProvider({ children }: { children: React.ReactNode }) {
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBudgets = useCallback(async () => {
    const res = await fetch('/api/budgets');
    const raw: Record<string, unknown>[] = await res.json();
    setBudgets(raw.map(b => ({
      id:    String(b._id),
      catId: b.catId as string,
      limit: b.limit as number,
    })));
  }, []);

  useEffect(() => {
    fetchBudgets().finally(() => setLoading(false));
  }, [fetchBudgets]);

  const upsertBudget = useCallback(async (catId: string, limit: number, id?: string) => {
    if (id) {
      await fetch(`/api/budgets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit }),
      });
    } else {
      await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ catId, limit }),
      });
    }
    await fetchBudgets();
  }, [fetchBudgets]);

  const deleteBudget = useCallback(async (id: string) => {
    await fetch(`/api/budgets/${id}`, { method: 'DELETE' });
    await fetchBudgets();
  }, [fetchBudgets]);

  return (
    <BudgetsContext.Provider value={{ budgets, loading, upsertBudget, deleteBudget }}>
      {children}
    </BudgetsContext.Provider>
  );
}

export function useBudgets(): BudgetsContextValue {
  const ctx = useContext(BudgetsContext);
  if (!ctx) throw new Error('useBudgets must be used inside BudgetsProvider');
  return ctx;
}
