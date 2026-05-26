'use client';

import React from 'react';
import type { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { Card } from '@/components/PhoneShell';
import { useTransactions } from '@/components/TransactionsContext';
import { useBudgets } from '@/components/BudgetsContext';
import { Toast, useToast } from '@/components/Toast';
import EditProfileSheet from '@/components/screens/EditProfileSheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

interface ProfileScreenProps {
  onLogout: () => void;
  session: Session | null;
}

export default function ProfileScreen({ onLogout, session }: ProfileScreenProps) {
  const { transactions: txs, loading: txLoading } = useTransactions();
  const { budgets, loading: budgetsLoading }       = useBudgets();
  const [logoutConfirm, setLogoutConfirm]          = React.useState(false);
  const [deleteConfirm, setDeleteConfirm]          = React.useState(false);
  const [deleteLoading, setDeleteLoading]          = React.useState(false);
  const [editOpen, setEditOpen]                    = React.useState(false);
  const { toast, show } = useToast();

  const loading = txLoading || budgetsLoading;

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <span className="text-sm text-muted-foreground">Se încarcă...</span>
    </div>
  );

  const totalSaved = txs.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0)
                   - txs.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);

  const userName    = session?.user?.name     ?? 'Utilizator';
  const userEmail   = session?.user?.email    ?? '';
  const avatarColor = session?.user?.avatarColor    ?? '#2563EB';
  const avatarInit  = session?.user?.avatarInitials ?? userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  async function handleDeleteAccount() {
    setDeleteLoading(true);
    const res = await fetch('/api/auth/delete-account', { method: 'DELETE' });
    if (res.ok) {
      await signOut({ callbackUrl: '/register' });
    } else {
      setDeleteLoading(false);
      setDeleteConfirm(false);
      show('Eroare la ștergerea contului');
    }
  }

  const sections = [
    {
      title: 'Contul tău',
      items: [
        { icon: '👤', label: 'Date personale', color: '#2563EB', detail: userName,   action: () => setEditOpen(true) },
        { icon: '🔐', label: 'Securitate',      color: '#16A34A', detail: 'Parolă',  action: () => setEditOpen(true) },
        { icon: '🔔', label: 'Notificări',      color: '#EA580C', detail: undefined, action: () => show('Funcție disponibilă în curând') },
      ],
    },
    {
      title: 'Personalizare',
      items: [
        { icon: '🎨', label: 'Aspect',    color: '#8B5CF6', detail: undefined,      action: () => show('Funcție disponibilă în curând') },
        { icon: '🏷️', label: 'Categorii', color: '#0EA5E9', detail: '12 categorii', action: () => show('Funcție disponibilă în curând') },
        { icon: '💱', label: 'Monedă',    color: '#F59E0B', detail: 'RON (lei)',     action: () => show('Funcție disponibilă în curând') },
        { icon: '🌍', label: 'Limbă',     color: '#14B8A6', detail: 'Română',        action: () => show('Funcție disponibilă în curând') },
      ],
    },
    {
      title: 'Date',
      items: [
        { icon: '📤', label: 'Exportă date',         color: '#6366F1', detail: 'CSV, PDF', action: () => show('Funcție disponibilă în curând') },
        { icon: '☁️', label: 'Sincronizare cloud',   color: '#0EA5E9', detail: undefined,  action: () => show('Funcție disponibilă în curând') },
        { icon: '🗂️', label: 'Tranzacții recurente', color: '#A16207', detail: undefined,  action: () => show('Funcție disponibilă în curând') },
      ],
    },
    {
      title: 'Despre',
      items: [
        { icon: '💬', label: 'Suport',          color: '#EC4899', detail: undefined, action: () => show('Funcție disponibilă în curând') },
        { icon: 'ℹ️', label: 'Despre MoneyFlow', color: '#64748B', detail: 'v1.0.0', action: () => show('MoneyFlow v1.0.0 · Made with 💙') },
        { icon: '🚪', label: 'Deconectare',      color: '#DC2626', detail: undefined, action: () => setLogoutConfirm(true) },
      ],
    },
    {
      title: 'Pericol',
      items: [
        { icon: '🗑️', label: 'Șterge contul', color: '#DC2626', detail: undefined, action: () => setDeleteConfirm(true) },
      ],
    },
  ];

  return (
    <div className="mf-screen">
      <div className="relative overflow-hidden px-5 pt-5 pb-[70px] rounded-b-[28px]"
        style={{ background: 'linear-gradient(160deg, #0f1d3a 0%, #1e3a8a 60%, #2563EB 100%)' }}>
        <div className="absolute top-[-30px] right-[-30px] w-[140px] h-[140px] rounded-full bg-white/[0.04]"/>
        <div className="flex items-center gap-3.5 relative">
          <div onClick={() => setEditOpen(true)} className="cursor-pointer relative">
            <Avatar className="h-[70px] w-[70px] border-[3px] border-white/25 shadow-[0_6px_20px_rgba(0,0,0,0.4)]">
              <AvatarFallback
                className="text-white text-2xl font-bold"
                style={{ background: `linear-gradient(135deg, ${avatarColor} 0%, ${avatarColor}CC 100%)` }}
              >
                {avatarInit}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-white/90 flex items-center justify-center text-[10px] border-2 border-white/30">✏️</div>
          </div>
          <div className="flex-1">
            <div className="text-lg font-bold text-white">{userName}</div>
            <div className="text-xs text-white/60 mt-0.5">{userEmail}</div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-12 relative z-10">
        <Card style={{ padding: 16 }}>
          <div className="grid grid-cols-[1fr_1px_1fr_1px_1fr] gap-2 items-center">
            <div className="text-center">
              <div className="text-[18px] font-bold text-emerald-400 tracking-tight">{Math.round(totalSaved).toLocaleString('ro-RO')}</div>
              <div className="text-[10px] text-muted-foreground font-medium mt-0.5 tracking-wide uppercase">ECONOMII (LEI)</div>
            </div>
            <div className="bg-border h-7"/>
            <div className="text-center">
              <div className="text-[18px] font-bold text-foreground tracking-tight">{txs.length}</div>
              <div className="text-[10px] text-muted-foreground font-medium mt-0.5 tracking-wide uppercase">TRANZACȚII</div>
            </div>
            <div className="bg-border h-7"/>
            <div className="text-center">
              <div className="text-[18px] font-bold text-primary tracking-tight">{budgets.length}</div>
              <div className="text-[10px] text-muted-foreground font-medium mt-0.5 tracking-wide uppercase">BUGETE</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="px-4 pt-5">
        {sections.map((sec, si) => (
          <div key={si} className="mb-4">
            <div className={cn(
              'text-[11px] font-bold tracking-widest uppercase px-1.5 pb-2',
              sec.title === 'Pericol' ? 'text-red-400' : 'text-muted-foreground'
            )}>{sec.title}</div>
            <Card style={{ padding: 4 }}>
              {sec.items.map((item, i) => (
                <React.Fragment key={i}>
                  <div
                    onClick={item.action}
                    className="flex items-center gap-3 py-[11px] px-3 cursor-pointer transition-colors hover:bg-muted/30 rounded-xl"
                  >
                    <div className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-base shrink-0" style={{ background: item.color + '22' }}>{item.icon}</div>
                    <div className={cn('flex-1 text-sm font-semibold', (item.label === 'Deconectare' || item.label === 'Șterge contul') ? 'text-red-400' : 'text-foreground')}>
                      {item.label}
                    </div>
                    {item.detail && <span className="text-xs text-muted-foreground font-medium">{item.detail}</span>}
                    <svg width="7" height="12" viewBox="0 0 7 12">
                      <path d="M1 1l5 5-5 5" stroke={(item.label === 'Deconectare' || item.label === 'Șterge contul') ? 'oklch(0.62 0.22 27 / 50%)' : 'oklch(1 0 0 / 20%)'} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {i < sec.items.length - 1 && <Separator className="ml-[58px] bg-border/50"/>}
                </React.Fragment>
              ))}
            </Card>
          </div>
        ))}
        <div className="text-center py-2 text-[11px] text-muted-foreground/40">
          MoneyFlow • v1.0.0 • Made with 💙 in Romania
        </div>
      </div>

      {/* Logout confirmation */}
      <AlertDialog open={logoutConfirm} onOpenChange={setLogoutConfirm}>
        <AlertDialogContent className="rounded-[20px] max-w-[340px] bg-card border-border">
          <AlertDialogHeader className="items-center text-center">
            <div className="text-[32px] mb-3">🚪</div>
            <AlertDialogTitle className="text-foreground">Deconectare</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-sm leading-relaxed">
              Ești sigur că vrei să te deconectezi din aplicație?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2.5 sm:space-x-0">
            <AlertDialogCancel className="flex-1 bg-muted/60 border-border text-foreground font-semibold hover:bg-muted">Anulează</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setLogoutConfirm(false); onLogout(); }} className="flex-1 bg-red-500/90 text-white font-bold hover:bg-red-500 border-none">Deconectează</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete account confirmation */}
      <AlertDialog open={deleteConfirm} onOpenChange={v => !deleteLoading && setDeleteConfirm(v)}>
        <AlertDialogContent className="rounded-[20px] max-w-[340px] bg-card border-border">
          <AlertDialogHeader className="items-center text-center">
            <div className="text-[32px] mb-3">⚠️</div>
            <AlertDialogTitle className="text-red-400">Șterge contul</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-sm leading-relaxed">
              Această acțiune este <strong>ireversibilă</strong>. Toate tranzacțiile, bugetele și datele tale vor fi șterse permanent.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2.5 sm:space-x-0">
            <AlertDialogCancel className="flex-1 bg-muted/60 border-border text-foreground font-semibold hover:bg-muted" disabled={deleteLoading}>Anulează</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deleteLoading}
              className="flex-1 bg-red-600 text-white font-bold hover:bg-red-700 border-none"
            >
              {deleteLoading ? 'Se șterge...' : 'Șterge tot'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditProfileSheet
        open={editOpen}
        onClose={() => setEditOpen(false)}
        session={session}
        onSaved={(name) => show(`Profil actualizat: ${name}`)}
      />

      <Toast {...toast}/>
    </div>
  );
}
