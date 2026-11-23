import React, { useEffect, useState } from 'react';
import { useSajt } from '../kontekst/Sajt.jsx';
import { Kontejner, LinkStrelica, Sekcija } from '../components/primitivi.jsx';
import ZaglavljeStranice from '../components/ZaglavljeStranice.jsx';
import IzborVozila, { procitajVozilo } from '../components/IzborVozila.jsx';
import ListaUsluga from '../components/ListaUsluga.jsx';
import { opcijeVozila } from '../lib/cene.js';

export default function Cenovnik() {
    const { servis, t, tx, p } = useSajt();
    const [vozilo, setVozilo] = useState(null);
    const opcije = opcijeVozila(servis);

    // Vozilo izabrano ranije u ovoj poseti (samo u browseru, posle hidratacije).
    useEffect(() => {
        const v = procitajVozilo();
        setVozilo(opcije.some((o) => o.id === v) ? v : null);
    }, [servis.delatnost]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <ZaglavljeStranice nadnaslov={t.cenovnik.nadnaslov} naslov={t.cenovnik.naslov} uvod={t.cenovnik.uvod} />
            <Kontejner className="sticky top-[76px] z-20 -mt-2 bg-paper/90 py-3 backdrop-blur-md">
                <div className="skriven-skrol flex items-center gap-2 overflow-x-auto">
                    {opcije.length > 0 ? (
                        <IzborVozila vozilo={vozilo} onIzbor={setVozilo} className="flex-nowrap whitespace-nowrap" />
                    ) : (
                        servis.kategorije.map((k) => (
                            <a key={k.id} href={`#${k.id}`} className="nadnaslov shrink-0 px-2 py-2 opacity-70 hover:opacity-100">{tx(k.naziv)}</a>
                        ))
                    )}
                </div>
            </Kontejner>

            <Sekcija className="!pt-10">
                <Kontejner className="space-y-20 md:space-y-28">
                    {!servis.kategorije.length && <p className="tekst-uvod">{t.cenovnik.prazno}</p>}
                    {servis.kategorije.map((k) => (
                        <section key={k.id} id={k.id} className="grid scroll-mt-40 gap-8 lg:grid-cols-12">
                            <div className="lg:col-span-4">
                                <div className="lg:sticky lg:top-44">
                                    <h2 className="naslov naslov-2 m-0">{tx(k.naziv)}</h2>
                                    <p className="tekst-telo m-0 mt-4 max-w-sm opacity-70">{tx(k.kratko)}</p>
                                    <LinkStrelica to={p('usluga', k.id)} className="mt-5">{t.cenovnik.detaljnije}</LinkStrelica>
                                </div>
                            </div>
                            <div className="lg:col-span-8">
                                <ListaUsluga usluge={k.usluge} vozilo={vozilo} />
                            </div>
                        </section>
                    ))}
                    <p className="nadnaslov m-0 opacity-60">{servis.firma.pdvObveznik ? t.cenovnik.pdvDa : t.cenovnik.pdvNe}</p>
                </Kontejner>
            </Sekcija>
        </>
    );
}
