/*
 * JEZICI I ADRESE STRANICA
 *
 * Srpski je na korenu sajta (/cenovnik), ostali jezici pod prefiksom
 * (/en/prices, /ru/ceny). Svaka stranica ima prevedenu adresu — bolje za
 * pretragu na tom jeziku — a `kljuc` je isti u svim jezicima, pa izbor jezika
 * vodi na istu stranicu na drugom jeziku.
 *
 * Stranice usluga su dinamične: /usluge/<id kategorije> (en: /services/…).
 * Id kategorije iz servis.js je ujedno i adresa (npr. „poliranje-farova”).
 *
 * Koji jezici su uključeni bira se u servis.js (`jezici`); ovde su svi koje
 * template podržava.
 */
export const SVI_JEZICI = {
    sr: { kod: 'sr', naziv: 'Srpski', kratko: 'SR', locale: 'sr-Latn-RS', og: 'sr_RS', prefiks: '' },
    en: { kod: 'en', naziv: 'English', kratko: 'EN', locale: 'en-GB', og: 'en_GB', prefiks: '/en' },
    ru: { kod: 'ru', naziv: 'Русский', kratko: 'RU', locale: 'ru-RU', og: 'ru_RU', prefiks: '/ru' },
};

export const PODRAZUMEVANI_JEZIK = 'sr';

/** Adrese stranica po jeziku (bez prefiksa jezika). */
export const RUTE = {
    pocetna: { sr: '/', en: '/', ru: '/' },
    cenovnik: { sr: '/cenovnik', en: '/prices', ru: '/ceny' },
    galerija: { sr: '/galerija', en: '/gallery', ru: '/galereya' },
    oNama: { sr: '/o-nama', en: '/about', ru: '/o-nas' },
    zakazivanje: { sr: '/zakazivanje', en: '/book', ru: '/zapis' },
    kontakt: { sr: '/kontakt', en: '/contact', ru: '/kontakty' },
    pitanja: { sr: '/pitanja', en: '/faq', ru: '/voprosy' },
    privatnost: { sr: '/politika-privatnosti', en: '/privacy', ru: '/konfidencialnost' },
    uslovi: { sr: '/uslovi-koriscenja', en: '/terms', ru: '/usloviya' },
    kolacici: { sr: '/kolacici', en: '/cookies', ru: '/cookies' },
};

/** Prefiks stranica pojedinačnih usluga: /usluge/pranje, /en/services/pranje. */
export const RUTA_USLUGE = { sr: '/usluge', en: '/services', ru: '/uslugi' };

const bezKose = (p) => (p.length > 1 ? p.replace(/\/+$/, '') : p);

/**
 * Puna putanja stranice na jeziku, npr. putanja('cenovnik', 'en') → '/en/prices',
 * putanja('usluga', 'sr', 'pranje') → '/usluge/pranje'.
 */
export const putanja = (kljuc, jezik = PODRAZUMEVANI_JEZIK, slug = '') => {
    const prefiks = SVI_JEZICI[jezik]?.prefiks ?? '';
    if (kljuc === 'usluga') return `${prefiks}${RUTA_USLUGE[jezik] ?? RUTA_USLUGE.sr}/${slug}`;
    const deo = RUTE[kljuc]?.[jezik] ?? RUTE[kljuc]?.sr ?? '/';
    if (deo === '/') return prefiks ? `${prefiks}/` : '/';
    return `${prefiks}${deo}`;
};

/** Jezik iz putanje: '/en/prices' → 'en'. */
export const jezikIzPutanje = (path = '/') => {
    const m = /^\/(en|ru)(\/|$)/.exec(path);
    return m ? m[1] : PODRAZUMEVANI_JEZIK;
};

const deoPutanje = (path) => {
    const jezik = jezikIzPutanje(path);
    const prefiks = SVI_JEZICI[jezik].prefiks;
    return { jezik, deo: bezKose(path.slice(prefiks.length) || '/') || '/' };
};

/** Id usluge iz putanje ('/usluge/pranje' → 'pranje'), ili null. */
export const slugIzPutanje = (path = '/') => {
    const { jezik, deo } = deoPutanje(path);
    const m = new RegExp(`^${RUTA_USLUGE[jezik]}/([a-z0-9-]+)$`).exec(deo);
    return m ? m[1] : null;
};

/** Ključ stranice iz putanje, ili null (404). */
export const kljucIzPutanje = (path = '/') => {
    const { jezik, deo } = deoPutanje(path);
    if (slugIzPutanje(path)) return 'usluga';
    for (const [kljuc, adrese] of Object.entries(RUTE)) {
        if (adrese[jezik] === deo) return kljuc;
    }
    return null;
};

/**
 * Tekst iz konfiguracije na jeziku. Polje može biti običan string (isti na
 * svim jezicima) ili { sr, en, ru }; kad prevod fali, vraća srpski.
 */
export const tx = (vrednost, jezik = PODRAZUMEVANI_JEZIK) => {
    if (vrednost && typeof vrednost === 'object' && !Array.isArray(vrednost)) {
        return vrednost[jezik] ?? vrednost[PODRAZUMEVANI_JEZIK] ?? '';
    }
    return vrednost ?? '';
};
