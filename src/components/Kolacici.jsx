import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSajt } from '../kontekst/Sajt.jsx';
import { DOGADJAJ, imaAnalitike, procitajPristanak, sacuvajPristanak, ucitajAnalitiku } from '../lib/pristanak.js';

/*
 * Traka za kolačiće. Prikazuje se samo kad sajt ima analitiku (GA4 / Meta
 * Pixel) — bez nje sajt koristi samo neophodno skladište i pitanje bi bilo
 * suvišno. Oba dugmeta su jednako vidljiva (ZZPL: odbijanje mora biti lako
 * kao prihvatanje).
 */
export default function Kolacici() {
    const { t, p } = useSajt();
    const [vidljiv, setVidljiv] = useState(false);

    useEffect(() => {
        if (!imaAnalitike()) return undefined;
        const odluka = procitajPristanak();
        if (odluka === 'sve') ucitajAnalitiku();
        setVidljiv(!odluka);
        const naPromenu = (e) => setVidljiv(!e.detail);
        window.addEventListener(DOGADJAJ, naPromenu);
        return () => window.removeEventListener(DOGADJAJ, naPromenu);
    }, []);

    if (!vidljiv) return null;
    return (
        <div role="region" aria-label={t.footer.podesavanjaKolacica} className="fixed inset-x-3 bottom-3 z-[70] md:inset-x-auto md:bottom-5 md:right-5 md:max-w-md">
            <div className="kartica p-5 shadow-2xl" style={{ animation: 'fade-up .5s cubic-bezier(.22,1,.36,1) both' }}>
                <p className="m-0 text-sm leading-relaxed">
                    {t.kolacici.tekst} <Link to={p('kolacici')} className="podvucen">{t.kolacici.vise}</Link>
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                    <button type="button" className="dugme dugme-sekundarno !px-3" onClick={() => sacuvajPristanak('neophodni')}>{t.kolacici.odbij}</button>
                    <button type="button" className="dugme dugme-primarno !px-3" onClick={() => sacuvajPristanak('sve')}>{t.kolacici.prihvati}</button>
                </div>
            </div>
        </div>
    );
}
