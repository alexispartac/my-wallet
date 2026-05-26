'use client';

import React from 'react';
import type { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  onClose: () => void;
  session: Session | null;
  onSaved: (name: string) => void;
}

const AVATAR_COLORS = ['#F59E0B', '#2563EB', '#16A34A', '#DC2626', '#8B5CF6', '#EA580C', '#0EA5E9', '#14B8A6'];

export default function EditProfileSheet({ open, onClose, session, onSaved }: Props) {
  const { update } = useSession();
  const [tab, setTab]               = React.useState<'info' | 'password'>('info');
  const [name, setName]             = React.useState('');
  const [curPwd, setCurPwd]         = React.useState('');
  const [newPwd, setNewPwd]         = React.useState('');
  const [confirmPwd, setConfirmPwd] = React.useState('');
  const [error, setError]           = React.useState('');
  const [loading, setLoading]       = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setName(session?.user?.name ?? '');
      setCurPwd(''); setNewPwd(''); setConfirmPwd('');
      setError(''); setTab('info');
    }
  }, [open, session]);

  const avatarColor = session?.user?.avatarColor ?? '#2563EB';
  const avatarInit  = session?.user?.avatarInitials
    ?? (session?.user?.name ?? 'MF').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  async function handleSave() {
    setError('');
    if (tab === 'password') {
      if (!curPwd || !newPwd) { setError('Completează toate câmpurile'); return; }
      if (newPwd !== confirmPwd) { setError('Parolele nu coincid'); return; }
      if (newPwd.length < 6) { setError('Parola trebuie să aibă minim 6 caractere'); return; }
    }
    setLoading(true);
    const body: Record<string, string> = {};
    if (tab === 'info' && name.trim()) body.name = name.trim();
    if (tab === 'password') { body.currentPassword = curPwd; body.newPassword = newPwd; }

    const res = await fetch('/api/auth/update-profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || 'Eroare'); return; }
    await update({ name: data.name, avatarInitials: data.avatarInitials });
    onSaved(data.name ?? name.trim());
    onClose();
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="bottom"
        className="rounded-t-[20px] px-5 pb-9 w-full max-w-[430px] !left-1/2 -translate-x-1/2 max-h-[90vh] overflow-y-auto bg-card border-border"
      >
        <SheetHeader className="pb-5">
          <div className="flex items-center gap-3.5">
            <Avatar className="h-14 w-14 border-[3px] border-border">
              <AvatarFallback
                className="text-white text-xl font-bold"
                style={{ background: `linear-gradient(135deg, ${avatarColor} 0%, ${avatarColor}CC 100%)` }}
              >
                {avatarInit}
              </AvatarFallback>
            </Avatar>
            <div>
              <SheetTitle className="text-foreground text-left text-base">{session?.user?.name ?? 'Utilizator'}</SheetTitle>
              <div className="text-xs text-muted-foreground mt-0.5">{session?.user?.email}</div>
            </div>
          </div>
        </SheetHeader>

        {/* Tab switcher */}
        <div className="flex gap-1.5 bg-muted/50 p-1 rounded-xl mb-5">
          {(['info', 'password'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'flex-1 py-2 rounded-[9px] border-none cursor-pointer text-sm font-semibold transition-all',
                tab === t ? 'bg-card text-foreground shadow-sm' : 'bg-transparent text-muted-foreground'
              )}
            >
              {t === 'info' ? '👤 Profil' : '🔐 Parolă'}
            </button>
          ))}
        </div>

        {tab === 'info' && (
          <div className="flex flex-col gap-3.5">
            <div>
              <Label className="text-xs font-bold text-muted-foreground tracking-widest uppercase mb-1.5 block">Nume complet</Label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Numele tău"
                className="bg-muted/40 border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <Label className="text-xs font-bold text-muted-foreground tracking-widest uppercase mb-2 block">Culoare avatar</Label>
              <div className="flex gap-2 flex-wrap">
                {AVATAR_COLORS.map(c => (
                  <div
                    key={c}
                    className="w-8 h-8 rounded-full cursor-pointer transition-all"
                    style={{
                      background: c,
                      border: c === avatarColor ? '3px solid oklch(0.62 0.21 264)' : '3px solid transparent',
                      outline: c === avatarColor ? '2px solid oklch(0.62 0.21 264 / 30%)' : 'none',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'password' && (
          <div className="flex flex-col gap-3.5">
            {[
              { label: 'PAROLA CURENTĂ',       value: curPwd,     set: setCurPwd,     placeholder: 'Parola ta actuală' },
              { label: 'PAROLA NOUĂ',            value: newPwd,     set: setNewPwd,     placeholder: 'Minim 6 caractere' },
              { label: 'CONFIRMĂ PAROLA NOUĂ',   value: confirmPwd, set: setConfirmPwd, placeholder: 'Repetă parola nouă' },
            ].map(f => (
              <div key={f.label}>
                <Label className="text-xs font-bold text-muted-foreground tracking-widest uppercase mb-1.5 block">{f.label}</Label>
                <Input
                  type="password"
                  value={f.value}
                  onChange={e => f.set(e.target.value)}
                  placeholder={f.placeholder}
                  className="bg-muted/40 border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="mt-3.5 px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 font-medium">{error}</div>
        )}

        <Button
          onClick={handleSave}
          disabled={loading}
          className="w-full mt-5 h-12 rounded-xl text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground border-none shadow-[0_6px_16px_oklch(0.62_0.21_264_/_25%)]"
        >
          {loading ? 'Se salvează...' : 'Salvează modificările'}
        </Button>
      </SheetContent>
    </Sheet>
  );
}
