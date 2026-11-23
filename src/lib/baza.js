/*
 * Sajt može da radi u korenu domena (https://servis.rs/) ili u podfolderu
 * (https://korisnik.github.io/template/). Podfolder i adresa se zadaju pri buildu:
 *
 *   BAZA=/template/ VITE_DOMEN=https://korisnik.github.io npm run build
 *
 * Za GitHub Pages to radi .github/workflows/pages.yml. Bez toga sve je kao
 * pre: koren domena i `domen` iz servis.js.
 */
import { servis } from '../config/sajt.js';

const env = (typeof import.meta !== 'undefined' && import.meta.env) || {};

/** '' u korenu, '/template-demo' u podfolderu (bez kose crte na kraju). */
export const BAZA = String(env.BASE_URL ?? '/').replace(/\/+$/, '');

/** Javna adresa sajta — iz builda (DOMEN) ili iz servis.js. */
export const DOMEN = String(env.VITE_DOMEN || servis.domen).replace(/\/+$/, '');

/** Putanja do fajla iz public/ ('/slike/x.webp') sa podfolderom ispred. */
export const javno = (p) => (typeof p === 'string' && p.startsWith('/') && !p.startsWith('//') ? `${BAZA}${p}` : p);

/** Puna adresa stranice ili fajla, za canonical, Open Graph i sitemap. */
export const apsolutno = (p) => `${DOMEN}${BAZA}${p}`;
