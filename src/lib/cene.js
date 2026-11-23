/*
 * CENE I TRAJANJE PO VOZILU
 *
 * Kod auto-usluga cena i trajanje najčešće zavise od veličine vozila (pranje,
 * poliranje, keramika) ili od veličine točka (gume). Zato u servis.js usluga
 * može da ima:
 *
 *   cena: 2500                                  — ista za sva vozila
 *   cena: { mali: 2000, srednji: 2500, suv: 3200 } — po opciji iz `izborVozila`
 *
 * i isto za `trajanje` (minuti). Ključevi su id-jevi iz `izborVozila.opcije`.
 * Dok posetilac nije izabrao vozilo, prikazuje se najniža cena („od 2.000”).
 *
 * `dana: 2` — vozilo ostaje kod servisa više dana (keramika, folija, veliki
 * servis). Termin je tada samo PRIJEM vozila (`zakazivanje.prijemMinuta`), a
 * na sajtu piše „2 dana”.
 */

const vrednosti = (v) => (v && typeof v === 'object' ? Object.values(v).filter((x) => typeof x === 'number') : [v]);

/** Vrednost za izabrano vozilo; bez vozila (ili nepoznatog) — najniža. */
export const zaVozilo = (v, vozilo) => {
    if (v && typeof v === 'object') return v[vozilo] ?? Math.min(...vrednosti(v));
    return v;
};

export const cenaZa = (u, vozilo) => zaVozilo(u.cena, vozilo) || 0;
export const najnizaCena = (u) => Math.min(...vrednosti(u.cena));
export const zavisiOdVozila = (u) => Boolean((u.cena && typeof u.cena === 'object') || (u.trajanje && typeof u.trajanje === 'object'));

/** Da li je prikazana cena „od” — po izboru u servis.js ili jer vozilo još nije izabrano. */
export const cenaJeOd = (u, vozilo) => Boolean(u.cenaOd) || (!vozilo && typeof u.cena === 'object' && new Set(vrednosti(u.cena)).size > 1);

/** Trajanje rada u minutima (za prikaz). */
export const trajanjeZa = (u, vozilo) => zaVozilo(u.trajanje, vozilo) || 0;

/** Koliko minuta termin zauzima u kalendaru: rad, ili samo prijem kad vozilo ostaje danima. */
export const minutaTermina = (u, vozilo, servis) => (u.dana ? servis.zakazivanje?.prijemMinuta ?? 30 : trajanjeZa(u, vozilo));

/** Najniža cena u kategoriji („od 1.200 RSD”). */
export const najnizaUKategoriji = (k) => Math.min(...k.usluge.map(najnizaCena));

/** Opcije vozila koje se nude (prazno = cene ne zavise od vozila). */
export const opcijeVozila = (servis) => (servis.izborVozila?.opcije?.length >= 2 ? servis.izborVozila.opcije : []);
