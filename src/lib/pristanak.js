/*
 * Saglasnost za kolačiće (ZZPL / GDPR). Neophodni rade uvek; analitika (GA4,
 * Meta Pixel) se učitava TEK posle „Prihvati sve”, nikad pre.
 */
import { servis } from '../config/sajt.js';

const KLJUC = 'pristanak.v1';
export const DOGADJAJ = 'pristanak-promenjen';

export const procitajPristanak = () => {
    try { return localStorage.getItem(KLJUC); } catch { return null; }
};

export const sacuvajPristanak = (vrednost) => {
    try { localStorage.setItem(KLJUC, vrednost); } catch { /* */ }
    window.dispatchEvent(new CustomEvent(DOGADJAJ, { detail: vrednost }));
    if (vrednost === 'sve') ucitajAnalitiku();
};

export const zaboraviPristanak = () => {
    try { localStorage.removeItem(KLJUC); } catch { /* */ }
    window.dispatchEvent(new CustomEvent(DOGADJAJ, { detail: null }));
};

export const imaAnalitike = () => Boolean(servis.analitika?.ga4 || servis.analitika?.metaPixel);

let ucitano = false;
export const ucitajAnalitiku = () => {
    if (ucitano || typeof document === 'undefined') return;
    ucitano = true;
    const { ga4, metaPixel } = servis.analitika ?? {};
    if (ga4) {
        const s = document.createElement('script');
        s.async = true;
        s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4)}`;
        document.head.appendChild(s);
        window.dataLayer = window.dataLayer || [];
        window.gtag = function gtag() { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', ga4, { anonymize_ip: true });
    }
    if (metaPixel) {
        /* eslint-disable */
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
        window.fbq('init', metaPixel);
        window.fbq('track', 'PageView');
    }
};

/** Događaj za analitiku (npr. poslat zahtev za termin), samo ako je dozvoljeno. */
export const zabeleziDogadjaj = (ime, podaci = {}) => {
    if (procitajPristanak() !== 'sve') return;
    window.gtag?.('event', ime, podaci);
    if (ime === 'zahtev_za_termin') window.fbq?.('track', 'Schedule');
};
