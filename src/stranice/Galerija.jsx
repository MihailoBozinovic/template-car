import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useSajt } from '../kontekst/Sajt.jsx';
import { Foto, Kontejner, Pojava, Sekcija } from '../components/primitivi.jsx';
import ZaglavljeStranice from '../components/ZaglavljeStranice.jsx';
import { javno } from '../lib/baza.js';
import SLIKE from '../config/slike.json';

/** Prikaz preko celog ekrana: strelice, tastatura (← → Esc) i prevlačenje na telefonu. */
const Lightbox = ({ slike, indeks, onZatvori, onPomeri }) => {
    const { t, tx } = useSajt();
    const dodir = useRef(null);
    const zatvoriRef = useRef(null);
    const s = slike[indeks];

    useEffect(() => {
        zatvoriRef.current?.focus();
        const taster = (e) => {
            if (e.key === 'Escape') onZatvori();
            if (e.key === 'ArrowRight') onPomeri(1);
            if (e.key === 'ArrowLeft') onPomeri(-1);
        };
        window.addEventListener('keydown', taster);
        document.documentElement.classList.add('bez-skrola');
        return () => { window.removeEventListener('keydown', taster); document.documentElement.classList.remove('bez-skrola'); };
    }, [onZatvori, onPomeri]);

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label={tx(s.opis) || t.opste.fotografija}
            className="fixed inset-0 z-[80] flex flex-col bg-black/95 text-white"
            style={{ animation: 'ulaz-stranice .3s ease both' }}
            onTouchStart={(e) => { dodir.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
                if (dodir.current == null) return;
                const dx = e.changedTouches[0].clientX - dodir.current;
                if (Math.abs(dx) > 50) onPomeri(dx < 0 ? 1 : -1);
                dodir.current = null;
            }}
        >
            <div className="flex items-center justify-between p-4 text-sm">
                <span className="tabular-nums opacity-70">{indeks + 1} / {slike.length}</span>
                <button ref={zatvoriRef} type="button" onClick={onZatvori} aria-label={t.opste.zatvori} className="rounded-full p-2 hover:bg-white/10"><X size={24} /></button>
            </div>
            <div className="relative flex flex-1 items-center justify-center px-4 pb-4 md:px-20">
                <img key={s.slika} src={javno(s.slika)} srcSet={SLIKE[s.slika] ? `${javno(s.slika).replace(/\.webp$/, '-1920.webp')} 1920w, ${javno(s.slika)} ${SLIKE[s.slika].w}w` : undefined} sizes="100vw" alt={tx(s.opis)} className="max-h-full max-w-full object-contain" style={{ animation: 'ulaz-stranice .4s ease both' }} />
                <button type="button" onClick={() => onPomeri(-1)} aria-label={t.opste.prethodna} className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full p-3 hover:bg-white/10 md:block"><ChevronLeft size={28} /></button>
                <button type="button" onClick={() => onPomeri(1)} aria-label={t.opste.sledeca} className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full p-3 hover:bg-white/10 md:block"><ChevronRight size={28} /></button>
            </div>
            {s.opis && <p className="m-0 px-4 pb-6 text-center text-sm opacity-80">{tx(s.opis)}</p>}
        </div>
    );
};

export default function Galerija() {
    const { servis, t, tx } = useSajt();
    const [filter, setFilter] = useState('sve');
    const [otvorena, setOtvorena] = useState(null);

    const kategorije = servis.kategorije.filter((k) => servis.galerija.some((g) => g.kategorija === k.id));
    const slike = filter === 'sve' ? servis.galerija : servis.galerija.filter((g) => g.kategorija === filter);

    const pomeri = useCallback((d) => setOtvorena((i) => (i + d + slike.length) % slike.length), [slike.length]);
    const zatvori = useCallback(() => setOtvorena(null), []);

    return (
        <>
            <ZaglavljeStranice nadnaslov={t.galerija.nadnaslov} naslov={t.galerija.naslov} uvod={t.galerija.uvod} />
            {kategorije.length > 1 && (
                <Kontejner className="skriven-skrol flex gap-2 overflow-x-auto pb-4">
                    <button type="button" className="cip" aria-pressed={filter === 'sve'} onClick={() => setFilter('sve')}>{t.galerija.sve}</button>
                    {kategorije.map((k) => (
                        <button key={k.id} type="button" className="cip" aria-pressed={filter === k.id} onClick={() => setFilter(k.id)}>{tx(k.naziv)}</button>
                    ))}
                </Kontejner>
            )}
            <Sekcija className="!pt-6">
                <Kontejner>
                    <div className="columns-2 gap-3 md:columns-3 md:gap-4 [&>*]:mb-3 md:[&>*]:mb-4">
                        {slike.map((g, i) => (
                            <Pojava key={g.slika} i={i % 3} className="break-inside-avoid">
                                <button type="button" onClick={() => setOtvorena(i)} className="hover-zum block w-full text-left" aria-label={`${t.galerija.otvori}: ${tx(g.opis)}`}>
                                    <Foto src={g.slika} alt={tx(g.opis)} okvirKlasa={['aspect-[3/4]', 'aspect-square', 'aspect-[4/5]'][i % 3]} sizes="(min-width: 768px) 33vw, 50vw" />
                                </button>
                            </Pojava>
                        ))}
                    </div>
                </Kontejner>
            </Sekcija>
            {otvorena !== null && slike[otvorena] && <Lightbox slike={slike} indeks={otvorena} onZatvori={zatvori} onPomeri={pomeri} />}
        </>
    );
}
