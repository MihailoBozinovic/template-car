/*
 * Aktivna tema i delatnost u browseru.
 *
 * Tema i delatnost sajta su one iz servis.js. Birač (vidljiv dok je
 * `demo: true` ili u `npm run dev`) menja izgled i sadržaj ODMAH, bez
 * ponovnog učitavanja: tema prepisuje <style id="tema"> i atribute na <html>,
 * delatnost menja usluge, tekstove i galeriju. Izbor se pamti u ovom browseru
 * (localStorage) i može da se pošalje linkom (?tema=atelje&delatnost=vulkanizer
 * — demo za tačno tog klijenta).
 */
import { servis as podesavanja } from '../config/servis.js';
import { TEME, resiTemu, cssTeme, atributiTeme } from '../config/teme.js';
import { DELATNOSTI, idDelatnosti } from '../config/sajt.js';

const KLJUC = 'tema.pregled.v1';
const KLJUC_DELATNOST = 'delatnost.pregled.v1';

export const biracUkljucen = () => Boolean(podesavanja.demo) || Boolean(import.meta.env?.DEV);

/** Zapis teme iz servis.js (string ili objekat sa izmenama). */
export const temaSajta = () => podesavanja.tema;
export const idTemeSajta = () => resiTemu(podesavanja.tema).id;
export const delatnostSajta = () => idDelatnosti(podesavanja.delatnost);

const izAdreseIliMemorije = (param, kljuc) => {
    try {
        return new URLSearchParams(window.location.search).get(param) || localStorage.getItem(kljuc);
    } catch {
        return null; // privatni prozor
    }
};

/** Tema za ovaj prikaz: ?tema=… → zapamćeni pregled → tema sajta. */
export const pocetnaTema = () => {
    if (typeof window === 'undefined' || !biracUkljucen()) return resiTemu(temaSajta());
    const id = izAdreseIliMemorije('tema', KLJUC);
    return id && TEME[id] ? zaId(id) : resiTemu(temaSajta());
};

/** Delatnost za ovaj prikaz: ?delatnost=… → zapamćeni pregled → delatnost sajta. */
export const pocetnaDelatnost = () => {
    if (typeof window === 'undefined' || !biracUkljucen()) return delatnostSajta();
    const id = izAdreseIliMemorije('delatnost', KLJUC_DELATNOST);
    return id && DELATNOSTI[id] ? id : delatnostSajta();
};

/** Za id koji je i tema sajta vraća verziju SA izmenama iz servis.js. */
export const zaId = (id) => (id === idTemeSajta() ? resiTemu(temaSajta()) : resiTemu(id));

export const primeniTemu = (tema) => {
    if (typeof document === 'undefined') return;
    let stil = document.getElementById('tema');
    if (!stil) {
        stil = document.createElement('style');
        stil.id = 'tema';
        document.head.appendChild(stil);
    }
    stil.textContent = cssTeme(tema);
    const html = document.documentElement;
    for (const [k, v] of Object.entries(atributiTeme(tema))) html.setAttribute(k, v);
    const boja = document.querySelector('meta[name="theme-color"]');
    if (boja) boja.setAttribute('content', tema.boje.paper);
};

const zapamti = (kljuc, param, id, podrazumevano) => {
    try {
        if (id === podrazumevano) localStorage.removeItem(kljuc);
        else localStorage.setItem(kljuc, id);
        const url = new URL(window.location.href);
        if (url.searchParams.has(param)) {
            url.searchParams.set(param, id);
            window.history.replaceState(null, '', url);
        }
    } catch { /* privatni prozor */ }
};

export const zapamtiPregled = (id) => zapamti(KLJUC, 'tema', id, idTemeSajta());
export const zapamtiDelatnost = (id) => zapamti(KLJUC_DELATNOST, 'delatnost', id, delatnostSajta());

/** U `npm run dev`: upisuje temu ili delatnost u servis.js (Vite middleware u vite.config.js). */
export const sacuvajUKonfiguraciju = async (polje, id) => {
    const odg = await fetch('/__tema', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ polje, id }) });
    if (!odg.ok) throw new Error(await odg.text());
    try { localStorage.removeItem(polje === 'delatnost' ? KLJUC_DELATNOST : KLJUC); } catch { /* */ }
};
