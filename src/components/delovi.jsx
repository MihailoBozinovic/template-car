import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';
import { useSajt } from '../kontekst/Sajt.jsx';
import { SVI_JEZICI, kljucIzPutanje, putanja, slugIzPutanje } from '../i18n/jezici.js';
import { aktivniJezici } from '../lib/seo.js';
import { grupisanoRadnoVreme, statusRada, neradanDan, sadaULokalu, dodajDane } from '../lib/vreme.js';
import { datumDugo } from '../lib/format.js';
import { cx, IkonaFacebook, IkonaInstagram, IkonaTikTok, IkonaViber, IkonaWhatsApp } from './primitivi.jsx';

/** Posle hidratacije — za sve što zavisi od trenutnog vremena. */
export const useNaKlijentu = () => {
    const [da, setDa] = useState(false);
    useEffect(() => setDa(true), []);
    return da;
};

/** „Otvoreno do 20:00” / „Otvaramo sutra u 09:00” — u zoni servisa. */
export const StatusOtvoreno = ({ className }) => {
    const { servis, t } = useSajt();
    const klijent = useNaKlijentu();
    const [s, setS] = useState(null);
    useEffect(() => {
        if (!klijent) return undefined;
        const osvezi = () => setS(statusRada(servis));
        osvezi();
        const id = setInterval(osvezi, 60_000);
        return () => clearInterval(id);
    }, [klijent, servis]);
    if (!s) return <span className={cx('inline-block h-5', className)} aria-hidden="true" />;
    let tekst = t.opste.zatvoreno;
    if (s.otvoreno) tekst = t.opste.otvorenoDo(s.do);
    else if (s.sledece) {
        const dan = s.sledece.za === 0 ? t.opste.danas : s.sledece.za === 1 ? t.opste.sutra : t.dani.uDan[s.sledece.dan];
        tekst = t.opste.otvaraU(dan, s.sledece.od);
    }
    return (
        <span className={cx('inline-flex items-center gap-2', className)}>
            <span className={cx('h-2 w-2 rounded-full', s.otvoreno ? 'bg-emerald-500' : 'bg-current opacity-40')} aria-hidden="true" />
            {tekst}
        </span>
    );
};

/** Radno vreme u redovima (uzastopni dani spojeni), sa današnjim istaknutim. */
export const RadnoVremeTabela = ({ className }) => {
    const { servis, t } = useSajt();
    const klijent = useNaKlijentu();
    const danas = klijent ? ['ned', 'pon', 'uto', 'sre', 'cet', 'pet', 'sub'][new Date(`${sadaULokalu().datum}T12:00:00Z`).getUTCDay()] : null;
    return (
        <dl className={cx('m-0 grid gap-2', className)}>
            {grupisanoRadnoVreme(servis).map((g) => {
                const dani = g.dani.length > 2 ? `${t.dani.kratko[g.dani[0]]} – ${t.dani.kratko[g.dani[g.dani.length - 1]]}` : g.dani.map((d) => t.dani.kratko[d]).join(', ');
                const aktivan = danas && g.dani.includes(danas);
                return (
                    <div key={g.dani.join()} className={cx('flex justify-between gap-6', aktivan && 'font-semibold')}>
                        <dt>{dani}</dt>
                        <dd className="m-0 tabular-nums">{g.vreme ? `${g.vreme[0]} – ${g.vreme[1]}` : t.opste.neradi}</dd>
                    </div>
                );
            })}
        </dl>
    );
};

/** Predstojeći neradni dani (sledećih 60 dana). */
export const NeradniDani = ({ className }) => {
    const { servis, t, tx, jezik } = useSajt();
    const klijent = useNaKlijentu();
    if (!klijent) return null;
    const { datum } = sadaULokalu();
    const do_ = dodajDane(datum, 60);
    const lista = (servis.neradniDani ?? []).filter((n) => n.datum >= datum && n.datum <= do_ && neradanDan(n.datum, servis));
    if (!lista.length) return null;
    return (
        <div className={className}>
            <p className="nadnaslov m-0 mb-2 opacity-70">{t.kontakt.neradniDani}</p>
            <ul className="m-0 list-none space-y-1 p-0 text-sm">
                {lista.map((n) => <li key={n.datum}>{datumDugo(n.datum, t, jezik)} — {tx(n.opis)}</li>)}
            </ul>
        </div>
    );
};

