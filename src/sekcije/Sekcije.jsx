import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Gift, Star } from 'lucide-react';
import { useSajt } from '../kontekst/Sajt.jsx';
import { cena } from '../lib/format.js';
import { najnizaUKategoriji } from '../lib/cene.js';
import { Dugme, Foto, Kontejner, LinkStrelica, Nadnaslov, Naslov, Pojava, Sekcija, cx } from '../components/primitivi.jsx';
import { useZakaziLink } from '../components/Header.jsx';
import { Marquee } from '../components/delovi.jsx';

/* ── Izjava i brojevi ─────────────────────────────────────────────────── */
export const Izjava = () => {
    const { servis, tx } = useSajt();
    const brojevi = (servis.pocetna.brojevi ?? []).map((b) => ({
        ...b,
        vrednost: b.vrednost === 'godine' ? String(new Date().getFullYear() - servis.osnovan) : b.vrednost,
    }));
    if (!tx(servis.pocetna.izjava) && !brojevi.length) return null;
    return (
        <Sekcija>
            <Kontejner>
                {tx(servis.pocetna.izjava) && <Naslov as="p" nivo={2} tekst={tx(servis.pocetna.izjava)} className="max-w-5xl" />}
                {brojevi.length > 0 && (
                    <dl className="m-0 mt-16 grid gap-10 border-t pt-10 sm:grid-cols-3" style={{ borderColor: 'rgb(var(--c-linija) / .15)' }}>
                        {brojevi.map((b, i) => (
                            <Pojava key={i} i={i}>
                                <dd className="naslov naslov-1 m-0">{b.vrednost}</dd>
                                <dt className="nadnaslov mt-3 opacity-70">{tx(b.oznaka)}</dt>
                            </Pojava>
                        ))}
                    </dl>
                )}
            </Kontejner>
        </Sekcija>
    );
};

/* ── Zaglavlje sekcije: nadnaslov levo, naslov, opcioni tekst i link desno ── */
export const ZaglavljeSekcije = ({ nadnaslov, naslov, akcenat, uvod, link, className, centar = false }) => (
    <div className={cx('mb-12 grid gap-6 md:mb-16', centar ? 'justify-items-center text-center' : 'md:grid-cols-12 md:items-end', className)}>
        <div className={centar ? 'max-w-3xl' : 'md:col-span-7'}>
            {nadnaslov && <Nadnaslov className="mb-4">{nadnaslov}</Nadnaslov>}
            <Naslov nivo={2} tekst={naslov} akcenat={akcenat} />
        </div>
        {(uvod || link) && (
            <Pojava className={cx('space-y-5', centar ? 'max-w-2xl' : 'md:col-span-5 md:col-start-8')}>
                {uvod && <p className="tekst-telo m-0 opacity-75">{uvod}</p>}
                {link}
            </Pojava>
        )}
    </div>
);

