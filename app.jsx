// App — manages screen state, renders phone with active screen

function App() {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "font": "Inter",
    "showOnboarding": false
  }/*EDITMODE-END*/;

  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [tab, setTab] = React.useState('dashboard');
  const [addOpen, setAddOpen] = React.useState(false);
  const [onboarding, setOnboarding] = React.useState(t.showOnboarding);

  React.useEffect(() => { setOnboarding(t.showOnboarding); }, [t.showOnboarding]);

  // Apply font
  React.useEffect(() => {
    const fontMap = {
      'Inter':     "'Inter', -apple-system, system-ui, sans-serif",
      'Geist':     "'Geist', -apple-system, system-ui, sans-serif",
      'IBM Plex':  "'IBM Plex Sans', -apple-system, system-ui, sans-serif",
    };
    document.getElementById('phone-root').style.fontFamily = fontMap[t.font] || fontMap.Inter;
  }, [t.font]);

  const screens = {
    dashboard:    <DashboardScreen   onNav={setTab} onAdd={() => setAddOpen(true)}/>,
    transactions: <TransactionsScreen/>,
    budget:       <BudgetScreen/>,
    reports:      <ReportsScreen/>,
    profile:      <ProfileScreen/>,
  };

  const screenLabels = {
    dashboard:    '01 Dashboard',
    transactions: '02 Tranzacții',
    budget:       '03 Buget',
    reports:      '04 Rapoarte',
    profile:      '05 Profil',
  };

  return (
    <>
      <style>{`
        @keyframes mfFade {
          from { opacity: 0 } to { opacity: 1 }
        }
        @keyframes mfSlideUp {
          from { transform: translateY(100%) } to { transform: translateY(0) }
        }
        @keyframes mfFloat {
          from { opacity: 0; transform: translateY(20px) scale(0.85) }
          to { opacity: 1; transform: translateY(0) scale(1) }
        }
        body, #phone-root {
          font-family: 'Inter', -apple-system, system-ui, sans-serif;
        }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at top, #F8FAFC 0%, #E2E8F0 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}>
        <IOSDevice width={390} height={844}>
          <div id="phone-root" data-screen-label={onboarding ? '00 Onboarding' : screenLabels[tab]} style={{
            position: 'absolute', inset: 0,
            background: '#F8FAFC',
            paddingTop: 50,
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
          }}>
            {onboarding ? (
              <Onboarding onFinish={() => { setOnboarding(false); setTweak('showOnboarding', false); }}/>
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
        </IOSDevice>
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
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
