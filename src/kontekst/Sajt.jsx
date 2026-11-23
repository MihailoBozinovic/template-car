import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { sastaviServis } from '../config/sajt.js';
import { recnik } from '../i18n/index.js';
import { putanja, tx } from '../i18n/jezici.js';
import { primeniTemu, zapamtiDelatnost, zapamtiPregled, zaId } from '../lib/tema.js';

const SajtKontekst = createContext(null);

export function SajtProvider({ jezik, tema: pocetna, delatnost: pocetnaDelatnost, children }) {
    const [tema, setTema] = useState(pocetna);
    const [delatnost, setDelatnost] = useState(pocetnaDelatnost);

    const postaviTemu = useCallback((id) => {
        const nova = zaId(id);
        primeniTemu(nova);
        zapamtiPregled(id);
        setTema(nova);
    }, []);

    const postaviDelatnost = useCallback((id) => {
        zapamtiDelatnost(id);
        setDelatnost(id);
    }, []);

    const servis = useMemo(() => sastaviServis(delatnost), [delatnost]);

    const vrednost = useMemo(() => ({
        servis,
        jezik,
        t: recnik(jezik),
        tx: (v) => tx(v, jezik),
        p: (kljuc, slug) => putanja(kljuc, jezik, slug),
        tema,
        postaviTemu,
        delatnost: servis.delatnost,
        postaviDelatnost,
    }), [servis, jezik, tema, postaviTemu, postaviDelatnost]);

    return <SajtKontekst.Provider value={vrednost}>{children}</SajtKontekst.Provider>;
}

export const useSajt = () => useContext(SajtKontekst);
