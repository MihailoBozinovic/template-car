/*
 * TEME
 *
 * Svaka tema je po jednom referentnom sajtu ili dizajn konceptu; izmerene
 * vrednosti i izvori su u docs/TEME.md. Tema nije samo paleta: određuje
 * fontove, tipografiju naslova, oblik dugmadi, raspored heroja i usluga,
 * header, filter fotografija i sve pokrete (krive, trajanja, reveal, zum
 * heroja, marquee, paralaksu, glatki skrol).
 *
 * Bira se jednim klikom (birač u uglu ekrana) ili u src/config/servis.js:
 *   tema: 'hotel'
 *   tema: { osnova: 'hotel', boje: { brand: '#0B5FA5' } }   // sa izmenama
 *
 * Fontovi bez ćirilice imaju u nizu rezervni font sa ćirilicom, pa ruska
 * verzija sajta ostaje u istom duhu.
 */

const SANS_INTER = 'Inter, system-ui, sans-serif';
const SERIF_CORMORANT = '"Cormorant Garamond", Georgia, serif';
const HELVETICA = '"Helvetica Neue", Helvetica, Arial, Inter, sans-serif';

export const TEME = {
    hotel: {
        naziv: 'Hotel',
        inspiracija: 'Topaz Detailing',
        opis: 'Britanski korporativni luksuz: belo, tanke linije, uski verzal naslovi, obris-dugmad sa 2 px zaobljenja, crveni akcenat.',
        tamna: false,
        boje: {
            paper: '#FFFFFF', ink: '#2C2C2C', mist: '#F4F4F2', povrsina: '#FFFFFF',
            brand: '#C8102E', naBrand: '#FFFFFF', linija: '#2C2C2C', tamna: '#313030', akcenat: '#EBEBEB',
        },
        fontovi: { naslov: '"Barlow Condensed", "Arial Narrow", sans-serif', tekst: '"Work Sans", system-ui, sans-serif', oznaka: '"Work Sans", system-ui, sans-serif', logo: '"Barlow Condensed", "Arial Narrow", sans-serif' },
        naslov: { tezina: 500, transform: 'uppercase', razmak: '0.02em', visina: 1.0, skala: 1.08, akcenat: 'boja' },
        oznaka: { transform: 'uppercase', razmak: '0.08em', velicina: '0.78rem', tezina: 500 },
        tekst: { tezina: 400 },
        dugme: { oblik: 'mali', stil: 'obris' },
        radius: { kartica: '2px', slika: '0px' },
        header: { tip: 'pun', logo: 'levo', posleSkrola: 'paper' },
        hero: 'puna-levo',
        usluge: 'plocice',
        slike: { filter: 'none' },
        pokret: {
            easing: 'cubic-bezier(0.29, 0.63, 0.44, 1)', brzo: '0.2s', srednje: '0.45s', sporo: '0.8s',
            reveal: 'fade', revealPomak: '0px', revealTrajanje: '0.8s', stagger: 0.07,
            heroEfekat: 'blagi-zum', heroTrajanje: '9s', heroPrelaz: 1000,
            hoverSlika: 1.03, linkHover: 'podvuci', marquee: 40, marqueePauza: false,
            paralaksa: 0, glatkiSkrol: false, prelazStranice: 'fade',
        },
    },

    atelje: {
        naziv: 'Atelje',
        inspiracija: 'Forge Automotive',
        opis: 'Nagrađivani minimalizam: crno i slonovača, tanak urednički serif, sitan verzal sa širokim razmakom, Lenis glatki skrol, auto kao umetnički objekat.',
        tamna: true,
        boje: {
            paper: '#0C0C0C', ink: '#F2F1ED', mist: '#161616', povrsina: '#161616',
            brand: '#C5A064', naBrand: '#0C0C0C', linija: '#F2F1ED', tamna: '#060606', akcenat: '#C5A064',
        },
        fontovi: { naslov: SERIF_CORMORANT, tekst: SANS_INTER, oznaka: SANS_INTER, logo: SERIF_CORMORANT },
        naslov: { tezina: 300, transform: 'none', razmak: '-0.012em', visina: 1.12, skala: 1.18, akcenat: 'kurziv' },
        oznaka: { transform: 'uppercase', razmak: '0.3em', velicina: '0.66rem', tezina: 600 },
        tekst: { tezina: 300 },
        dugme: { oblik: 'pravo', stil: 'obris' },
        radius: { kartica: '0px', slika: '0px' },
        header: { tip: 'providan', logo: 'centar', posleSkrola: 'paper' },
        hero: 'puna-centar',
        usluge: 'lista',
        slike: { filter: 'none' },
        pokret: {
            easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)', brzo: '0.3s', srednje: '0.5s', sporo: '0.9s',
            reveal: 'reci', revealPomak: '105%', revealTrajanje: '1s', stagger: 0.06,
            heroEfekat: 'blagi-zum', heroTrajanje: '12s', heroPrelaz: 1600,
            hoverSlika: 1.03, linkHover: 'podvuci', marquee: 60, marqueePauza: false,
            paralaksa: 40, glatkiSkrol: true, prelazStranice: 'fade',
        },
    },

    laboratorija: {
        naziv: 'Laboratorija',
        inspiracija: 'AMMO NYC',
        opis: 'Njujorški laboratorijski minimalizam: belo, Helvetica bold verzal, crvena dugmad, studijske fotografije, brze precizne tranzicije.',
        tamna: false,
        boje: {
            paper: '#FFFFFF', ink: '#191818', mist: '#F3F3F3', povrsina: '#FFFFFF',
            brand: '#E11E23', naBrand: '#FFFFFF', linija: '#191818', tamna: '#0D0D0D', akcenat: '#E11E23',
        },
        fontovi: { naslov: HELVETICA, tekst: HELVETICA, oznaka: HELVETICA, logo: HELVETICA },
        naslov: { tezina: 700, transform: 'uppercase', razmak: '-0.03em', visina: 0.92, skala: 1.05, akcenat: 'boja' },
        oznaka: { transform: 'uppercase', razmak: '0.14em', velicina: '0.72rem', tezina: 700 },
        tekst: { tezina: 400 },
        dugme: { oblik: 'blago', stil: 'puno' },
        radius: { kartica: '4px', slika: '4px' },
        header: { tip: 'pun', logo: 'centar', posleSkrola: 'paper' },
        hero: 'puna-levo',
        usluge: 'kartice',
        slike: { filter: 'saturate(1.12) contrast(1.04)' },
        pokret: {
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)', brzo: '0.15s', srednje: '0.3s', sporo: '0.6s',
            reveal: 'fade-up', revealPomak: '16px', revealTrajanje: '0.5s', stagger: 0.05,
            heroEfekat: 'nista', heroTrajanje: '0s', heroPrelaz: 700,
            hoverSlika: 1.04, linkHover: 'boja', marquee: 30, marqueePauza: true,
            paralaksa: 0, glatkiSkrol: false, prelazStranice: 'fade',
        },
    },

    studio: {
        naziv: 'Studio',
        inspiracija: 'ESOTERIC Detail',
        opis: 'Studijski pristup: visoki uski Bebas naslovi, Montserrat, čist grid pločica, crni CTA u headeru, spore tranzicije fotografija.',
        tamna: false,
        boje: {
            paper: '#FFFFFF', ink: '#1A1A1A', mist: '#F1F1F1', povrsina: '#FFFFFF',
            brand: '#0B0B0B', naBrand: '#FFFFFF', linija: '#1A1A1A', tamna: '#0B0B0B', akcenat: '#EC0928',
        },
        fontovi: { naslov: '"Bebas Neue", Oswald, "Arial Narrow", sans-serif', tekst: 'Montserrat, system-ui, sans-serif', oznaka: 'Montserrat, system-ui, sans-serif', logo: 'Montserrat, system-ui, sans-serif' },
        naslov: { tezina: 400, transform: 'uppercase', razmak: '0.01em', visina: 0.95, skala: 1.22, akcenat: 'akcenat' },
        oznaka: { transform: 'uppercase', razmak: '0.12em', velicina: '0.72rem', tezina: 600 },
        tekst: { tezina: 400 },
        dugme: { oblik: 'pravo', stil: 'puno' },
        radius: { kartica: '0px', slika: '0px' },
        header: { tip: 'pun', logo: 'levo', posleSkrola: 'paper' },
        hero: 'puna-levo',
        usluge: 'plocice',
        slike: { filter: 'none' },
        pokret: {
            easing: 'cubic-bezier(0.2, 0, 0.3, 1)', brzo: '0.3s', srednje: '0.6s', sporo: '1s',
            reveal: 'fade-up', revealPomak: '24px', revealTrajanje: '0.8s', stagger: 0.08,
            heroEfekat: 'ken-burns', heroTrajanje: '10s', heroPrelaz: 1200,
            hoverSlika: 1.06, linkHover: 'boja', marquee: 35, marqueePauza: true,
            paralaksa: 0, glatkiSkrol: false, prelazStranice: 'fade',
        },
    },

    konsijerz: {
        naziv: 'Konsijerž',
        inspiracija: 'Voiture Detailing (London)',
        opis: 'Concierge luksuz: grafit i šampanj-krem, Montserrat naslovi, serifni tekst, pill dugmad sa širokim razmakom, usluge kao kurirani paketi.',
        tamna: true,
        boje: {
            paper: '#1B1B1B', ink: '#F4F1EA', mist: '#242424', povrsina: '#262626',
            brand: '#F7E7CE', naBrand: '#1B1B1B', linija: '#F4F1EA', tamna: '#111111', akcenat: '#F7E7CE',
        },
        fontovi: { naslov: 'Montserrat, system-ui, sans-serif', tekst: SERIF_CORMORANT, oznaka: 'Montserrat, system-ui, sans-serif', logo: 'Montserrat, system-ui, sans-serif' },
        naslov: { tezina: 600, transform: 'none', razmak: '-0.01em', visina: 1.1, skala: 0.95, akcenat: 'boja' },
        oznaka: { transform: 'uppercase', razmak: '0.18em', velicina: '0.74rem', tezina: 500 },
        tekst: { tezina: 400, velicina: '1.15rem' },
        dugme: { oblik: 'pill', stil: 'puno' },
        radius: { kartica: '14px', slika: '14px' },
        header: { tip: 'pun', logo: 'levo', posleSkrola: 'paper' },
        hero: 'puna-centar',
        usluge: 'paketi',
        slike: { filter: 'none' },
        pokret: {
            easing: 'cubic-bezier(0.05, 0.45, 0.1, 1)', brzo: '0.2s', srednje: '0.4s', sporo: '0.8s',
            reveal: 'fade-up', revealPomak: '40px', revealTrajanje: '0.9s', stagger: 0.1,
            heroEfekat: 'blagi-zum', heroTrajanje: '10s', heroPrelaz: 1200,
            hoverSlika: 1.03, linkHover: 'boja', marquee: 40, marqueePauza: true,
            paralaksa: 0, glatkiSkrol: false, prelazStranice: 'fade',
        },
    },

    velnes: {
        naziv: 'Velnes',
        inspiracija: 'Wash Haus',
        opis: 'Moderni lifestyle car wash: krem i tamnozelena, Inter sa tesnim razmakom, žuta dugmad sa strelicom ↗, drugi red naslova u sivoj.',
        tamna: false,
        boje: {
            paper: '#F1EFE9', ink: '#171A18', mist: '#E7E4DB', povrsina: '#FFFFFF',
            brand: '#F2C230', naBrand: '#171A18', linija: '#171A18', tamna: '#171A18', akcenat: '#F2C230',
        },
        fontovi: { naslov: SANS_INTER, tekst: SANS_INTER, oznaka: SANS_INTER, logo: SANS_INTER },
        naslov: { tezina: 500, transform: 'none', razmak: '-0.05em', visina: 1.04, skala: 1.08, akcenat: 'siva' },
        oznaka: { transform: 'uppercase', razmak: '0.16em', velicina: '0.74rem', tezina: 600 },
        tekst: { tezina: 400, velicina: '1.05rem' },
        dugme: { oblik: 'meko', stil: 'ugao' },
        radius: { kartica: '12px', slika: '10px' },
        header: { tip: 'tamni', logo: 'levo', posleSkrola: 'tamni' },
        hero: 'blok',
        usluge: 'kartice',
        slike: { filter: 'none' },
        pokret: {
            easing: 'ease', brzo: '0.2s', srednje: '0.3s', sporo: '0.5s',
            reveal: 'fade-up', revealPomak: '12px', revealTrajanje: '0.6s', stagger: 0.06,
            heroEfekat: 'nista', heroTrajanje: '0s', heroPrelaz: 800,
            hoverSlika: 1.03, linkHover: 'boja', marquee: 30, marqueePauza: true,
            paralaksa: 0, glatkiSkrol: false, prelazStranice: 'fade',
        },
    },

    galerija: {
        naziv: 'Galerija',
        inspiracija: 'Marque Auto Atelier (koncept)',
        opis: 'Appointment-only atelje: topla crna, slonovača i mesing, Bodoni naslovi, fotografije složene kao u modnom magazinu.',
        tamna: true,
        boje: {
            paper: '#0F0E0C', ink: '#EDE6DA', mist: '#171512', povrsina: '#1A1815',
            brand: '#B08D57', naBrand: '#0F0E0C', linija: '#EDE6DA', tamna: '#080706', akcenat: '#B08D57',
        },
        fontovi: { naslov: '"Bodoni Moda", "Playfair Display", Georgia, serif', tekst: 'Manrope, system-ui, sans-serif', oznaka: 'Manrope, system-ui, sans-serif', logo: '"Bodoni Moda", "Playfair Display", Georgia, serif' },
        naslov: { tezina: 400, transform: 'none', razmak: '-0.01em', visina: 1.08, skala: 1.1, akcenat: 'kurziv-boja' },
        oznaka: { transform: 'uppercase', razmak: '0.24em', velicina: '0.68rem', tezina: 500 },
        tekst: { tezina: 400 },
        dugme: { oblik: 'pravo', stil: 'obris' },
        radius: { kartica: '0px', slika: '0px' },
        header: { tip: 'providan', logo: 'levo', posleSkrola: 'paper' },
        hero: 'uvuceno',
        usluge: 'kartice',
        slike: { filter: 'none' },
        pokret: {
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)', brzo: '0.25s', srednje: '0.6s', sporo: '1.1s',
            reveal: 'fade-up', revealPomak: '28px', revealTrajanje: '1s', stagger: 0.09,
            heroEfekat: 'ken-burns', heroTrajanje: '14s', heroPrelaz: 1600,
            hoverSlika: 1.04, linkHover: 'podvuci', marquee: 50, marqueePauza: false,
            paralaksa: 50, glatkiSkrol: true, prelazStranice: 'fade',
        },
    },

    magazin: {
        naziv: 'Magazin',
        inspiracija: 'Autovera (koncept)',
        opis: 'Urednička tipografija kao u Kinfolk/Cereal magazinu: krem, Playfair kurziv u naslovu, DM Sans, numerisana lista usluga, reči koje izranjaju.',
        tamna: false,
        boje: {
            paper: '#F4F0E8', ink: '#151515', mist: '#EAE4D8', povrsina: '#FBF9F4',
            brand: '#151515', naBrand: '#F4F0E8', linija: '#151515', tamna: '#151515', akcenat: '#B5532A',
        },
        fontovi: { naslov: '"Playfair Display", Georgia, serif', tekst: '"DM Sans", Manrope, system-ui, sans-serif', oznaka: '"DM Sans", Manrope, system-ui, sans-serif', logo: '"Playfair Display", Georgia, serif' },
        naslov: { tezina: 400, transform: 'none', razmak: '-0.015em', visina: 1.06, skala: 1.12, akcenat: 'kurziv-akcenat' },
        oznaka: { transform: 'uppercase', razmak: '0.18em', velicina: '0.7rem', tezina: 500 },
        tekst: { tezina: 400 },
        dugme: { oblik: 'pill', stil: 'puno' },
        radius: { kartica: '0px', slika: '0px' },
        header: { tip: 'pun', logo: 'centar', posleSkrola: 'paper' },
        hero: 'dupla',
        usluge: 'lista',
        slike: { filter: 'none' },
        pokret: {
            easing: 'cubic-bezier(0.525, 0, 0, 1)', brzo: '0.2s', srednje: '0.45s', sporo: '1s',
            reveal: 'reci', revealPomak: '105%', revealTrajanje: '1s', stagger: 0.05,
            heroEfekat: 'nista', heroTrajanje: '0s', heroPrelaz: 900,
            hoverSlika: 1.05, linkHover: 'gasi-ostale', marquee: 40, marqueePauza: false,
            paralaksa: 60, glatkiSkrol: true, prelazStranice: 'fade',
        },
    },

    most: {
        naziv: 'Most',
        inspiracija: 'Blackbridge (koncept)',
        opis: 'Ravnoteža luksuznih serifnih naslova i modernog minimalističkog rasporeda: topla bela, šampanj akcenat, Manrope, visoke kartice usluga.',
        tamna: false,
        boje: {
            paper: '#FAF9F6', ink: '#1B1B1B', mist: '#F0EDE6', povrsina: '#FFFFFF',
            brand: '#1B1B1B', naBrand: '#FAF9F6', linija: '#1B1B1B', tamna: '#1B1B1B', akcenat: '#C9B79C',
        },
        fontovi: { naslov: SERIF_CORMORANT, tekst: 'Manrope, system-ui, sans-serif', oznaka: 'Manrope, system-ui, sans-serif', logo: SERIF_CORMORANT },
        naslov: { tezina: 500, transform: 'none', razmak: '-0.01em', visina: 1.02, skala: 1.12, akcenat: 'kurziv' },
        oznaka: { transform: 'uppercase', razmak: '0.16em', velicina: '0.72rem', tezina: 600 },
        tekst: { tezina: 400 },
        dugme: { oblik: 'pill', stil: 'strelica' },
        radius: { kartica: '18px', slika: '18px' },
        header: { tip: 'providan', logo: 'levo', posleSkrola: 'paper' },
        hero: 'split',
        usluge: 'visoke-kartice',
        slike: { filter: 'none' },
        pokret: {
            easing: 'ease', brzo: '0.3s', srednje: '0.4s', sporo: '0.8s',
            reveal: 'fade-up', revealPomak: '20px', revealTrajanje: '0.9s', stagger: 0.08,
            heroEfekat: 'ken-burns', heroTrajanje: '10s', heroPrelaz: 1200,
            hoverSlika: 1.06, linkHover: 'pozadina', marquee: 30, marqueePauza: false,
            paralaksa: 0, glatkiSkrol: false, prelazStranice: 'fade',
        },
    },

    kinematik: {
        naziv: 'Kinematik',
        inspiracija: 'Eclectic (dark cinematic)',
        opis: 'Tamno i filmski: skoro crna osnova, ogromni Archivo verzal naslovi, jedan narandžasti akcenat, mirni pokreti (ease-out-expo).',
        tamna: true,
        boje: {
            paper: '#0C0C0F', ink: '#ECEAE3', mist: '#15151A', povrsina: '#15151A',
            brand: '#FC9303', naBrand: '#0C0C0F', linija: '#ECEAE3', tamna: '#080809', akcenat: '#FC9303',
        },
        fontovi: { naslov: 'Archivo, Inter, system-ui, sans-serif', tekst: SANS_INTER, oznaka: SANS_INTER, logo: 'Archivo, Inter, system-ui, sans-serif' },
        naslov: { tezina: 900, transform: 'uppercase', razmak: '-0.02em', visina: 0.9, skala: 1.08, akcenat: 'boja' },
        oznaka: { transform: 'uppercase', razmak: '0.25em', velicina: '0.7rem', tezina: 600 },
        tekst: { tezina: 400 },
        dugme: { oblik: 'pill', stil: 'puno' },
        radius: { kartica: '16px', slika: '24px' },
        header: { tip: 'providan', logo: 'levo', posleSkrola: 'paper' },
        hero: 'puna-levo',
        usluge: 'plocice',
        slike: { filter: 'none' },
        pokret: {
            easing: 'cubic-bezier(0.23, 1, 0.32, 1)', brzo: '0.2s', srednje: '0.4s', sporo: '0.8s',
            reveal: 'fade-up', revealPomak: '16px', revealTrajanje: '0.7s', stagger: 0.05,
            heroEfekat: 'nista', heroTrajanje: '0s', heroPrelaz: 1200,
            hoverSlika: 1.03, linkHover: 'podvuci', marquee: 40, marqueePauza: true,
            paralaksa: 0, glatkiSkrol: false, prelazStranice: 'fade',
        },
    },
};

