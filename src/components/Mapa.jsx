import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Navigation } from 'lucide-react';
import { useSajt } from '../kontekst/Sajt.jsx';
import { cx } from './primitivi.jsx';

/*
 * MAPA SALONA
 *
 * Vektorska mapa (MapLibre GL) sa OpenFreeMap pločicama: bez API ključa, bez
 * naloga, bez kolačića i besplatna i za komercijalne sajtove. Isti pristup kao
 * mapa u futeru AllSeasons-a.
 *
 *  - stil „positron” (miran, sivi) na svetlim temama, „dark” na tamnim — mapa
 *    izgleda kao deo stranice, a ne kao šareni prozor u nju;
 *  - pozadina, voda i zelenilo se boje tonovima aktivne teme, zgrade su blago
 *    izdignute (3D) pod laganim nagibom;
 *  - pin je u boji teme, sa nazivom servisa; „Uputstva” vodi na Google mape;
 *  - učitava se tek kad je blizu ekrana (biblioteka ~250 KB gzip ide samo na
 *    stranicu Kontakt), a točkić miša ne zumira bez Ctrl — stranica se skroluje
 *    normalno preko mape;
 *  - bez WebGL-a ili mreže ostaje statična kartica sa adresom i linkovima.
 */

const STIL = {
    svetla: 'https://tiles.openfreemap.org/styles/positron',
    tamna: 'https://tiles.openfreemap.org/styles/dark',
};

