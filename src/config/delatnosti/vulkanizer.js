/*
 * PREDLOŽAK: VULKANIZER (zamena guma, balansiranje, hotel za gume, trap)
 *
 * Kod guma cena zavisi od veličine točka, pa je `izborVozila` ovde „veličina
 * felne”. Cene su okvirne (2026), samo za demo.
 */
export default {
    naziv: 'Gume Centar',
    kratkiNaziv: 'Gume',
    slogan: { sr: 'Vulkanizer i servis točkova', en: 'Tyre fitting & wheel service' },
    opis: {
        sr: 'Sezonska zamena guma, montaža i balansiranje, hotel za gume i 3D geometrija trapa. Zakažite termin online i preskočite sezonsku gužvu.',
        en: 'Seasonal tyre swaps, fitting and balancing, tyre storage and 3D wheel alignment. Book online and skip the seasonal rush.',
    },

    izborVozila: {
        naslov: { sr: 'Kolika je veličina felne?', en: 'What is your wheel size?' },
        oznaka: { sr: 'Felna', en: 'Wheel' },
        opcije: [
            { id: 'r16', naziv: { sr: '13–16 inča', en: '13–16 inch' }, opis: { sr: 'Većina gradskih i kompaktnih vozila', en: 'Most city and compact cars' } },
            { id: 'r18', naziv: { sr: '17–18 inča', en: '17–18 inch' }, opis: { sr: 'Limuzine i manji SUV', en: 'Saloons and small SUVs' } },
            { id: 'r19', naziv: { sr: '19 inča i više', en: '19 inch and up' }, opis: { sr: 'Sportska i premium vozila', en: 'Sports and premium cars' } },
            { id: 'suv', naziv: { sr: 'SUV, 4×4 i kombi', en: 'SUV, 4×4 & van' }, opis: { sr: 'Velike i teške gume, C gume', en: 'Large, heavy and commercial tyres' } },
        ],
    },

    kategorije: [
        {
            id: 'zamena-guma',
            naziv: { sr: 'Zamena guma', en: 'Tyre change' },
            kratko: { sr: 'Sezonska zamena kompleta ili montaža novih guma, sa balansiranjem.', en: 'Seasonal wheel swaps or fitting new tyres, with balancing.' },
            opis: [
                { sr: 'Gume montiramo na mašinama bez poluge za osetljive i niskoprofilne felne, pa nema ogrebotina na rubu felne. Svaki točak se balansira i proverava pritisak, a šrafove pritežemo moment-ključem.', en: 'Tyres are fitted on leverless machines that are safe for delicate and low-profile wheels, so rims stay scratch-free. Every wheel is balanced, pressures are set and bolts torqued with a torque wrench.' },
            ],
            slika: '/slike/gume-montaza.webp',
            ukljuceno: [
                { sr: 'Skidanje i postavljanje točkova', en: 'Wheels off and on' },
                { sr: 'Balansiranje sva četiri točka', en: 'Balancing all four wheels' },
                { sr: 'Provera dubine šare i datuma proizvodnje', en: 'Tread depth and DOT date check' },
                { sr: 'Pritisak po fabričkoj specifikaciji', en: 'Pressures to factory spec' },
                { sr: 'Pritezanje moment-ključem', en: 'Torque-wrench tightening' },
            ],
            koraci: [
                { naslov: { sr: 'Prijem', en: 'Check-in' }, tekst: { sr: 'Proverimo gume i dogovorimo šta se radi.', en: 'We check the tyres and agree what to do.' } },
                { naslov: { sr: 'Montaža', en: 'Fitting' }, tekst: { sr: 'Mašine bez poluge, bez oštećenja felni.', en: 'Leverless machines, no rim damage.' } },
                { naslov: { sr: 'Balans', en: 'Balancing' }, tekst: { sr: 'Precizno balansiranje svakog točka.', en: 'Precise balancing of every wheel.' } },
                { naslov: { sr: 'Kontrola', en: 'Final check' }, tekst: { sr: 'Pritisak, moment i probna provera.', en: 'Pressure, torque and a final check.' } },
            ],
            usluge: [
                { id: 'sezonska-zamena', naziv: { sr: 'Sezonska zamena kompleta', en: 'Seasonal wheel swap' }, opis: { sr: 'Komplet točkova na felnama: skidanje, postavljanje i balans.', en: 'Wheels already on rims: swap and balance.' }, trajanje: { r16: 30, r18: 35, r19: 40, suv: 45 }, cena: { r16: 2800, r18: 3400, r19: 4200, suv: 4800 } },
                { id: 'montaza-guma', naziv: { sr: 'Montaža i demontaža guma', en: 'Tyre fitting' }, opis: { sr: 'Prebacivanje guma na felnama, ventili i balans (4 kom).', en: 'Swapping tyres on rims, valves and balancing (4 pcs).' }, trajanje: { r16: 50, r18: 60, r19: 70, suv: 75 }, cena: { r16: 4200, r18: 5000, r19: 6200, suv: 7200 } },
                { id: 'balansiranje', naziv: { sr: 'Balansiranje', en: 'Wheel balancing' }, opis: { sr: 'Sva četiri točka.', en: 'All four wheels.' }, trajanje: 30, cena: { r16: 1600, r18: 2000, r19: 2400, suv: 2800 } },
            ],
        },
        {
            id: 'popravke',
            naziv: { sr: 'Popravke', en: 'Repairs' },
            kratko: { sr: 'Krpljenje, ventili, TPMS senzori i ravnanje felni.', en: 'Punctures, valves, TPMS sensors and wheel straightening.' },
            slika: '/slike/felna.webp',
            usluge: [
                { id: 'krpljenje', naziv: { sr: 'Krpljenje gume', en: 'Puncture repair' }, opis: { sr: 'Unutrašnja zakrpa sa čepom — trajna popravka.', en: 'Internal plug-patch — a permanent repair.' }, trajanje: 20, cena: 900, cenaOd: true },
                { id: 'ventili', naziv: { sr: 'Zamena ventila', en: 'Valve replacement' }, opis: { sr: 'Četiri nova ventila.', en: 'Four new valves.' }, trajanje: 15, cena: 1200 },
                { id: 'tpms', naziv: { sr: 'TPMS senzori', en: 'TPMS sensors' }, opis: { sr: 'Programiranje i zamena senzora pritiska.', en: 'Programming and replacing pressure sensors.' }, trajanje: 30, cena: 2500, cenaOd: true },
                { id: 'ravnanje-felni', naziv: { sr: 'Ravnanje aluminijumskih felni', en: 'Alloy wheel straightening' }, opis: { sr: 'Po felni, zavisno od oštećenja.', en: 'Per wheel, depending on damage.' }, trajanje: 60, cena: 3500, cenaOd: true },
            ],
        },
        {
            id: 'hotel-za-gume',
            naziv: { sr: 'Hotel za gume', en: 'Tyre hotel' },
            kratko: { sr: 'Čuvamo vaše gume između sezona — oprane, obeležene i na suvom.', en: 'We store your tyres between seasons — washed, labelled and dry.' },
            opis: [
                { sr: 'Gume posle skidanja peremo, proveravamo i obeležavamo, pa čuvamo u suvom magacinu na policama. Na početku sezone su spremne čim dođete.', en: 'After removal the tyres are washed, checked, labelled and stored on racks in a dry warehouse. At the start of the season they are ready when you arrive.' },
            ],
            slika: '/slike/gume-stalak.webp',
            usluge: [
                { id: 'cuvanje-guma', naziv: { sr: 'Čuvanje kompleta (jedna sezona)', en: 'Storage (one season)' }, opis: { sr: 'Četiri gume ili točka, sa osiguranjem.', en: 'Four tyres or wheels, insured.' }, trajanje: 15, cena: 4000 },
                { id: 'pranje-tockova', naziv: { sr: 'Pranje i pakovanje točkova', en: 'Wheel wash & bagging' }, opis: { sr: 'Pre čuvanja ili za odnošenje kući.', en: 'Before storage or to take home.' }, trajanje: 20, cena: 1200 },
            ],
        },
        {
            id: 'trap-i-geometrija',
            naziv: { sr: 'Trap i geometrija', en: 'Alignment & suspension' },
            kratko: { sr: '3D centriranje trapa i pregled amortizera.', en: '3D wheel alignment and shock absorber check.' },
            slika: '/slike/balansiranje.webp',
            usluge: [
                { id: 'geometrija', naziv: { sr: 'Centriranje trapa (3D geometrija)', en: '3D wheel alignment' }, opis: { sr: 'Merenje i podešavanje, sa izveštajem pre i posle.', en: 'Measured and adjusted, with a before/after report.' }, trajanje: 45, cena: 3800, cenaOd: true },
                { id: 'pregled-trapa', naziv: { sr: 'Pregled trapa', en: 'Suspension check' }, opis: { sr: 'Amortizeri, krajevi spone, ležajevi.', en: 'Shocks, tie-rod ends, bearings.' }, trajanje: 30, cena: 1500 },
            ],
        },
    ],

    galerija: [
        { slika: '/slike/gume-montaza.webp', kategorija: 'zamena-guma', opis: { sr: 'Montaža na mašini bez poluge', en: 'Leverless fitting machine' } },
        { slika: '/slike/gume-stalak.webp', kategorija: 'hotel-za-gume', opis: { sr: 'Hotel za gume', en: 'Tyre hotel' } },
        { slika: '/slike/balansiranje.webp', kategorija: 'trap-i-geometrija', opis: { sr: 'Precizno podešavanje', en: 'Precise adjustment' } },
        { slika: '/slike/felna.webp', kategorija: 'popravke', opis: { sr: 'Felna posle servisa', en: 'Wheel after service' } },
        { slika: '/slike/radionica.webp', kategorija: '', opis: { sr: 'Radionica', en: 'Workshop' } },
        { slika: '/slike/lift.webp', kategorija: 'zamena-guma', opis: { sr: 'Vozilo na dizalici', en: 'Car on the lift' } },
        { slika: '/slike/mehanicar.webp', kategorija: 'popravke', opis: { sr: 'Pažljiv rad', en: 'Careful work' } },
        { slika: '/slike/kocnice.webp', kategorija: 'trap-i-geometrija', opis: { sr: 'Pregled trapa i kočnica', en: 'Suspension and brake check' } },
        { slika: '/slike/sjaj.webp', kategorija: '', opis: { sr: 'Spremno za sezonu', en: 'Ready for the season' } },
    ],

    pocetna: {
        hero: {
            nadnaslov: { sr: 'Vulkanizer · hotel za gume · geometrija', en: 'Tyres · storage · alignment' },
            naslov: { sr: 'Zamena guma', en: 'Tyre change' },
            akcenat: { sr: 'bez sezonske gužve', en: 'without the seasonal rush' },
            uvod: {
                sr: 'Zakažite tačan termin, dovezite auto i za pola sata ste na putu — na gumama koje su balansirane i pritegnute kako treba.',
                en: 'Book an exact time, drive in and be back on the road in half an hour — on tyres balanced and torqued the right way.',
            },
            slike: ['/slike/gume-montaza.webp', '/slike/gume-stalak.webp', '/slike/felna.webp'],
        },
        izjava: {
            sr: 'Gume su jedino što drži vaš auto na putu. Zato ih menjamo kao da je naša porodica na zadnjem sedištu.',
            en: 'Tyres are the only thing keeping your car on the road. So we fit them as if our family were in the back seat.',
        },
        brojevi: [
            { vrednost: 'godine', oznaka: { sr: 'godina iskustva', en: 'years of experience' } },
            { vrednost: '30 min', oznaka: { sr: 'sezonska zamena', en: 'seasonal swap' } },
            { vrednost: '2.000+', oznaka: { sr: 'kompleta u hotelu', en: 'sets in storage' } },
        ],
        zastoMi: [
            { naslov: { sr: 'Bez ogrebotina na felnama', en: 'No scratched rims' }, tekst: { sr: 'Mašine bez poluge i zaštitne čeljusti za alu felne.', en: 'Leverless machines and protective jaws for alloys.' } },
            { naslov: { sr: 'Moment-ključ, ne „na osećaj”', en: 'Torque wrench, not guesswork' }, tekst: { sr: 'Šrafovi pritegnuti po fabričkoj specifikaciji vozila.', en: 'Bolts tightened to the car’s factory spec.' } },
            { naslov: { sr: 'Termin, ne red', en: 'A slot, not a queue' }, tekst: { sr: 'I u sezoni — zakazano vreme je vaše vreme.', en: 'Even in season — your booked time is yours.' } },
        ],
        proces: [
            { naslov: { sr: 'Zakažite online', en: 'Book online' }, tekst: { sr: 'Izaberite veličinu felne, uslugu i termin.', en: 'Choose wheel size, service and time.' } },
            { naslov: { sr: 'Dovezite auto', en: 'Drive in' }, tekst: { sr: 'Gume iz hotela su već spremne kad stignete.', en: 'Stored tyres are ready when you arrive.' } },
            { naslov: { sr: 'Vozite bezbedno', en: 'Drive safely' }, tekst: { sr: 'Balansirano, provereno i pritegnuto.', en: 'Balanced, checked and torqued.' } },
        ],
        poziv: {
            naslov: { sr: 'Sezona je blizu', en: 'The season is coming' },
            tekst: { sr: 'Zakažite zamenu guma na vreme — bez čekanja u redu.', en: 'Book your tyre change early — no queues.' },
            slika: '/slike/gume-stalak.webp',
        },
    },

    oNama: {
        naslov: { sr: 'Vulkanizer kakav bismo i sami želeli', en: 'The tyre shop we would want ourselves' },
        tekst: [
            { sr: 'Gume Centar je porodična radionica koja je od jedne mašine i jednog čoveka narasla u servis sa tri linije za montažu i hotelom za preko dve hiljade kompleta.', en: 'Gume Centar is a family workshop that grew from one machine and one person into a shop with three fitting lines and storage for over two thousand sets.' },
            { sr: 'Ono što se nije promenilo je pristup: svaku gumu proverimo, svaki točak izbalansiramo i svaki šraf pritegnemo onako kako proizvođač vozila propisuje.', en: 'What has not changed is the approach: every tyre is checked, every wheel balanced and every bolt torqued exactly as the car maker specifies.' },
        ],
        slika: '/slike/radionica.webp',
        vrednosti: [
            { naslov: { sr: 'Bezbednost', en: 'Safety' }, tekst: { sr: 'Prvo bezbednost, pa brzina.', en: 'Safety first, then speed.' } },
            { naslov: { sr: 'Pažnja', en: 'Care' }, tekst: { sr: 'Vaše felne tretiramo kao svoje.', en: 'We treat your wheels as our own.' } },
            { naslov: { sr: 'Iskren savet', en: 'Honest advice' }, tekst: { sr: 'Kažemo kad gume još mogu — i kad više ne mogu.', en: 'We tell you when tyres still have life — and when they do not.' } },
        ],
    },

    recenzije: {
        prosek: 4.9,
        broj: 403,
        izvor: 'Google',
        lista: [
            { autor: 'Demo recenzija', ocena: 5, tekst: { sr: 'Usred sezone, a ja sam bio gotov za 25 minuta. Zakazivanje online je spas.', en: 'Mid-season and I was done in 25 minutes. Online booking is a lifesaver.' } },
            { autor: 'Demo recenzija', ocena: 5, tekst: { sr: 'Niskoprofilne gume na 20" felnama — ni jedna ogrebotina.', en: 'Low-profile tyres on 20" rims — not a single scratch.' } },
            { autor: 'Demo recenzija', ocena: 5, tekst: { sr: 'Hotel za gume je odličan, točkovi su mi čekali oprani i spremni.', en: 'The tyre hotel is great — my wheels were waiting washed and ready.' } },
        ],
    },

    brendovi: ['Michelin', 'Continental', 'Pirelli', 'Bridgestone', 'Goodyear', 'Hankook'],

    poklonVaucer: { tekst: '' },

    pitanja: [
        { pitanje: { sr: 'Kada treba preći na zimske gume?', en: 'When should I switch to winter tyres?' }, odgovor: { sr: 'Kada temperatura padne ispod 7 °C. U Srbiji su zimske gume obavezne od 1. novembra do 1. aprila kada su na putu zimski uslovi.', en: 'When temperatures drop below 7 °C. In Serbia winter tyres are mandatory from 1 November to 1 April whenever there are winter conditions on the road.' } },
        { pitanje: { sr: 'Koja je minimalna dubina šare?', en: 'What is the minimum tread depth?' }, odgovor: { sr: 'Za zimske gume najmanje 4 mm. Za letnje zakonski minimum je 1,6 mm, ali preporučujemo zamenu ispod 3 mm.', en: 'At least 4 mm for winter tyres. For summer tyres the legal minimum is 1.6 mm, but we recommend replacing them below 3 mm.' } },
        { pitanje: { sr: 'Kako da znam veličinu felne?', en: 'How do I know my wheel size?' }, odgovor: { sr: 'Na boku gume, npr. 225/45 R17 — broj posle „R” je prečnik felne u inčima (ovde 17).', en: 'On the tyre sidewall, e.g. 225/45 R17 — the number after “R” is the rim diameter in inches (here 17).' } },
        { pitanje: { sr: 'Da li prodajete gume?', en: 'Do you sell tyres?' }, odgovor: { sr: 'Da — nabavljamo gume svih vodećih proizvođača. Pošaljite nam dimenziju porukom i šaljemo ponudu.', en: 'Yes — we source tyres from all major brands. Message us your size and we will send a quote.' } },
        { pitanje: { sr: 'Koliko dugo se čuvaju gume u hotelu?', en: 'How long can you store my tyres?' }, odgovor: { sr: 'Jednu sezonu, uz mogućnost produženja. Pre preuzimanja nas obavestite dan ranije.', en: 'One season, with the option to extend. Let us know a day before collecting.' } },
        { pitanje: { sr: 'Šta ako moram da otkažem?', en: 'What if I need to cancel?' }, odgovor: { sr: 'Otkazivanje je besplatno do 2 sata pre termina — pozovite ili pošaljite poruku.', en: 'Cancelling is free up to 2 hours before — call or message us.' } },
    ],

    placanje: ['Gotovina', 'Visa', 'Mastercard', 'Dina'],

    zakazivanje: {
        korakMinuta: 15,
        najranijeSati: 1,
        danaUnapred: 30,
        otkazivanjeSati: 2,
        maksUsluga: 3,
        poljaVozila: { model: 'opciono', tablice: 'ne' },
    },
};
