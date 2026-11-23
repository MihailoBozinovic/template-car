import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useSajt } from '../kontekst/Sajt.jsx';
import { kljucIzPutanje, slugIzPutanje } from '../i18n/jezici.js';
import { javno } from '../lib/baza.js';
import { Dugme, cx } from './primitivi.jsx';
import { IzborJezika, KontaktDugmad, Mreze, StatusOtvoreno } from './delovi.jsx';

const STAVKE = ['cenovnik', 'galerija', 'oNama', 'kontakt'];
export const HEROJ_ISPOD_HEADERA = ['puna-levo', 'puna-centar'];

/** Link „Zakaži”: na stranicu zakazivanja, ili na spoljni sistem kad je nacin 'link'. */
export const useZakaziLink = () => {
    const { servis, p } = useSajt();
    const z = servis.zakazivanje;
    return z.nacin === 'link' && z.link ? { href: z.link, target: '_blank', rel: 'noopener noreferrer' } : { to: p('zakazivanje') };
};

/** Teme čiji je naziv u headeru ispisan verzalom, i razmak slova po temi. */
const LOGO = {
    hotel: 'uppercase tracking-[0.06em] text-[1.65rem] md:text-[1.8rem]',
    atelje: 'uppercase tracking-[0.32em] text-[0.95rem] md:text-[1.05rem] font-semibold',
    laboratorija: 'uppercase tracking-[-0.02em] font-bold text-[1.5rem] md:text-[1.75rem]',
    studio: 'uppercase tracking-[0.22em] font-light text-[1.2rem] md:text-[1.4rem]',
    konsijerz: 'uppercase tracking-[0.2em] font-semibold text-[0.95rem] md:text-[1.05rem]',
    velnes: 'tracking-[-0.03em] font-semibold text-[1.35rem]',
    galerija: 'tracking-[0.02em] text-[1.55rem] md:text-[1.75rem]',
    magazin: 'italic text-[1.6rem] md:text-[1.85rem]',
    most: 'tracking-[0.01em] font-medium text-[1.6rem] md:text-[1.8rem]',
    kinematik: 'uppercase tracking-[-0.01em] font-black text-[1.35rem] md:text-[1.5rem]',
};

export const Logo = ({ className }) => {
    const { servis, p, tema } = useSajt();
    return (
        <Link to={p('pocetna')} className={cx('logo-tekst inline-flex items-center leading-none no-underline', className)} aria-label={servis.naziv}>
            {servis.logo ? (
                <img src={javno(servis.logo)} alt={servis.naziv} className="h-8 w-auto md:h-10" />
            ) : (
                <span className={cx('whitespace-nowrap transition-all duration-500', LOGO[tema.id] ?? 'text-[1.55rem]')}>{servis.naziv}</span>
            )}
        </Link>
    );
};

