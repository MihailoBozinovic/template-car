import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check, ChevronRight, Clock, Plus, Tag } from 'lucide-react';
import { useSajt } from '../kontekst/Sajt.jsx';
import { slugIzPutanje } from '../i18n/jezici.js';
import { brojDana, cena, trajanje } from '../lib/format.js';
import { najnizaUKategoriji, opcijeVozila, trajanjeZa } from '../lib/cene.js';
import { Dugme, Foto, Kontejner, Nadnaslov, Naslov, Pojava, Sekcija, cx } from '../components/primitivi.jsx';
import { useZakaziLink } from '../components/Header.jsx';
import { KontaktDugmad, StatusOtvoreno } from '../components/delovi.jsx';
import IzborVozila, { procitajVozilo } from '../components/IzborVozila.jsx';
import ListaUsluga from '../components/ListaUsluga.jsx';
import { Usluge } from '../sekcije/Sekcije.jsx';
import NijePronadjeno from './NijePronadjeno.jsx';

/*
 * STRANICA USLUGE — logika ServicePage-a iz Eclectic-a, generisana iz
 * konfiguracije (jedna stranica po kategoriji, /usluge/<id>):
 *
 *   hero (fotografija, naslov, trajanje + cena „od”)
 *   ├─ glavna kolona: O usluzi · Šta je uključeno · Cene (po vozilu) ·
 *   │                 Kako radimo · Česta pitanja
 *   └─ desno (desktop): lepljivi sažetak sa dugmetom za zakazivanje
 *   Ostale usluge · na telefonu lepljiva traka sa cenom i „Zakaži”
 *
 * Sekcija bez podataka u konfiguraciji se ne prikazuje.
 */

/** Raspon trajanja u kategoriji: „30 min – 2 h” ili „1–3 dana”. */
const rasponTrajanja = (k, jezik) => {
    const dani = k.usluge.filter((u) => u.dana).map((u) => u.dana);
    const minuti = k.usluge.filter((u) => !u.dana).flatMap((u) => (typeof u.trajanje === 'object' ? Object.values(u.trajanje) : [trajanjeZa(u)]));
    const delovi = [];
    if (minuti.length) {
        const [a, b] = [Math.min(...minuti), Math.max(...minuti)];
        delovi.push(a === b ? trajanje(a, jezik) : `${trajanje(a, jezik)} – ${trajanje(b, jezik)}`);
    }
    if (dani.length) {
        const [a, b] = [Math.min(...dani), Math.max(...dani)];
        delovi.push(a === b ? brojDana(a, jezik) : `${a}–${brojDana(b, jezik)}`);
    }
    return delovi.join(' · ');
};

