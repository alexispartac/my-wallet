// Charts — Donut + Line + ProgressBar
// All with animation, RON-aware

function DonutChart({ data, size = 220, thickness = 26 }) {
  // data: [{ label, value, color }]
  const total = data.reduce((a, b) => a + b.value, 0);
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const cx = size / 2, cy = size / 2;

  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    let raf;
    const start = performance.now();
    const dur = 900;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setT(eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  let offset = 0;
  const segments = data.map((d, i) => {
    const frac = d.value / total;
    const len = c * frac * t;
    const seg = (
      <circle
        key={i}
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={d.color}
        strokeWidth={thickness}
        strokeDasharray={`${len} ${c}`}
        strokeDashoffset={-offset}
        strokeLinecap="butt"
        style={{ transition: 'none' }}
      />
    );
    offset += c * frac * t;
    return seg;
  });

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F1F5F9" strokeWidth={thickness}/>
        {segments}
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      }}>
        <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500, letterSpacing: 0.5, textTransform: 'uppercase' }}>Total cheltuit</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: '#1A3C5E', marginTop: 2, letterSpacing: -0.5 }}>
          {Math.round(total * t).toLocaleString('ro-RO')}
        </div>
        <div style={{ fontSize: 12, color: '#64748B', marginTop: 0 }}>lei</div>
      </div>
    </div>
  );
}

function LineChart({ data, width = 326, height = 160 }) {
  // data: [{ month, income, expense }]
  const pad = { l: 8, r: 8, t: 14, b: 24 };
  const w = width - pad.l - pad.r;
  const h = height - pad.t - pad.b;

  const max = Math.max(...data.flatMap(d => [d.income, d.expense])) * 1.1;

  const x = (i) => pad.l + (i / (data.length - 1)) * w;
  const y = (v) => pad.t + h - (v / max) * h;

  const path = (key) => data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d[key])}`).join(' ');
  const areaPath = (key) => `${path(key)} L ${x(data.length - 1)} ${pad.t + h} L ${x(0)} ${pad.t + h} Z`;

  const [reveal, setReveal] = React.useState(0);
  React.useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 1100);
      const eased = 1 - Math.pow(1 - p, 3);
      setReveal(eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16A34A" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#16A34A" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EA580C" stopOpacity="0.22"/>
          <stop offset="100%" stopColor="#EA580C" stopOpacity="0"/>
        </linearGradient>
        <clipPath id="revealClip">
          <rect x={pad.l} y={0} width={w * reveal} height={height}/>
        </clipPath>
      </defs>

      {/* gridlines */}
      {[0.25, 0.5, 0.75].map((g, i) => (
        <line key={i} x1={pad.l} x2={pad.l + w} y1={pad.t + h * g} y2={pad.t + h * g}
          stroke="#F1F5F9" strokeWidth="1"/>
      ))}

      <g clipPath="url(#revealClip)">
        <path d={areaPath('income')}  fill="url(#incGrad)"/>
        <path d={areaPath('expense')} fill="url(#expGrad)"/>
        <path d={path('income')}  fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d={path('expense')} fill="none" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </g>

      {/* dots on last point */}
      {reveal > 0.95 && (
        <>
          <circle cx={x(data.length - 1)} cy={y(data[data.length-1].income)}  r="5" fill="#fff" stroke="#16A34A" strokeWidth="2.5"/>
          <circle cx={x(data.length - 1)} cy={y(data[data.length-1].expense)} r="5" fill="#fff" stroke="#EA580C" strokeWidth="2.5"/>
        </>
      )}

      {/* month labels */}
      {data.map((d, i) => (
        <text key={i} x={x(i)} y={height - 6} textAnchor="middle"
          fontSize="11" fill="#94A3B8" fontWeight="500"
          fontFamily="inherit">{d.month}</text>
      ))}
    </svg>
  );
}

function ProgressBar({ value, max, color, height = 8, animate = true }) {
  const pct = Math.min(100, (value / max) * 100);
  const [w, setW] = React.useState(0);
  React.useEffect(() => {
    if (!animate) { setW(pct); return; }
    const id = setTimeout(() => setW(pct), 60);
    return () => clearTimeout(id);
  }, [pct, animate]);
  return (
    <div style={{ background: '#F1F5F9', height, borderRadius: 999, overflow: 'hidden' }}>
      <div style={{
        width: w + '%', height: '100%',
        background: color,
        borderRadius: 999,
        transition: 'width 900ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}/>
    </div>
  );
}

Object.assign(window, { DonutChart, LineChart, ProgressBar });