export const Mreze = ({ className, velicina = 18 }) => {
    const { servis, t } = useSajt();
    const k = servis.kontakt;
    const stavke = [
        k.instagram && { href: k.instagram, ime: t.opste.instagram, Ikona: IkonaInstagram },
        k.facebook && { href: k.facebook, ime: t.opste.facebook, Ikona: IkonaFacebook },
        k.tiktok && { href: k.tiktok, ime: t.opste.tiktok, Ikona: IkonaTikTok },
    ].filter(Boolean);
    if (!stavke.length) return null;
    return (
        <ul className={cx('m-0 flex list-none gap-2 p-0', className)}>
            {stavke.map(({ href, ime, Ikona }) => (
                <li key={href}>
                    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={ime}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-current/20 transition-colors hover:bg-ink hover:text-paper"
                        style={{ borderColor: 'color-mix(in srgb, currentColor 25%, transparent)' }}>
                        <Ikona size={velicina} />
                    </a>
                </li>
            ))}
        </ul>
    );
};

/** Poziv, WhatsApp, Viber, e-mail — šta je popunjeno u servis.js. */
export const KontaktDugmad = ({ className, tekst = null }) => {
    const { servis, t } = useSajt();
    const k = servis.kontakt;
    const st = [
        k.telefon && { href: `tel:${k.telefon}`, ime: `${t.opste.pozovite} · ${k.telefonPrikaz}`, Ikona: Phone },
        k.whatsapp && { href: `https://wa.me/${k.whatsapp}${tekst ? `?text=${encodeURIComponent(tekst)}` : ''}`, ime: t.opste.whatsapp, Ikona: IkonaWhatsApp, spolja: true },
        k.viber && { href: `viber://chat?number=%2B${k.viber}${tekst ? `&draft=${encodeURIComponent(tekst)}` : ''}`, ime: t.opste.viber, Ikona: IkonaViber },
        k.email && { href: `mailto:${k.email}`, ime: k.email, Ikona: Mail },
    ].filter(Boolean);
    return (
        <div className={cx('flex flex-wrap gap-2', className)}>
            {st.map(({ href, ime, Ikona, spolja }) => (
                <a key={href} href={href} className="cip" {...(spolja ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                    <Ikona size={16} aria-hidden="true" /> {ime}
                </a>
            ))}
        </div>
    );
};

/** SR · EN · RU — ista stranica na drugom jeziku. */
export const IzborJezika = ({ className, puno = false, onIzbor }) => {
    const { jezik, t, servis } = useSajt();
    const { pathname } = useLocation();
    const jezici = aktivniJezici(servis);
    if (jezici.length < 2) return null;
    const kljuc = kljucIzPutanje(pathname) ?? 'pocetna';
    const slug = slugIzPutanje(pathname);
    return (
        <nav aria-label={t.nav.jezik} className={className}>
            <ul className="m-0 flex list-none items-center gap-1 p-0">
                {jezici.map((j) => (
                    <li key={j}>
                        <Link
                            to={putanja(kljuc, j, slug)}
                            hrefLang={j}
                            lang={j}
                            onClick={onIzbor}
                            aria-current={j === jezik ? 'true' : undefined}
                            className={cx('nadnaslov inline-flex min-h-[2.25rem] items-center px-1.5 transition-opacity', j === jezik ? 'opacity-100 underline underline-offset-4' : 'opacity-55 hover:opacity-100')}
                        >
                            {puno ? SVI_JEZICI[j].naziv : SVI_JEZICI[j].kratko}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

/** Beskonačna traka (marquee) — brzina i pauza na hover iz teme. */
export const Marquee = ({ stavke, className, razdvajac = '✦' }) => {
    const niz = [...stavke, ...stavke];
    return (
        <div className={cx('marquee', className)} aria-label={stavke.join(', ')}>
            <div className="marquee-traka" aria-hidden="true">
                {[0, 1].map((k) => (
                    <div key={k} className="flex shrink-0 items-center">
                        {niz.map((s, i) => (
                            <span key={`${k}-${i}`} className="flex items-center">
                                <span className="px-8 md:px-12">{s}</span>
                                <span className="text-brand opacity-70">{razdvajac}</span>
                            </span>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};
