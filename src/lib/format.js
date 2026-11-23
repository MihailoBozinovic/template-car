/** Cena u dinarima po običaju jezika: 2.800 RSD · 2,800 RSD · 2 800 RSD. */
export const cena = (iznos, jezik = 'sr') => {
    const sep = jezik === 'en' ? ',' : jezik === 'ru' ? ' ' : '.';
    const broj = String(Math.round(iznos)).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
    return `${broj} RSD`;
};

const JEDINICE = {
    sr: { h: 'h', min: 'min' },
    en: { h: 'h', min: 'min' },
    ru: { h: 'ч', min: 'мин' },
};

/** Trajanje: 45 min · 1 h 30 min · 1 ч 30 мин. */
export const trajanje = (minuti, jezik = 'sr') => {
    const j = JEDINICE[jezik] ?? JEDINICE.sr;
    const h = Math.floor(minuti / 60);
    const m = minuti % 60;
    if (!h) return `${m} ${j.min}`;
    return m ? `${h} ${j.h} ${m} ${j.min}` : `${h} ${j.h}`;
};

/** Datum 'YYYY-MM-DD' kao „12. decembar” / „12 December” / „12 декабря”. */
export const datumDugo = (iso, t, jezik = 'sr') => {
    const [, m, d] = iso.split('-').map(Number);
    if (jezik === 'en') return `${d} ${t.meseci[m - 1]}`;
    if (jezik === 'ru') return `${d} ${t.meseciGen[m - 1]}`;
    return `${d}. ${t.meseciGen[m - 1]}`;
};

export const godinaSada = () => new Date().getFullYear();

const DANI = {
    sr: (n) => (n % 10 === 1 && n % 100 !== 11 ? 'dan' : 'dana'),
    en: (n) => (n === 1 ? 'day' : 'days'),
    ru: (n) => (n % 10 === 1 && n % 100 !== 11 ? 'день' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'дня' : 'дней'),
};

/** „2 dana” / „2 days” / „2 дня”. */
export const brojDana = (n, jezik = 'sr') => `${n} ${(DANI[jezik] ?? DANI.sr)(n)}`;

/** Trajanje usluge za prikaz: minuti rada, ili broj dana kad vozilo ostaje kod servisa. */
export const trajanjeUsluge = (u, minuti, jezik = 'sr') => (u.dana ? brojDana(u.dana, jezik) : trajanje(minuti, jezik));
