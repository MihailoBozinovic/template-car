import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Calendar, CalendarDays, Car, Check, ChevronUp, Clock, Search, X } from 'lucide-react';
import { useSajt } from '../kontekst/Sajt.jsx';
import { brojDana as tekstDana, cena, datumDugo, trajanje, trajanjeUsluge } from '../lib/format.js';
import { daniZaZakazivanje, danUNedelji, sadaULokalu, dodajDane, terminiZaDan, uMinute } from '../lib/vreme.js';
import {
    dozvoljeniKorak, greskePodataka, imaCenuOd, linkKanala, poljaVozila, posaljiZahtev, sveUsluge, tekstPoruke,
    ukupnaCena, ukupnoDana, ukupnoMinuta, vidljiviKoraci, normalizujTelefon,
} from '../lib/zakazivanje.js';
import { cenaJeOd, cenaZa, opcijeVozila, trajanjeZa } from '../lib/cene.js';
import { procitajVozilo, zapamtiVozilo } from '../components/IzborVozila.jsx';
import { napraviIcs, preuzmiIcs } from '../lib/ics.js';
import { zabeleziDogadjaj } from '../lib/pristanak.js';
import { Dugme, Foto, Kontejner, Nadnaslov, Naslov, cx } from '../components/primitivi.jsx';
import ZaglavljeStranice from '../components/ZaglavljeStranice.jsx';
import { KontaktDugmad, useNaKlijentu } from '../components/delovi.jsx';

/*
 * ZAKAZIVANJE — pravljeno prvo za telefon (tu se najviše zakazuje):
 *
 *  - kompaktno zaglavlje i traka napretka („Korak 2 od 5 · Usluga”) umesto
 *    velikog naslova stranice, pa usluge kreću u prvom ekranu;
 *  - usluge po kategorijama (čipovi), velika polja za dodir sa jasnim
 *    izborom (kvačica, okvir u boji teme);
 *  - vozilo i vreme: dodir bira I prelazi na sledeći korak (kao u
 *    aplikacijama za rezervacije); prvi slobodan dan je već izabran, pa se
 *    vremena vide odmah;
 *  - lepljiva traka na dnu: šta je izabrano i koliko košta (dodir otvara
 *    pregled sa brisanjem), „Nazad” i veliko dugme sa tekstom koji kaže šta
 *    sledi („Izaberite vreme”, „Dalje · 2 usluge”…);
 *  - na desktopu ista logika sa šinom koraka i sažetkom sa strane.
 */

const NACRT = 'zakazivanje.nacrt.v1';
const PRAZNO = { vozilo: null, usluge: [], datum: null, vreme: null, korak: 'vozilo', podaci: { ime: '', telefon: '', email: '', model: '', tablice: '', napomena: '', saglasnost: false } };
const KANAL_IME = { whatsapp: 'WhatsApp', viber: 'Viber', email: 'e-mail' };
const AUTO_DALJE_MS = 260;

const ucitajNacrt = () => {
    try {
        const n = JSON.parse(sessionStorage.getItem(NACRT) || '{}');
        return { ...PRAZNO, ...n, podaci: { ...PRAZNO.podaci, ...(n.podaci ?? {}) } };
    } catch { return PRAZNO; }
};

/* ── Spoljni sistem (nacin: 'link') ───────────────────────────────────── */
const ZakazivanjeLinkom = () => {
    const { servis, t } = useSajt();
    return (
        <>
            <ZaglavljeStranice nadnaslov={t.zakazivanje.nadnaslov} naslov={t.zakazivanje.linkNaslov} uvod={t.zakazivanje.linkTekst}>
                <div className="mt-8 space-y-8">
                    <Dugme href={servis.zakazivanje.link} target="_blank" rel="noopener noreferrer">{t.zakazivanje.linkDugme}</Dugme>
                    <div>
                        <p className="nadnaslov m-0 mb-3 opacity-70">{t.zakazivanje.iliKontakt}</p>
                        <KontaktDugmad />
                    </div>
                </div>
            </ZaglavljeStranice>
            <div className="pb-24" />
        </>
    );
};

/* ── Napredak: traka na telefonu, šina koraka na desktopu ─────────────── */
const Napredak = ({ koraci, korak, idiNa }) => {
    const { t } = useSajt();
    const i = koraci.indexOf(korak);
    return (
        <>
            <div className="md:hidden" aria-live="polite">
                <div className="flex items-baseline justify-between gap-3">
                    <p className="m-0 text-sm font-medium">{t.zakazivanje.koraci[korak]}</p>
                    <p className="nadnaslov m-0 opacity-60">{t.zakazivanje.korakOd(i + 1, koraci.length)}</p>
                </div>
                <div className="mt-2.5 flex gap-1" aria-hidden="true">
                    {koraci.map((k, n) => (
                        <span key={k} className="h-1 flex-1 rounded-full transition-colors duration-300" style={{ background: n <= i ? 'rgb(var(--c-brand))' : 'rgb(var(--c-linija) / .15)' }} />
                    ))}
                </div>
            </div>
            <ol className="m-0 hidden list-none gap-2 p-0 md:flex" aria-label={t.zakazivanje.korakOd(i + 1, koraci.length)}>
                {koraci.map((k, n) => (
                    <li key={k} className="flex-1">
                        <button
                            type="button"
                            disabled={n > i}
                            onClick={() => idiNa(k)}
                            aria-current={k === korak ? 'step' : undefined}
                            className={cx('nadnaslov flex w-full flex-col items-start gap-2 border-t-2 pt-3 text-left transition-opacity', n > i && 'opacity-40', n < i && 'hover:opacity-70')}
                            style={{ borderColor: n <= i ? 'rgb(var(--c-brand))' : 'rgb(var(--c-linija) / .2)' }}
                        >
                            <span className="tabular-nums opacity-60">{n < i ? <Check size={13} className="inline" /> : String(n + 1).padStart(2, '0')}</span>
                            <span>{t.zakazivanje.koraci[k]}</span>
                        </button>
                    </li>
                ))}
            </ol>
        </>
    );
};