export default function Usluga() {
    const { servis, t, tx, p, jezik } = useSajt();
    const { pathname } = useLocation();
    const zakazi = useZakaziLink();
    const k = servis.kategorije.find((x) => x.id === slugIzPutanje(pathname));
    const [vozilo, setVozilo] = useState(null);

    useEffect(() => {
        const v = procitajVozilo();
        setVozilo(opcijeVozila(servis).some((o) => o.id === v) ? v : null);
    }, [servis]);

    if (!k) return <NijePronadjeno />;

    const odCena = `${t.opste.od} ${cena(najnizaUKategoriji(k), jezik)}`;
    const raspon = rasponTrajanja(k, jezik);
    const zakaziLink = zakazi.to ? { to: `${p('zakazivanje')}?kategorija=${k.id}${vozilo ? `&vozilo=${vozilo}` : ''}` } : zakazi;
    const ostali = servis.kategorije.length > 1;

    return (
        <>
            {/* Hero preko cele širine, header je providan preko njega */}
            <section className="relative flex min-h-[78svh] items-end overflow-hidden bg-tamna text-white md:min-h-[86svh]">
                <Foto src={k.slika} alt={tx(k.naziv)} prioritet okvirKlasa="!absolute inset-0 !rounded-none" sizes="100vw" />
                <div className="veo-dole absolute inset-0" aria-hidden="true" />
                <Kontejner className="na-foto relative pb-16 pt-36 md:pb-24">
                    <nav aria-label="breadcrumb" className="nadnaslov animate-fade-up mb-6 flex flex-wrap items-center gap-1.5 !opacity-85">
                        <Link to={p('pocetna')} className="hover:underline">{t.nav.pocetna}</Link>
                        <ChevronRight size={13} aria-hidden="true" />
                        <Link to={p('cenovnik')} className="hover:underline">{t.nav.cenovnik}</Link>
                    </nav>
                    <Naslov as="h1" nivo="hero" tekst={tx(k.naziv)} odmah className="max-w-5xl" />
                    {k.kratko && <p className="tekst-uvod animate-fade-up m-0 mt-6 max-w-2xl opacity-90" style={{ animationDelay: '.2s' }}>{tx(k.kratko)}</p>}
                    <ul className="animate-fade-up m-0 mt-8 flex list-none flex-wrap gap-2 p-0" style={{ animationDelay: '.3s' }}>
                        {raspon && <li className="inline-flex h-9 items-center gap-2 rounded-full border border-white/20 bg-black/25 px-4 text-sm backdrop-blur-md"><Clock size={15} aria-hidden="true" />{raspon}</li>}
                        <li className="inline-flex h-9 items-center gap-2 rounded-full border border-white/20 bg-black/25 px-4 text-sm backdrop-blur-md"><Tag size={15} aria-hidden="true" />{odCena}</li>
                    </ul>
                </Kontejner>
            </section>

            <Kontejner className="pt-14 md:pt-20">
                <div className="grid gap-14 lg:grid-cols-12">
                    <div className="min-w-0 space-y-20 md:space-y-28 lg:col-span-8">
                        {k.opis?.length > 0 && (
                            <section aria-labelledby="opis">
                                <Nadnaslov className="mb-4">{t.usluga.opis}</Nadnaslov>
                                <div className="space-y-5">
                                    {k.opis.map((pasus, i) => (
                                        <Pojava as="p" key={i} i={i} className={i === 0 ? 'tekst-uvod m-0' : 'tekst-telo m-0 opacity-80'} id={i === 0 ? 'opis' : undefined}>{tx(pasus)}</Pojava>
                                    ))}
                                </div>
                            </section>
                        )}

                        {k.ukljuceno?.length > 0 && (
                            <section aria-labelledby="ukljuceno">
                                <Naslov nivo={2} tekst={t.usluga.ukljuceno} className="mb-10" />
                                <ul id="ukljuceno" className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
                                    {k.ukljuceno.map((s, i) => (
                                        <Pojava as="li" key={i} i={i % 4} className="kartica flex items-start gap-3 p-4">
                                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-naBrand" aria-hidden="true"><Check size={14} strokeWidth={2.5} /></span>
                                            <span className="leading-snug">{tx(s)}</span>
                                        </Pojava>
                                    ))}
                                </ul>
                            </section>
                        )}

                        <section aria-labelledby="cene">
                            <Naslov nivo={2} tekst={t.usluga.cene} className="mb-8" />
                            <span id="cene" />
                            <IzborVozila vozilo={vozilo} onIzbor={setVozilo} className="mb-6" />
                            <ListaUsluga usluge={k.usluge} vozilo={vozilo} />
                            <p className="nadnaslov m-0 mt-6 opacity-60">{servis.firma.pdvObveznik ? t.cenovnik.pdvDa : t.cenovnik.pdvNe}</p>
                        </section>

                        {k.koraci?.length > 0 && (
                            <section aria-labelledby="proces">
                                <Naslov nivo={2} tekst={t.usluga.proces} className="mb-10" />
                                <ol id="proces" className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2">
                                    {k.koraci.map((kr, i) => (
                                        <Pojava as="li" key={i} i={i} className="border-t pt-5" style={{ borderColor: 'rgb(var(--c-linija) / .25)' }}>
                                            <span className="nadnaslov text-brand">{String(i + 1).padStart(2, '0')}</span>
                                            <h3 className="naslov naslov-3 m-0 mt-3">{tx(kr.naslov)}</h3>
                                            <p className="tekst-telo m-0 mt-2 opacity-75">{tx(kr.tekst)}</p>
                                        </Pojava>
                                    ))}
                                </ol>
                            </section>
                        )}

                        {k.pitanja?.length > 0 && (
                            <section aria-labelledby="pitanja-usluge">
                                <Naslov nivo={2} tekst={t.usluga.pitanja} className="mb-8" />
                                <div id="pitanja-usluge" className="border-t" style={{ borderColor: 'rgb(var(--c-linija) / .8)' }}>
                                    {k.pitanja.map((q, i) => (
                                        <details key={i} className="group border-b" style={{ borderColor: 'rgb(var(--c-linija) / .18)' }}>
                                            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                                                <span className="naslov naslov-3">{tx(q.pitanje)}</span>
                                                <Plus size={22} strokeWidth={1.25} className="shrink-0 transition-transform duration-300 group-open:rotate-45" aria-hidden="true" />
                                            </summary>
                                            <p className="tekst-telo m-0 max-w-3xl pb-7 opacity-80">{tx(q.odgovor)}</p>
                                        </details>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Desktop: lepljivi sažetak */}
                    <aside className="hidden lg:col-span-4 lg:block" aria-label={t.usluga.sazetak}>
                        <div className="kartica sticky top-28 space-y-6 p-7">
                            <div>
                                <p className="nadnaslov m-0 opacity-60">{t.usluga.sazetak}</p>
                                <p className="naslov naslov-3 m-0 mt-3">{tx(k.naziv)}</p>
                            </div>
                            <dl className="m-0 space-y-3 text-sm">
                                {raspon && <div className="flex justify-between gap-4"><dt className="opacity-60">{t.usluga.trajanje}</dt><dd className="m-0 text-right">{raspon}</dd></div>}
                                <div className="flex justify-between gap-4"><dt className="opacity-60">{t.usluga.cenaOd}</dt><dd className="m-0 tabular-nums">{cena(najnizaUKategoriji(k), jezik)}</dd></div>
                            </dl>
                            <Dugme {...zakaziLink} className="w-full">{t.usluga.zakaziOvo}</Dugme>
                            <StatusOtvoreno className="nadnaslov block opacity-75" />
                            <KontaktDugmad className="!gap-1.5 [&>a]:!px-3 [&>a]:!text-[0.72rem]" />
                        </div>
                    </aside>
                </div>
            </Kontejner>

            {ostali && <Usluge izostavi={k.id} naslov={t.usluga.ostale} />}
            {!ostali && <Sekcija />}

            {/* Telefon: lepljiva traka sa cenom i dugmetom */}
            <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-paper/95 px-4 pt-3 backdrop-blur-md lg:hidden" style={{ borderColor: 'rgb(var(--c-linija) / .12)', paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
                <div className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                        <p className="m-0 truncate text-sm font-medium">{tx(k.naziv)}</p>
                        <p className="m-0 text-xs opacity-65">{odCena}{raspon ? ` · ${raspon}` : ''}</p>
                    </div>
                    <Dugme {...zakaziLink} className={cx('!min-h-[2.9rem] shrink-0 !px-5')}>{t.cenovnik.zakazi}</Dugme>
                </div>
            </div>
            <div className="h-20 lg:hidden" aria-hidden="true" />
        </>
    );
}
