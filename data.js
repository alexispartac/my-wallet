// MoneyFlow — sample data (RO)
window.MF_CATEGORIES = [
  { id: 'food',    name: 'Mâncare',      icon: '🍔', color: '#EA580C' },
  { id: 'trans',   name: 'Transport',    icon: '🚌', color: '#2563EB' },
  { id: 'util',    name: 'Utilități',    icon: '💡', color: '#F59E0B' },
  { id: 'fun',     name: 'Divertisment', icon: '🎬', color: '#8B5CF6' },
  { id: 'health',  name: 'Sănătate',     icon: '💊', color: '#EC4899' },
  { id: 'home',    name: 'Casă',         icon: '🏠', color: '#0EA5E9' },
  { id: 'cloth',   name: 'Haine',        icon: '👕', color: '#14B8A6' },
  { id: 'edu',     name: 'Educație',     icon: '📚', color: '#6366F1' },
  { id: 'gift',    name: 'Cadouri',      icon: '🎁', color: '#DC2626' },
  { id: 'cafe',    name: 'Cafenele',     icon: '☕', color: '#A16207' },
  { id: 'salary',  name: 'Salariu',      icon: '💼', color: '#16A34A' },
  { id: 'free',    name: 'Freelance',    icon: '💻', color: '#16A34A' },
];

window.MF_BUDGETS = [
  { catId: 'food',   limit: 1200 },
  { catId: 'trans',  limit: 350 },
  { catId: 'util',   limit: 600 },
  { catId: 'fun',    limit: 400 },
  { catId: 'home',   limit: 1800 },
  { catId: 'cafe',   limit: 250 },
  { catId: 'cloth',  limit: 300 },
  { catId: 'health', limit: 200 },
];

// Generate realistic Romanian transactions for the current month
const today = new Date(2026, 4, 24); // May 24, 2026
function d(daysAgo) {
  const x = new Date(today); x.setDate(x.getDate() - daysAgo); return x;
}

window.MF_TRANSACTIONS = [
  // Income
  { id: 't1', type: 'income',  catId: 'salary', merchant: 'Salariu lunar',         amount: 6800, date: d(23), note: '' },
  { id: 't2', type: 'income',  catId: 'free',   merchant: 'Proiect Freelance',     amount: 1500, date: d(8),  note: 'Design website' },

  // Recent (top of list)
  { id: 't3',  type: 'expense', catId: 'food',  merchant: 'Mega Image',           amount: 87.40,  date: d(0),  note: '' },
  { id: 't4',  type: 'expense', catId: 'cafe',  merchant: '5 to go',               amount: 12.50,  date: d(0),  note: 'Cafea de dimineață' },
  { id: 't5',  type: 'expense', catId: 'trans', merchant: 'STB — Abonament',       amount: 80.00,  date: d(1),  note: '' },
  { id: 't6',  type: 'expense', catId: 'food',  merchant: 'Lidl',                  amount: 142.30, date: d(1),  note: '' },
  { id: 't7',  type: 'expense', catId: 'fun',   merchant: 'Cinema City',           amount: 45.00,  date: d(2),  note: 'Bilet 2 persoane' },
  { id: 't8',  type: 'expense', catId: 'cafe',  merchant: 'Origo Coffee',          amount: 24.00,  date: d(2),  note: '' },
  { id: 't9',  type: 'expense', catId: 'food',  merchant: 'Glovo — Dristor Kebap', amount: 56.80,  date: d(3),  note: '' },
  { id: 't10', type: 'expense', catId: 'home',  merchant: 'Chirie',                amount: 1800,   date: d(4),  note: 'Mai 2026' },
  { id: 't11', type: 'expense', catId: 'util',  merchant: 'Enel — Curent',         amount: 187.50, date: d(5),  note: '' },
  { id: 't12', type: 'expense', catId: 'food',  merchant: 'Carrefour',             amount: 234.10, date: d(6),  note: 'Cumpărături săptămână' },
  { id: 't13', type: 'expense', catId: 'trans', merchant: 'Bolt',                  amount: 28.50,  date: d(7),  note: '' },
  { id: 't14', type: 'expense', catId: 'cafe',  merchant: 'Starbucks',             amount: 32.00,  date: d(8),  note: '' },
  { id: 't15', type: 'expense', catId: 'fun',   merchant: 'Netflix',               amount: 49.99,  date: d(9),  note: 'Abonament' },
  { id: 't16', type: 'expense', catId: 'cloth', merchant: 'H&M',                   amount: 189.00, date: d(10), note: 'Cămașă' },
  { id: 't17', type: 'expense', catId: 'food',  merchant: 'Mega Image',            amount: 64.20,  date: d(11), note: '' },
  { id: 't18', type: 'expense', catId: 'health',merchant: 'Farmacia Tei',          amount: 78.00,  date: d(12), note: '' },
  { id: 't19', type: 'expense', catId: 'util',  merchant: 'Digi — Internet',       amount: 39.00,  date: d(13), note: '' },
  { id: 't20', type: 'expense', catId: 'fun',   merchant: 'Spotify',               amount: 19.99,  date: d(14), note: '' },
  { id: 't21', type: 'expense', catId: 'food',  merchant: 'Profi',                 amount: 51.70,  date: d(15), note: '' },
  { id: 't22', type: 'expense', catId: 'trans', merchant: 'Uber',                  amount: 22.00,  date: d(16), note: '' },
  { id: 't23', type: 'expense', catId: 'util',  merchant: 'Apă Nova',              amount: 86.40,  date: d(17), note: '' },
  { id: 't24', type: 'expense', catId: 'cafe',  merchant: 'Ted\'s Coffee',         amount: 18.00,  date: d(18), note: '' },
  { id: 't25', type: 'expense', catId: 'food',  merchant: 'Auchan',                amount: 168.90, date: d(19), note: '' },
];

// Aggregate helpers
window.MF_HELPERS = {
  catById: (id) => window.MF_CATEGORIES.find(c => c.id === id),
  formatRON: (n) => {
    const v = Math.abs(n);
    const s = v.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return s + ' lei';
  },
  formatRONShort: (n) => {
    const v = Math.abs(n);
    if (v >= 1000) return (v / 1000).toFixed(1).replace('.0', '') + 'k';
    return Math.round(v).toString();
  },
  monthName: (d) => ['Ian','Feb','Mar','Apr','Mai','Iun','Iul','Aug','Sep','Oct','Noi','Dec'][d.getMonth()],
  dayLabel: (date) => {
    const t = new Date(2026, 4, 24);
    const diff = Math.floor((t - date) / (1000*60*60*24));
    if (diff === 0) return 'Azi';
    if (diff === 1) return 'Ieri';
    if (diff < 7) return `Acum ${diff} zile`;
    return `${date.getDate()} ${['ian','feb','mar','apr','mai','iun','iul','aug','sep','oct','noi','dec'][date.getMonth()]}`;
  },
};

// 6-month sold history (for line chart)
window.MF_HISTORY = [
  { month: 'Dec', income: 7200, expense: 6100 },
  { month: 'Ian', income: 6800, expense: 5400 },
  { month: 'Feb', income: 6800, expense: 5900 },
  { month: 'Mar', income: 7100, expense: 5600 },
  { month: 'Apr', income: 6800, expense: 6200 },
  { month: 'Mai', income: 8300, expense: 3858.28 },
];
