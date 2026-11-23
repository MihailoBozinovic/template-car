/*
 * ZAKAZIVANJE — logika koraka (ista ideja kao u Template Frizeri / AllSeasons):
 *
 *  - koraci imaju IMENA, ne brojeve, i idu redom kojim odgovori zavise jedan
 *    od drugog: vozilo odlučuje cenu i trajanje → usluga → termin → podaci →
 *    potvrda;
 *  - korak „vozilo” se prikazuje samo kad servis ima bar DVE opcije u
 *    `izborVozila` (tehnički pregled ili auto servis ga obično nemaju);
 *  - `dozvoljeniKorak` samo SPUŠTA željeni korak do prvog bez odgovora (nikad
 *    ga ne diže) — to pokriva vraćeni nacrt, promenjeno vozilo i termin koji je
 *    ispao iz mreže.
 */
import { cenaJeOd, cenaZa, minutaTermina, opcijeVozila, trajanjeZa } from './cene.js';

export const KORACI = ['vozilo', 'usluga', 'termin', 'podaci', 'potvrda'];

export const vidljiviKoraci = (servis) => KORACI.filter((k) => k !== 'vozilo' || opcijeVozila(servis).length >= 2);

const ODGOVOR = {
    vozilo: (s) => Boolean(s.vozilo),
    usluga: (s) => s.usluge.length > 0,
    termin: (s) => Boolean(s.datum && s.vreme),
    podaci: () => true,
    potvrda: () => true,
};

export const dozvoljeniKorak = (zeljeni, stanje, koraci) => {
    if (!koraci.includes(zeljeni)) zeljeni = KORACI.slice(KORACI.indexOf(zeljeni) + 1).find((k) => koraci.includes(k)) ?? koraci[0];
    const do_ = koraci.indexOf(zeljeni);
    for (let i = 0; i < do_; i++) {
        if (!ODGOVOR[koraci[i]](stanje)) return koraci[i];
    }
    return koraci.includes(zeljeni) ? zeljeni : koraci[0];
};

/** Sve usluge ravno, sa kategorijom. */
export const sveUsluge = (servis) => servis.kategorije.flatMap((k) => k.usluge.map((u) => ({ ...u, kategorija: k.id })));

/** Koliko minuta zauzimaju izabrane usluge (vozilo koje ostaje danima = samo prijem, jednom). */
export const ukupnoMinuta = (izabrane, vozilo, servis) => {
    const danima = izabrane.filter((u) => u.dana);
    const rad = izabrane.filter((u) => !u.dana).reduce((a, u) => a + trajanjeZa(u, vozilo), 0);
    return rad + (danima.length ? minutaTermina(danima[0], vozilo, servis) : 0);
};
export const ukupnoDana = (izabrane) => Math.max(0, ...izabrane.map((u) => u.dana || 0));
export const ukupnaCena = (izabrane, vozilo) => izabrane.reduce((a, u) => a + cenaZa(u, vozilo), 0);
export const imaCenuOd = (izabrane, vozilo) => izabrane.some((u) => cenaJeOd(u, vozilo));

/* ── Provera podataka ───────────────────────────────────────────────────── */

const cistTelefon = (t) => t.replace(/[\s\-/().]/g, '');

/**
 * Srpski mobilni/fiksni (060…, +381…, 00381…) ili međunarodni sa „+”.
 * Vraća E.164 ili null.
 */
export const normalizujTelefon = (unos) => {
    const t = cistTelefon(unos || '');
    if (/^0[1-9]\d{6,9}$/.test(t)) return `+381${t.slice(1)}`;
    if (/^00\d{8,14}$/.test(t)) return `+${t.slice(2)}`;
    if (/^\+\d{8,15}$/.test(t)) return t;
    if (/^381\d{7,10}$/.test(t)) return `+${t}`;
    return null;
};

export const ispravanEmail = (e) => !e || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());

