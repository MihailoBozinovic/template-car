import React from 'react';
import { useSajt } from '../kontekst/Sajt.jsx';
import { Dugme, Foto, Kontejner, Naslov, Pojava, Sekcija } from '../components/primitivi.jsx';
import ZaglavljeStranice from '../components/ZaglavljeStranice.jsx';
import { useZakaziLink } from '../components/Header.jsx';
import { Brendovi, TimPregled } from '../sekcije/Sekcije.jsx';

export default function ONama() {
    const { servis, t, tx } = useSajt();
    const o = servis.oNama;
    const zakazi = useZakaziLink();
    return (
        <>
            <ZaglavljeStranice nadnaslov={t.oNama.nadnaslov} naslov={tx(o.naslov)} />
            <Sekcija className="!pt-4">
                <Kontejner className="grid gap-12 lg:grid-cols-12">
                    <div className="lg:col-span-6">
                        <Foto src={o.slika} alt={servis.naziv} okvirKlasa="aspect-[4/5]" paralaksa prioritet />
                    </div>
                    <div className="space-y-6 lg:col-span-5 lg:col-start-8 lg:pt-16">
                        {o.tekst.map((pasus, i) => (
                            <Pojava as="p" key={i} i={i} className={i === 0 ? 'tekst-uvod m-0' : 'tekst-telo m-0 opacity-80'}>{tx(pasus)}</Pojava>
                        ))}
                    </div>
                </Kontejner>
            </Sekcija>
            {o.vrednosti?.length > 0 && (
                <Sekcija className="bg-mist">
                    <Kontejner>
                        <Naslov nivo={2} tekst={t.oNama.vrednostiNaslov} className="mb-14" />
                        <div className="grid gap-10 md:grid-cols-3">
                            {o.vrednosti.map((v, i) => (
                                <Pojava key={i} i={i} className="border-t pt-6" style={{ borderColor: 'rgb(var(--c-linija) / .25)' }}>
                                    <h3 className="naslov naslov-3 m-0">{tx(v.naslov)}</h3>
                                    <p className="tekst-telo m-0 mt-3 opacity-75">{tx(v.tekst)}</p>
                                </Pojava>
                            ))}
                        </div>
                    </Kontejner>
                </Sekcija>
            )}
            <TimPregled />
            <Brendovi />
            <Sekcija>
                <Kontejner className="flex flex-col items-center text-center">
                    <Naslov nivo={2} tekst={t.oNama.poziv} />
                    <Pojava className="mt-8"><Dugme {...zakazi}>{t.nav.zakazi}</Dugme></Pojava>
                </Kontejner>
            </Sekcija>
        </>
    );
}
