import React from 'react';
import { MapPin } from 'lucide-react';
import { useSajt } from '../kontekst/Sajt.jsx';
import { Kontejner, Pojava, Sekcija } from '../components/primitivi.jsx';
import ZaglavljeStranice from '../components/ZaglavljeStranice.jsx';
import Mapa from '../components/Mapa.jsx';
import { KontaktDugmad, Mreze, NeradniDani, RadnoVremeTabela, StatusOtvoreno } from '../components/delovi.jsx';



export default function Kontakt() {
    const { servis, t, tx } = useSajt();
    const l = servis.lokacija;
    const f = servis.firma;
    const googleLink = l.googleMape || `https://www.google.com/maps/search/?api=1&query=${l.koordinate.lat},${l.koordinate.lng}`;
    return (
        <>
            <ZaglavljeStranice nadnaslov={t.kontakt.nadnaslov} naslov={t.kontakt.naslov} uvod={t.kontakt.uvod}>
                <StatusOtvoreno className="nadnaslov mt-6" />
            </ZaglavljeStranice>
            <Sekcija className="!pt-4">
                <Kontejner className="grid gap-12 lg:grid-cols-12">
                    <div className="space-y-10 lg:col-span-5">
                        <Pojava>
                            <p className="nadnaslov m-0 mb-3 opacity-70">{t.kontakt.adresa}</p>
                            <address className="naslov naslov-3 not-italic">{l.adresa}, {l.postanskiBroj} {tx(l.grad)}</address>
                            {l.opstina && <p className="m-0 mt-1 opacity-70">{l.opstina}</p>}
                            <a href={googleLink} target="_blank" rel="noopener noreferrer" className="link-strelica nadnaslov mt-4 inline-flex"><MapPin size={15} aria-hidden="true" /> {t.kontakt.otvoriMapu}</a>
                        </Pojava>
                        <Pojava i={1}>
                            <p className="nadnaslov m-0 mb-3 opacity-70">{t.kontakt.telefon} · {t.kontakt.email}</p>
                            <KontaktDugmad />
                        </Pojava>
                        <Pojava i={2}>
                            <p className="nadnaslov m-0 mb-3 opacity-70">{t.kontakt.radnoVreme}</p>
                            <RadnoVremeTabela className="max-w-sm" />
                            <NeradniDani className="mt-6" />
                        </Pojava>
                        {tx(l.kakoDoNas) && (
                            <Pojava i={3}>
                                <p className="nadnaslov m-0 mb-3 opacity-70">{t.kontakt.kakoDoNas}</p>
                                <p className="tekst-telo m-0 opacity-80">{tx(l.kakoDoNas)}</p>
                            </Pojava>
                        )}
                        {servis.placanje?.length > 0 && (
                            <Pojava i={4}>
                                <p className="nadnaslov m-0 mb-3 opacity-70">{t.kontakt.placanje}</p>
                                <p className="m-0">{servis.placanje.join(' · ')}</p>
                            </Pojava>
                        )}
                        <Pojava i={5}>
                            <p className="nadnaslov m-0 mb-3 opacity-70">{t.kontakt.mreze}</p>
                            <Mreze />
                        </Pojava>
                    </div>
                    <div className="lg:col-span-7">
                        <Pojava className="lg:sticky lg:top-28">
                            <Mapa className="h-[360px] sm:h-[460px] lg:h-[640px]" />
                        </Pojava>
                    </div>
                </Kontejner>
            </Sekcija>
            <Kontejner className="pb-20">
                <div className="kartica p-6 text-sm leading-relaxed md:p-8">
                    <p className="nadnaslov m-0 mb-3 opacity-70">{t.kontakt.firma}</p>
                    <p className="m-0">{f.naziv}<br />{f.adresa}</p>
                    <p className="m-0 mt-2 opacity-80">
                        {t.footer.pib}: {f.pib} · {t.footer.mb}: {f.maticniBroj}
                        {f.sifraDelatnosti && <> · {t.footer.delatnost}: {f.sifraDelatnosti}</>}
                        {!f.pdvObveznik && <> · {t.footer.nijePdv}</>}
                    </p>
                </div>
            </Kontejner>
        </>
    );
}
