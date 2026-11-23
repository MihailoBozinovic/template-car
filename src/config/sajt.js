/*
 * SASTAVLJENI PODACI SAJTA = predložak delatnosti + izmene iz servis.js.
 *
 * Ovaj fajl se ne menja ručno. Sav kod čita `servis` odavde, nikad direktno
 * iz servis.js, pa uvek dobija kompletne podatke: ono što klijent nije
 * popunio dolazi iz predloška (src/config/delatnosti/).
 *
 * Pravila spajanja:
 *  - polje koje u servis.js ne postoji (ili je null) → iz predloška;
 *  - `pocetna`, `oNama`, `zakazivanje`, `recenzije`, `izborVozila` spajaju se
 *    po poljima (može da se pregazi samo `pocetna.hero.naslov`);
 *  - prazan niz ili prazan string NIJE „ne postoji” — sakriva sekciju.
 *
 * Pregled druge delatnosti u biraču (demo): sadržaj (naziv, usluge, tekstovi)
 * dolazi iz njenog predloška, a kontakt, adresa, radno vreme i firma ostaju
 * iz servis.js.
 */
import { servis as podesavanja } from './servis.js';
import { DELATNOSTI, PODRAZUMEVANA_DELATNOST } from './delatnosti/index.js';

export { DELATNOSTI };

/** Polja koja pripadaju delatnosti (pri pregledu druge delatnosti ne važe izmene iz servis.js). */
const SADRZAJ = ['naziv', 'kratkiNaziv', 'slogan', 'opis', 'izborVozila', 'kategorije', 'galerija', 'pocetna', 'oNama', 'recenzije', 'brendovi', 'poklonVaucer', 'pitanja', 'placanje'];
const PO_POLJIMA = ['pocetna', 'oNama', 'zakazivanje', 'recenzije', 'izborVozila', 'poklonVaucer'];

const jeObjekat = (v) => v && typeof v === 'object' && !Array.isArray(v);

const spoji = (osnova, izmene, dubina = 0) => {
    if (izmene == null) return osnova;
    if (!jeObjekat(osnova) || !jeObjekat(izmene)) return izmene;
    const rez = { ...osnova };
    for (const [k, v] of Object.entries(izmene)) {
        if (v == null) continue;
        // Tekst { sr, en } se ne spaja po jezicima — zamenjuje se ceo.
        rez[k] = dubina < 2 && jeObjekat(v) && jeObjekat(osnova[k]) && !('sr' in v) ? spoji(osnova[k], v, dubina + 1) : v;
    }
    return rez;
};

export const idDelatnosti = (id) => (DELATNOSTI[id] ? id : PODRAZUMEVANA_DELATNOST);

/** Kompletni podaci sajta za delatnost (podrazumevano: onu iz servis.js). */
export const sastaviServis = (delatnost = podesavanja.delatnost) => {
    const id = idDelatnosti(delatnost);
    const d = DELATNOSTI[id];
    const pregledDruge = id !== idDelatnosti(podesavanja.delatnost);
    const vlastito = pregledDruge
        ? Object.fromEntries(Object.entries(podesavanja).filter(([k]) => !SADRZAJ.includes(k)))
        : podesavanja;

    const rez = { tim: [], obavestenje: {}, ...d.predlozak };
    for (const [k, v] of Object.entries(vlastito)) {
        if (v == null) continue;
        rez[k] = PO_POLJIMA.includes(k) ? spoji(d.predlozak[k] ?? {}, v) : v;
    }
    rez.delatnost = id;
    rez.delatnostInfo = { naziv: d.naziv, opis: d.opis, schema: d.schema };
    rez.firma = { ...rez.firma, sifraDelatnosti: rez.firma?.sifraDelatnosti || d.sifraDelatnosti };
    rez.kategorije = (rez.kategorije ?? []).map((k) => ({ ...k, usluge: k.usluge ?? [] }));
    return rez;
};

/** Podaci sajta sa delatnošću iz servis.js — ono što ide u gotov sajt. */
export const servis = sastaviServis();
