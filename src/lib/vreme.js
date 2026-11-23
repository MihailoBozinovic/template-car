/*
 * RADNO VREME I TERMINI
 *
 * Sve se računa u vremenskoj zoni servisa (Europe/Belgrade), ne posetioca: gost
 * iz Moskve koji zakazuje mora da vidi beogradske termine, a „otvoreno sada”
 * važi za servis. Datumi se drže kao 'YYYY-MM-DD', vreme kao minuti od ponoći —
 * bez Date objekata koji bi tiho prešli u lokalnu zonu browsera.
 */

export const ZONA = 'Europe/Belgrade';
export const DANI_PO_INDEKSU = ['ned', 'pon', 'uto', 'sre', 'cet', 'pet', 'sub'];
export const DANI_REDOM = ['pon', 'uto', 'sre', 'cet', 'pet', 'sub', 'ned'];

export const uMinute = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
};

export const uSate = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

/** Trenutni datum i minut u zoni servisa. */
export const sadaULokalu = (sada = new Date(), zona = ZONA) => {
    const delovi = Object.fromEntries(
        new Intl.DateTimeFormat('en-CA', {
            timeZone: zona, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
        }).formatToParts(sada).map((p) => [p.type, p.value]),
    );
    return { datum: `${delovi.year}-${delovi.month}-${delovi.day}`, minut: Number(delovi.hour) * 60 + Number(delovi.minute) };
};

/** Dan u nedelji ('pon'…) za datum 'YYYY-MM-DD'. */
export const danUNedelji = (iso) => {
    const [g, m, d] = iso.split('-').map(Number);
    return DANI_PO_INDEKSU[new Date(Date.UTC(g, m - 1, d, 12)).getUTCDay()];
};

export const dodajDane = (iso, n) => {
    const [g, m, d] = iso.split('-').map(Number);
    const x = new Date(Date.UTC(g, m - 1, d + n, 12));
    return x.toISOString().slice(0, 10);
};

/** Neradni dan iz konfiguracije za taj datum, ili null. */
export const neradanDan = (iso, servis) => servis.neradniDani?.find((n) => n.datum === iso) ?? null;

/** [od, do] u minutima za taj datum, ili null kad servis ne radi. */
export const radnoVremeDana = (iso, servis) => {
    if (neradanDan(iso, servis)) return null;
    const rv = servis.radnoVreme?.[danUNedelji(iso)];
    return rv ? [uMinute(rv[0]), uMinute(rv[1])] : null;
};

/**
 * Status za „Otvoreno sada”: { otvoreno, do } ili { otvoreno: false, sledece:
 * { datum, od, za } } gde je `za` 0 (danas), 1 (sutra) ili više dana.
 */
export const statusRada = (servis, sada = new Date()) => {
    const { datum, minut } = sadaULokalu(sada);
    const danas = radnoVremeDana(datum, servis);
    if (danas && minut >= danas[0] && minut < danas[1]) return { otvoreno: true, do: uSate(danas[1]) };
    for (let i = 0; i < 14; i++) {
        const d = dodajDane(datum, i);
        const rv = radnoVremeDana(d, servis);
        if (rv && (i > 0 || minut < rv[0])) return { otvoreno: false, sledece: { datum: d, dan: danUNedelji(d), od: uSate(rv[0]), za: i } };
    }
    return { otvoreno: false, sledece: null };
};

/**
 * Slobodni počeci za termin od `trajanje` minuta na datum, na mreži od `korak`
 * minuta: rad mora da se završi do zatvaranja, a početak mora biti bar
 * `najranijeSati` od sada (u zoni servisa).
 *
 * Ovo je ponuda za ZAHTEV — servis potvrđuje. Pravu zauzetost zna kalendar
 * servisa; kad se sajt poveže sa API-jem (kanal 'webhook' sa odgovorom),
 * ovde se ubacuje lista zauzetih.
 */
export const terminiZaDan = (iso, servis, { trajanje, sada = new Date() }) => {
    const rv = radnoVremeDana(iso, servis);
    if (!rv) return [];
    const z = servis.zakazivanje ?? {};
    const korak = z.korakMinuta ?? 15;
    const { datum, minut } = sadaULokalu(sada);
    let najranije = rv[0];
    if (iso === datum) najranije = Math.max(rv[0], minut + (z.najranijeSati ?? 2) * 60);
    else if (iso < datum) return [];
    const prvi = Math.ceil(najranije / korak) * korak;
    const rez = [];
    for (let m = prvi; m + trajanje <= rv[1]; m += korak) rez.push(uSate(m));
    return rez;
};

/** Datumi koji se nude u zakazivanju: od danas, `danaUnapred` dana. */
export const daniZaZakazivanje = (servis, sada = new Date()) => {
    const { datum } = sadaULokalu(sada);
    const n = servis.zakazivanje?.danaUnapred ?? 30;
    return Array.from({ length: n }, (_, i) => dodajDane(datum, i));
};

/** Radno vreme grupisano za prikaz: uzastopni dani sa istim vremenom u jedan red. */
export const grupisanoRadnoVreme = (servis) => {
    const grupe = [];
    for (const dan of DANI_REDOM) {
        const rv = servis.radnoVreme?.[dan] ?? null;
        const kljuc = rv ? rv.join('–') : null;
        const posl = grupe[grupe.length - 1];
        if (posl && posl.kljuc === kljuc) posl.dani.push(dan);
        else grupe.push({ kljuc, dani: [dan], vreme: rv });
    }
    return grupe;
};
