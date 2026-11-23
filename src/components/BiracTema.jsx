import React, { useEffect, useState } from 'react';
import { Car, Check, Gauge, Link2, Palette, Sparkles, Wrench, X, CircleDot } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useSajt } from '../kontekst/Sajt.jsx';
import { kljucIzPutanje } from '../i18n/jezici.js';
import { TEME } from '../config/teme.js';
import { DELATNOSTI } from '../config/sajt.js';
import { delatnostSajta, idTemeSajta, sacuvajUKonfiguraciju } from '../lib/tema.js';
import { cx } from './primitivi.jsx';

const IKONE = { perionica: Car, detailing: Sparkles, tehnicki: Gauge, vulkanizer: CircleDot, servis: Wrench };

/*
 * BIRAČ TEME I DELATNOSTI — jedan klik menja ceo izgled sajta (boje, fontove,
 * raspored, animacije) ili sadržaj (usluge, cene, tekstove) za drugu vrstu
 * posla, bez ponovnog učitavanja. Vidi se samo dok je `demo: true` ili u
 * `npm run dev`; na pravom sajtu ga nema.
 *
 * U `npm run dev` dugme „Postavi kao …” upisuje izbor u servis.js. Na
 * objavljenom demo sajtu izbor važi u tom browseru, a „Kopiraj link” daje
 * adresu sa ?tema=…&delatnost=… — klijent vidi tačno taj spoj.
 */