/** Kvačica za izabranu stavku. */
const Kvacica = ({ ukljucena, okrugla = true }) => (
    <span
        className={cx('flex h-6 w-6 shrink-0 items-center justify-center border transition-all duration-200', okrugla ? 'rounded-full' : 'rounded-md', ukljucena ? 'scale-100 border-brand bg-brand text-naBrand' : 'border-ink/25')}
        aria-hidden="true"
    >
        {ukljucena && <Check size={14} strokeWidth={2.5} />}
    </span>
);

export default function Zakazivanje() {
    const { servis, t, tx, jezik, p } = useSajt();
    if (servis.zakazivanje.nacin === 'link' && servis.zakazivanje.link) return <ZakazivanjeLinkom />;
    return <Carobnjak servis={servis} t={t} z={t.zakazivanje} tx={tx} jezik={jezik} p={p} />;
}

function Carobnjak({ servis, t, z, tx, jezik, p }) {
    const { search } = useLocation();
    const klijent = useNaKlijentu();
    const [s, setS] = useState(PRAZNO);
    const [greske, setGreske] = useState({});
    const [kategorija, setKategorija] = useState('sve');
    const [upit, setUpit] = useState('');
    const [brojDana, setBrojDana] = useState(21);
    const [pregled, setPregled] = useState(false); // sažetak na telefonu (dodir na traku)
    const [slanje, setSlanje] = useState({ stanje: 'ne' }); // ne | salje | uspeh | greska
    const vrh = useRef(null);
    const ucitano = useRef(false);
    const tajmer = useRef(null);

    // Nacrt iz sesije + ?usluga= / ?kategorija= / ?vozilo= iz adrese (samo u browseru, posle hidratacije).
    useEffect(() => {
        const q = new URLSearchParams(search);
        const nacrt = ucitajNacrt();
        const usluga = q.get('usluga');
        const kat = q.get('kategorija');
        const vozilo = q.get('vozilo') || nacrt.vozilo || procitajVozilo();
        nacrt.vozilo = opcijeVozila(servis).some((o) => o.id === vozilo) ? vozilo : null;
        nacrt.usluge = nacrt.usluge.filter((id) => sveUsluge(servis).some((u) => u.id === id));
        if (usluga && sveUsluge(servis).some((u) => u.id === usluga)) { nacrt.usluge = [usluga]; nacrt.korak = 'termin'; nacrt.datum = null; nacrt.vreme = null; }
        if (kat && servis.kategorije.some((k) => k.id === kat)) { setKategorija(kat); if (!usluga) nacrt.korak = 'usluga'; }
        setS(nacrt);
        ucitano.current = true;
        return () => clearTimeout(tajmer.current);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!ucitano.current) return;
        try { sessionStorage.setItem(NACRT, JSON.stringify({ ...s, podaci: { ...s.podaci, saglasnost: false } })); } catch { /* */ }
    }, [s]);

    const sve = useMemo(() => sveUsluge(servis), [servis]);
    const izabrane = s.usluge.map((id) => sve.find((u) => u.id === id)).filter(Boolean);
    const opcije = opcijeVozila(servis);
    const vozilo = opcije.find((o) => o.id === s.vozilo) ?? null;
    const koraci = vidljiviKoraci(servis);
    const korak = dozvoljeniKorak(s.korak, { vozilo: s.vozilo, usluge: izabrane, datum: s.datum, vreme: s.vreme }, koraci);
    const minuta = ukupnoMinuta(izabrane, s.vozilo, servis);
    const dana = ukupnoDana(izabrane);
    const maks = servis.zakazivanje.maksUsluga ?? 1;
    const pv = poljaVozila(servis);

    const dani = useMemo(() => (klijent ? daniZaZakazivanje(servis) : []), [klijent, servis]);
    // Slobodni termini po danu, jednom za sve prikazane dane (dan bez termina je onemogućen).
    const terminiPoDanu = useMemo(() => {
        if (!klijent || !minuta) return {};
        return Object.fromEntries(dani.map((d) => [d, terminiZaDan(d, servis, { trajanje: minuta })]));
    }, [klijent, minuta, dani, servis]);
    const terminiDana = (s.datum && terminiPoDanu[s.datum]) || [];

    // Na koraku „Termin”: ako dan nije izabran (ili više nema termina), izaberi prvi slobodan — vremena se vide odmah.
    useEffect(() => {
        if (korak !== 'termin' || !klijent || !minuta) return;
        if (s.datum && terminiPoDanu[s.datum]?.length) return;
        const prvi = dani.find((d) => terminiPoDanu[d]?.length);
        if (prvi) setS((x) => ({ ...x, datum: prvi, vreme: null }));
    }, [korak, klijent, minuta, terminiPoDanu]); // eslint-disable-line react-hooks/exhaustive-deps

    // Izabrani termin koji više ne postoji (drugo vozilo, duža usluga) se briše.
    useEffect(() => {
        if (s.vreme && s.datum && klijent && minuta && !terminiDana.includes(s.vreme)) setS((x) => ({ ...x, vreme: null }));
    }, [terminiPoDanu, s.datum]); // eslint-disable-line react-hooks/exhaustive-deps

    const postavi = (izmena) => setS((x) => ({ ...x, ...izmena }));
    const naVrh = () => {
        const el = vrh.current;
        if (!el) return;
        const cilj = el.getBoundingClientRect().top + window.scrollY - 88;
        if (window.scrollY <= cilj + 4) return; // već se vidi
        if (window.__lenis) window.__lenis.scrollTo(cilj);
        else window.scrollTo({ top: cilj, behavior: 'smooth' });
    };
    const idiNa = (k) => {
        clearTimeout(tajmer.current);
        setPregled(false);
        postavi({ korak: k });
        requestAnimationFrame(naVrh);
    };
    const sledeciOd = (k) => koraci[koraci.indexOf(k) + 1];
    const sledeci = () => {
        if (korak === 'podaci') {
            const g = greskePodataka(s.podaci, z.greske, servis);
            setGreske(g);
            if (Object.keys(g).length) {
                document.getElementById(`polje-${Object.keys(g)[0]}`)?.focus();
                return;
            }
        }
        const n = sledeciOd(korak);
        if (n) idiNa(n);
    };
    const nazad = () => { const n = koraci[koraci.indexOf(korak) - 1]; if (n) idiNa(n); };
    /** Izbor koji sam vodi dalje (vozilo, vreme) — kratka pauza da se vidi kvačica. */
    const izaberiIDalje = (izmena, saKoraka) => {
        postavi(izmena);
        clearTimeout(tajmer.current);
        tajmer.current = setTimeout(() => { const n = sledeciOd(saKoraka); if (n) idiNa(n); }, AUTO_DALJE_MS);
    };

    const toggleUsluga = (u) => {
        const ima = s.usluge.includes(u.id);
        let nove = ima ? s.usluge.filter((x) => x !== u.id) : [...s.usluge, u.id];
        if (!ima && maks === 1) nove = [u.id];
        if (nove.length > maks) return;
        postavi({ usluge: nove, vreme: null });
    };

    const nazivUsluge = (u) => tx(u.naziv);
    const cenaTekst = `${imaCenuOd(izabrane, s.vozilo) ? `${t.opste.od} ` : ''}${cena(ukupnaCena(izabrane, s.vozilo), jezik)}`;
    const trajanjeTekst = dana ? tekstDana(dana, jezik) : trajanje(minuta, jezik);
    const datumTekst = s.datum ? `${t.dani.dugo[danUNedelji(s.datum)]}, ${datumDugo(s.datum, t, jezik)}` : '';
    const poruka = () => tekstPoruke({
        izabrane, voziloNaziv: vozilo ? tx(vozilo.naziv) : null, datumTekst, vreme: s.vreme, podaci: s.podaci, nazivUsluge, cenaTekst, trajanjeTekst,
    }, t);

    const posalji = async () => {
        const tekst = poruka();
        const kanal = servis.zakazivanje.kanal ?? {};
        const zahtev = {
            usluge: izabrane.map((u) => ({ id: u.id, naziv: nazivUsluge(u), trajanje: trajanjeZa(u, s.vozilo), dana: u.dana ?? null, cena: cenaZa(u, s.vozilo), cenaOd: cenaJeOd(u, s.vozilo) })),
            vozilo: vozilo ? { id: vozilo.id, naziv: tx(vozilo.naziv) } : null,
            datum: s.datum, vreme: s.vreme, trajanje: minuta, dana: dana || null, ukupno: ukupnaCena(izabrane, s.vozilo),
            ime: s.podaci.ime.trim(), telefon: normalizujTelefon(s.podaci.telefon), email: s.podaci.email.trim() || null,
            model: s.podaci.model?.trim() || null, tablice: s.podaci.tablice?.trim().toUpperCase() || null,
            napomena: s.podaci.napomena.trim() || null, jezik, saglasnost: true, poslato: new Date().toISOString(),
        };
        // Aplikacija za poruke se otvara ODMAH, u istom kliku — inače je browser blokira.
        if (kanal.tip !== 'webhook' || !kanal.url) {
            const url = linkKanala(kanal.tip, servis, tekst) ?? linkKanala('whatsapp', servis, tekst) ?? linkKanala('email', servis, tekst);
            if (url) {
                if (url.startsWith('https://')) window.open(url, '_blank', 'noopener');
                else window.location.href = url;
                zabeleziDogadjaj('zahtev_za_termin', { kanal: kanal.tip });
                setSlanje({ stanje: 'uspeh', kanal: true });
                window.scrollTo({ top: 0 });
            } else setSlanje({ stanje: 'greska' });
            return;
        }
        setSlanje({ stanje: 'salje' });
        const r = await posaljiZahtev(servis, zahtev, tekst);
        if (r.ok) {
            zabeleziDogadjaj('zahtev_za_termin', { kanal: 'webhook' });
            setSlanje({ stanje: 'uspeh' });
            window.scrollTo({ top: 0 });
        } else setSlanje({ stanje: 'greska' });
    };

    const kalendar = () => preuzmiIcs(napraviIcs({
        naslov: `${servis.naziv} — ${izabrane.map(nazivUsluge).join(', ')}`,
        opis: `${z.zahtevNapomena}\n${servis.kontakt.telefonPrikaz}`,
        lokacija: `${servis.lokacija.adresa}, ${tx(servis.lokacija.grad)}`,
        datum: s.datum, vreme: s.vreme, trajanje: minuta,
    }), `${servis.kratkiNaziv || 'termin'}-${s.datum}.ics`);

    const novo = () => {
        try { sessionStorage.removeItem(NACRT); } catch { /* */ }
        setS(PRAZNO);
        setSlanje({ stanje: 'ne' });
        setGreske({});
    };

    /* ── Uspeh ── */
    if (slanje.stanje === 'uspeh') {
        return (
            <Kontejner className="flex min-h-[80svh] max-w-3xl flex-col justify-center pb-24 pt-28 md:pt-36">
                <span className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand text-naBrand" style={{ animation: 'pin-pad .6s cubic-bezier(.22,1,.36,1) both' }}><Check size={26} /></span>
                <Naslov as="h1" nivo={1} tekst={z.uspehNaslov} animiraj={false} />
                <p className="tekst-uvod m-0 mt-6 opacity-80">{slanje.kanal ? z.uspehKanal : z.uspehTekst}</p>
                <div className="kartica mt-10 space-y-2 p-6 text-sm">
                    <p className="m-0 font-medium">{izabrane.map(nazivUsluge).join(', ')}</p>
                    <p className="m-0 opacity-75">{datumTekst} · {s.vreme} · {trajanjeTekst}</p>
                    {vozilo && <p className="m-0 opacity-75">{tx(vozilo.naziv)}{s.podaci.model ? ` · ${s.podaci.model}` : ''}</p>}
                </div>
                <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
                    <Dugme onClick={kalendar} varijanta="sekundarno" strelica={false}><Calendar size={16} /> {z.dodajUKalendar}</Dugme>
                    <Dugme onClick={novo} varijanta="sekundarno" strelica={false}>{z.novo}</Dugme>
                </div>
                {slanje.kanal && <KontaktDugmad className="mt-8" tekst={poruka()} />}
            </Kontejner>
        );
    }

    const upitMali = upit.trim().toLowerCase();
    const kategorijeSaUslugama = servis.kategorije
        .map((k) => ({
            ...k,
            lista: k.usluge
                .map((u) => sve.find((x) => x.id === u.id))
                .filter((u) => !upitMali || tx(u.naziv).toLowerCase().includes(upitMali) || tx(k.naziv).toLowerCase().includes(upitMali)),
        }))
        .filter((k) => k.lista.length);
    const prikazaneKategorije = upitMali || kategorija === 'sve' ? kategorijeSaUslugama : kategorijeSaUslugama.filter((k) => k.id === kategorija);
    const { datum: danasISO } = klijent ? sadaULokalu() : { datum: '' };
    const oznakaDana = (d) => (d === danasISO ? t.opste.danas : d === dodajDane(danasISO, 1) ? t.opste.sutra : t.dani.kratko[danUNedelji(d)]);

    /* ── Sadržaj koraka ── */
    const sadrzaj = {
        usluga: (
            <div>
                <h2 className="naslov naslov-3 m-0 md:naslov-2">{z.uslugaNaslov}</h2>
                <p className="m-0 mt-2 text-sm opacity-70">{z.uslugaNapomena(maks)}</p>
                {vozilo && (
                    <p className="m-0 mt-4">
                        <button type="button" className="cip" onClick={() => idiNa('vozilo')}><Car size={14} aria-hidden="true" /> {tx(vozilo.naziv)} <span className="opacity-60">· {z.izmeni}</span></button>
                    </p>
                )}

                <label className="relative mt-5 block">
                    <span className="sr-only">{z.pretraga}</span>
                    <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" aria-hidden="true" />
                    <input type="search" value={upit} onChange={(e) => setUpit(e.target.value)} placeholder={z.pretraga} className="polje !pl-11" enterKeyHint="search" />
                </label>

                {/* Kategorije — lepljive ispod headera, prevlače se vodoravno */}
                {!upitMali && kategorijeSaUslugama.length > 1 && (
                    <div className="sticky top-[76px] z-10 -mx-5 mt-4 bg-paper/95 px-5 py-2.5 backdrop-blur md:static md:mx-0 md:bg-transparent md:px-0 md:backdrop-blur-none">
                        <div className="skriven-skrol -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
                            {[{ id: 'sve', naziv: t.galerija.sve }, ...kategorijeSaUslugama].map((k) => {
                                const broj = k.id === 'sve' ? s.usluge.length : k.lista.filter((u) => s.usluge.includes(u.id)).length;
                                return (
                                    <button key={k.id} type="button" className="cip shrink-0" aria-pressed={kategorija === k.id} onClick={() => setKategorija(k.id)}>
                                        {tx(k.naziv)}
                                        {broj > 0 && k.id !== 'sve' && <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-[11px] text-naBrand">{broj}</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="mt-4 space-y-8">
                    {!prikazaneKategorije.length && <p className="m-0 py-8 text-center opacity-60">{t.cenovnik.prazno}</p>}
                    {prikazaneKategorije.map((k) => (
                        <section key={k.id} aria-label={tx(k.naziv)}>
                            {(kategorija === 'sve' || upitMali) && <h3 className="nadnaslov m-0 mb-3 opacity-60">{tx(k.naziv)}</h3>}
                            <ul className="m-0 grid list-none gap-2 p-0 lg:grid-cols-2">
                                {k.lista.map((u) => {
                                    const izabrana = s.usluge.includes(u.id);
                                    const puno = !izabrana && maks > 1 && s.usluge.length >= maks;
                                    return (
                                        <li key={u.id}>
                                            <button
                                                type="button"
                                                aria-pressed={izabrana}
                                                disabled={puno}
                                                onClick={() => toggleUsluga(u)}
                                                className={cx(
                                                    'kartica flex min-h-[72px] w-full items-center gap-4 px-4 py-3.5 text-left transition-all duration-200 active:scale-[.99] disabled:opacity-40',
                                                    izabrana ? '!border-brand shadow-[0_0_0_1px_rgb(var(--c-brand))]' : 'hover:!border-ink/35',
                                                )}
                                                style={izabrana ? { background: 'color-mix(in srgb, rgb(var(--c-brand)) 6%, rgb(var(--c-povrsina)))' } : undefined}
                                            >
                                                <span className="min-w-0 flex-1">
                                                    <span className="block font-medium leading-snug">{tx(u.naziv)}</span>
                                                    <span className="mt-1 flex flex-wrap items-center gap-x-2 text-sm opacity-65">
                                                        <span className="inline-flex items-center gap-1">{u.dana ? <CalendarDays size={13} aria-hidden="true" /> : <Clock size={13} aria-hidden="true" />}{trajanjeUsluge(u, trajanjeZa(u, s.vozilo), jezik)}</span>
                                                        <span aria-hidden="true">·</span>
                                                        <span className="tabular-nums">{cenaJeOd(u, s.vozilo) && `${t.opste.od} `}{cena(cenaZa(u, s.vozilo), jezik)}</span>
                                                    </span>
                                                </span>
                                                <Kvacica ukljucena={izabrana} okrugla={maks === 1} />
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </section>
                    ))}
                </div>
            </div>
        ),

        vozilo: (
            <div>
                <h2 className="naslov naslov-3 m-0 md:naslov-2">{tx(servis.izborVozila?.naslov) || z.voziloNaslov}</h2>
                <p className="m-0 mt-2 text-sm opacity-70">{z.voziloNapomena}</p>
                <ul className="m-0 mt-6 grid list-none gap-2 p-0 sm:grid-cols-2" role="radiogroup" aria-label={tx(servis.izborVozila?.naslov) || z.voziloNaslov}>
                    {opcije.map((o) => {
                        const izabran = s.vozilo === o.id;
                        return (
                            <li key={o.id}>
                                <button
                                    type="button"
                                    role="radio"
                                    aria-checked={izabran}
                                    onClick={() => { zapamtiVozilo(o.id); izaberiIDalje({ vozilo: o.id, vreme: null }, 'vozilo'); }}
                                    className={cx('kartica flex min-h-[84px] w-full items-center gap-4 p-3 pr-4 text-left transition-all duration-200 active:scale-[.99]', izabran ? '!border-brand shadow-[0_0_0_1px_rgb(var(--c-brand))]' : 'hover:!border-ink/35')}
                                >
                                    <span className="flex h-14 w-14 shrink-0 items-center justify-center" style={{ background: 'rgb(var(--c-mist))', borderRadius: 'min(var(--r-kartica), 12px)' }}><Car size={24} strokeWidth={1.25} aria-hidden="true" /></span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block font-medium">{tx(o.naziv)}</span>
                                        {o.opis && <span className="block text-sm opacity-65">{tx(o.opis)}</span>}
                                    </span>
                                    <Kvacica ukljucena={izabran} />
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        ),

        termin: (
            <div>
                <h2 className="naslov naslov-3 m-0 md:naslov-2">{z.terminNaslov}</h2>
                <p className="m-0 mt-2 text-sm opacity-70">{dana ? z.terminPrijem(tekstDana(dana, jezik)) : `${trajanje(minuta, jezik)}${vozilo ? ` · ${tx(vozilo.naziv)}` : ''}`}</p>

                {/* Dani — vodoravna traka; dan bez slobodnih termina je ugašen */}
                <div className="mt-6">
                    <p className="nadnaslov m-0 mb-3 opacity-60">{s.datum ? `${t.meseci[Number(s.datum.slice(5, 7)) - 1]} ${s.datum.slice(0, 4)}` : ' '}</p>
                    <div className="skriven-skrol -mx-5 flex snap-x scroll-px-5 gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:scroll-px-0 md:px-0">
                        {!klijent && <div className="h-[76px]" />}
                        {dani.slice(0, brojDana).map((d) => {
                            const radi = (terminiPoDanu[d]?.length ?? 0) > 0;
                            const izabran = s.datum === d;
                            return (
                                <button
                                    key={d}
                                    type="button"
                                    disabled={!radi}
                                    aria-pressed={izabran}
                                    aria-label={`${t.dani.dugo[danUNedelji(d)]}, ${datumDugo(d, t, jezik)}`}
                                    onClick={() => postavi({ datum: d, vreme: null })}
                                    className={cx('flex w-[3.9rem] shrink-0 snap-start flex-col items-center gap-0.5 border py-2.5 transition-colors disabled:cursor-not-allowed disabled:opacity-30', izabran ? 'border-ink bg-ink text-paper' : 'hover:border-ink/50')}
                                    style={{ borderRadius: 'min(var(--r-kartica), 14px)', borderColor: izabran ? undefined : 'rgb(var(--c-linija) / .18)' }}
                                >
                                    <span className="text-[11px] uppercase tracking-wide opacity-75">{oznakaDana(d)}</span>
                                    <span className="text-xl font-medium tabular-nums leading-tight">{Number(d.slice(8))}</span>
                                </button>
                            );
                        })}
                        {brojDana < dani.length && (
                            <button type="button" onClick={() => setBrojDana((b) => b + 14)} className="w-[4.6rem] shrink-0 border border-dashed px-2 text-xs opacity-70 hover:opacity-100" style={{ borderRadius: 'min(var(--r-kartica), 14px)', borderColor: 'rgb(var(--c-linija) / .3)' }}>
                                {z.prikaziJos}
                            </button>
                        )}
                    </div>
                </div>

                {/* Vremena izabranog dana */}
                {s.datum && (
                    <div className="mt-7" key={s.datum} style={{ animation: 'ulaz-stranice .35s ease both' }}>
                        <p className="m-0 mb-4 font-medium">{datumTekst}</p>
                        {!terminiDana.length && <p className="m-0 opacity-70">{z.nemaTermina}</p>}
                        {[['jutro', 0, 720], ['popodne', 720, 1020], ['vece', 1020, 1440]].map(([ime, od, do_]) => {
                            const lista = terminiDana.filter((v) => uMinute(v) >= od && uMinute(v) < do_);
                            if (!lista.length) return null;
                            return (
                                <div key={ime} className="mb-6">
                                    <p className="nadnaslov m-0 mb-2.5 opacity-60">{z[ime]}</p>
                                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
                                        {lista.map((v) => (
                                            <button
                                                key={v}
                                                type="button"
                                                aria-pressed={s.vreme === v}
                                                onClick={() => izaberiIDalje({ vreme: v }, 'termin')}
                                                className={cx('h-12 border text-[15px] tabular-nums transition-colors active:scale-95', s.vreme === v ? 'border-ink bg-ink text-paper' : 'hover:border-ink/60')}
                                                style={{ borderRadius: 'min(var(--r-dugme), 10px)', borderColor: s.vreme === v ? undefined : 'rgb(var(--c-linija) / .18)' }}
                                            >
                                                {v}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        ),

        podaci: (
            <form noValidate onSubmit={(e) => { e.preventDefault(); sledeci(); }}>
                <h2 className="naslov naslov-3 m-0 md:naslov-2">{z.podaciNaslov}</h2>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    {[
                        ['ime', z.ime, 'text', 'name', true, 'next'],
                        ['telefon', z.telefon, 'tel', 'tel', true, 'next'],
                        ['email', z.email, 'email', 'email', false, 'next'],
                        ...(pv.model !== 'ne' ? [['model', z.model, 'text', 'off', pv.model === 'obavezno', 'next', z.modelPlaceholder]] : []),
                        ...(pv.tablice !== 'ne' ? [['tablice', z.tablice, 'text', 'off', pv.tablice === 'obavezno', 'next', z.tablicePlaceholder]] : []),
                    ].map(([k, oznaka, tip, ac, obavezno, enter, placeholder], _i, svi) => (
                        <label key={k} className={cx('block', svi.length % 2 === 1 && k === svi[svi.length - 1][0] && 'sm:col-span-2')}>
                            <span className="mb-2 block text-sm font-medium">{oznaka}{!obavezno && <span className="font-normal opacity-60"> · {z.opciono}</span>}</span>
                            <input
                                id={`polje-${k}`}
                                type={tip}
                                autoComplete={ac}
                                enterKeyHint={enter}
                                inputMode={tip === 'tel' ? 'tel' : tip === 'email' ? 'email' : undefined}
                                autoCapitalize={k === 'ime' || k === 'model' ? 'words' : k === 'tablice' ? 'characters' : 'off'}
                                placeholder={placeholder}
                                required={obavezno}
                                value={s.podaci[k]}
                                aria-invalid={Boolean(greske[k])}
                                aria-describedby={greske[k] ? `greska-${k}` : undefined}
                                onChange={(e) => { postavi({ podaci: { ...s.podaci, [k]: e.target.value } }); if (greske[k]) setGreske((g) => ({ ...g, [k]: undefined })); }}
                                className="polje h-12"
                            />
                            {greske[k] && <span id={`greska-${k}`} className="mt-1.5 block text-sm text-red-700">{greske[k]}</span>}
                        </label>
                    ))}
                    <label className="block sm:col-span-2">
                        <span className="mb-2 block text-sm font-medium">{z.napomena}<span className="font-normal opacity-60"> · {z.opciono}</span></span>
                        <textarea rows={3} maxLength={500} value={s.podaci.napomena} placeholder={z.napomenaPlaceholder} onChange={(e) => postavi({ podaci: { ...s.podaci, napomena: e.target.value } })} className="polje resize-y" />
                    </label>
                    <label className="flex cursor-pointer items-start gap-3 text-sm sm:col-span-2">
                        <input
                            id="polje-saglasnost"
                            type="checkbox"
                            checked={s.podaci.saglasnost}
                            aria-invalid={Boolean(greske.saglasnost)}
                            onChange={(e) => { postavi({ podaci: { ...s.podaci, saglasnost: e.target.checked } }); setGreske((g) => ({ ...g, saglasnost: undefined })); }}
                            className="mt-0.5 h-5 w-5 shrink-0 accent-[rgb(var(--c-brand))]"
                        />
                        <span className="leading-relaxed">{z.saglasnost} <Link to={p('privatnost')} target="_blank" className="podvucen">{z.politika}</Link>.
                            {greske.saglasnost && <span className="mt-1.5 block text-red-700">{greske.saglasnost}</span>}
                        </span>
                    </label>
                </div>
                <button type="submit" className="sr-only">{t.opste.dalje}</button>
            </form>
        ),

        potvrda: (
            <div>
                <h2 className="naslov naslov-3 m-0 md:naslov-2">{z.potvrdaNaslov}</h2>
                <dl className="kartica m-0 mt-6 divide-y p-0">
                    {[
                        ['usluga', z.poruka.usluge, izabrane.map(nazivUsluge).join(', ')],
                        ...(koraci.includes('vozilo') && vozilo ? [['vozilo', z.poruka.vozilo, tx(vozilo.naziv)]] : []),
                        ['termin', z.poruka.termin, `${datumTekst} · ${s.vreme}`],
                        ['podaci', z.poruka.ime, [s.podaci.ime, s.podaci.telefon, s.podaci.email, s.podaci.model, s.podaci.tablice?.toUpperCase()].filter(Boolean).join(' · ')],
                    ].map(([k, oznaka, vrednost]) => (
                        <div key={k} className="flex items-start justify-between gap-4 p-4 md:p-5" style={{ borderColor: 'rgb(var(--c-linija) / .1)' }}>
                            <div className="min-w-0">
                                <dt className="nadnaslov opacity-60">{oznaka}</dt>
                                <dd className="m-0 mt-1.5 break-words">{vrednost}</dd>
                            </div>
                            <button type="button" onClick={() => idiNa(k)} className="shrink-0 p-1 text-sm underline underline-offset-4 opacity-70 hover:opacity-100">{z.izmeni}</button>
                        </div>
                    ))}
                    <div className="flex items-baseline justify-between gap-4 p-4 md:p-5" style={{ borderColor: 'rgb(var(--c-linija) / .1)' }}>
                        <dt className="font-medium">{z.ukupno} · {trajanjeTekst}</dt>
                        <dd className="m-0 text-xl tabular-nums">{cenaTekst}</dd>
                    </div>
                </dl>
                <p className="m-0 mt-5 text-sm leading-relaxed opacity-75">{z.zahtevNapomena}</p>
                {slanje.stanje === 'greska' && (
                    <div className="mt-6 border p-5 text-sm" role="alert" style={{ borderColor: 'rgb(180 35 24 / .4)', borderRadius: 'var(--r-kartica)' }}>
                        <p className="m-0 mb-4 text-red-700">{z.greska}</p>
                        <KontaktDugmad tekst={poruka()} />
                    </div>
                )}
            </div>
        ),
    };

    /* ── Dugme „dalje”: tekst kaže šta sledi ── */
    const kanalTip = servis.zakazivanje.kanal?.tip;
    const dugmePosalji = kanalTip === 'webhook' && servis.zakazivanje.kanal?.url ? z.posalji : z.posaljiPreko(KANAL_IME[kanalTip] ?? 'WhatsApp');
    const moze = korak === 'vozilo' ? Boolean(vozilo) : korak === 'usluga' ? izabrane.length > 0 : korak === 'termin' ? Boolean(s.datum && s.vreme) : true;
    const prvi = koraci.indexOf(korak) === 0;
    let natpis = t.opste.dalje;
    if (korak === 'vozilo' && !vozilo) natpis = z.izaberiVozilo;
    else if (korak === 'usluga' && !izabrane.length) natpis = z.izaberiUslugu;
    else if (korak === 'termin' && !s.vreme) natpis = z.izaberiVreme;
    const glavnoDugme = korak === 'potvrda' ? (
        <Dugme onClick={posalji} disabled={slanje.stanje === 'salje'} className="w-full !px-4 lg:w-auto">{slanje.stanje === 'salje' ? z.saljem : dugmePosalji}</Dugme>
    ) : (
        <Dugme onClick={sledeci} disabled={!moze} strelica={moze} className="w-full !px-4 lg:w-auto">{natpis}</Dugme>
    );

    const sazetakStavke = (
        <>
            {!izabrane.length && <p className="m-0 text-sm opacity-60">—</p>}
            <ul className="m-0 list-none space-y-2.5 p-0 text-sm">
                {izabrane.map((u) => (
                    <li key={u.id} className="flex items-start justify-between gap-3">
                        <span className="min-w-0">{nazivUsluge(u)}<span className="block text-xs opacity-60">{trajanjeUsluge(u, trajanjeZa(u, s.vozilo), jezik)}</span></span>
                        <span className="flex shrink-0 items-center gap-2">
                            <span className="whitespace-nowrap tabular-nums opacity-75">{cena(cenaZa(u, s.vozilo), jezik)}</span>
                            {korak === 'usluga' && (
                                <button type="button" onClick={() => toggleUsluga(u)} aria-label={`${t.opste.zatvori}: ${nazivUsluge(u)}`} className="-m-1 p-1 opacity-50 hover:opacity-100"><X size={14} /></button>
                            )}
                        </span>
                    </li>
                ))}
            </ul>
            {(vozilo || s.vreme) && (
                <div className="mt-4 space-y-1 border-t pt-4 text-sm opacity-80" style={{ borderColor: 'rgb(var(--c-linija) / .1)' }}>
                    {vozilo && <p className="m-0">{tx(vozilo.naziv)}</p>}
                    {s.datum && s.vreme && <p className="m-0">{datumTekst} · {s.vreme}</p>}
                </div>
            )}
        </>
    );

    return (
        <>
            {/* Kompaktno zaglavlje: na telefonu odmah ispod headera, bez velikog uvoda */}
            <Kontejner className="pt-[92px] md:pt-[140px]">
                <Nadnaslov className="mb-2 md:mb-4">{z.nadnaslov}</Nadnaslov>
                <Naslov as="h1" nivo={1} tekst={z.naslov} odmah className="!text-[clamp(1.9rem,7vw,4.2rem)]" />
                <p className="tekst-uvod m-0 mt-4 hidden max-w-2xl opacity-75 md:block">{z.uvod}</p>
            </Kontejner>

            <Kontejner className="pb-44 pt-6 md:pt-12 lg:pb-24">
                <div ref={vrh}>
                    <Napredak koraci={koraci} korak={korak} idiNa={idiNa} />
                </div>
                <div className="mt-6 grid gap-10 md:mt-10 lg:grid-cols-12">
                    <div key={korak} className="prelaz-stranice min-w-0 lg:col-span-8">{sadrzaj[korak]}</div>

                    {/* Desktop: sažetak sa strane */}
                    <aside className="hidden lg:col-span-4 lg:block">
                        <div className="kartica sticky top-28 p-6">
                            <p className="nadnaslov m-0 mb-4 opacity-60">{z.izabrano}</p>
                            {sazetakStavke}
                            <div className="mt-5 border-t pt-5" style={{ borderColor: 'rgb(var(--c-linija) / .1)' }}>
                                <div className="mb-4 flex items-baseline justify-between gap-3">
                                    <span className="text-sm opacity-60">{z.ukupno}{minuta ? ` · ${trajanjeTekst}` : ''}</span>
                                    <span className="text-lg tabular-nums">{izabrane.length ? cenaTekst : '—'}</span>
                                </div>
                                <div className="flex gap-2">
                                    {!prvi && <button type="button" onClick={nazad} className="dugme dugme-sekundarno !px-3.5" aria-label={t.opste.nazad}><ArrowLeft size={18} /></button>}
                                    <div className="flex-1 [&>*]:w-full">{glavnoDugme}</div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </Kontejner>

            {/* Telefon i tablet: lepljiva traka na dnu */}
            <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
                {pregled && izabrane.length > 0 && (
                    <>
                        <button type="button" className="fixed inset-0 -z-10 bg-black/30" aria-label={t.opste.zatvori} onClick={() => setPregled(false)} style={{ animation: 'ulaz-stranice .2s ease both' }} />
                        <div className="max-h-[50svh] overflow-y-auto border-t bg-povrsina px-5 pb-4 pt-5" style={{ borderColor: 'rgb(var(--c-linija) / .1)', animation: 'fade-up .3s cubic-bezier(.22,1,.36,1) both' }}>
                            <p className="nadnaslov m-0 mb-4 opacity-60">{z.izabrano}</p>
                            {sazetakStavke}
                        </div>
                    </>
                )}
                <div className="border-t bg-paper/95 px-4 pt-3 backdrop-blur-md" style={{ borderColor: 'rgb(var(--c-linija) / .12)', paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
                    {izabrane.length > 0 && <button
                        type="button"
                        onClick={() => setPregled((x) => !x)}
                        aria-expanded={pregled}
                        className="mb-3 flex w-full items-center justify-between gap-3 text-left disabled:cursor-default"
                    >
                        <span className="min-w-0 truncate text-sm">
                            <span className="font-medium">{izabrane.length === 1 ? nazivUsluge(izabrane[0]) : `${izabrane.length} × ${z.poruka.usluge.toLowerCase()}`}</span>
                            <span className="opacity-60"> · {trajanjeTekst}{s.vreme ? ` · ${t.dani.kratko[danUNedelji(s.datum)]} ${s.vreme}` : ''}</span>
                        </span>
                        <span className="flex shrink-0 items-center gap-1.5 tabular-nums">
                            {cenaTekst}
                            <ChevronUp size={16} className={cx('transition-transform', !pregled && 'rotate-180')} aria-hidden="true" />
                        </span>
                    </button>}
                    <div className="flex gap-2">
                        {!prvi && (
                            <button type="button" onClick={nazad} className="dugme dugme-sekundarno !min-h-[3.25rem] !px-4" aria-label={t.opste.nazad}><ArrowLeft size={18} /></button>
                        )}
                        <div className="flex-1 [&>*]:!min-h-[3.25rem]">{glavnoDugme}</div>
                    </div>
                </div>
            </div>
        </>
    );
}
