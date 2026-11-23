import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Clock } from 'lucide-react';
import { useSajt } from '../kontekst/Sajt.jsx';
import { cena, trajanjeUsluge } from '../lib/format.js';
import { cenaJeOd, cenaZa, trajanjeZa } from '../lib/cene.js';
import { Pojava } from './primitivi.jsx';
import { useZakaziLink } from './Header.jsx';

/**
 * Usluge jedne kategorije sa cenom za izabrano vozilo — isti red na cenovniku
 * i na stranici usluge. „Zakaži” vodi u zakazivanje sa već izabranom uslugom
 * (i vozilom), pa klijent kreće od termina.
 */
export default function ListaUsluga({ usluge, vozilo }) {
    const { t, tx, jezik, p } = useSajt();
    const zakazi = useZakaziLink();
    const linkUsluge = (u) => {
        if (!zakazi.to) return null;
        const q = new URLSearchParams({ usluga: u.id });
        if (vozilo) q.set('vozilo', vozilo);
        return `${p('zakazivanje')}?${q}`;
    };
    return (
        <ul className="m-0 list-none border-t p-0" style={{ borderColor: 'rgb(var(--c-linija) / .8)' }}>
            {usluge.map((u, i) => {
                const l = linkUsluge(u);
                return (
                    <Pojava as="li" key={u.id} i={i % 4} className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-2 border-b py-6" style={{ borderColor: 'rgb(var(--c-linija) / .15)' }}>
                        <div>
                            <h3 className="m-0 text-lg font-medium" style={{ fontFamily: 'var(--font-tekst)' }}>{tx(u.naziv)}</h3>
                            {u.opis && <p className="m-0 mt-1 text-sm leading-relaxed opacity-70">{tx(u.opis)}</p>}
                            <p className="nadnaslov m-0 mt-3 inline-flex items-center gap-1.5 opacity-60">
                                {u.dana ? <CalendarDays size={13} aria-hidden="true" /> : <Clock size={13} aria-hidden="true" />}
                                {u.dana ? t.cenovnik.ostaje(trajanjeUsluge(u, 0, jezik)) : trajanjeUsluge(u, trajanjeZa(u, vozilo), jezik)}
                            </p>
                        </div>
                        <div className="flex flex-col items-end justify-between gap-3 text-right">
                            <p className="m-0 whitespace-nowrap text-lg tabular-nums">
                                {cenaJeOd(u, vozilo) && <span className="mr-1 text-sm opacity-60">{t.opste.od}</span>}
                                {cena(cenaZa(u, vozilo), jezik)}
                            </p>
                            {l ? (
                                <Link to={l} className="cip !py-1.5">{t.cenovnik.zakazi}</Link>
                            ) : (
                                <a {...zakazi} className="cip !py-1.5">{t.cenovnik.zakazi}</a>
                            )}
                        </div>
                    </Pojava>
                );
            })}
        </ul>
    );
}
