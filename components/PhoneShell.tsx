'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type TabId = 'dashboard' | 'transactions' | 'budget' | 'reports' | 'profile';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  gradient?: boolean;
}

function ScreenHeader({ title, subtitle, right, gradient = false }: ScreenHeaderProps) {
  return (
    <div className={cn(
      'px-5 pt-3 pb-3.5',
      gradient
        ? 'bg-gradient-to-br from-[#0f1f3d] to-blue-600 text-white'
        : 'bg-background text-foreground'
    )}>
      <div className="flex items-start justify-between">
        <div>
          {subtitle && (
            <div className={cn(
              'text-xs font-medium tracking-wider uppercase mb-0.5',
              gradient ? 'text-white/60' : 'text-muted-foreground'
            )}>{subtitle}</div>
          )}
          <div className="text-[26px] font-bold tracking-tight">{title}</div>
        </div>
        {right}
      </div>
    </div>
  );
}

const TAB_ICONS: Record<TabId, (active: boolean) => React.ReactElement> = {
  dashboard: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 12L12 4l9 8v8a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-8z"
        stroke={active ? 'oklch(0.62 0.21 264)' : 'oklch(0.45 0.02 264)'}
        strokeWidth="2" strokeLinejoin="round"
        fill={active ? 'oklch(0.62 0.21 264 / 20%)' : 'none'}/>
    </svg>
  ),
  transactions: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="6" width="18" height="13" rx="2"
        stroke={active ? 'oklch(0.62 0.21 264)' : 'oklch(0.45 0.02 264)'}
        strokeWidth="2" fill={active ? 'oklch(0.62 0.21 264 / 20%)' : 'none'}/>
      <path d="M3 10h18" stroke={active ? 'oklch(0.62 0.21 264)' : 'oklch(0.45 0.02 264)'} strokeWidth="2"/>
      <circle cx="7" cy="14.5" r="1" fill={active ? 'oklch(0.62 0.21 264)' : 'oklch(0.45 0.02 264)'}/>
    </svg>
  ),
  budget: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9"
        stroke={active ? 'oklch(0.62 0.21 264)' : 'oklch(0.45 0.02 264)'}
        strokeWidth="2" fill={active ? 'oklch(0.62 0.21 264 / 20%)' : 'none'}/>
      <circle cx="12" cy="12" r="4" stroke={active ? 'oklch(0.62 0.21 264)' : 'oklch(0.45 0.02 264)'} strokeWidth="2"/>
      <circle cx="12" cy="12" r="1" fill={active ? 'oklch(0.62 0.21 264)' : 'oklch(0.45 0.02 264)'}/>
    </svg>
  ),
  reports: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 19V9M10 19V5M16 19v-7M22 19H2"
        stroke={active ? 'oklch(0.62 0.21 264)' : 'oklch(0.45 0.02 264)'}
        strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  profile: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4"
        stroke={active ? 'oklch(0.62 0.21 264)' : 'oklch(0.45 0.02 264)'}
        strokeWidth="2" fill={active ? 'oklch(0.62 0.21 264 / 20%)' : 'none'}/>
      <path d="M4 21c0-4 4-7 8-7s8 3 8 7"
        stroke={active ? 'oklch(0.62 0.21 264)' : 'oklch(0.45 0.02 264)'}
        strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  ),
};

const TAB_LABELS: Record<TabId, string> = {
  dashboard: 'Acasă',
  transactions: 'Tranzacții',
  budget: 'Buget',
  reports: 'Rapoarte',
  profile: 'Profil',
};

interface BottomNavProps {
  active: string;
  onChange: (tab: string) => void;
}

function BottomNav({ active, onChange }: BottomNavProps) {
  const tabs: TabId[] = ['dashboard', 'transactions', 'budget', 'reports', 'profile'];
  return (
    <div className="shrink-0 bg-background pt-2 pb-[max(16px,env(safe-area-inset-bottom))] border-t border-border">
      <div className="flex justify-around items-center bg-card mx-3 rounded-[22px] py-2 px-1.5 border border-border relative">
        {tabs.map(t => {
          const isActive = active === t;
          return (
            <button
              key={t}
              onClick={() => onChange(t)}
              className="flex flex-col items-center gap-[3px] flex-1 min-w-0 bg-transparent border-none cursor-pointer py-1.5 px-1"
            >
              {TAB_ICONS[t](isActive)}
              <span className={cn(
                'text-[10px] font-semibold tracking-tight',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}>{TAB_LABELS[t]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface FABProps {
  onClick: () => void;
}

function FAB({ onClick }: FABProps) {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-[calc(80px+max(16px,env(safe-area-inset-bottom)))] right-[22px] z-[35] w-14 h-14 rounded-full bg-primary border-none cursor-pointer text-primary-foreground shadow-[0_8px_24px_oklch(0.62_0.21_264_/_40%)] flex items-center justify-center transition-transform active:scale-95"
      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
    </button>
  );
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

function Card({ children, className, style, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-card rounded-[18px] p-[18px] border border-border',
        onClick && 'cursor-pointer hover:bg-card/80 transition-colors',
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}

interface SideNavProps {
  active: string;
  onChange: (tab: string) => void;
  onAdd: () => void;
}

function SideNav({ active, onChange, onAdd }: SideNavProps) {
  const tabs: TabId[] = ['dashboard', 'transactions', 'budget', 'reports', 'profile'];
  return (
    <div className="w-60 shrink-0 h-dvh bg-card border-r border-border flex flex-col px-3 py-5">
      <div className="px-3 pb-6 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-[10px] bg-primary flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M21 7H3a1 1 0 00-1 1v12a1 1 0 001 1h18a1 1 0 001-1V8a1 1 0 00-1-1z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M16 3H8L3 7h18l-5-4z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
            <circle cx="12" cy="14" r="2" fill="white"/>
          </svg>
        </div>
        <span className="text-lg font-bold text-foreground tracking-tight">MoneyFlow</span>
      </div>

      <button
        onClick={onAdd}
        className="bg-primary text-primary-foreground border-none rounded-[14px] py-3 px-4 mx-1 mb-5 cursor-pointer flex items-center gap-2 text-sm font-bold shadow-[0_4px_16px_oklch(0.62_0.21_264_/_35%)] transition-opacity hover:opacity-90"
      >
        <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
        Adaugă tranzacție
      </button>

      <div className="flex-1 flex flex-col gap-0.5">
        {tabs.map(t => {
          const isActive = active === t;
          return (
            <button
              key={t}
              onClick={() => onChange(t)}
              className={cn(
                'border-none cursor-pointer py-2.5 px-3 rounded-xl flex items-center gap-3 transition-all text-left',
                isActive ? 'bg-primary/15 text-primary' : 'bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              )}
            >
              {TAB_ICONS[t](isActive)}
              <span className="text-sm font-semibold">{TAB_LABELS[t]}</span>
            </button>
          );
        })}
      </div>

      <div className="px-3 pt-3 pb-1 text-[11px] text-muted-foreground/50 font-medium">
        MoneyFlow · v1.0.0
      </div>
    </div>
  );
}

export { ScreenHeader, BottomNav, FAB, Card, SideNav, TAB_ICONS, TAB_LABELS };
