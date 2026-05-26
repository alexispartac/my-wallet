'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Transaction } from '@/components/data';

interface TransactionsContextValue {
  transactions: Transaction[];
  loading: boolean;
  addTransaction: (data: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextValue | null>(null);

export function TransactionsProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    const res = await fetch('/api/transactions');
    const raw: Record<string, unknown>[] = await res.json();
    const normalized: Transaction[] = raw.map((t) => ({
      id:       String(t._id),
      type:     t.type as 'income' | 'expense',
      catId:    t.catId as string,
      merchant: t.merchant as string,
      amount:   t.amount as number,
      date:     new Date(t.date as string),
      note:     (t.note as string) ?? '',
    }));
    setTransactions(normalized);
  }, []);

  useEffect(() => {
    fetchTransactions().finally(() => setLoading(false));
  }, [fetchTransactions]);

  const addTransaction = useCallback(async (data: Omit<Transaction, 'id'>) => {
    await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    await fetchTransactions();
  }, [fetchTransactions]);

  const deleteTransaction = useCallback(async (id: string) => {
    await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
    await fetchTransactions();
  }, [fetchTransactions]);

  const refresh = useCallback(async () => {
    await fetchTransactions();
  }, [fetchTransactions]);

  return (
    <TransactionsContext.Provider value={{ transactions, loading, addTransaction, deleteTransaction, refresh }}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions(): TransactionsContextValue {
  const ctx = useContext(TransactionsContext);
  if (!ctx) throw new Error('useTransactions must be used inside TransactionsProvider');
  return ctx;
}