export default function BiracTema() {
    const { t, tx, tema, postaviTemu, delatnost, postaviDelatnost, servis } = useSajt();
    // Na zakazivanju i stranici usluge je na telefonu traka sa dugmetom na dnu — birač se tu skriva.
    const naZakazivanju = ['zakazivanje', 'usluga'].includes(kljucIzPutanje(useLocation().pathname));
    const [otvoren, setOtvoren] = useState(false);
    const [kartica, setKartica] = useState('teme');
    const [poruka, setPoruka] = useState('');
    const [temaSajta, setTemaSajta] = useState(idTemeSajta());
    const [delatnostSajtaId, setDelatnostSajta] = useState(delatnostSajta());
    const dev = Boolean(import.meta.env?.DEV);

    useEffect(() => {
        if (!otvoren) return undefined;
        const esc = (e) => e.key === 'Escape' && setOtvoren(false);
        window.addEventListener('keydown', esc);
        return () => window.removeEventListener('keydown', esc);
    }, [otvoren]);

    useEffect(() => setPoruka(''), [tema.id, delatnost, kartica]);

    const sacuvaj = async () => {
        try {
            if (kartica === 'teme') { await sacuvajUKonfiguraciju('tema', tema.id); setTemaSajta(tema.id); }
            else { await sacuvajUKonfiguraciju('delatnost', delatnost); setDelatnostSajta(delatnost); }
            setPoruka(t.tema.sacuvano);
        } catch (e) {
            setPoruka(String(e.message || e));
        }
    };

    const kopirajLink = async () => {
        const url = new URL(window.location.href);
        url.searchParams.set('tema', tema.id);
        url.searchParams.set('delatnost', delatnost);
        try { await navigator.clipboard.writeText(url.href); setPoruka(t.tema.kopirano); } catch { setPoruka(url.href); }
    };

    const stavka = (aktivna, onClick, levo, naslov, podnaslov, oznaka) => (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={aktivna}
            className={cx('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors', aktivna ? 'bg-black/[0.06]' : 'hover:bg-black/[0.035]')}
        >
            {levo}
            <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-sm font-semibold">
                    {naslov}
                    {oznaka && <span className="rounded bg-black/[0.07] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-black/60">{t.tema.aktivna}</span>}
                </span>
                <span className="block truncate text-xs text-black/55">{podnaslov}</span>
            </span>
            {aktivna && <Check size={16} className="shrink-0" />}
        </button>
    );

    const jeSacuvano = kartica === 'teme' ? tema.id === temaSajta : delatnost === delatnostSajtaId;

    return (
        <div className={cx('fixed z-[60] font-[Inter,system-ui,sans-serif] text-[#1d1d1f]', naZakazivanju ? 'bottom-4 left-4 hidden lg:block' : 'bottom-4 left-4')} style={{ letterSpacing: 0, textTransform: 'none' }}>
            {otvoren && (
                <div
                    role="dialog"
                    aria-label={t.tema.naslov}
                    className="mb-3 w-[min(92vw,390px)] overflow-hidden rounded-2xl border border-black/10 bg-white/95 shadow-2xl backdrop-blur-xl"
                    style={{ animation: 'fade-up .35s cubic-bezier(.22,1,.36,1) both' }}
                >
                    <div className="flex items-start justify-between gap-3 border-b border-black/10 px-4 py-3">
                        <div>
                            <p className="m-0 text-sm font-semibold">{t.tema.naslov}</p>
                            <p className="m-0 text-xs text-black/55">{t.tema.podnaslov}</p>
                        </div>
                        <button type="button" onClick={() => setOtvoren(false)} aria-label={t.opste.zatvori} className="rounded-full p-1.5 hover:bg-black/5">
                            <X size={16} />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-1 border-b border-black/10 p-2" role="tablist">
                        {[['teme', t.tema.teme, TEME[tema.id]?.naziv], ['delatnosti', t.tema.delatnosti, tx(DELATNOSTI[delatnost]?.naziv)]].map(([id, naziv, izbor]) => (
                            <button key={id} type="button" role="tab" aria-selected={kartica === id} onClick={() => setKartica(id)} className={cx('rounded-lg px-3 py-2 text-left text-sm transition-colors', kartica === id ? 'bg-[#1d1d1f] text-white' : 'hover:bg-black/5')}>
                                <span className="block font-medium">{naziv}</span>
                                <span className={cx('block truncate text-xs', kartica === id ? 'text-white/65' : 'text-black/50')}>{izbor}</span>
                            </button>
                        ))}
                    </div>
                    <ul className="m-0 max-h-[50vh] list-none space-y-1 overflow-y-auto p-2">
                        {kartica === 'teme' && Object.entries(TEME).map(([id, tm]) => (
                            <li key={id}>
                                {stavka(
                                    tema.id === id,
                                    () => postaviTemu(id),
                                    <span className="flex shrink-0 overflow-hidden rounded-md border border-black/10" aria-hidden="true">
                                        {[tm.boje.paper, tm.boje.ink, tm.boje.brand, tm.boje.akcenat].map((b, i) => <span key={i} className="h-9 w-3.5" style={{ background: b }} />)}
                                    </span>,
                                    <span style={{ fontFamily: tm.fontovi.naslov }}>{tm.naziv}</span>,
                                    `${t.tema.po} ${tm.inspiracija}`,
                                    id === temaSajta,
                                )}
                            </li>
                        ))}
                        {kartica === 'delatnosti' && Object.entries(DELATNOSTI).map(([id, d]) => {
                            const Ikona = IKONE[id] ?? Car;
                            return (
                                <li key={id}>
                                    {stavka(
                                        delatnost === id,
                                        () => postaviDelatnost(id),
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/[0.05]" aria-hidden="true"><Ikona size={18} strokeWidth={1.6} /></span>,
                                        tx(d.naziv),
                                        tx(d.opis),
                                        id === delatnostSajtaId,
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                    <div className="space-y-2 border-t border-black/10 px-4 py-3 text-xs">
                        <p className="m-0 text-black/60">{kartica === 'teme' ? TEME[tema.id]?.opis : `${servis.naziv} · ${servis.kategorije.length} ${t.nav.usluge.toLowerCase()}`}</p>
                        {dev ? (
                            <button
                                type="button"
                                onClick={sacuvaj}
                                disabled={jeSacuvano}
                                className="w-full rounded-lg bg-[#1d1d1f] px-3 py-2.5 text-sm font-medium text-white transition-opacity disabled:opacity-35"
                            >
                                {kartica === 'teme' ? t.tema.sacuvaj : t.tema.sacuvajDelatnost}
                            </button>
                        ) : (
                            <p className="m-0 text-black/60">{t.tema.samoPregled} <code className="rounded bg-black/5 px-1">{kartica === 'teme' ? `tema: '${tema.id}'` : `delatnost: '${delatnost}'`}</code></p>
                        )}
                        <button type="button" onClick={kopirajLink} className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm font-medium hover:bg-black/[0.035]">
                            <Link2 size={14} /> {t.tema.link}
                        </button>
                        {poruka && <p className="m-0 break-all font-medium text-emerald-700" role="status">{poruka}</p>}
                    </div>
                </div>
            )}
            <button
                type="button"
                onClick={() => setOtvoren((o) => !o)}
                aria-expanded={otvoren}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/95 px-4 py-2.5 text-sm font-medium shadow-lg backdrop-blur-xl transition-transform hover:-translate-y-0.5"
            >
                <Palette size={16} /><span className={naZakazivanju ? 'hidden lg:inline' : ''}>{TEME[tema.id]?.naziv} · <span className="text-black/55">{tx(DELATNOSTI[delatnost]?.naziv)}</span></span>
            </button>
        </div>
    );
}