export const PODRAZUMEVANA_TEMA = 'hotel';

const spoji = (osnova, izmene) => {
    if (!izmene || typeof izmene !== 'object') return osnova;
    const rez = { ...osnova };
    for (const [k, v] of Object.entries(izmene)) {
        rez[k] = v && typeof v === 'object' && !Array.isArray(v) ? { ...osnova[k], ...v } : v;
    }
    return rez;
};

/** Tema po id-ju, ili po zapisu iz servis.js (string ili { osnova, ...izmene }). */
export const resiTemu = (zapis) => {
    if (typeof zapis === 'string') {
        return { id: TEME[zapis] ? zapis : PODRAZUMEVANA_TEMA, ...(TEME[zapis] ?? TEME[PODRAZUMEVANA_TEMA]) };
    }
    if (zapis && typeof zapis === 'object') {
        const id = TEME[zapis.osnova] ? zapis.osnova : PODRAZUMEVANA_TEMA;
        const { osnova: _o, ...izmene } = zapis;
        return { id, ...spoji(TEME[id], izmene) };
    }
    return { id: PODRAZUMEVANA_TEMA, ...TEME[PODRAZUMEVANA_TEMA] };
};

const rgb = (hex) => {
    const h = hex.replace('#', '');
    const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
    return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
};