const hex = (h) => {
    const s = h.replace('#', '');
    const n = parseInt(s.length === 3 ? s.split('').map((c) => c + c).join('') : s, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const mesaj = (a, b, t) => {
    const [x, y] = [hex(a), hex(b)];
    return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(',')})`;
};

/** Boje teme na slojeve stila (samo ono što postoji u stilu; ostalo ostaje). */
/** Nazivi ulica na jeziku sajta: latinica (sr), engleski (en), ćirilica (ru). */
const NAZIV = {
    sr: ['coalesce', ['get', 'name:latin'], ['get', 'name']],
    en: ['coalesce', ['get', 'name_en'], ['get', 'name:latin'], ['get', 'name']],
    ru: ['coalesce', ['get', 'name:ru'], ['get', 'name:nonlatin'], ['get', 'name']],
};
const jezikMape = (map, jezik) => {
    for (const s of map.getStyle().layers) {
        if (s.type !== 'symbol' || !s.layout?.['text-field']) continue;
        try { map.setLayoutProperty(s.id, 'text-field', NAZIV[jezik] ?? NAZIV.sr); } catch { /* */ }
    }
};

const obojiMapu = (map, tema) => {
    const b = tema.boje;
    const tamna = tema.tamna;
    const tlo = tamna ? mesaj(b.paper, '#000000', 0.15) : mesaj(b.mist, '#FFFFFF', 0.35);
    const voda = tamna ? mesaj(b.paper, '#1b2a36', 0.6) : mesaj(b.mist, '#9fb7c4', 0.45);
    const zelenilo = tamna ? mesaj(b.paper, '#22301f', 0.5) : mesaj(b.mist, '#c9d8bd', 0.55);
    const postavi = (sloj, svojstvo, vrednost) => { try { map.setPaintProperty(sloj, svojstvo, vrednost); } catch { /* sloj ne postoji u ovom stilu */ } };
    for (const s of map.getStyle().layers) {
        if (s.type === 'background') postavi(s.id, 'background-color', tlo);
        else if (s.type === 'fill' && /landuse_residential/.test(s.id)) postavi(s.id, 'fill-color', tlo);
        else if (s.type === 'fill' && /water/.test(s.id)) postavi(s.id, 'fill-color', voda);
        else if (s.type === 'fill' && /park|landcover_grass|landcover_wood|landuse_park|green/.test(s.id)) postavi(s.id, 'fill-color', zelenilo);
    }
    const prvaOznaka = map.getStyle().layers.find((s) => s.type === 'symbol')?.id;
    try {
        map.addLayer({
            id: 'zgrade-3d',
            type: 'fill-extrusion',
            source: 'openmaptiles',
            'source-layer': 'building',
            minzoom: 14,
            paint: {
                'fill-extrusion-color': tamna ? mesaj(b.paper, '#FFFFFF', 0.08) : mesaj(b.mist, b.ink, 0.08),
                'fill-extrusion-height': ['coalesce', ['get', 'render_height'], 8],
                'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
                'fill-extrusion-opacity': 0.8,
            },
        }, prvaOznaka);
    } catch { /* ravne zgrade */ }
};

/** Pin u boji teme sa nazivom servisa (DOM element za MapLibre Marker). */
const napraviPin = (naziv, tema) => {
    const el = document.createElement('div');
    // MapLibre pozicionira marker preko `transform` na ovom elementu — animacija ide na unutrašnji.
    el.className = 'mapa-pin';
    el.innerHTML = `<span class="mapa-pin-telo">
        <span class="mapa-pin-oznaka">${naziv.replace(/</g, '&lt;')}</span>
        <svg width="34" height="44" viewBox="0 0 34 44" aria-hidden="true">
            <path d="M17 43c-1-1.6-15-17.4-15-26.6A15 15 0 0 1 32 16.4C32 25.6 18 41.4 17 43z" fill="${tema.boje.brand}" stroke="${tema.tamna ? tema.boje.paper : '#fff'}" stroke-width="2"/>
            <circle cx="17" cy="16.5" r="5.5" fill="${tema.boje.naBrand}"/>
        </svg></span>`;
    return el;
};

export default function Mapa({ className }) {
    const { servis, t, tx, tema, jezik } = useSajt();
    const kontejner = useRef(null);
    const [stanje, setStanje] = useState('ceka'); // ceka | ucitava | spremna | rezerva
    const l = servis.lokacija;
    const { lat, lng } = l.koordinate;
    const googleLink = l.googleMape || `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    const uputstva = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    useEffect(() => {
        const el = kontejner.current;
        if (!el) return undefined;
        let map = null;
        let otkazano = false;

        const napravi = async () => {
            setStanje('ucitava');
            let maplibregl;
            try {
                const [mod] = await Promise.all([import('maplibre-gl'), import('maplibre-gl/dist/maplibre-gl.css')]);
                maplibregl = mod.default ?? mod;
                if (typeof maplibregl?.Map !== 'function') throw new Error('maplibre');
            } catch {
                if (!otkazano) setStanje('rezerva');
                return;
            }
            if (otkazano) return;
            const mirno = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            try {
                map = new maplibregl.Map({
                    container: el,
                    style: tema.tamna ? STIL.tamna : STIL.svetla,
                    center: [lng, lat],
                    zoom: 15.2,
                    pitch: 0,
                    bearing: 0,
                    cooperativeGestures: true,
                    attributionControl: { compact: true },
                    fadeDuration: 0,
                });
            } catch {
                setStanje('rezerva');
                return;
            }
            map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
            let ucitana = false;
            map.on('load', () => {
                ucitana = true;
                obojiMapu(map, tema);
                jezikMape(map, jezik);
                new maplibregl.Marker({ element: napraviPin(servis.naziv, tema), anchor: 'bottom' }).setLngLat([lng, lat]).addTo(map);
                setStanje('spremna');
                // Blagi „dolazak” do servisa: zum i nagib da se vide zgrade.
                const cilj = { center: [lng, lat], zoom: 16.6, pitch: 45, bearing: -12 };
                if (mirno) map.jumpTo(cilj);
                else map.easeTo({ ...cilj, duration: 2200, easing: (x) => 1 - Math.pow(1 - x, 3) });
            });
            map.on('error', () => {
                if (!ucitana && !otkazano) {
                    try { map.remove(); } catch { /* */ }
                    map = null;
                    setStanje('rezerva');
                }
            });
        };

        const io = new IntersectionObserver(([u]) => {
            if (u.isIntersecting) { io.disconnect(); napravi(); }
        }, { rootMargin: '300px' });
        io.observe(el);
        return () => {
            otkazano = true;
            io.disconnect();
            if (map) { try { map.remove(); } catch { /* */ } }
        };
    }, [tema, jezik, lat, lng, servis.naziv]);

    return (
        <div className="relative">
        <div className={cx('foto-okvir relative', className)}>
            {/* h-full/w-full: MapLibre kontejneru postavlja `position: relative`, pa samo `inset-0` ne bi dalo visinu */}
            <div ref={kontejner} className="absolute inset-0 h-full w-full" style={{ filter: tema.slike.filter === 'grayscale' ? 'grayscale(1)' : undefined }} aria-label={t.kontakt.mapa} role="region" />

            {stanje !== 'spremna' && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center" style={{ background: 'rgb(var(--c-mist))' }}>
                    {stanje === 'rezerva' ? (
                        <div className="pointer-events-auto px-6 text-center">
                            <p className="naslov naslov-3 m-0">{l.adresa}</p>
                            <p className="m-0 mt-1 opacity-70">{l.postanskiBroj} {tx(l.grad)}</p>
                        </div>
                    ) : (
                        <span className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent opacity-30" aria-hidden="true" />
                    )}
                </div>
            )}

        </div>
            {/* Kartica sa adresom i linkovima — ispod mape na telefonu, preko mape (dole levo) od tableta */}
            <div className="kartica relative z-[2] mt-3 flex flex-col gap-3 p-4 sm:absolute sm:bottom-4 sm:left-4 sm:mt-0 sm:max-w-xs sm:shadow-lg" style={{ borderRadius: 'min(var(--r-kartica), 14px)' }}>
                <div>
                    <p className="m-0 font-medium">{servis.naziv}</p>
                    <p className="m-0 text-sm opacity-70">{l.adresa}, {tx(l.grad)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <a href={uputstva} target="_blank" rel="noopener noreferrer" className="cip !py-1.5"><Navigation size={14} aria-hidden="true" /> {t.kontakt.uputstva}</a>
                    <a href={googleLink} target="_blank" rel="noopener noreferrer" className="cip !py-1.5"><ExternalLink size={14} aria-hidden="true" /> {t.kontakt.otvoriMapu}</a>
                </div>
            </div>
        </div>
    );
}
