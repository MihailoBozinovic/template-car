import React from 'react';
import { useSajt } from '../kontekst/Sajt.jsx';
import { Dugme, Kontejner, Naslov } from '../components/primitivi.jsx';
import { useZakaziLink } from '../components/Header.jsx';

export default function NijePronadjeno() {
    const { t, p } = useSajt();
    const zakazi = useZakaziLink();
    return (
        <Kontejner className="flex min-h-[80svh] flex-col items-start justify-center pt-28">
            <p className="nadnaslov m-0 mb-6 opacity-60">404</p>
            <Naslov as="h1" nivo={1} tekst={t.nijePronadjeno.naslov} animiraj={false} />
            <p className="tekst-uvod m-0 mt-6 max-w-xl opacity-75">{t.nijePronadjeno.tekst}</p>
            <div className="mt-10 flex flex-wrap gap-3">
                <Dugme to={p('pocetna')} varijanta="sekundarno" strelica={false}>{t.nijePronadjeno.pocetna}</Dugme>
                <Dugme {...zakazi}>{t.nav.zakazi}</Dugme>
            </div>
        </Kontejner>
    );
}
