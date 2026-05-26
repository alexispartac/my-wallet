// PhoneShell — header + scroll area + bottom tab bar + FAB

function ScreenHeader({ title, subtitle, right, gradient = false }) {
  return (
    <div style={{
      padding: '12px 20px 14px',
      background: gradient
        ? 'linear-gradient(160deg, #1A3C5E 0%, #2563EB 100%)'
        : '#F8FAFC',
      color: gradient ? '#fff' : '#1A3C5E',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          {subtitle && (
            <div style={{
              fontSize: 12, fontWeight: 500, letterSpacing: 0.6,
              textTransform: 'uppercase',
              color: gradient ? 'rgba(255,255,255,0.7)' : '#64748B',
              marginBottom: 2,
            }}>{subtitle}</div>
          )}
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.6 }}>{title}</div>
        </div>
        {right}
      </div>
    </div>
  );
}

const TAB_ICONS = {
  dashboard: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 12L12 4l9 8v8a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-8z"
        stroke={active ? '#2563EB' : '#94A3B8'} strokeWidth="2" strokeLinejoin="round"
        fill={active ? '#DBEAFE' : 'none'}/>
    </svg>
  ),
  transactions: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="6" width="18" height="13" rx="2" stroke={active ? '#2563EB' : '#94A3B8'} strokeWidth="2" fill={active ? '#DBEAFE' : 'none'}/>
      <path d="M3 10h18" stroke={active ? '#2563EB' : '#94A3B8'} strokeWidth="2"/>
      <circle cx="7" cy="14.5" r="1" fill={active ? '#2563EB' : '#94A3B8'}/>
    </svg>
  ),
  budget: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={active ? '#2563EB' : '#94A3B8'} strokeWidth="2" fill={active ? '#DBEAFE' : 'none'}/>
      <circle cx="12" cy="12" r="4" stroke={active ? '#2563EB' : '#94A3B8'} strokeWidth="2"/>
      <circle cx="12" cy="12" r="1" fill={active ? '#2563EB' : '#94A3B8'}/>
    </svg>
  ),
  reports: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" stroke={active ? '#2563EB' : '#94A3B8'} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  profile: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke={active ? '#2563EB' : '#94A3B8'} strokeWidth="2" fill={active ? '#DBEAFE' : 'none'}/>
      <path d="M4 21c0-4 4-7 8-7s8 3 8 7" stroke={active ? '#2563EB' : '#94A3B8'} strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  ),
};

const TAB_LABELS = {
  dashboard: 'Acasă',
  transactions: 'Tranzacții',
  budget: 'Buget',
  reports: 'Rapoarte',
  profile: 'Profil',
};

function BottomNav({ active, onChange }) {
  const tabs = ['dashboard', 'transactions', 'budget', 'reports', 'profile'];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30,
      paddingBottom: 28, paddingTop: 8,
      background: 'linear-gradient(to top, #fff 70%, rgba(255,255,255,0))',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        background: '#fff',
        margin: '0 12px',
        borderRadius: 22,
        padding: '8px 6px',
        boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.08)',
        border: '1px solid #F1F5F9',
        position: 'relative',
      }}>
        {tabs.map(t => {
          const isActive = active === t;
          return (
            <button key={t} onClick={() => onChange(t)}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '6px 4px', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 3, flex: 1, minWidth: 0,
              }}>
              {TAB_ICONS[t](isActive)}
              <div style={{
                fontSize: 10, fontWeight: 600, letterSpacing: 0.1,
                color: isActive ? '#2563EB' : '#94A3B8',
              }}>{TAB_LABELS[t]}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FAB({ onClick }) {
  return (
    <button onClick={onClick} style={{
      position: 'absolute', bottom: 92, right: 22, zIndex: 35,
      width: 56, height: 56, borderRadius: '50%',
      background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
      border: 'none', cursor: 'pointer', color: '#fff',
      boxShadow: '0 8px 20px rgba(37,99,235,0.45), 0 2px 4px rgba(37,99,235,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'transform 150ms',
    }}
      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>
    </button>
  );
}

function Card({ children, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: '#fff',
      borderRadius: 18,
      padding: 18,
      boxShadow: '0 1px 2px rgba(15,23,42,0.03), 0 4px 14px rgba(15,23,42,0.05)',
      border: '1px solid #F1F5F9',
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}>{children}</div>
  );
}

Object.assign(window, { ScreenHeader, BottomNav, FAB, Card, TAB_ICONS, TAB_LABELS });