const ZAOBLJENJE = { pill: '999px', meko: '6px', blago: '4px', mali: '2px', pravo: '0px' };
const FILTER = { none: 'none', grayscale: 'grayscale(1) contrast(1.05)' };

/** CSS promenljive teme — ide u <style id="tema"> u <head>. */
export const cssTeme = (t) => {
    const b = t.boje;
    const p = t.pokret;
    const v = {
        '--c-paper': rgb(b.paper), '--c-ink': rgb(b.ink), '--c-mist': rgb(b.mist),
        '--c-povrsina': rgb(b.povrsina), '--c-brand': rgb(b.brand), '--c-na-brand': rgb(b.naBrand),
        '--c-linija': rgb(b.linija), '--c-tamna': rgb(b.tamna), '--c-akcenat': rgb(b.akcenat),
        '--font-naslov': t.fontovi.naslov, '--font-tekst': t.fontovi.tekst,
        '--font-oznaka': t.fontovi.oznaka, '--font-logo': t.fontovi.logo,
        '--naslov-tezina': t.naslov.tezina, '--naslov-tt': t.naslov.transform,
        '--naslov-razmak': t.naslov.razmak, '--naslov-visina': t.naslov.visina, '--naslov-skala': t.naslov.skala,
        '--oznaka-tt': t.oznaka.transform, '--oznaka-razmak': t.oznaka.razmak,
        '--oznaka-velicina': t.oznaka.velicina, '--oznaka-tezina': t.oznaka.tezina,
        '--tekst-tezina': t.tekst.tezina, '--tekst-velicina': t.tekst.velicina ?? '1rem', '--tekst-tt': t.tekst.transform ?? 'none',
        '--r-dugme': ZAOBLJENJE[t.dugme.oblik] ?? '0px', '--r-kartica': t.radius.kartica, '--r-slika': t.radius.slika,
        '--ease': p.easing, '--t-brzo': p.brzo, '--t-srednje': p.srednje, '--t-sporo': p.sporo,
        '--reveal-pomak': p.revealPomak, '--reveal-trajanje': p.revealTrajanje,
        '--hero-trajanje': p.heroTrajanje, '--hero-prelaz': `${p.heroPrelaz}ms`,
        '--hover-slika': p.hoverSlika, '--marquee': `${p.marquee}s`,
        '--filter-slike': FILTER[t.slike.filter] ?? t.slike.filter,
        'color-scheme': t.tamna ? 'dark' : 'light',
    };
    return `:root{${Object.entries(v).map(([k, val]) => `${k}:${val}`).join(';')}}`;
};

/** Atributi na <html> po kojima CSS menja raspored i ponašanje. */
export const atributiTeme = (t) => ({
    'data-tema': t.id,
    'data-hero': t.hero,
    'data-dugme': t.dugme.stil,
    'data-link': t.pokret.linkHover,
    'data-reveal': t.pokret.reveal,
    'data-hero-efekat': t.pokret.heroEfekat,
    'data-akcenat': t.naslov.akcenat,
    'data-marquee-pauza': t.pokret.marqueePauza ? 'da' : 'ne',
    'data-tamna': t.tamna ? 'da' : 'ne',
});
