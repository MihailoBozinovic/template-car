import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Car } from 'lucide-react';
import { useSajt } from '../kontekst/Sajt.jsx';
import SLIKE from '../config/slike.json';
import { javno } from '../lib/baza.js';

const cx = (...k) => k.filter(Boolean).join(' ');
export { cx };

/* ── Pojavljivanje pri skrolu ──────────────────────────────────────────── */
/*
 * Vraća `true` kad je element ušao u ekran. Stanje, a ne classList: React pri
 * sledećem renderu (promena teme, jezika, stanja roditelja) prepisuje
 * `className`, pa bi ručno dodata klasa nestala i tekst ostao na opacity 0.
 * Jednom vidljiv, element ostaje vidljiv.
 */
export const usePojava = (ref, { prag = 0.15 } = {}) => {
    const [vidljivo, setVidljivo] = useState(false);
    useEffect(() => {
        if (vidljivo) return undefined;
        const el = ref.current;
        if (!el) return undefined;
        if (typeof IntersectionObserver === 'undefined') { setVidljivo(true); return undefined; }
        const io = new IntersectionObserver((unosi) => {
            if (unosi.some((u) => u.isIntersecting)) { setVidljivo(true); io.disconnect(); }
        }, { threshold: prag, rootMargin: '0px 0px -6% 0px' });
        io.observe(el);
        return () => io.disconnect();
    }, [ref, prag, vidljivo]);
    return vidljivo;
};

/** Omotač koji se pojavljuje pri skrolu; `i` = redni broj za kaskadu. */
export const Pojava = ({ as: Tag = 'div', i = 0, className, style, children, ...ostalo }) => {
    const ref = useRef(null);
    const { tema } = useSajt();
    const vidljivo = usePojava(ref);
    return (
        <Tag ref={ref} className={cx('pojava', vidljivo && 'vidljivo', className)} style={{ '--kasnjenje': `${(i * tema.pokret.stagger).toFixed(2)}s`, ...style }} {...ostalo}>
            {children}
        </Tag>
    );
};

/* ── Tipografija ───────────────────────────────────────────────────────── */
export const Nadnaslov = ({ className, children, ...o }) => (
    <p className={cx('nadnaslov m-0 opacity-80', className)} {...o}>{children}</p>
);

const reci = (tekst, od) => String(tekst).split(/(\s+)/).map((d, k) => (
    /\s+/.test(d) ? d : <span key={`${od}-${k}`} className="rec"><span style={{ '--i': od + k }}>{d}</span></span>
));

/**
 * Naslov teme. `akcenat` dobija stil teme (kurziv, boja, verzal…). Kad tema
 * animira reči (Soho), svaka reč izranja iz maske; inače ceo naslov ulazi kao
 * `Pojava`. `animiraj={false}` za naslove koji moraju biti odmah vidljivi.
 *
 * `odmah` — za naslove iznad pregiba (h1 heroja i podstranica): animacija je
 * čist CSS koji kreće sa prvim iscrtavanjem, bez čekanja na JavaScript i
 * IntersectionObserver. Najveći tekst na ekranu (LCP) je tako vidljiv i kad
 * se skripta sporo učitava ili ne učita uopšte.
 */
export const Naslov = ({ as: Tag = 'h2', nivo = 2, tekst, akcenat, posle, className, animiraj = true, odmah = false, kasnjenje = 0, children }) => {
    const ref = useRef(null);
    const { tema } = useSajt();
    const reciAnim = animiraj && tema.pokret.reveal === 'reci';
    const vidljivo = usePojava(ref);
    const klasaAnimacije = !animiraj ? null
        : odmah ? (reciAnim ? 'reci-odmah' : 'ulaz-odmah')
            : cx(reciAnim ? 'reci-anim' : 'pojava', vidljivo && 'vidljivo');
    const velicina = { hero: 'naslov-hero', 1: 'naslov-1', 2: 'naslov-2', 3: 'naslov-3' }[nivo];
    const telo = children ?? (reciAnim ? (
        <>
            {reci(tekst, 0)}
            {akcenat && <> <span className="akcenat">{reci(akcenat, String(tekst).split(/(\s+)/).length + 1)}</span></>}
            {posle}
        </>
    ) : (
        <>
            {tekst}
            {akcenat && <> <span className="akcenat">{akcenat}</span></>}
            {posle}
        </>
    ));
    return (
        <Tag
            ref={ref}
            className={cx('naslov m-0', velicina, klasaAnimacije, className)}
            style={{ '--kasnjenje': `${kasnjenje}s` }}
        >
            {telo}
        </Tag>
    );
};

/* ── Dugme ─────────────────────────────────────────────────────────────── */
const VARIJANTE = { primarno: 'dugme-primarno', sekundarno: 'dugme-sekundarno', foto: 'dugme-foto', fotoObris: 'dugme-foto-obris' };

