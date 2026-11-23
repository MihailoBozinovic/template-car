import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSajt } from '../kontekst/Sajt.jsx';
import { Dugme, Foto, Nadnaslov, Naslov, cx } from '../components/primitivi.jsx';
import { useZakaziLink } from '../components/Header.jsx';
import { StatusOtvoreno } from '../components/delovi.jsx';

/** Slideshow sa pretapanjem; Ken Burns / blagi zum i trajanje iz teme. */
export const HeroSlajdovi = ({ slike, alt, className, traka = false }) => {
    const { tema } = useSajt();
    const [aktivan, setAktivan] = useState(0);
    const [pauza, setPauza] = useState(false);
    const trajanje = Math.max(5000, (parseFloat(tema.pokret.heroTrajanje) || 7) * 1000 * 0.75);

    useEffect(() => {
        if (slike.length < 2 || pauza) return undefined;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
        const id = setTimeout(() => setAktivan((a) => (a + 1) % slike.length), trajanje);
        return () => clearTimeout(id);
    }, [aktivan, pauza, slike.length, trajanje]);

    return (
        <div className={cx('absolute inset-0 overflow-hidden', className)} onMouseEnter={() => setPauza(true)} onMouseLeave={() => setPauza(false)}>
            {slike.map((s, i) => (
                <div key={s} className={cx('slajd', i === aktivan && 'aktivan')} aria-hidden={i !== aktivan}>
                    <Foto src={s} alt={i === 0 ? alt : ''} prioritet={i === 0} okvirKlasa="!absolute inset-0 !rounded-none" sizes="100vw" />
                </div>
            ))}
            {traka && slike.length > 1 && (
                <div className="absolute bottom-6 right-6 z-10 flex gap-2 md:bottom-10 md:right-10" role="tablist">
                    {slike.map((s, i) => (
                        <button key={s} type="button" onClick={() => setAktivan(i)} aria-label={`${i + 1}/${slike.length}`} aria-selected={i === aktivan} role="tab" className="py-3">
                            <span className="traka-napredak block w-10 md:w-14">
                                {i === aktivan && <span key={`${aktivan}-${pauza}`} style={{ animationDuration: `${trajanje}ms`, animationPlayState: pauza ? 'paused' : 'running' }} />}
                                {i < aktivan && <span style={{ animation: 'none' }} />}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default function Hero() {
    const { servis, t, tx, p, tema } = useSajt();
    const h = servis.pocetna.hero;
    const zakazi = useZakaziLink();
    const slike = h.slike?.length ? h.slike : [''];
    const naslov = tx(h.naslov);
    const akcenat = tx(h.akcenat);
    const r = servis.recenzije;

    const dugmad = (naFoto) => (
        <div className="flex flex-wrap gap-3">
            <Dugme {...zakazi} varijanta={naFoto ? 'foto' : 'primarno'}>{t.nav.zakazi}</Dugme>
            <Dugme to={p('cenovnik')} varijanta={naFoto ? 'fotoObris' : 'sekundarno'} strelica={false}>{t.nav.cenovnik}</Dugme>
        </div>
    );

    /* ── Preko cele širine: tekst dole levo (Topaz, AMMO, Esoteric, Eclectic) ── */
    if (tema.hero === 'puna-levo') {
        return (
            <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-tamna text-white">
                <HeroSlajdovi slike={slike} alt={tx(servis.slogan)} traka />
                <div className="veo-dole absolute inset-0 z-[2]" aria-hidden="true" />
                <div className="na-foto relative z-[3] mx-auto w-full max-w-[110rem] px-5 pb-24 pt-40 md:px-10 md:pb-28">
                    <Nadnaslov className="animate-fade-up mb-5 !opacity-90">{tx(h.nadnaslov)}</Nadnaslov>
                    <Naslov as="h1" nivo="hero" tekst={naslov} akcenat={akcenat} className="max-w-5xl" odmah />
                    <p className="tekst-uvod animate-fade-up m-0 mt-6 max-w-xl opacity-90" style={{ animationDelay: '.25s' }}>{tx(h.uvod)}</p>
                    <div className="animate-fade-up mt-9" style={{ animationDelay: '.35s' }}>{dugmad(true)}</div>
                </div>
            </section>
        );
    }

    /* ── Preko cele širine, centrirano (Forge Automotive, Voiture) ── */
    if (tema.hero === 'puna-centar') {
        return (
            <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-tamna text-white">
                <HeroSlajdovi slike={slike} alt={tx(servis.slogan)} />
                <div className="veo-ravan absolute inset-0 z-[2]" aria-hidden="true" />
                <div className="na-foto relative z-[3] mx-auto flex max-w-5xl flex-col items-center px-6 pt-24 text-center">
                    <Naslov as="h1" nivo="hero" tekst={naslov} akcenat={akcenat} odmah />
                    <Nadnaslov className="animate-fade-up mt-5 !opacity-95" style={{ animationDelay: '.2s' }}>{tx(h.nadnaslov)}</Nadnaslov>
                    <p className="tekst-uvod animate-fade-up m-0 mt-5 max-w-2xl opacity-90" style={{ animationDelay: '.3s' }}>{tx(h.uvod)}</p>
                    <div className="animate-fade-up mt-9 flex justify-center" style={{ animationDelay: '.4s' }}>{dugmad(true)}</div>
                </div>
            </section>
        );
    }

    /* ── Dve fotografije sa ogromnim rečima u providnim poljima (urednički, Autovera) ── */
    if (tema.hero === 'dupla') {
        const polja = [
            { slika: slike[0], rec: t.nav.zakazi, ...zakazi },
            { slika: slike[1] ?? slike[0], rec: t.nav.cenovnik, to: p('cenovnik') },
        ];
        return (
            <section className="pt-[76px]">
                <div className="grid md:grid-cols-2">
                    {polja.map((pl, i) => {
                        const Tag = pl.to ? Link : 'a';
                        const veza = pl.to ? { to: pl.to } : { href: pl.href, target: pl.target, rel: pl.rel };
                        return (
                            <Tag key={i} {...veza} className="hover-zum group relative block h-[62svh] overflow-hidden md:h-[calc(100svh-76px)]">
                                <Foto src={pl.slika} alt="" prioritet okvirKlasa="!absolute inset-0 !rounded-none" paralaksa sizes="(min-width: 768px) 50vw, 100vw" />
                                <span className="absolute inset-0 flex items-center justify-center p-6">
                                    <span
                                        className="naslov flex aspect-square w-[min(62%,26rem)] items-center justify-center text-center text-[clamp(2.4rem,6vw,5.5rem)] transition-colors"
                                        style={{ background: i === 0 ? 'rgb(var(--c-akcenat) / .78)' : 'rgb(var(--c-paper) / .45)', color: i === 0 ? 'rgb(var(--c-ink) / .7)' : '#fff', transitionDuration: 'var(--t-brzo)' }}
                                    >
                                        {pl.rec}
                                    </span>
                                </span>
                            </Tag>
                        );
                    })}
                </div>
                <div className="mx-auto grid max-w-[110rem] gap-8 px-5 py-16 md:grid-cols-12 md:px-10 md:py-24">
                    <div className="md:col-span-7">
                        <Nadnaslov className="mb-4">{tx(h.nadnaslov)}</Nadnaslov>
                        <Naslov as="h1" nivo={1} tekst={naslov} akcenat={akcenat} odmah />
                    </div>
                    <div className="space-y-6 md:col-span-5 md:pt-10">
                        <p className="tekst-uvod m-0 opacity-80">{tx(h.uvod)}</p>
                        <StatusOtvoreno className="nadnaslov" />
                    </div>
                </div>
            </section>
        );
    }

    /* ── Uvučena fotografija sa marginama, tekst ispod (galerijski, Marque) ── */
    if (tema.hero === 'uvuceno') {
        return (
            <section className="pt-[112px] md:pt-[136px]">
                <div className="px-5 md:px-10">
                    <div className="relative mx-auto h-[56svh] max-w-[110rem] overflow-hidden md:h-[72svh]">
                        <HeroSlajdovi slike={slike} alt={tx(servis.slogan)} />
                    </div>
                </div>
                <div className="mx-auto grid max-w-[110rem] gap-8 px-5 py-14 md:grid-cols-12 md:px-10 md:py-20">
                    <div className="md:col-span-6">
                        <Nadnaslov className="mb-4">{tx(h.nadnaslov)}</Nadnaslov>
                        <Naslov as="h1" nivo={1} tekst={naslov} akcenat={akcenat} odmah />
                    </div>
                    <div className="space-y-8 md:col-span-5 md:col-start-8">
                        <p className="tekst-uvod m-0 opacity-80">{tx(h.uvod)}</p>
                        {dugmad(false)}
                    </div>
                </div>
            </section>
        );
    }

    /* ── Blok: tamni tekstualni blok preko cele širine, fotografija ispod (Wash Haus) ── */
    if (tema.hero === 'blok') {
        return (
            <section className="pt-[76px]">
                <div className="bg-tamna text-white">
                    <div className="mx-auto grid max-w-[110rem] gap-10 px-5 pb-14 pt-14 md:px-10 md:pb-20 md:pt-20 lg:grid-cols-12 lg:items-end">
                        <div className="lg:col-span-8">
                            <Nadnaslov className="animate-fade-up mb-6 !opacity-75">{tx(h.nadnaslov)}</Nadnaslov>
                            <Naslov as="h1" nivo="hero" tekst={naslov} akcenat={akcenat} odmah className="na-foto [&_.akcenat]:block" />
                        </div>
                        <div className="space-y-8 lg:col-span-4">
                            <p className="tekst-uvod animate-fade-up m-0 opacity-80" style={{ animationDelay: '.2s' }}>{tx(h.uvod)}</p>
                            <div className="animate-fade-up" style={{ animationDelay: '.3s' }}>
                                <div className="flex flex-wrap gap-3">
                                    <Dugme {...zakazi} className="min-w-[15rem]">{t.nav.zakazi}</Dugme>
                                    <Dugme to={p('cenovnik')} varijanta="fotoObris" strelica={false}>{t.nav.cenovnik}</Dugme>
                                </div>
                            </div>
                            <StatusOtvoreno className="nadnaslov opacity-70" />
                        </div>
                    </div>
                </div>
                <div className="relative h-[58svh] min-h-[20rem] overflow-hidden bg-tamna md:h-[78svh]">
                    <HeroSlajdovi slike={slike} alt={tx(servis.slogan)} traka />
                </div>
            </section>
        );
    }

    /* ── Split: tekst na papiru, fotografija do ivice (Blackbridge / AllSeasons) ── */
    return (
        <section className="pt-[76px]">
            <div className="grid lg:min-h-[calc(100svh-76px)] lg:grid-cols-12">
                <div className="relative order-1 h-[62svh] min-h-[22rem] lg:order-2 lg:col-span-6 lg:h-auto">
                    <div className="absolute inset-0 lg:inset-y-6 lg:right-6 lg:overflow-hidden" style={{ borderRadius: 'var(--r-kartica)' }}>
                        <HeroSlajdovi slike={slike} alt={tx(servis.slogan)} traka />
                    </div>
                </div>
                <div className="order-2 flex flex-col justify-center px-5 py-14 md:px-10 lg:order-1 lg:col-span-6 lg:py-20 lg:pr-16 xl:pl-[max(2.5rem,calc((100vw-84rem)/2+2.5rem))]">
                    <Nadnaslov className="animate-fade-up mb-6">{tx(h.nadnaslov)}</Nadnaslov>
                    <Naslov as="h1" nivo="hero" tekst={naslov} akcenat={akcenat} odmah />
                    <p className="tekst-uvod animate-fade-up m-0 mt-6 max-w-lg opacity-80" style={{ animationDelay: '.2s' }}>{tx(h.uvod)}</p>
                    <div className="animate-fade-up mt-9" style={{ animationDelay: '.3s' }}>{dugmad(false)}</div>
                    <StatusOtvoreno className="nadnaslov mt-10 opacity-75" />
                </div>
            </div>
        </section>
    );
}
