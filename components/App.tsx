'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakButton } from '@/components/TweaksPanel';
import { BottomNav, FAB, SideNav } from '@/components/PhoneShell';
import DashboardScreen from '@/components/screens/Dashboard';
import TransactionsScreen from '@/components/screens/Transactions';
import BudgetScreen from '@/components/screens/Budget';
import ReportsScreen from '@/components/screens/Reports';
import ProfileScreen from '@/components/screens/Profile';
import AddSheet from '@/components/screens/AddSheet';
import Onboarding from '@/components/screens/Onboarding';
import { TransactionsProvider } from '@/components/TransactionsContext';
import { BudgetsProvider } from '@/components/BudgetsContext';

export default function App() {
  const TWEAK_DEFAULTS = {
    font: 'Inter' as string,
    showOnboarding: false,
  };

  const { data: session } = useSession();
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [tab, setTab] = React.useState('dashboard');
  const [addOpen, setAddOpen] = React.useState(false);
  const [onboarding, setOnboarding] = React.useState(t.showOnboarding);
  const [isDesktop, setIsDesktop] = React.useState(false);
  const appRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => { setOnboarding(t.showOnboarding); }, [t.showOnboarding]);

  React.useEffect(() => {
    if (window.location.search.includes('onboarding=1')) {
      setOnboarding(true);
      window.history.replaceState({}, '', '/');
    }
  }, []);

  React.useLayoutEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  React.useEffect(() => {
    const fontMap: Record<string, string> = {
      'Inter':    "'Inter', -apple-system, system-ui, sans-serif",
      'Geist':    "'Geist', -apple-system, system-ui, sans-serif",
      'IBM Plex': "'IBM Plex Sans', -apple-system, system-ui, sans-serif",
    };
    if (appRef.current) appRef.current.style.fontFamily = fontMap[t.font] ?? fontMap['Inter'];
  }, [t.font]);

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };

  const screens: Record<string, React.ReactElement> = {
    dashboard:    <DashboardScreen onNav={setTab} onAdd={() => setAddOpen(true)}/>,
    transactions: <TransactionsScreen/>,
    budget:       <BudgetScreen/>,
    reports:      <ReportsScreen/>,
    profile:      <ProfileScreen onLogout={handleLogout} session={session}/>,
  };

  return (
    <BudgetsProvider>
    <TransactionsProvider>
    <>
      <div
        ref={appRef}
        style={{
          position: 'relative',
          height: '100dvh',
          display: 'flex',
          flexDirection: isDesktop ? 'row' : 'column',
          maxWidth: isDesktop ? undefined : 430,
          width: '100%',
          margin: '0 auto',
          background: 'var(--color-background)',
          overflow: 'hidden',
        }}
      >
        {onboarding ? (
          <Onboarding onFinish={() => { setOnboarding(false); setTweak('showOnboarding', false); }}/>
        ) : isDesktop ? (
          <>
            <SideNav active={tab} onChange={setTab} onAdd={() => setAddOpen(true)}/>
            <div key={tab} style={{
              flex: 1, overflowY: 'auto', overflowX: 'hidden',
              animation: 'mfFade 240ms ease-out',
            }}>
              <div style={{ maxWidth: 900, margin: '0 auto' }}>
                {screens[tab]}
              </div>
            </div>
            <AddSheet open={addOpen} onClose={() => setAddOpen(false)}/>
          </>
        ) : (
          <>
            <div key={tab} style={{
              flex: 1, overflowY: 'auto', overflowX: 'hidden',
              animation: 'mfFade 240ms ease-out',
            }}>
              {screens[tab]}
            </div>
            {tab === 'dashboard' && <FAB onClick={() => setAddOpen(true)}/>}
            <BottomNav active={tab} onChange={setTab}/>
            <AddSheet open={addOpen} onClose={() => setAddOpen(false)}/>
          </>
        )}
      </div>

      <TweaksPanel>
        <TweakSection label="Tipografie">
          <TweakRadio
            label="Font"
            value={t.font}
            options={['Inter', 'Geist', 'IBM Plex']}
            onChange={(v) => setTweak('font', v)}
          />
        </TweakSection>
        <TweakSection label="Onboarding">
          <TweakButton
            label="Reia onboarding-ul"
            onClick={() => setOnboarding(true)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
    </TransactionsProvider>
    </BudgetsProvider>
  );
}
