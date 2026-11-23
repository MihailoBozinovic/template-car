import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { SajtProvider, useSajt } from './kontekst/Sajt.jsx';
import { jezikIzPutanje, kljucIzPutanje, slugIzPutanje } from './i18n/jezici.js';
import { metaStranice, primeniMeta } from './lib/seo.js';
import { biracUkljucen } from './lib/tema.js';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Kolacici from './components/Kolacici.jsx';
import Obavestenje from './components/Obavestenje.jsx';
import BiracTema from './components/BiracTema.jsx';
import Pocetna from './stranice/Pocetna.jsx';
import Cenovnik from './stranice/Cenovnik.jsx';
import Usluga from './stranice/Usluga.jsx';
import Galerija from './stranice/Galerija.jsx';
import ONama from './stranice/ONama.jsx';
import Zakazivanje from './stranice/Zakazivanje.jsx';
import Kontakt from './stranice/Kontakt.jsx';
import Pitanja from './stranice/Pitanja.jsx';
import Pravno from './stranice/Pravno.jsx';
import NijePronadjeno from './stranice/NijePronadjeno.jsx';

const STRANICE = {
    pocetna: Pocetna,
    cenovnik: Cenovnik,
    usluga: Usluga,
    galerija: Galerija,
    oNama: ONama,
    zakazivanje: Zakazivanje,
    kontakt: Kontakt,
    pitanja: Pitanja,
    privatnost: () => <Pravno vrsta="privatnost" />,
    uslovi: () => <Pravno vrsta="uslovi" />,
    kolacici: () => <Pravno vrsta="kolacici" />,
};

/** Glatki skrol (Lenis) za teme koje ga traže — Forge Automotive koristi isti. */
const useGlatkiSkrol = (ukljucen) => {
    useEffect(() => {
        if (!ukljucen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
        let lenis;
        let rafId;
        let ugasen = false;
        import('lenis').then(({ default: Lenis }) => {
            if (ugasen) return;
            lenis = new Lenis({ duration: 1.15, easing: (x) => 1 - Math.pow(1 - x, 3.2), smoothWheel: true });
            const petlja = (vreme) => { lenis.raf(vreme); rafId = requestAnimationFrame(petlja); };
            rafId = requestAnimationFrame(petlja);
            window.__lenis = lenis;
        });
        return () => { ugasen = true; cancelAnimationFrame(rafId); lenis?.destroy(); window.__lenis = undefined; };
    }, [ukljucen]);
};

function Okvir() {
    const { pathname, hash } = useLocation();
    const { tema, jezik, servis } = useSajt();
    const kljuc = kljucIzPutanje(pathname);
    const slug = slugIzPutanje(pathname);
    const Stranica = STRANICE[kljuc] ?? NijePronadjeno;
    const prvi = useRef(true);

    useGlatkiSkrol(tema.pokret.glatkiSkrol);

    // Na promenu stranice: meta podaci, vrh stranice (ili sidro), bez skoka pri prvom učitavanju.
    useEffect(() => {
        primeniMeta(metaStranice(kljuc, jezik, slug, servis));
        if (prvi.current) { prvi.current = false; return; }
        if (hash) {
            const el = document.getElementById(decodeURIComponent(hash.slice(1)));
            if (el) { window.__lenis ? window.__lenis.scrollTo(el, { offset: -140 }) : el.scrollIntoView({ behavior: 'smooth' }); return; }
        }
        window.__lenis ? window.__lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0);
    }, [pathname, hash, kljuc, slug, jezik, servis]);

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <Obavestenje />
            <main id="sadrzaj" key={pathname} className={tema.pokret.prelazStranice === 'fade' && !prvi.current ? 'prelaz-stranice flex-1' : 'flex-1'}>
                <Stranica />
            </main>
            <Footer />
            <Kolacici />
            {biracUkljucen() && <BiracTema />}
        </div>
    );
}

export default function App({ tema, delatnost }) {
    const { pathname } = useLocation();
    return (
        <SajtProvider jezik={jezikIzPutanje(pathname)} tema={tema} delatnost={delatnost}>
            <Okvir />
        </SajtProvider>
    );
}
