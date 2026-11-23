import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Info, X } from 'lucide-react';
import { useSajt } from '../kontekst/Sajt.jsx';
import { sadaULokalu } from '../lib/vreme.js';
import { cx } from './primitivi.jsx';

const KLJUC = 'obavestenje.zatvoreno.v1';

/*
 * OBAVEŠTENJE (kao ObavestenjeBanner u Eclectic-u) — praznici, promena radnog
 * vremena, akcija. Upisuje se u servis.js (`obavestenje`), prikazuje se do
 * datuma `do`, ispod headera, i može da se zatvori (pamti se dok traje sesija;
 * novo obaveštenje se opet prikazuje). Bez teksta ne postoji uopšte.
 */
export default function Obavestenje() {
    const { servis, t, tx, p } = useSajt();
    const o = servis.obavestenje ?? {};
    const tekst = tx(o.tekst);
    const [vidljivo, setVidljivo] = useState(false);

    useEffect(() => {
        if (!tekst) return;
        const { datum } = sadaULokalu();
        if (o.do && datum > o.do) return;
        try { if (sessionStorage.getItem(KLJUC) === tekst) return; } catch { /* */ }
        setVidljivo(true);
    }, [tekst, o.do]);

    if (!vidljivo) return null;
    const zatvori = () => {
        setVidljivo(false);
        try { sessionStorage.setItem(KLJUC, tekst); } catch { /* */ }
    };
    return (
        <div role="status" className="pointer-events-none fixed inset-x-3 top-[86px] z-40 flex justify-center" style={{ animation: 'fade-up .5s cubic-bezier(.22,1,.36,1) both .4s' }}>
            <div className="kartica pointer-events-auto flex max-w-2xl items-center gap-3 py-2.5 pl-4 pr-2 text-sm shadow-lg">
                <Info size={16} className="shrink-0 text-brand" aria-hidden="true" />
                <p className="m-0 leading-snug">
                    {tekst}
                    {o.link && <> <Link to={p(o.link)} className={cx('podvucen ml-1 font-medium')}>{t.obavestenje.vise}</Link></>}
                </p>
                <button type="button" onClick={zatvori} aria-label={t.obavestenje.zatvori} className="ml-1 shrink-0 rounded-full p-1.5 opacity-60 hover:bg-mist hover:opacity-100"><X size={15} /></button>
            </div>
        </div>
    );
}
