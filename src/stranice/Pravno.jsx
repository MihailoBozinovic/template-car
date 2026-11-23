import React from 'react';
import { useSajt } from '../kontekst/Sajt.jsx';
import { pravniTekst } from '../i18n/pravno.js';
import { Kontejner, Sekcija } from '../components/primitivi.jsx';
import ZaglavljeStranice from '../components/ZaglavljeStranice.jsx';

/** Politika privatnosti, uslovi korišćenja i kolačići — isti raspored, tekst iz i18n/pravno.js. */
export default function Pravno({ vrsta }) {
    const { servis, t, jezik } = useSajt();
    const naslov = t.seo[vrsta]({ naziv: '' }).replace(/ — $/, '');
    const odeljci = pravniTekst(vrsta, servis, jezik);
    return (
        <>
            <ZaglavljeStranice naslov={naslov} />
            <Sekcija className="!pt-2">
                <Kontejner className="max-w-3xl">
                    {odeljci.map((o, i) => (
                        <section key={i} className="border-t py-8" style={{ borderColor: 'rgb(var(--c-linija) / .15)' }}>
                            <h2 className="naslov naslov-3 m-0">{o.naslov}</h2>
                            {o.p.map((pasus, k) => <p key={k} className="tekst-telo m-0 mt-4 opacity-80">{pasus}</p>)}
                        </section>
                    ))}
                </Kontejner>
            </Sekcija>
        </>
    );
}
