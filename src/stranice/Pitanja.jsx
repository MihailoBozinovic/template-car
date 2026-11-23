import React from 'react';
import { Plus } from 'lucide-react';
import { useSajt } from '../kontekst/Sajt.jsx';
import { Kontejner, Naslov, Pojava, Sekcija } from '../components/primitivi.jsx';
import ZaglavljeStranice from '../components/ZaglavljeStranice.jsx';
import { KontaktDugmad } from '../components/delovi.jsx';

export default function Pitanja() {
    const { servis, t, tx } = useSajt();
    return (
        <>
            <ZaglavljeStranice nadnaslov={t.pitanja.nadnaslov} naslov={t.pitanja.naslov} uvod={t.pitanja.uvod} />
            <Sekcija className="!pt-4">
                <Kontejner className="max-w-4xl">
                    <div className="border-t" style={{ borderColor: 'rgb(var(--c-linija) / .8)' }}>
                        {servis.pitanja.map((q, i) => (
                            <Pojava key={i} i={i % 4}>
                                <details className="group border-b" style={{ borderColor: 'rgb(var(--c-linija) / .18)' }}>
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                                        <span className="naslov naslov-3">{tx(q.pitanje)}</span>
                                        <Plus size={22} strokeWidth={1.25} className="shrink-0 transition-transform duration-300 group-open:rotate-45" aria-hidden="true" />
                                    </summary>
                                    <p className="tekst-telo m-0 max-w-3xl pb-7 opacity-80">{tx(q.odgovor)}</p>
                                </details>
                            </Pojava>
                        ))}
                    </div>
                    <div className="mt-16">
                        <Naslov nivo={3} tekst={t.pitanja.nisteNasli} />
                        <p className="m-0 mt-3 opacity-75">{t.pitanja.javiteSe}</p>
                        <KontaktDugmad className="mt-6" />
                    </div>
                </Kontejner>
            </Sekcija>
        </>
    );
}
