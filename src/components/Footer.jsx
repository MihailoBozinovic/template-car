import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSajt } from '../kontekst/Sajt.jsx';
import { kljucIzPutanje } from '../i18n/jezici.js';
import { zaboraviPristanak } from '../lib/pristanak.js';
import { Dugme, Kontejner, Naslov, cx } from './primitivi.jsx';
import { Mreze, RadnoVremeTabela, StatusOtvoreno } from './delovi.jsx';
import { Logo, useZakaziLink } from './Header.jsx';

export default function Footer() {
    const { servis, t, tx, p, tema } = useSajt();
    const zakazi = useZakaziLink();
    const f = servis.firma;
    const l = servis.lokacija;
    const godina = new Date().getFullYear();
    // Svetle teme čiji referentni sajt ima taman footer.
    const tamno = !tema.tamna && ['hotel', 'laboratorija', 'studio', 'velnes'].includes(tema.id);
    const naZakazivanju = kljucIzPutanje(useLocation().pathname) === 'zakazivanje';

    return (
        <footer className={cx('mt-auto', tamno ? 'bg-tamna text-white' : 'bg-mist text-ink')}>
            <Kontejner className="py-16 md:py-24">
                {/* Poziv na zakazivanje — ne na samoj stranici zakazivanja */}
                {!naZakazivanju && (
                    <div className="flex flex-col items-start justify-between gap-8 border-b pb-14 md:flex-row md:items-end" style={{ borderColor: 'color-mix(in srgb, currentColor 15%, transparent)' }}>
                        <Naslov nivo={1} tekst={t.footer.zakaziNaslov} className="max-w-3xl" />
                        <Dugme {...zakazi} varijanta={tamno ? 'foto' : 'primarno'}>{t.nav.zakazi}</Dugme>
                    </div>
                )}

                <div className={cx('grid gap-12 sm:grid-cols-2 lg:grid-cols-12', !naZakazivanju && 'pt-14')}>
                    <div className="space-y-5 lg:col-span-3">
                        <Logo />
                        <p className="m-0 max-w-sm text-sm leading-relaxed opacity-75">{tx(servis.opis)}</p>
                        <Mreze />
                    </div>
                    <nav aria-label={t.footer.usluge} className="space-y-3 text-sm lg:col-span-3">
                        <p className="nadnaslov m-0 opacity-70">{t.footer.usluge}</p>
                        <ul className="m-0 list-none space-y-2 p-0">
                            {servis.kategorije.map((k) => (
                                <li key={k.id}><Link to={p('usluga', k.id)} className="opacity-85 hover:opacity-100 hover:underline">{tx(k.naziv)}</Link></li>
                            ))}
                        </ul>
                    </nav>
                    <div className="space-y-3 text-sm lg:col-span-2">
                        <p className="nadnaslov m-0 opacity-70">{t.kontakt.nadnaslov}</p>
                        <address className="not-italic leading-relaxed">
                            {l.adresa}<br />{l.postanskiBroj} {tx(l.grad)}
                        </address>
                        <p className="m-0"><a href={`tel:${servis.kontakt.telefon}`} className="podvucen">{servis.kontakt.telefonPrikaz}</a></p>
                        {servis.kontakt.email && <p className="m-0"><a href={`mailto:${servis.kontakt.email}`} className="podvucen break-all">{servis.kontakt.email}</a></p>}
                    </div>
                    <div className="space-y-3 text-sm lg:col-span-2">
                        <p className="nadnaslov m-0 opacity-70">{t.kontakt.radnoVreme}</p>
                        <RadnoVremeTabela />
                        <StatusOtvoreno className="pt-1 opacity-80" />
                    </div>
                    <nav aria-label={t.footer.navigacija} className="space-y-3 text-sm lg:col-span-2">
                        <p className="nadnaslov m-0 opacity-70">{t.footer.navigacija}</p>
                        <ul className="m-0 list-none space-y-2 p-0">
                            {['cenovnik', 'galerija', 'oNama', 'kontakt', 'pitanja', 'zakazivanje'].map((k) => (
                                <li key={k}><Link to={p(k)} className="opacity-85 hover:opacity-100 hover:underline">{k === 'zakazivanje' ? t.nav.zakazi : t.nav[k]}</Link></li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </Kontejner>

            <div className="border-t" style={{ borderColor: 'color-mix(in srgb, currentColor 12%, transparent)' }}>
                <Kontejner className="flex flex-col gap-4 py-6 text-xs leading-relaxed opacity-75 lg:flex-row lg:items-start lg:justify-between">
                    <p className="m-0 max-w-3xl">
                        {f.naziv} · {f.adresa} · {t.footer.pib} {f.pib} · {t.footer.mb} {f.maticniBroj}
                        {f.sifraDelatnosti && <> · {t.footer.delatnost} {f.sifraDelatnosti}</>}
                        {!f.pdvObveznik && <> · {t.footer.nijePdv}</>}
                        <br />© {godina} {servis.naziv}. {t.footer.prava}
                    </p>
                    <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-2 p-0">
                        <li><Link to={p('privatnost')} className="hover:underline">{t.seo.privatnost({ naziv: '' }).replace(/ — $/, '')}</Link></li>
                        <li><Link to={p('uslovi')} className="hover:underline">{t.seo.uslovi({ naziv: '' }).replace(/ — $/, '')}</Link></li>
                        <li><Link to={p('kolacici')} className="hover:underline">{t.seo.kolacici({ naziv: '' }).replace(/ — $/, '')}</Link></li>
                        <li><button type="button" className="hover:underline" onClick={zaboraviPristanak}>{t.footer.podesavanjaKolacica}</button></li>
                    </ul>
                </Kontejner>
            </div>
        </footer>
    );
}