export const Dugme = forwardRef(({ to, href, varijanta = 'primarno', className, children, strelica = true, ...o }, ref) => {
    const klasa = cx('dugme', VARIJANTE[varijanta], className);
    const sadrzaj = (
        <>
            <span>{children}</span>
            {strelica && <span className="dugme-strelica" aria-hidden="true"><ArrowRight size={18} strokeWidth={1.75} /></span>}
            {strelica && <span className="dugme-ugao" aria-hidden="true"><ArrowUpRight size={18} strokeWidth={1.75} /></span>}
        </>
    );
    if (to) return <Link ref={ref} to={to} className={klasa} {...o}>{sadrzaj}</Link>;
    if (href) return <a ref={ref} href={href} className={klasa} {...o}>{sadrzaj}</a>;
    return <button ref={ref} type="button" className={klasa} {...o}>{sadrzaj}</button>;
});
Dugme.displayName = 'Dugme';

export const LinkStrelica = ({ to, href, className, children, ...o }) => {
    const sadrzaj = <>{children}<ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" /></>;
    const klasa = cx('link-strelica nadnaslov', className);
    return to ? <Link to={to} className={klasa} {...o}>{sadrzaj}</Link> : <a href={href} className={klasa} {...o}>{sadrzaj}</a>;
};

/* ── Raspored ──────────────────────────────────────────────────────────── */
export const Kontejner = ({ className, children, as: Tag = 'div', ...o }) => (
    <Tag className={cx('mx-auto w-full max-w-sajt px-5 md:px-10', className)} {...o}>{children}</Tag>
);

export const Sekcija = ({ className, children, id, ...o }) => (
    <section id={id} className={cx('py-20 md:py-28', className)} {...o}>{children}</section>
);

/* ── Fotografija ───────────────────────────────────────────────────────── */
/**
 * Fotografija sa filterom teme i rezervnim prikazom: dok fotografija ne
 * postoji (novi klijent još nije poslao slike), umesto prazne rupe stoji
 * diskretna površina u bojama teme. `paralaksa` — pomera se sporije od
 * stranice, jačinom koju određuje tema.
 */
export const Foto = ({ src, alt = '', className, okvirKlasa, prioritet = false, paralaksa = false, sizes, ...o }) => {
    const [greska, setGreska] = useState(!src);
    const imgRef = useRef(null);
    const okvirRef = useRef(null);
    const { tema } = useSajt();
    const jacina = paralaksa ? tema.pokret.paralaksa : 0;
    // Varijante iz `npm run slike` (640/1280/1920 + 4K) → srcset; browser bira najmanju dovoljnu.
    const podaci = src ? SLIKE[src] : null;

    useEffect(() => {
        setGreska(!src);
        const img = imgRef.current;
        if (img && img.complete && img.naturalWidth === 0 && src) setGreska(true);
    }, [src]);

    useEffect(() => {
        if (!jacina || greska) return undefined;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
        const okvir = okvirRef.current;
        const img = imgRef.current;
        if (!okvir || !img) return undefined;
        let ceka = false;
        const pomeri = () => {
            ceka = false;
            const r = okvir.getBoundingClientRect();
            const vh = window.innerHeight;
            if (r.bottom < -100 || r.top > vh + 100) return;
            const odnos = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
            img.style.transform = `translate3d(0, ${(-odnos * jacina).toFixed(1)}px, 0) scale(1.18)`;
        };
        const naSkrol = () => { if (!ceka) { ceka = true; requestAnimationFrame(pomeri); } };
        pomeri();
        window.addEventListener('scroll', naSkrol, { passive: true });
        window.addEventListener('resize', naSkrol);
        return () => { window.removeEventListener('scroll', naSkrol); window.removeEventListener('resize', naSkrol); img.style.transform = ''; };
    }, [jacina, greska]);

    return (
        <div ref={okvirRef} className={cx('foto-okvir', okvirKlasa)}>
            {!greska && (
                <img
                    ref={imgRef}
                    src={javno(src)}
                    srcSet={podaci ? [...podaci.varijante.map((w) => `${javno(src).replace(/\.webp$/, `-${w}.webp`)} ${w}w`), `${javno(src)} ${podaci.w}w`].join(', ') : undefined}
                    sizes={podaci ? (sizes || '(min-width: 1280px) 40vw, (min-width: 768px) 50vw, 100vw') : sizes}
                    width={podaci?.w}
                    height={podaci?.h}
                    alt={alt}
                    loading={prioritet ? 'eager' : 'lazy'}
                    decoding="async"
                    fetchpriority={prioritet ? 'high' : undefined}
                    onError={() => setGreska(true)}
                    className={cx('foto', className)}
                    {...o}
                />
            )}
            {greska && (
                <div className="zamena-foto" role={alt ? 'img' : undefined} aria-label={alt || undefined}>
                    <Car size={30} strokeWidth={1} aria-hidden="true" />
                </div>
            )}
        </div>
    );
};