/* ── Usluge — pet rasporeda, bira tema ────────────────────────────────── */
export const Usluge = ({ izostavi, naslov: sopstveniNaslov, bezZaglavlja = false }) => {
    const { servis, t, tx, p, tema, jezik } = useSajt();
    const kat = servis.kategorije.filter((k) => k.id !== izostavi);
    if (!kat.length) return null;
    const za = (k) => p('usluga', k.id);
    const od = (k) => `${t.opste.od} ${cena(najnizaUKategoriji(k), jezik)}`;
    const zaglavlje = bezZaglavlja ? null : (
        <ZaglavljeSekcije
            nadnaslov={t.pocetna.uslugeNadnaslov}
            naslov={sopstveniNaslov ?? t.pocetna.uslugeNaslov}
            akcenat={sopstveniNaslov ? null : t.pocetna.uslugeAkcenat}
            uvod={sopstveniNaslov ? null : t.pocetna.uslugeUvod}
            centar={tema.usluge === 'paketi'}
            link={<LinkStrelica to={p('cenovnik')}>{t.pocetna.cenovnikDugme}</LinkStrelica>}
        />
    );

    // Visoke kartice: naslov gore levo, cena u pill-u dole (Blackbridge)
    if (tema.usluge === 'visoke-kartice') {
        return (
            <Sekcija>
                <Kontejner>
                    {zaglavlje}
                    <div className="skriven-skrol -mx-5 flex snap-x gap-4 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4">
                        {kat.map((k, i) => (
                            <Pojava key={k.id} i={i} className="w-[78vw] shrink-0 snap-start md:w-auto">
                                <Link to={za(k)} className="hover-zum group relative block aspect-[3/4] overflow-hidden text-white" style={{ borderRadius: 'var(--r-kartica)' }}>
                                    <Foto src={k.slika} alt={tx(k.naziv)} okvirKlasa="!absolute inset-0" sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 78vw" />
                                    <span className="veo-dole absolute inset-0" aria-hidden="true" />
                                    <span className="absolute inset-x-6 top-6 naslov naslov-3">{tx(k.naziv)}</span>
                                    <span className="absolute bottom-6 left-6 inline-flex items-center gap-3 rounded-full bg-white/15 py-1.5 pl-4 pr-1.5 text-sm backdrop-blur-md">
                                        {od(k)}
                                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink transition-transform duration-300 group-hover:-rotate-45"><ArrowRight size={16} /></span>
                                    </span>
                                </Link>
                            </Pojava>
                        ))}
                    </div>
                </Kontejner>
            </Sekcija>
        );
    }

    // Pločice: kvadrati sa natpisom preko fotografije (Topaz, Esoteric, Eclectic bento)
    if (tema.usluge === 'plocice') {
        // Kolone po broju kategorija, da nijedan red ne ostane sa jednom pločicom.
        const plocice = kat.slice(0, 8);
        const n = plocice.length;
        const kolone = n === 5 ? 'lg:grid-cols-5' : n === 3 || n === 6 ? 'lg:grid-cols-3' : n <= 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-4';
        return (
            <Sekcija className={tema.tamna ? '' : 'bg-mist'}>
                <Kontejner>
                    {zaglavlje}
                    <div className={cx('grid grid-cols-2 gap-2 md:gap-3', kolone)}>
                        {plocice.map((k, i) => (
                            <Pojava key={k.id} i={i} className={n % 2 === 1 && i === n - 1 ? 'col-span-2 lg:col-span-1' : undefined}>
                                <Link to={za(k)} className={cx('hover-zum group relative block overflow-hidden text-white', n % 2 === 1 && i === n - 1 ? 'aspect-[2/1] lg:aspect-[4/5]' : 'aspect-[4/5]')} style={{ borderRadius: 'var(--r-kartica)' }}>
                                    <Foto src={k.slika} alt={tx(k.naziv)} okvirKlasa="!absolute inset-0" sizes="(min-width: 1024px) 25vw, 50vw" />
                                    <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10 transition-opacity group-hover:opacity-90" style={{ transitionDuration: 'var(--t-srednje)' }} aria-hidden="true" />
                                    <span className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4 md:p-6">
                                        <span className="naslov naslov-3">{tx(k.naziv)}</span>
                                        <span className="nadnaslov opacity-85">{od(k)}</span>
                                    </span>
                                </Link>
                            </Pojava>
                        ))}
                    </div>
                </Kontejner>
            </Sekcija>
        );
    }

    // Lista: urednički spisak sa rednim brojem i cenom (Forge, Autovera)
    if (tema.usluge === 'lista') {
        return (
            <Sekcija>
                <Kontejner>
                    {zaglavlje}
                    <ul className="grupa-linkova m-0 list-none border-t p-0" style={{ borderColor: 'rgb(var(--c-linija) / .9)' }}>
                        {kat.map((k, i) => (
                            <Pojava as="li" key={k.id} i={i} className="border-b" style={{ borderColor: 'rgb(var(--c-linija) / .18)' }}>
                                <Link to={za(k)} className="link-nav group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-7 md:grid-cols-[4rem_1fr_1fr_auto] md:py-9">
                                    <span className="nadnaslov opacity-60">{String(i + 1).padStart(2, '0')}</span>
                                    <span className="naslov naslov-2">{tx(k.naziv)}</span>
                                    <span className="tekst-telo hidden opacity-70 md:block">{tx(k.kratko)}</span>
                                    <span className="nadnaslov inline-flex items-center gap-3 whitespace-nowrap">
                                        {od(k)}
                                        <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                                    </span>
                                </Link>
                            </Pojava>
                        ))}
                    </ul>
                </Kontejner>
            </Sekcija>
        );
    }

    // Paketi: kategorije kao kurirani paketi sa spiskom (Voiture — Maintain / Restore / Protect)
    if (tema.usluge === 'paketi') {
        const istaknut = Math.min(1, kat.length - 1);
        return (
            <Sekcija>
                <Kontejner>
                    {zaglavlje}
                    <div className={cx('grid gap-4 md:gap-5', kat.length >= 4 ? 'md:grid-cols-2 xl:grid-cols-4' : 'md:grid-cols-3')}>
                        {kat.map((k, i) => {
                            const stavke = (k.ukljuceno?.length ? k.ukljuceno.map((x) => tx(x)) : k.usluge.map((u) => tx(u.naziv))).slice(0, 5);
                            const glavni = i === istaknut;
                            return (
                                <Pojava key={k.id} i={i} className={cx('kartica relative flex flex-col p-7 md:p-8', glavni && '!border-brand')} style={glavni ? { boxShadow: '0 0 0 1px rgb(var(--c-brand))' } : undefined}>
                                    {glavni && <span className="nadnaslov absolute -top-3 left-7 rounded-full bg-brand px-3 py-1 text-naBrand">{t.pocetna.paketNajtrazeniji}</span>}
                                    <p className="nadnaslov m-0 opacity-60">{String(i + 1).padStart(2, '0')}</p>
                                    <h3 className="naslov naslov-3 m-0 mt-3">{tx(k.naziv)}</h3>
                                    <p className="tekst-telo m-0 mt-3 opacity-75">{tx(k.kratko)}</p>
                                    <p className="nadnaslov m-0 mt-6 opacity-60">{t.pocetna.paketUkljucuje}</p>
                                    <ul className="m-0 mt-3 flex-1 list-none space-y-2 p-0 text-[0.95rem]">
                                        {stavke.map((s) => <li key={s} className="flex gap-2.5"><Check size={16} className="mt-1 shrink-0 text-brand" aria-hidden="true" />{s}</li>)}
                                    </ul>
                                    <div className="mt-8 flex items-center justify-between gap-4 border-t pt-5" style={{ borderColor: 'rgb(var(--c-linija) / .12)' }}>
                                        <span className="text-lg tabular-nums">{od(k)}</span>
                                        <LinkStrelica to={za(k)}>{t.cenovnik.detaljnije}</LinkStrelica>
                                    </div>
                                </Pojava>
                            );
                        })}
                    </div>
                </Kontejner>
            </Sekcija>
        );
    }

    // Kartice: fotografija, ispod naziv, opis i cena (AMMO, Wash Haus, Marque)
    return (
        <Sekcija>
            <Kontejner>
                {zaglavlje}
                <div className={cx('grid gap-x-6 gap-y-12 sm:grid-cols-2', kat.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3')}>
                    {kat.map((k, i) => (
                        <Pojava key={k.id} i={i % 4}>
                            <Link to={za(k)} className="hover-zum group block">
                                <Foto src={k.slika} alt={tx(k.naziv)} okvirKlasa="aspect-[4/5]" paralaksa={i % 2 === 1} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
                                <div className="mt-5 flex items-baseline justify-between gap-4">
                                    <h3 className="naslov naslov-3 m-0">{tx(k.naziv)}</h3>
                                    <span className="nadnaslov whitespace-nowrap opacity-70">{od(k)}</span>
                                </div>
                                <p className="tekst-telo m-0 mt-2 opacity-70">{tx(k.kratko)}</p>
                            </Link>
                        </Pojava>
                    ))}
                </div>
            </Kontejner>
        </Sekcija>
    );
};

/* ── Proces (kako funkcioniše) ────────────────────────────────────────── */
export const Proces = () => {
    const { servis, t, tx } = useSajt();
    const zakazi = useZakaziLink();
    const koraci = servis.pocetna.proces ?? [];
    if (!koraci.length) return null;
    return (
        <Sekcija className="!pt-0">
            <Kontejner>
                <div className="kartica grid gap-8 p-8 md:grid-cols-12 md:p-12">
                    <div className="md:col-span-4">
                        <Nadnaslov className="mb-4">{t.pocetna.procesNadnaslov}</Nadnaslov>
                        <Naslov nivo={3} tekst={t.pocetna.procesNaslov} />
                        <Dugme {...zakazi} className="mt-8">{t.nav.zakazi}</Dugme>
                    </div>
                    <ol className="m-0 grid list-none gap-8 p-0 md:col-span-8 md:grid-cols-3">
                        {koraci.map((k, i) => (
                            <Pojava as="li" key={i} i={i}>
                                <span className="naslov naslov-2 block text-brand">{i + 1}</span>
                                <p className="m-0 mt-3 font-medium">{tx(k.naslov)}</p>
                                <p className="m-0 mt-2 text-sm leading-relaxed opacity-70">{tx(k.tekst)}</p>
                            </Pojava>
                        ))}
                    </ol>
                </div>
            </Kontejner>
        </Sekcija>
    );
};

/* ── Traka galerije (horizontalni niz) ────────────────────────────────── */
export const GalerijaTraka = () => {
    const { servis, t, tx, p } = useSajt();
    const slike = servis.galerija.slice(0, 8);
    if (!slike.length) return null;
    return (
        <Sekcija className="overflow-hidden">
            <Kontejner>
                <ZaglavljeSekcije
                    nadnaslov={t.pocetna.galerijaNadnaslov}
                    naslov={t.pocetna.galerijaNaslov}
                    link={<LinkStrelica to={p('galerija')}>{t.opste.pogledajSve}</LinkStrelica>}
                />
            </Kontejner>
            <div className="skriven-skrol flex snap-x gap-3 overflow-x-auto px-5 md:gap-4 md:px-10">
                {slike.map((g, i) => (
                    <Pojava key={`${g.slika}-${i}`} i={i} className="w-[68vw] shrink-0 snap-start sm:w-[42vw] lg:w-[24vw]">
                        <Link to={p('galerija')} className="hover-zum block">
                            <Foto src={g.slika} alt={tx(g.opis)} okvirKlasa={i % 2 ? 'aspect-[4/5]' : 'aspect-[3/4]'} sizes="(min-width: 1024px) 24vw, (min-width: 640px) 42vw, 68vw" />
                        </Link>
                    </Pojava>
                ))}
            </div>
        </Sekcija>
    );
};

/* ── Tim (opciono, na „O nama”) ───────────────────────────────────────── */
export const TimPregled = () => {
    const { servis, t, tx } = useSajt();
    if (!servis.tim?.length) return null;
    return (
        <Sekcija className="bg-mist">
            <Kontejner>
                <ZaglavljeSekcije nadnaslov={t.pocetna.timNadnaslov} naslov={t.pocetna.timNaslov} />
                <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
                    {servis.tim.map((r, i) => (
                        <Pojava key={r.id} i={i}>
                            <Foto src={r.slika} alt={r.ime} okvirKlasa="aspect-[4/5]" sizes="(min-width: 1024px) 25vw, 50vw" />
                            <p className="naslov naslov-3 m-0 mt-4">{r.ime}</p>
                            <p className="nadnaslov m-0 mt-1.5 opacity-70">{tx(r.uloga)}</p>
                            {r.opis && <p className="m-0 mt-3 text-sm leading-relaxed opacity-75">{tx(r.opis)}</p>}
                        </Pojava>
                    ))}
                </div>
            </Kontejner>
        </Sekcija>
    );
};

/* ── Zašto mi ─────────────────────────────────────────────────────────── */
export const ZastoMi = () => {
    const { servis, t, tx } = useSajt();
    const stavke = servis.pocetna.zastoMi ?? [];
    if (!stavke.length) return null;
    return (
        <Sekcija>
            <Kontejner>
                <ZaglavljeSekcije nadnaslov={t.pocetna.zastoNadnaslov} naslov={t.pocetna.zastoNaslov} akcenat={t.pocetna.zastoAkcenat} />
                <div className="grid gap-10 md:grid-cols-3">
                    {stavke.map((s, i) => (
                        <Pojava key={i} i={i} className="border-t pt-6" style={{ borderColor: 'rgb(var(--c-linija) / .2)' }}>
                            <p className="nadnaslov m-0 mb-4 opacity-60">{String(i + 1).padStart(2, '0')}</p>
                            <h3 className="naslov naslov-3 m-0">{tx(s.naslov)}</h3>
                            <p className="tekst-telo m-0 mt-3 opacity-75">{tx(s.tekst)}</p>
                        </Pojava>
                    ))}
                </div>
            </Kontejner>
        </Sekcija>
    );
};

/* ── Recenzije ────────────────────────────────────────────────────────── */
export const Recenzije = () => {
    const { servis, t, tx, tema } = useSajt();
    const r = servis.recenzije;
    if (!r?.lista?.length) return null;
    const centar = ['atelje', 'konsijerz', 'galerija'].includes(tema.id);
    return (
        <Sekcija className="border-t" style={{ borderColor: 'rgb(var(--c-linija) / .12)' }}>
            <Kontejner>
                <ZaglavljeSekcije
                    nadnaslov={t.pocetna.recenzijeNadnaslov}
                    naslov={t.pocetna.recenzijeNaslov}
                    centar={centar}
                    uvod={r.prosek ? `${t.opste.ocena(String(r.prosek).replace('.', ','), r.broj)} · ${r.izvor}` : null}
                    link={servis.kontakt.googleRecenzija ? <LinkStrelica href={servis.kontakt.googleRecenzija} target="_blank" rel="noopener noreferrer">Google</LinkStrelica> : null}
                />
                <div className="grid gap-6 md:grid-cols-3">
                    {r.lista.map((rv, i) => (
                        <Pojava as="figure" key={i} i={i} className={cx('kartica m-0 flex flex-col p-8', centar && 'text-center')}>
                            <span className={cx('flex gap-1 text-brand', centar && 'justify-center')} aria-label={`${rv.ocena}/5`}>
                                {Array.from({ length: rv.ocena }, (_, k) => <Star key={k} size={15} fill="currentColor" strokeWidth={0} />)}
                            </span>
                            <blockquote className="naslov m-0 mt-6 flex-1 text-[1.3rem] leading-snug" style={{ textTransform: 'none', letterSpacing: '-0.01em' }}>„{tx(rv.tekst)}”</blockquote>
                            <figcaption className="nadnaslov mt-6 opacity-70">{rv.autor}</figcaption>
                        </Pojava>
                    ))}
                </div>
            </Kontejner>
        </Sekcija>
    );
};

/* ── Brendovi (marquee) ───────────────────────────────────────────────── */
export const Brendovi = () => {
    const { servis, t } = useSajt();
    if (!servis.brendovi?.length) return null;
    return (
        <section className="border-y py-10 md:py-14" style={{ borderColor: 'rgb(var(--c-linija) / .12)' }}>
            <p className="nadnaslov m-0 mb-6 text-center opacity-60">{t.pocetna.brendoviNaslov}</p>
            <Marquee stavke={servis.brendovi} className="naslov text-2xl md:text-4xl" />
        </section>
    );
};

/* ── Poklon vaučer ────────────────────────────────────────────────────── */
export const Vaucer = () => {
    const { servis, t, tx } = useSajt();
    const tekst = tx(servis.poklonVaucer?.tekst);
    if (!tekst) return null;
    const k = servis.kontakt;
    const href = k.whatsapp ? `https://wa.me/${k.whatsapp}?text=${encodeURIComponent(t.pocetna.vaucerNaslov)}` : `tel:${k.telefon}`;
    return (
        <Sekcija className="!py-0">
            <Kontejner>
                <Pojava className="flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-12" style={{ background: 'rgb(var(--c-akcenat) / .22)', borderRadius: 'var(--r-kartica)' }}>
                    <div className="flex items-start gap-5">
                        <Gift size={28} strokeWidth={1.25} className="mt-1 shrink-0" aria-hidden="true" />
                        <div>
                            <Nadnaslov className="mb-2">{t.pocetna.vaucerNadnaslov}</Nadnaslov>
                            <h2 className="naslov naslov-3 m-0">{t.pocetna.vaucerNaslov}</h2>
                            <p className="tekst-telo m-0 mt-2 max-w-2xl opacity-80">{tekst}</p>
                        </div>
                    </div>
                    <Dugme href={href} varijanta="sekundarno" target={k.whatsapp ? '_blank' : undefined} rel="noopener noreferrer">{t.pocetna.vaucerDugme}</Dugme>
                </Pojava>
            </Kontejner>
        </Sekcija>
    );
};

/* ── Završni poziv preko fotografije ──────────────────────────────────── */
export const ZavrsniPoziv = () => {
    const { servis, tx, t } = useSajt();
    const zakazi = useZakaziLink();
    const pz = servis.pocetna.poziv;
    if (!pz) return null;
    return (
        <section className="relative mt-20 flex min-h-[70svh] items-center overflow-hidden bg-tamna text-white md:mt-28">
            <Foto src={pz.slika} alt="" okvirKlasa="!absolute inset-0 !rounded-none" paralaksa sizes="100vw" />
            <div className="veo-ravan absolute inset-0" aria-hidden="true" />
            <Kontejner className="na-foto relative py-24 text-center">
                <Naslov nivo={1} tekst={tx(pz.naslov)} className="mx-auto max-w-3xl" />
                <Pojava as="p" className="tekst-uvod mx-auto m-0 mt-6 max-w-xl opacity-90">{tx(pz.tekst)}</Pojava>
                <Pojava className="mt-10 flex justify-center"><Dugme {...zakazi} varijanta="foto">{t.nav.zakazi}</Dugme></Pojava>
            </Kontejner>
        </section>
    );
};
