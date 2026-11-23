import React from 'react';
import Hero from '../sekcije/Hero.jsx';
import { Brendovi, GalerijaTraka, Izjava, Proces, Recenzije, Usluge, Vaucer, ZastoMi, ZavrsniPoziv } from '../sekcije/Sekcije.jsx';

/*
 * Početna, odozgo nadole: hero → izjava i brojevi → usluge (raspored po temi)
 * → kako funkcioniše → brendovi (marquee) → traka galerije → zašto mi →
 * recenzije → vaučer → završni poziv. Sekcija bez podataka se ne prikazuje.
 */
export default function Pocetna() {
    return (
        <>
            <Hero />
            <Izjava />
            <Usluge />
            <Proces />
            <Brendovi />
            <GalerijaTraka />
            <ZastoMi />
            <Recenzije />
            <Vaucer />
            <ZavrsniPoziv />
        </>
    );
}