/* ── Ikonice društvenih mreža (lucide nema brendove) ───────────────────── */
const Svg = ({ children, size = 18, ...o }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...o}>{children}</svg>
);
export const IkonaInstagram = (p) => <Svg {...p}><path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.2.8-.4.4-.6.7-.8 1.2-.2.4-.3 1-.4 2.1C2.7 8.5 2.7 8.9 2.7 12s0 3.5.1 4.7c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.2.4.4.7.6 1.2.8.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.2-.8.4-.4.6-.7.8-1.2.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.2-.4-.4-.7-.6-1.2-.8-.4-.2-1-.3-2.1-.4C15.5 4 15.1 4 12 4zm0 3.1a4.9 4.9 0 110 9.8 4.9 4.9 0 010-9.8zm0 8.1a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4zm6.2-8.3a1.1 1.1 0 11-2.3 0 1.1 1.1 0 012.3 0z" /></Svg>;
export const IkonaFacebook = (p) => <Svg {...p}><path d="M13.5 21.9v-8h2.7l.4-3.1h-3.1V8.8c0-.9.3-1.5 1.6-1.5h1.7V4.5c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.3H7.6v3.1h2.8v8h3.1z" /></Svg>;
export const IkonaTikTok = (p) => <Svg {...p}><path d="M16.6 3c.3 2.2 1.6 3.6 3.9 3.8v2.6c-1.4.1-2.6-.3-3.9-1.1v5c0 6.3-6.9 8.3-9.6 3.8-1.8-2.9-.7-8 5-8.2v2.8c-.4.1-.9.2-1.3.3-1.3.4-2 1.2-1.8 2.6.4 2.8 5.5 3.6 5.1-1.8V3h2.6z" /></Svg>;
export const IkonaWhatsApp = (p) => <Svg {...p}><path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.7-.3-1.6-.6-2.5-1.5-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.4.3-.4v-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.2-.9.9-.9 2.2s.9 2.6 1.1 2.7c.1.2 1.8 2.8 4.4 3.9 2.2.9 2.6.7 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z" /></Svg>;
export const IkonaViber = (p) => <Svg {...p}><path d="M11.4 2c-2 0-6.3.3-8.3 2.2C1.6 5.7 1.1 7.9 1 10.6c-.1 2.7-.1 7.8 4.8 9.2v2.1s0 .8.5 1c.6.2 1-.4 1.6-1l1.1-1.3c3 .3 5.4-.3 5.6-.4.6-.2 4.1-.6 4.7-5.3.6-4.9-.3-8-1.9-9.4C16 4.2 13.4 2 11.4 2zm.1 1.6c1.7 0 4 1.4 4.9 2.2 1.3 1.1 2 3.7 1.5 7.8-.5 3.9-3.3 4.1-3.8 4.3-.2.1-2.2.6-4.7.4 0 0-1.9 2.2-2.5 2.8-.1.1-.2.1-.3.1s-.1-.3-.1-.4v-3C2.4 16.6 2.6 12.4 2.6 10.6c.1-2.3.5-4.1 1.7-5.3 1.6-1.5 5.4-1.7 7.2-1.7zm.3 2.4c-.2 0-.2.3 0 .3 1.4 0 2.6.5 3.4 1.4.8.9 1.2 2 1.2 3.3 0 .2.3.2.3 0 0-1.4-.4-2.6-1.3-3.6-.9-.9-2.1-1.4-3.6-1.4zm-3.4.6c-.3 0-.5.1-.7.3l-.6.6c-.3.3-.4.7-.3 1.1.3 1 .9 2.2 1.9 3.3 1.1 1.2 2.4 2 3.6 2.5.4.2.8.1 1.1-.2l.6-.6c.3-.3.3-.8 0-1.1l-1-.8c-.3-.2-.7-.2-1 .1l-.4.4c-.1.1-.3.1-.4.1-.4-.2-1-.5-1.5-1.1-.5-.5-.9-1-1.1-1.5 0-.1 0-.3.1-.4l.4-.4c.3-.3.3-.7.1-1l-.8-1c-.1-.2-.3-.3-.5-.3h.3zm3.6.3c-.2 0-.2.3 0 .3.8.1 1.5.4 2 .9s.8 1.2.8 2c0 .2.3.2.3 0 0-.9-.3-1.7-.9-2.3-.6-.6-1.3-.9-2.2-.9zm.2 1.1c-.2 0-.2.3 0 .3.8.1 1.2.5 1.3 1.3 0 .2.3.2.3 0-.1-1-.6-1.5-1.6-1.6z" /></Svg>;
