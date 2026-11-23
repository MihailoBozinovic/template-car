/*
 * ═══════════════════════════════════════════════════════════════════════════
 *  PODACI SERVISA — JEDINI FAJL KOJI SE MENJA ZA NOVOG KLIJENTA
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Sve što sajt prikazuje — naziv, telefon, radno vreme, usluge i cene,
 *  galerija, tekstovi, SEO, pravni podaci firme — čita se odavde i iz
 *  predloška izabrane delatnosti. Isti podaci idu u footer, kontakt,
 *  zakazivanje, strukturirane podatke za Google (JSON-LD), sitemap i pravne
 *  strane, pa nigde ne mogu da se raziđu.
 *
 *  KAKO RADI:
 *    1. izaberi `delatnost` — perionica, detailing, tehnicki, vulkanizer ili
 *       servis. Predložak (src/config/delatnosti/) donosi gotove usluge sa
 *       cenama, tekstove, pitanja i galeriju;
 *    2. popuni podatke ispod (kontakt, adresa, radno vreme, firma);
 *    3. sve iz predloška što ne odgovara klijentu PREGAZI ovde, istim imenom
 *       polja (primeri su na dnu fajla, zakomentarisani) — najčešće
 *       `kategorije` (pravi cenovnik) i `pocetna.hero` (naslov);
 *    4. `npm run provera` pokazuje šta je ostalo demo ili nepopunjeno.
 *
 *  PREVODI: svako tekstualno polje može biti običan tekst (isti na svim
 *  jezicima) ili { sr: '…', en: '…' }. Kad prevod fali, prikazuje se srpski.
 *
 *  Dok je `demo: true`, sajt je zaključan za pretraživače (noindex), vidi se
 *  birač tema i delatnosti, a `npm run provera` ne prolazi. Prebaci na
 *  `false` tek kad su podaci pravi.
 *
 *  Prazan niz ili prazan string sakriva tu sekciju (bez recenzija nema bloka
 *  recenzija, bez TikTok-a nema ikonice itd.).
 */