/** Padajuća lista usluga (desktop): naziv kategorije vodi na njenu stranicu. */
const UslugeMeni = () => {
    const { servis, t, tx, p } = useSajt();
    const { pathname } = useLocation();
    const [otvoren, setOtvoren] = useState(false);
    const zatvoriTajmer = useRef(null);
    const aktivna = ['cenovnik', 'usluga'].includes(kljucIzPutanje(pathname));
    useEffect(() => setOtvoren(false), [pathname]);
    const otvori = () => { clearTimeout(zatvoriTajmer.current); setOtvoren(true); };
    const zatvori = () => { zatvoriTajmer.current = setTimeout(() => setOtvoren(false), 140); };
    return (
        <li className="relative" onMouseEnter={otvori} onMouseLeave={zatvori} onFocus={otvori} onBlur={zatvori}>
            <Link to={p('cenovnik')} aria-current={aktivna ? 'page' : undefined} aria-expanded={otvoren} className="link-nav nadnaslov inline-flex min-h-[2.5rem] items-center gap-1 whitespace-nowrap">
                {t.nav.cenovnik}<ChevronDown size={14} className={cx('transition-transform duration-300', otvoren && 'rotate-180')} aria-hidden="true" />
            </Link>
            <div className={cx('absolute left-1/2 top-full z-10 w-72 -translate-x-1/2 pt-3 transition-all duration-300', otvoren ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0')}>
                <ul className="kartica m-0 list-none space-y-0.5 p-2 text-ink shadow-xl">
                    {servis.kategorije.map((k) => (
                        <li key={k.id}>
                            <Link to={p('usluga', k.id)} className="block px-3 py-2.5 transition-colors hover:bg-mist" style={{ borderRadius: 'min(var(--r-kartica), 10px)' }}>
                                <span className="block text-[0.95rem] font-medium" style={{ fontFamily: 'var(--font-tekst)', textTransform: 'none', letterSpacing: 0 }}>{tx(k.naziv)}</span>
                                {k.kratko && <span className="mt-0.5 block text-xs leading-snug opacity-60" style={{ textTransform: 'none', letterSpacing: 0 }}>{tx(k.kratko)}</span>}
                            </Link>
                        </li>
                    ))}
                    <li className="border-t pt-1" style={{ borderColor: 'rgb(var(--c-linija) / .1)' }}>
                        <Link to={p('cenovnik')} className="nadnaslov block px-3 py-2.5 opacity-80 hover:opacity-100">{t.pocetna.cenovnikDugme} →</Link>
                    </li>
                </ul>
            </div>
        </li>
    );
};

const NavLinkovi = ({ className }) => {
    const { t, p } = useSajt();
    const { pathname } = useLocation();
    const aktivna = kljucIzPutanje(pathname);
    return (
        <ul className={cx('grupa-linkova m-0 flex list-none items-center p-0', className)}>
            <UslugeMeni />
            {STAVKE.filter((k) => k !== 'cenovnik').map((k) => (
                <li key={k}>
                    <Link to={p(k)} aria-current={aktivna === k ? 'page' : undefined} className="link-nav nadnaslov inline-flex min-h-[2.5rem] items-center whitespace-nowrap">
                        {t.nav[k]}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default function Header() {
    const { t, tema, p, tx, servis } = useSajt();
    const { pathname } = useLocation();
    const [skrolovano, setSkrolovano] = useState(false);
    const [otvoren, setOtvoren] = useState(false);
    const dugmeRef = useRef(null);
    const zakazi = useZakaziLink();
    const kljuc = kljucIzPutanje(pathname);
    const slug = slugIzPutanje(pathname);

    useEffect(() => {
        const naSkrol = () => setSkrolovano(window.scrollY > 30);
        naSkrol();
        window.addEventListener('scroll', naSkrol, { passive: true });
        return () => window.removeEventListener('scroll', naSkrol);
    }, []);

    useEffect(() => { setOtvoren(false); }, [pathname]);

    useEffect(() => {
        document.documentElement.classList.toggle('bez-skrola', otvoren);
        if (!otvoren) return undefined;
        const esc = (e) => { if (e.key === 'Escape') { setOtvoren(false); dugmeRef.current?.focus(); } };
        window.addEventListener('keydown', esc);
        return () => window.removeEventListener('keydown', esc);
    }, [otvoren]);

    // Header je providan samo preko fotografije: hero početne ili hero stranice usluge.
    const prekoFotografije = (kljuc === 'pocetna' && HEROJ_ISPOD_HEADERA.includes(tema.hero)) || (kljuc === 'usluga' && servis.kategorije.some((k) => k.id === slug));
    const providan = tema.header.tip === 'providan' && prekoFotografije && !skrolovano && !otvoren;
    const tamni = tema.header.tip === 'tamni' && !otvoren;
    const stil = providan ? 'header-providan' : tamni ? 'header-tamni' : tema.header.posleSkrola === 'brand' ? 'header-brand' : 'header-pun';
    const fotoDugme = providan || stil === 'header-brand';
    const raspored = tema.header.logo;

    return (
        <>
            <a href="#sadrzaj" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-paper focus:px-4 focus:py-2 focus:text-ink">
                {t.opste.preskoci}
            </a>
            <header className={cx('header fixed inset-x-0 top-0 z-50', stil)}>
                <div className="mx-auto flex h-[76px] max-w-[110rem] items-center gap-6 px-5 md:px-10">
                    {raspored === 'centar' ? (
                        <>
                            <nav aria-label={t.nav.meni} className="hidden flex-1 xl:block"><NavLinkovi className="gap-6" /></nav>
                            <div className="flex flex-1 xl:flex-none xl:justify-center"><Logo /></div>
                        </>
                    ) : (
                        <>
                            <Logo />
                            <nav aria-label={t.nav.meni} className="hidden flex-1 justify-center lg:flex">
                                <NavLinkovi className={tema.pokret.linkHover === 'pozadina' ? 'gap-0 xl:gap-1' : 'gap-5 xl:gap-8'} />
                            </nav>
                        </>
                    )}
                    <div className={cx('flex items-center justify-end gap-3', raspored === 'centar' ? 'flex-1' : 'ml-auto lg:ml-0')}>
                        <IzborJezika className="hidden md:block" />
                        <Dugme {...zakazi} varijanta={fotoDugme ? 'foto' : 'primarno'} className="hidden !min-h-[2.6rem] !py-2.5 sm:inline-flex">
                            {t.nav.zakazi}
                        </Dugme>
                        <button
                            ref={dugmeRef}
                            type="button"
                            className={cx('inline-flex h-11 w-11 items-center justify-center', raspored === 'centar' ? 'xl:hidden' : 'lg:hidden')}
                            aria-expanded={otvoren}
                            aria-controls="mobilni-meni"
                            aria-label={otvoren ? t.nav.zatvori : t.nav.meni}
                            onClick={() => setOtvoren((o) => !o)}
                        >
                            {otvoren ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobilni meni preko celog ekrana; stavke ulaze kaskadno. */}
            <div
                id="mobilni-meni"
                className={cx('fixed inset-0 z-40 flex flex-col bg-paper text-ink transition-opacity', raspored === 'centar' ? 'xl:hidden' : 'lg:hidden', otvoren ? 'meni-otvoren opacity-100' : 'pointer-events-none opacity-0')}
                style={{ transitionDuration: 'var(--t-srednje)' }}
                aria-hidden={!otvoren}
                inert={!otvoren ? '' : undefined}
            >
                <div className="flex flex-1 flex-col overflow-y-auto px-6 pb-10 pt-28">
                    <nav aria-label={t.nav.meni}>
                        <ul className="m-0 list-none space-y-1 p-0">
                            {['pocetna', ...STAVKE, 'pitanja'].map((k, i) => (
                                <li key={k} className="meni-stavka" style={{ '--i': i }}>
                                    <Link to={p(k)} className="naslov naslov-2 block py-1.5">{t.nav[k]}</Link>
                                    {k === 'cenovnik' && (
                                        <ul className="m-0 mb-2 mt-1 flex list-none flex-wrap gap-2 p-0">
                                            {servis.kategorije.map((kat) => (
                                                <li key={kat.id}><Link to={p('usluga', kat.id)} className="cip">{tx(kat.naziv)}</Link></li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="meni-stavka mt-10 space-y-6" style={{ '--i': 8 }}>
                        <Dugme {...zakazi} className="w-full">{t.nav.zakazi}</Dugme>
                        <StatusOtvoreno className="nadnaslov" />
                        <KontaktDugmad />
                        <div className="flex items-center justify-between">
                            <IzborJezika puno />
                            <Mreze />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