/** Registarska oznaka: BG-123-AB, NS 1234 CD… — slova, cifre, razmak i crtica, 4–12 znakova. */
export const ispravneTablice = (t) => /^[A-ZČĆŠĐŽ0-9][A-ZČĆŠĐŽ0-9 -]{2,10}[A-ZČĆŠĐŽ0-9]$/i.test((t || '').trim());

/** Polja o vozilu u koraku „Podaci”: 'obavezno' | 'opciono' | 'ne'. */
export const poljaVozila = (servis) => ({ model: 'opciono', tablice: 'ne', ...(servis.zakazivanje?.poljaVozila ?? {}) });

export const greskePodataka = (p, g, servis) => {
    const rez = {};
    const pv = poljaVozila(servis);
    if (!p.ime || p.ime.trim().length < 2) rez.ime = g.ime;
    if (!normalizujTelefon(p.telefon)) rez.telefon = g.telefon;
    if (!ispravanEmail(p.email)) rez.email = g.email;
    if (pv.model === 'obavezno' && (!p.model || p.model.trim().length < 2)) rez.model = g.model;
    if (pv.tablice !== 'ne' && (p.tablice?.trim() || pv.tablice === 'obavezno') && !ispravneTablice(p.tablice)) rez.tablice = g.tablice;
    if (!p.saglasnost) rez.saglasnost = g.saglasnost;
    return rez;
};

/* ── Poruka za servis ──────────────────────────────────────────────────── */

export const tekstPoruke = ({ izabrane, voziloNaziv, datumTekst, vreme, podaci, nazivUsluge, cenaTekst, trajanjeTekst }, t) => {
    const p = t.zakazivanje.poruka;
    const redovi = [
        `${p.naslov}`,
        '',
        `${p.usluge}: ${izabrane.map(nazivUsluge).join(', ')} (${trajanjeTekst}, ${cenaTekst})`,
    ];
    if (voziloNaziv) redovi.push(`${p.vozilo}: ${voziloNaziv}`);
    redovi.push(`${p.termin}: ${datumTekst} ${vreme}`, `${p.ime}: ${podaci.ime.trim()}`, `${p.telefon}: ${normalizujTelefon(podaci.telefon)}`);
    if (podaci.email) redovi.push(`${p.email}: ${podaci.email.trim()}`);
    if (podaci.model) redovi.push(`${p.model}: ${podaci.model.trim()}`);
    if (podaci.tablice) redovi.push(`${p.tablice}: ${podaci.tablice.trim().toUpperCase()}`);
    if (podaci.napomena) redovi.push(`${p.napomena}: ${podaci.napomena.trim()}`);
    return redovi.join('\n');
};

export const linkKanala = (tip, servis, tekst) => {
    const k = servis.kontakt;
    const enc = encodeURIComponent(tekst);
    if (tip === 'whatsapp' && k.whatsapp) return `https://wa.me/${k.whatsapp}?text=${enc}`;
    if (tip === 'viber' && k.viber) return `viber://chat?number=%2B${k.viber}&draft=${enc}`;
    if (tip === 'email' && k.email) return `mailto:${k.email}?subject=${encodeURIComponent(tekst.split('\n')[0])}&body=${enc}`;
    return null;
};

/**
 * Šalje zahtev. Za 'webhook' radi POST i vraća { ok }; za ostale kanale vraća
 * { otvori: url } — stranica otvara aplikaciju.
 */
export const posaljiZahtev = async (servis, zahtev, tekst) => {
    const kanal = servis.zakazivanje?.kanal ?? { tip: 'whatsapp' };
    if (kanal.tip === 'webhook' && kanal.url) {
        try {
            const odg = await fetch(kanal.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({ ...zahtev, poruka: tekst, servis: servis.naziv, izvor: 'sajt' }),
            });
            return { ok: odg.ok };
        } catch {
            return { ok: false };
        }
    }
    const url = linkKanala(kanal.tip, servis, tekst) ?? linkKanala('whatsapp', servis, tekst) ?? linkKanala('email', servis, tekst);
    return url ? { ok: true, otvori: url } : { ok: false };
};
