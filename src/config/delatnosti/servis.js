/*
 * PREDLOŽAK: AUTO SERVIS (održavanje, dijagnostika, kočnice, klima, popravke)
 *
 * Cene rada zavise od vozila i delova, pa su prikazane kao „od” i bez izbora
 * vozila — tačnu ponudu servis šalje posle zahteva. Okvirne cene (2026), demo.
 */
export default {
    naziv: 'Servis Ključ',
    kratkiNaziv: 'Ključ',
    slogan: { sr: 'Auto servis i dijagnostika', en: 'Car service & diagnostics' },
    opis: {
        sr: 'Auto servis za sve marke: mali i veliki servis, kompjuterska dijagnostika, kočnice, trap i klima. Jasna ponuda pre početka rada, zakazivanje online.',
        en: 'Car service for all makes: oil and major services, diagnostics, brakes, suspension and air-con. A clear quote before work starts, online booking.',
    },

    izborVozila: { opcije: [] },

    kategorije: [
        {
            id: 'redovno-odrzavanje',
            naziv: { sr: 'Redovno održavanje', en: 'Routine maintenance' },
            kratko: { sr: 'Mali i veliki servis po preporuci proizvođača, sa originalnim ili OEM delovima.', en: 'Minor and major services to manufacturer schedule, with original or OEM parts.' },
            opis: [
                { sr: 'Servis radimo po servisnom planu proizvođača vašeg vozila. Pre početka rada dobijate ponudu sa cenom delova i rada, a ništa van dogovora ne menjamo bez vašeg odobrenja.', en: 'We service to your car maker’s schedule. Before starting you get a quote with parts and labour, and nothing outside it is changed without your approval.' },
                { sr: 'Zamenjene delove vam vraćamo, a servis upisujemo u servisnu knjižicu ili digitalnu evidenciju.', en: 'Replaced parts are returned to you and the service is recorded in your service book or digital history.' },
            ],
            slika: '/slike/servis-ulje.webp',
            ukljuceno: [
                { sr: 'Zamena ulja i filtera ulja', en: 'Oil and oil filter change' },
                { sr: 'Filter vazduha i kabine', en: 'Air and cabin filter' },
                { sr: 'Provera tečnosti, kočnica i trapa', en: 'Fluids, brakes and suspension check' },
                { sr: 'Reset servisnog intervala', en: 'Service interval reset' },
                { sr: 'Upis u servisnu knjižicu', en: 'Service book entry' },
            ],
            koraci: [
                { naslov: { sr: 'Prijem', en: 'Check-in' }, tekst: { sr: 'Zapišemo kilometražu, simptome i vaše želje.', en: 'We note the mileage, symptoms and your requests.' } },
                { naslov: { sr: 'Ponuda', en: 'Quote' }, tekst: { sr: 'Šaljemo ponudu porukom i čekamo vaše odobrenje.', en: 'We message a quote and wait for your approval.' } },
                { naslov: { sr: 'Rad', en: 'Work' }, tekst: { sr: 'Servis po specifikaciji proizvođača.', en: 'Service to manufacturer spec.' } },
                { naslov: { sr: 'Predaja', en: 'Handover' }, tekst: { sr: 'Objasnimo šta je urađeno i vratimo stare delove.', en: 'We explain what was done and return the old parts.' } },
            ],
            usluge: [
                { id: 'mali-servis', naziv: { sr: 'Mali servis', en: 'Oil service' }, opis: { sr: 'Ulje, filter ulja, vazduha i kabine. Cena rada; delovi po ponudi.', en: 'Oil, oil, air and cabin filters. Labour; parts quoted.' }, trajanje: 60, cena: 3500, cenaOd: true },
                { id: 'veliki-servis', naziv: { sr: 'Veliki servis', en: 'Major service (timing belt)' }, opis: { sr: 'Zupčasti kaiš ili lanac, pumpa za vodu, zatezači. Vozilo ostaje kod nas.', en: 'Timing belt or chain, water pump, tensioners. Car stays with us.' }, trajanje: 360, cena: 14000, cenaOd: true, dana: 1 },
                { id: 'pregled-pred-kupovinu', naziv: { sr: 'Pregled pred kupovinu', en: 'Pre-purchase inspection' }, opis: { sr: 'Detaljan pregled polovnog vozila, sa pisanim izveštajem.', en: 'Thorough used-car check with a written report.' }, trajanje: 90, cena: 4500 },
            ],
        },
        {
            id: 'dijagnostika',
            naziv: { sr: 'Dijagnostika i elektrika', en: 'Diagnostics & electrics' },
            kratko: { sr: 'Kompjuterska dijagnostika, lampice na tabli i auto-elektrika.', en: 'Computer diagnostics, warning lights and auto electrics.' },
            slika: '/slike/dijagnostika.webp',
            usluge: [
                { id: 'kompjuterska-dijagnostika', naziv: { sr: 'Kompjuterska dijagnostika', en: 'Computer diagnostics' }, opis: { sr: 'Očitavanje grešaka svih sistema i tumačenje.', en: 'Fault codes from every system, with interpretation.' }, trajanje: 45, cena: 2500 },
                { id: 'auto-elektrika', naziv: { sr: 'Auto-elektrika', en: 'Auto electrics' }, opis: { sr: 'Alternator, anlaser, instalacija, svetla.', en: 'Alternator, starter, wiring, lights.' }, trajanje: 60, cena: 3000, cenaOd: true },
                { id: 'akumulator', naziv: { sr: 'Zamena akumulatora', en: 'Battery replacement' }, opis: { sr: 'Test, zamena i registracija akumulatora (start-stop).', en: 'Test, replace and register the battery (start-stop).' }, trajanje: 20, cena: 1200, cenaOd: true },
            ],
        },
        {
            id: 'kocnice-i-trap',
            naziv: { sr: 'Kočnice i trap', en: 'Brakes & suspension' },
            kratko: { sr: 'Pločice, diskovi, amortizeri i delovi trapa.', en: 'Pads, discs, shock absorbers and suspension parts.' },
            slika: '/slike/kocnice.webp',
            usluge: [
                { id: 'plocice', naziv: { sr: 'Zamena pločica (osovina)', en: 'Brake pads (per axle)' }, opis: { sr: 'Rad, čišćenje i podmazivanje vođica.', en: 'Labour, cleaning and lubricating slides.' }, trajanje: 60, cena: 2500, cenaOd: true },
                { id: 'diskovi-plocice', naziv: { sr: 'Diskovi i pločice (osovina)', en: 'Discs and pads (per axle)' }, opis: { sr: 'Rad; delovi po ponudi.', en: 'Labour; parts quoted.' }, trajanje: 90, cena: 4500, cenaOd: true },
                { id: 'popravka-trapa', naziv: { sr: 'Popravka trapa', en: 'Suspension repair' }, opis: { sr: 'Amortizeri, viljuške, krajevi spone.', en: 'Shocks, control arms, tie-rod ends.' }, trajanje: 120, cena: 3500, cenaOd: true },
            ],
        },
        {
            id: 'klima',
            naziv: { sr: 'Klima i grejanje', en: 'Air-con & heating' },
            kratko: { sr: 'Servis i punjenje klime, dezinfekcija i grejanje.', en: 'Air-con service and recharge, disinfection and heating.' },
            slika: '/slike/motor.webp',
            usluge: [
                { id: 'servis-klime', naziv: { sr: 'Servis klime', en: 'Air-con service' }, opis: { sr: 'Provera zaptivenosti i punjenje gasom (R134a ili R1234yf).', en: 'Leak test and gas recharge (R134a or R1234yf).' }, trajanje: 60, cena: 5500, cenaOd: true },
                { id: 'dezinfekcija-klime', naziv: { sr: 'Dezinfekcija klime', en: 'Air-con disinfection' }, opis: { sr: 'Uklanja neprijatne mirise i bakterije, uz novi filter kabine.', en: 'Removes odours and bacteria, with a new cabin filter.' }, trajanje: 30, cena: 2500 },
            ],
        },
    ],

    galerija: [
        { slika: '/slike/mehanicar.webp', kategorija: 'redovno-odrzavanje', opis: { sr: 'Servis u toku', en: 'Service in progress' } },
        { slika: '/slike/dijagnostika.webp', kategorija: 'dijagnostika', opis: { sr: 'Kompjuterska dijagnostika', en: 'Computer diagnostics' } },
        { slika: '/slike/kocnice.webp', kategorija: 'kocnice-i-trap', opis: { sr: 'Nove kočnice', en: 'New brakes' } },
        { slika: '/slike/lift.webp', kategorija: '', opis: { sr: 'Vozilo na dizalici', en: 'Car on the lift' } },
        { slika: '/slike/servis-ulje.webp', kategorija: 'redovno-odrzavanje', opis: { sr: 'Zamena ulja', en: 'Oil change' } },
        { slika: '/slike/radionica.webp', kategorija: '', opis: { sr: 'Radionica', en: 'The workshop' } },
        { slika: '/slike/motor.webp', kategorija: 'klima', opis: { sr: 'Motorni prostor', en: 'Engine bay' } },
        { slika: '/slike/kljucevi.webp', kategorija: '', opis: { sr: 'Predaja vozila', en: 'Handover' } },
        { slika: '/slike/felna.webp', kategorija: 'kocnice-i-trap', opis: { sr: 'Točak i kočnice', en: 'Wheel and brakes' } },
    ],

    pocetna: {
        hero: {
            nadnaslov: { sr: 'Auto servis za sve marke', en: 'Car service for all makes' },
            naslov: { sr: 'Servis kome', en: 'A garage' },
            akcenat: { sr: 'možete da verujete', en: 'you can trust' },
            uvod: {
                sr: 'Jasna ponuda pre početka rada, originalni i OEM delovi i objašnjenje bez stručnog žargona. Zakažite termin online.',
                en: 'A clear quote before we start, original and OEM parts, and explanations without the jargon. Book online.',
            },
            slike: ['/slike/mehanicar.webp', '/slike/radionica.webp', '/slike/dijagnostika.webp'],
        },
        izjava: {
            sr: 'Najbolji servis je onaj posle kog tačno znate šta je urađeno, zašto, i koliko je koštalo — pre nego što ste platili.',
            en: 'The best service is the one after which you know exactly what was done, why, and what it cost — before you paid.',
        },
        brojevi: [
            { vrednost: 'godine', oznaka: { sr: 'godina iskustva', en: 'years of experience' } },
            { vrednost: '9.000+', oznaka: { sr: 'servisiranih vozila', en: 'cars serviced' } },
            { vrednost: '12 mes.', oznaka: { sr: 'garancije na rad', en: 'warranty on labour' } },
        ],
        zastoMi: [
            { naslov: { sr: 'Ponuda pre rada', en: 'A quote before work' }, tekst: { sr: 'Ne radimo ništa što niste odobrili — ni deo, ni sat rada.', en: 'Nothing is done without your approval — not a part, not an hour.' } },
            { naslov: { sr: 'Stari delovi nazad', en: 'Old parts returned' }, tekst: { sr: 'Vidite šta je zamenjeno i zašto.', en: 'See what was replaced and why.' } },
            { naslov: { sr: 'Garancija na rad', en: 'Labour warranty' }, tekst: { sr: 'Dvanaest meseci garancije na izvršene radove.', en: 'Twelve months’ warranty on all work.' } },
        ],
        proces: [
            { naslov: { sr: 'Zakažite online', en: 'Book online' }, tekst: { sr: 'Opišite problem i izaberite termin prijema.', en: 'Describe the issue and pick a drop-off time.' } },
            { naslov: { sr: 'Odobrite ponudu', en: 'Approve the quote' }, tekst: { sr: 'Posle pregleda šaljemo ponudu porukom.', en: 'After inspection we message you a quote.' } },
            { naslov: { sr: 'Preuzmite vozilo', en: 'Collect the car' }, tekst: { sr: 'Javljamo se kad je gotovo, sa računom i objašnjenjem.', en: 'We let you know when it is ready, with an invoice and explanation.' } },
        ],
        poziv: {
            naslov: { sr: 'Upalila se lampica?', en: 'Warning light on?' },
            tekst: { sr: 'Zakažite dijagnostiku — odgovor dobijate isti dan.', en: 'Book diagnostics — you get an answer the same day.' },
            slika: '/slike/dijagnostika.webp',
        },
    },

    oNama: {
        naslov: { sr: 'Servis bez iznenađenja', en: 'A garage without surprises' },
        tekst: [
            { sr: 'Servis Ključ vode majstori sa dvadeset godina iskustva u ovlašćenim servisima. Otvorili smo sopstvenu radionicu da bismo radili onako kako mislimo da treba: pošteno, transparentno i bez prečica.', en: 'Servis Ključ is run by mechanics with twenty years in dealer workshops. We opened our own garage to work the way we think it should be done: honestly, transparently and without shortcuts.' },
            { sr: 'Radimo sa originalnim i proverenim OEM delovima, dijagnostičkom opremom za sve marke i pisanom garancijom na rad.', en: 'We use original and proven OEM parts, diagnostic equipment for all makes, and a written warranty on labour.' },
        ],
        slika: '/slike/radionica.webp',
        vrednosti: [
            { naslov: { sr: 'Transparentnost', en: 'Transparency' }, tekst: { sr: 'Ponuda pre rada, račun bez iznenađenja.', en: 'A quote before work, an invoice without surprises.' } },
            { naslov: { sr: 'Stručnost', en: 'Expertise' }, tekst: { sr: 'Majstori obučeni u ovlašćenim servisima.', en: 'Mechanics trained in dealer workshops.' } },
            { naslov: { sr: 'Odgovornost', en: 'Accountability' }, tekst: { sr: 'Pisana garancija na svaki rad.', en: 'A written warranty on all work.' } },
        ],
    },

    recenzije: {
        prosek: 4.9,
        broj: 236,
        izvor: 'Google',
        lista: [
            { autor: 'Demo recenzija', ocena: 5, tekst: { sr: 'Dobio sam ponudu pre rada i na kraju platio tačno toliko. Retkost.', en: 'Got a quote before the work and paid exactly that. Rare.' } },
            { autor: 'Demo recenzija', ocena: 5, tekst: { sr: 'Pronašli su grešku koju dva servisa pre njih nisu mogla.', en: 'They found a fault two other garages could not.' } },
            { autor: 'Demo recenzija', ocena: 5, tekst: { sr: 'Vratili su mi stare delove i objasnili šta je bilo. Preporuka.', en: 'They returned the old parts and explained everything. Recommended.' } },
        ],
    },

    brendovi: ['Bosch', 'Castrol', 'Mann-Filter', 'Brembo', 'Sachs', 'Valeo'],

    poklonVaucer: { tekst: '' },

    pitanja: [
        { pitanje: { sr: 'Da li radite sve marke vozila?', en: 'Do you service all makes?' }, odgovor: { sr: 'Da — putnička vozila i laka dostavna svih marki, uključujući hibride.', en: 'Yes — cars and light vans of all makes, including hybrids.' } },
        { pitanje: { sr: 'Mogu li da donesem svoje delove?', en: 'Can I bring my own parts?' }, odgovor: { sr: 'Možete, ali na njih ne dajemo garanciju. Na delove koje mi nabavimo garancija važi kao i na rad.', en: 'You can, but they are not covered by our warranty. Parts we source carry the same warranty as the labour.' } },
        { pitanje: { sr: 'Koliko unapred dobijam ponudu?', en: 'When do I get the quote?' }, odgovor: { sr: 'Za redovan servis odmah pri zakazivanju; za kvarove posle dijagnostike, obično isti dan.', en: 'For routine service right when booking; for faults after diagnostics, usually the same day.' } },
        { pitanje: { sr: 'Da li vozilo ostaje kod vas?', en: 'Will the car stay with you?' }, odgovor: { sr: 'Mali servis i dijagnostika traju do sat vremena i možete sačekati. Za veće radove vozilo ostaje dan ili dva — javljamo se kad je gotovo.', en: 'An oil service or diagnostics take up to an hour and you can wait. Bigger jobs keep the car a day or two — we let you know when it is ready.' } },
        { pitanje: { sr: 'Kakva je garancija?', en: 'What warranty do you give?' }, odgovor: { sr: 'Dvanaest meseci na rad i delove koje mi nabavljamo, uz račun.', en: 'Twelve months on labour and on parts we supply, with the invoice.' } },
        { pitanje: { sr: 'Kako mogu da platim?', en: 'How can I pay?' }, odgovor: { sr: 'Gotovinom, karticom ili uplatom na račun (za firme).', en: 'Cash, card or bank transfer (for companies).' } },
    ],

    placanje: ['Gotovina', 'Visa', 'Mastercard', 'Dina', 'Račun za firme'],

    zakazivanje: {
        korakMinuta: 30,
        najranijeSati: 2,
        danaUnapred: 30,
        otkazivanjeSati: 12,
        maksUsluga: 3,
        prijemMinuta: 30,
        poljaVozila: { model: 'obavezno', tablice: 'opciono' },
    },
};
