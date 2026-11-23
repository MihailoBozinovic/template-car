import React from 'react';
import { useSajt } from '../kontekst/Sajt.jsx';
import { opcijeVozila } from '../lib/cene.js';
import { cx } from './primitivi.jsx';

const KLJUC = 'vozilo.v1';

/** Izabrano vozilo se pamti tokom posete — cenovnik, stranice usluga i zakazivanje ga dele. */
export const procitajVozilo = () => {
    try { return sessionStorage.getItem(KLJUC) || null; } catch { return null; }
};
export const zapamtiVozilo = (id) => {
    try { if (id) sessionStorage.setItem(KLJUC, id); else sessionStorage.removeItem(KLJUC); } catch { /* */ }
};

/** Segmentni izbor vozila za cenovnik i stranice usluga („Cene za: Gradsko · Limuzina · SUV…”). */
export default function IzborVozila({ vozilo, onIzbor, className, sviVozila = true }) {
    const { servis, t, tx } = useSajt();
    const opcije = opcijeVozila(servis);
    if (!opcije.length) return null;
    return (
        <div className={cx('flex flex-wrap items-center gap-2', className)} role="group" aria-label={tx(servis.izborVozila?.oznaka) || t.opste.vozilo}>
            <span className="nadnaslov mr-1 shrink-0 opacity-60">{t.cenovnik.zaVozilo}</span>
            {sviVozila && (
                <button type="button" className="cip" aria-pressed={!vozilo} onClick={() => { zapamtiVozilo(null); onIzbor(null); }}>{t.cenovnik.sviVozila}</button>
            )}
            {opcije.map((o) => (
                <button key={o.id} type="button" className="cip" aria-pressed={vozilo === o.id} title={tx(o.opis)} onClick={() => { zapamtiVozilo(o.id); onIzbor(o.id); }}>
                    {tx(o.naziv)}
                </button>
            ))}
        </div>
    );
}
