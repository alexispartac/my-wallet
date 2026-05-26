// AddTransaction bottom sheet — the 15-second flow

function AddSheet({ open, onClose }) {
  const [type, setType] = React.useState('expense');
  const [amount, setAmount] = React.useState('');
  const [catId, setCatId] = React.useState(null);
  const [note, setNote] = React.useState('');

  React.useEffect(() => {
    if (open) { setAmount(''); setCatId(null); setNote(''); setType('expense'); }
  }, [open]);

  const cats = window.MF_CATEGORIES.filter(c =>
    type === 'income' ? (c.id === 'salary' || c.id === 'free') : (c.id !== 'salary' && c.id !== 'free')
  );

  const press = (k) => {
    setAmount(prev => {
      if (k === 'back') return prev.slice(0, -1);
      if (k === '.' && prev.includes('.')) return prev;
      if (prev === '0' && k !== '.') return k;
      if (prev === '' && k === '.') return '0.';
      return prev + k;
    });
  };

  if (!open) return null;

  return (
    <>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, zIndex: 100,
        background: 'rgba(15,23,42,0.4)',
        backdropFilter: 'blur(4px)',
        animation: 'mfFade 200ms ease-out',
      }}/>
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 101,
        background: '#fff',
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: '14px 16px 28px',
        animation: 'mfSlideUp 320ms cubic-bezier(0.16, 1, 0.3, 1)',
        maxHeight: '88%', display: 'flex', flexDirection: 'column',
      }}>
        {/* Grabber */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: '#CBD5E1' }}/>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 4px 12px' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1A3C5E' }}>Adaugă tranzacție</div>
          <button onClick={onClose} style={{
            background: '#F1F5F9', border: 'none', cursor: 'pointer',
            width: 28, height: 28, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#64748B" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Type toggle */}
        <div style={{
          display: 'flex', background: '#F1F5F9',
          padding: 4, borderRadius: 14, gap: 4, marginBottom: 14,
        }}>
          {[
            { id: 'expense', label: '💸 Cheltuială', color: '#EA580C' },
            { id: 'income',  label: '💰 Venit',      color: '#16A34A' },
          ].map(opt => {
            const active = type === opt.id;
            return (
              <button key={opt.id} onClick={() => { setType(opt.id); setCatId(null); }} style={{
                flex: 1, padding: '10px 8px', borderRadius: 11,
                border: 'none', cursor: 'pointer',
                background: active ? '#fff' : 'transparent',
                color: active ? opt.color : '#94A3B8',
                fontSize: 13, fontWeight: 700,
                boxShadow: active ? '0 1px 3px rgba(15,23,42,0.08)' : 'none',
                transition: 'all 180ms',
              }}>{opt.label}</button>
            );
          })}
        </div>

        {/* Amount display */}
        <div style={{
          background: type === 'income' ? '#F0FDF4' : '#FFF7ED',
          borderRadius: 18, padding: '20px 18px',
          textAlign: 'center', marginBottom: 12,
          border: `1px solid ${type === 'income' ? '#BBF7D0' : '#FED7AA'}`,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', letterSpacing: 0.5, textTransform: 'uppercase' }}>Suma</div>
          <div style={{
            fontSize: 42, fontWeight: 700, letterSpacing: -1.4, marginTop: 2,
            color: type === 'income' ? '#16A34A' : '#EA580C',
            lineHeight: 1.1,
          }}>
            {type === 'income' ? '+' : '−'}{amount || '0'}
            <span style={{ fontSize: 18, fontWeight: 500, color: '#94A3B8', marginLeft: 4 }}>lei</span>
          </div>
        </div>

        {/* Category grid */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', padding: '0 4px 6px' }}>Categorie</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
            {cats.slice(0, 12).map(c => {
              const active = catId === c.id;
              return (
                <button key={c.id} onClick={() => setCatId(c.id)} style={{
                  background: active ? c.color + '22' : '#F8FAFC',
                  border: active ? `2px solid ${c.color}` : '2px solid transparent',
                  borderRadius: 12, padding: '8px 4px', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                  transition: 'all 150ms',
                }}>
                  <div style={{ fontSize: 20 }}>{c.icon}</div>
                  <div style={{
                    fontSize: 9, fontWeight: 600, color: active ? c.color : '#64748B',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%',
                  }}>{c.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Numeric keypad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 12 }}>
          {['1','2','3','4','5','6','7','8','9','.','0','back'].map(k => (
            <button key={k} onClick={() => press(k)} style={{
              background: '#F8FAFC', border: '1px solid #F1F5F9',
              borderRadius: 12, padding: '12px 0',
              fontSize: 20, fontWeight: 600, color: '#1A3C5E',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {k === 'back' ? (
                <svg width="20" height="14" viewBox="0 0 23 17"><path d="M7 1h13a2 2 0 012 2v11a2 2 0 01-2 2H7l-6-7.5L7 1z" fill="none" stroke="#64748B" strokeWidth="1.6" strokeLinejoin="round"/><path d="M10 5l7 7M17 5l-7 7" stroke="#64748B" strokeWidth="1.6" strokeLinecap="round"/></svg>
              ) : k}
            </button>
          ))}
        </div>

        {/* Save button */}
        <button onClick={onClose} disabled={!amount || !catId} style={{
          background: (!amount || !catId) ? '#E2E8F0' : (type === 'income' ? 'linear-gradient(135deg, #16A34A, #15803D)' : 'linear-gradient(135deg, #2563EB, #1D4ED8)'),
          border: 'none',
          borderRadius: 14, padding: '14px',
          fontSize: 14, fontWeight: 700, color: '#fff',
          cursor: (!amount || !catId) ? 'not-allowed' : 'pointer',
          boxShadow: (!amount || !catId) ? 'none' : '0 6px 16px rgba(37,99,235,0.3)',
        }}>
          Salvează tranzacția
        </button>
      </div>
    </>
  );
}

window.AddSheet = AddSheet;