export const servis = {
    demo: true,

    /*
     * Tema — jedna od: hotel, atelje, laboratorija, studio, konsijerz, velnes,
     * galerija, magazin, most, kinematik (opisi u src/config/teme.js i
     * docs/TEME.md). Najlakše: u `npm run dev` otvori birač i klikni „Postavi
     * kao temu sajta” — ova linija se sama prepiše.
     * Može i sa izmenama: tema: { osnova: 'hotel', boje: { brand: '#0B5FA5' } }
     */
    tema: 'hotel',

    /*
     * Delatnost — predložak sadržaja (docs/DELATNOSTI.md):
     *   'perionica'  — ručno pranje, enterijer, zaštita (Google: AutoWash)
     *   'detailing'  — korekcija laka, keramika, PPF folija
     *   'tehnicki'   — tehnički pregled i registracija
     *   'vulkanizer' — gume, balansiranje, hotel za gume, geometrija (TireShop)
     *   'servis'     — auto servis, dijagnostika, kočnice, klima (AutoRepair)
     * Birač u `npm run dev` ima i „Postavi kao delatnost sajta”.
     */
    delatnost: 'perionica',

    // Jezici sajta. Prvi je glavni (na adresi /), ostali pod /en i /ru.
    // Predlošci imaju srpski i engleski; za ruski dodaj `ru` u tekstove.
    jezici: ['sr', 'en'],

    // Naziv servisa. Izostavljeno = naziv iz predloška (samo za demo).
    naziv: 'Sjaj Car Wash',
    // Kraći naziv za ikonicu aplikacije (do ~12 slova).
    kratkiNaziv: 'Sjaj',
    // Logo (SVG ili PNG u public/). Prazno = naziv ispisan fontom teme.
    logo: '',

    // Puna adresa sajta, bez kose crte na kraju (canonical, sitemap, deljenje).
    domen: 'https://www.sjaj-carwash.rs',
    osnovan: 2015,

    kontakt: {
        // E.164 za pozive (tel:) i kako se broj prikazuje.
        telefon: '+381601234567',
        telefonPrikaz: '060 123 4567',
        // Broj za WhatsApp i Viber, E.164 bez „+” (prazno = nema dugmeta).
        whatsapp: '381601234567',
        viber: '381601234567',
        email: 'zakazivanje@sjaj-carwash.rs',
        instagram: 'https://www.instagram.com/sjaj.carwash/',
        facebook: '',
        tiktok: '',
        // Link „Ostavite recenziju” na Google profilu (prazno = nema dugmeta).
        googleRecenzija: '',
    },

    lokacija: {
        adresa: 'Bulevar oslobođenja 100',
        postanskiBroj: '11000',
        grad: { sr: 'Beograd', en: 'Belgrade', ru: 'Белград' },
        opstina: 'Voždovac',
        drzava: 'RS',
        // U Google Maps: desni klik na lokaciju → prve dve vrednosti.
        koordinate: { lat: 44.7866, lng: 20.4735 },
        // Link ka profilu na Google mapama (prazno = pravi se iz koordinata).
        googleMape: '',
        kakoDoNas: {
            sr: 'Ulaz za vozila iz dvorišta, parking za klijente ispred perionice. Čekaonica sa kafom i Wi-Fi-jem.',
            en: 'Vehicle entrance from the yard, customer parking in front. Lounge with coffee and Wi-Fi.',
        },
    },

    /*
     * Radno vreme po danima. null = ne radi. Zakazivanje nudi samo termine
     * koji se završavaju pre zatvaranja.
     */
    radnoVreme: {
        pon: ['08:00', '20:00'],
        uto: ['08:00', '20:00'],
        sre: ['08:00', '20:00'],
        cet: ['08:00', '20:00'],
        pet: ['08:00', '20:00'],
        sub: ['09:00', '17:00'],
        ned: null,
    },

    // Dani kad servis ne radi iako je inače radni dan (praznici, odmor).
    neradniDani: [
        { datum: '2026-12-31', opis: { sr: 'Doček Nove godine', en: 'New Year’s Eve' } },
        { datum: '2027-01-01', opis: { sr: 'Nova godina', en: 'New Year' } },
        { datum: '2027-01-02', opis: { sr: 'Nova godina', en: 'New Year' } },
        { datum: '2027-01-07', opis: { sr: 'Božić', en: 'Orthodox Christmas' } },
    ],

    /*
     * Podaci privrednog društva / preduzetnika. Zakon o trgovini i Zakon o
     * elektronskoj trgovini traže da budu na sajtu — prikazuju se u footeru,
     * na kontaktu i na pravnim stranama.
     */
    firma: {
        naziv: 'Sjaj Car Wash, Marko Marković PR, Beograd',
        oblik: 'preduzetnik', // 'preduzetnik' | 'doo'
        adresa: 'Bulevar oslobođenja 100, 11000 Beograd',
        pib: '000000000',
        maticniBroj: '00000000',
        // Šifra delatnosti; prazno = iz predloška (4520 održavanje vozila, 7120 tehnički pregled).
        sifraDelatnosti: '',
        pdvObveznik: false,
        // Kome se klijenti obraćaju za lične podatke i reklamacije.
        emailZaPodatke: 'zakazivanje@sjaj-carwash.rs',
    },

    /*
     * ZAKAZIVANJE
     *
     *  nacin: 'zahtev' — klijent bira vozilo, uslugu i termin, servis potvrđuje
     *                    (online zahtev čeka odobrenje). Zahtev stiže preko `kanal`.
     *         'link'   — dugme „Zakaži” vodi na spoljni sistem na adresi `link`.
     *
     *  kanal.tip: 'webhook'  — POST JSON na `kanal.url` (Formspree, Make, n8n,
     *                          Google Apps Script ili sopstveni API). Preporučeno.
     *             'whatsapp' — otvara WhatsApp sa popunjenom porukom.
     *             'viber'    — otvara Viber sa popunjenom porukom.
     *             'email'    — otvara e-mail sa popunjenom porukom.
     *  Ako webhook ne uspe, odmah se nude WhatsApp/Viber/poziv — zahtev se nikad
     *  ne gubi u tišini.
     *
     *  Ostalo dolazi iz predloška delatnosti, a može da se pregazi ovde:
     *    korakMinuta: 15        mreža termina
     *    najranijeSati: 1       najraniji termin od sada
     *    danaUnapred: 30        koliko dana unapred
     *    otkazivanjeSati: 2     besplatno otkazivanje (piše u uslovima)
     *    maksUsluga: 3          koliko usluga odjednom
     *    prijemMinuta: 30       termin za prijem vozila kad ostaje više dana
     *    poljaVozila: { model: 'opciono', tablice: 'ne' }   'obavezno' | 'opciono' | 'ne'
     */
    zakazivanje: {
        nacin: 'zahtev',
        link: '',
        kanal: { tip: 'whatsapp', url: '' },
    },

    /*
     * OBAVEŠTENJE — traka na vrhu sajta (praznici, promena radnog vremena,
     * akcija). Prazan tekst = nema trake. `do` = poslednji dan prikaza.
     */
    obavestenje: {
        tekst: '',
        do: '',
        // Stranica na koju vodi klik: 'kontakt', 'cenovnik', 'zakazivanje' ili prazno.
        link: '',
    },

    /*
     * TIM — opciono, za stranicu „O nama” (prazno = nema sekcije).
     *   { id: 'marko', ime: 'Marko Marković', uloga: { sr: 'Šef perionice', en: 'Head of wash' }, slika: '/slike/tim-1.webp', opis: '' }
     */
    tim: [],

    // ANALITIKA — učitava se tek kad posetilac prihvati kolačiće. Prazno = nema.
    analitika: {
        ga4: '', // npr. 'G-XXXXXXXXXX'
        metaPixel: '', // npr. '1234567890'
    },

    seo: {
        // Slika za deljenje linka (1200×630) u public/; bez nje build pravi sliku iz prve hero fotografije.
        slikaZaDeljenje: '/og-slika.jpg',
        /*
         * Naslov i opis po stranici, po želji po jeziku; prazno = podrazumevani
         * tekst iz src/i18n. Ključevi: pocetna, cenovnik, galerija, oNama,
         * zakazivanje, kontakt, pitanja.
         *   cenovnik: { naslov: { sr: '…', en: '…' }, opis: '…' }
         */
        stranice: {},
    },

    /*
     * ─── PREGAŽENI SADRŽAJ PREDLOŠKA (opciono) ───────────────────────────
     * Sve ispod ima podrazumevanu vrednost u predlošku delatnosti. Otkomentariši
     * i izmeni samo ono što je drugačije kod klijenta. Struktura je ista kao u
     * src/config/delatnosti/<delatnost>.js — najlakše je kopirati odatle.
     *
     * slogan: { sr: 'Ručno pranje vozila', en: 'Hand car wash' },
     * opis: { sr: 'Jedna rečenica za Google (do ~155 znakova).', en: '…' },
     *
     * pocetna: {
     *     hero: { naslov: { sr: 'Vaš auto,' }, akcenat: { sr: 'kao nov' } },
     * },
     *
     * izborVozila: { opcije: [ { id: 'mali', naziv: 'Gradski' }, … ] },
     *
     * kategorije: [
     *     {
     *         id: 'pranje',                         // ujedno adresa: /usluge/pranje
     *         naziv: { sr: 'Pranje', en: 'Wash' },
     *         kratko: { sr: 'Jedna rečenica.' },
     *         slika: '/slike/pranje-pena.webp',
     *         usluge: [
     *             { id: 'spoljno', naziv: 'Spoljno pranje', trajanje: 30,
     *               cena: { mali: 1300, srednji: 1500, suv: 1800, kombi: 2100 } },
     *             { id: 'ozon', naziv: 'Ozon', trajanje: 45, cena: 2500 },
     *             { id: 'keramika', naziv: 'Keramika', trajanje: 600, cena: 30000, cenaOd: true, dana: 2 },
     *         ],
     *     },
     * ],
     *
     * galerija: [ { slika: '/slike/galerija-01.webp', kategorija: 'pranje', opis: '…' } ],
     * recenzije: { prosek: 4.9, broj: 120, izvor: 'Google', lista: [ … samo prave recenzije … ] },
     * pitanja: [ { pitanje: '…', odgovor: '…' } ],
     * brendovi: ['Koch-Chemie', 'Gyeon'],
     * poklonVaucer: { tekst: '' },
     * placanje: ['Gotovina', 'Visa', 'Mastercard', 'Dina'],
     */
};
