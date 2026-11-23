/*
 * PREDLOŽAK: PERIONICA (ručno pranje vozila, car wash)
 *
 * Usluge, cene po veličini vozila, tekstovi i pitanja za tipičnu premium
 * perionicu. Sve ovde je podrazumevano — u src/config/servis.js svako polje
 * može da se pregazi (npr. `kategorije: [...]` sa pravim cenovnikom klijenta).
 * Cene su okvirne (Beograd, 2026) i služe samo za demo.
 */
export default {
    naziv: 'Sjaj Car Wash',
    kratkiNaziv: 'Sjaj',
    slogan: { sr: 'Ručno pranje i nega vozila', en: 'Hand car wash & care' },
    opis: {
        sr: 'Ručno pranje vozila metodom dve kante, demineralizovana voda i premium hemija. Spoljno i kompletno pranje, enterijer i zaštita laka. Zakažite online.',
        en: 'Two-bucket hand wash, demineralised water and premium products. Exterior and full washes, interior care and paint protection. Book online.',
    },

    izborVozila: {
        naslov: { sr: 'Koje vozilo dovozite?', en: 'Which vehicle are you bringing?' },
        oznaka: { sr: 'Vozilo', en: 'Vehicle' },
        opcije: [
            { id: 'mali', naziv: { sr: 'Gradsko i malo', en: 'City & small' }, opis: { sr: 'Clio, Polo, Golf, Corsa…', en: 'Clio, Polo, Golf, Corsa…' } },
            { id: 'srednji', naziv: { sr: 'Limuzina i karavan', en: 'Saloon & estate' }, opis: { sr: 'Octavia, Passat, Serija 3, A4…', en: 'Octavia, Passat, 3 Series, A4…' } },
            { id: 'suv', naziv: { sr: 'SUV i džip', en: 'SUV & 4×4' }, opis: { sr: 'Tiguan, X5, Q7, Range Rover…', en: 'Tiguan, X5, Q7, Range Rover…' } },
            { id: 'kombi', naziv: { sr: 'Kombi i minivan', en: 'Van & MPV' }, opis: { sr: 'Vito, Transporter, Sharan…', en: 'Vito, Transporter, Sharan…' } },
        ],
    },

    kategorije: [
        {
            id: 'pranje',
            naziv: { sr: 'Pranje vozila', en: 'Car wash' },
            kratko: { sr: 'Od brzog spoljnog do premium pranja — uvek ručno, bez četki.', en: 'From a quick exterior to a premium wash — always by hand, never brushes.' },
            opis: [
                { sr: 'Svako pranje počinje aktivnom penom koja omekša prljavštinu, a nastavlja se ručnim pranjem metodom dve kante — tako se pesak ne vraća na lak i ne pravi nove riseve.', en: 'Every wash starts with snow foam that softens the dirt, followed by a two-bucket hand wash — so grit never goes back onto the paint and leaves new swirls.' },
                { sr: 'Ispiramo demineralizovanom vodom, koja ne ostavlja kamenac, a sušimo toplim vazduhom i mekim mikrofiber peškirima.', en: 'We rinse with demineralised water that leaves no spots, and dry with warm air and soft microfibre towels.' },
            ],
            slika: '/slike/pranje-pena.webp',
            ukljuceno: [
                { sr: 'Pretpranje aktivnom penom', en: 'Snow-foam pre-wash' },
                { sr: 'Ručno pranje metodom dve kante', en: 'Two-bucket hand wash' },
                { sr: 'Felne i gume posebnim sredstvima', en: 'Wheels and tyres with dedicated cleaners' },
                { sr: 'Ispiranje demineralizovanom vodom', en: 'Demineralised water rinse' },
                { sr: 'Beskontaktno sušenje toplim vazduhom', en: 'Touchless warm-air drying' },
                { sr: 'Dresing guma, mat ili sjaj', en: 'Tyre dressing, matte or gloss' },
            ],
            koraci: [
                { naslov: { sr: 'Pregled', en: 'Inspection' }, tekst: { sr: 'Zajedno pogledamo vozilo i dogovorimo šta je prioritet.', en: 'We look over the car together and agree on priorities.' } },
                { naslov: { sr: 'Pena i felne', en: 'Foam & wheels' }, tekst: { sr: 'Aktivna pena, felne i podkrila pre kontakta sa lakom.', en: 'Snow foam, wheels and arches before anything touches the paint.' } },
                { naslov: { sr: 'Ručno pranje', en: 'Hand wash' }, tekst: { sr: 'Dve kante, čist mitt za svaki panel.', en: 'Two buckets, a clean mitt for every panel.' } },
                { naslov: { sr: 'Sušenje i finiš', en: 'Dry & finish' }, tekst: { sr: 'Topao vazduh, peškiri i dresing guma.', en: 'Warm air, towels and tyre dressing.' } },
            ],
            usluge: [
                { id: 'spoljno', naziv: { sr: 'Spoljno pranje', en: 'Exterior wash' }, opis: { sr: 'Pena, ručno pranje, felne, sušenje i dresing guma.', en: 'Foam, hand wash, wheels, drying and tyre dressing.' }, trajanje: { mali: 30, srednji: 35, suv: 40, kombi: 45 }, cena: { mali: 1300, srednji: 1500, suv: 1800, kombi: 2100 } },
                { id: 'kompletno', naziv: { sr: 'Kompletno pranje', en: 'Full wash' }, opis: { sr: 'Spoljno pranje + usisavanje, plastika, stakla iznutra i patosnice.', en: 'Exterior wash + vacuum, plastics, inside glass and mats.' }, trajanje: { mali: 60, srednji: 70, suv: 80, kombi: 90 }, cena: { mali: 2200, srednji: 2500, suv: 2900, kombi: 3300 } },
                { id: 'premium', naziv: { sr: 'Premium pranje', en: 'Premium wash' }, opis: { sr: 'Kompletno pranje, dubinski očišćene felne, brza zaštita laka i detaljan enterijer.', en: 'Full wash, deep-cleaned wheels, quick paint protection and a detailed interior.' }, trajanje: { mali: 120, srednji: 135, suv: 150, kombi: 165 }, cena: { mali: 3900, srednji: 4400, suv: 5200, kombi: 5900 } },
            ],
        },
        {
            id: 'enterijer',
            naziv: { sr: 'Enterijer', en: 'Interior' },
            kratko: { sr: 'Dubinsko pranje sedišta, nega kože i uklanjanje mirisa.', en: 'Deep seat cleaning, leather care and odour removal.' },
            opis: [
                { sr: 'Sedišta i tapacir peremo ekstrakcijom — sredstvo se utiskuje u tkaninu i odmah izvlači zajedno sa prljavštinom, pa se sedišta suše za nekoliko sati.', en: 'Seats and carpets are cleaned by extraction — the cleaner is worked into the fabric and pulled straight back out with the dirt, so seats dry within hours.' },
                { sr: 'Kožu čistimo blagim sredstvom i mekom četkom, pa je hidriramo — bez sjaja i bez masnog sloja.', en: 'Leather is cleaned with a gentle cleaner and a soft brush, then conditioned — no shine, no greasy film.' },
            ],
            slika: '/slike/enterijer.webp',
            ukljuceno: [
                { sr: 'Izduvavanje nepristupačnih delova kompresorom', en: 'Compressed-air blow-out of hard-to-reach areas' },
                { sr: 'Detaljno usisavanje sedišta, poda i gepeka', en: 'Thorough vacuum of seats, floor and boot' },
                { sr: 'Ekstrakcija tekstila ili nega kože', en: 'Fabric extraction or leather care' },
                { sr: 'Plastika i tabla mekim četkicama', en: 'Plastics and dash with soft brushes' },
                { sr: 'Stakla iznutra bez tragova', en: 'Streak-free inside glass' },
            ],
            usluge: [
                { id: 'dubinsko', naziv: { sr: 'Dubinsko pranje enterijera', en: 'Deep interior clean' }, opis: { sr: 'Ekstrakcija sedišta, tapacira i gepeka, plastika i stakla.', en: 'Extraction of seats, carpets and boot, plus plastics and glass.' }, trajanje: { mali: 180, srednji: 210, suv: 240, kombi: 270 }, cena: { mali: 7000, srednji: 8000, suv: 9500, kombi: 11000 } },
                { id: 'koza', naziv: { sr: 'Čišćenje i nega kože', en: 'Leather clean & condition' }, opis: { sr: 'Sedišta, volan i obloge vrata od kože.', en: 'Leather seats, steering wheel and door cards.' }, trajanje: 90, cena: { mali: 3500, srednji: 4000, suv: 5000, kombi: 5000 } },
                { id: 'ozon', naziv: { sr: 'Dezinfekcija ozonom', en: 'Ozone treatment' }, opis: { sr: 'Uklanja neprijatne mirise i bakterije iz kabine i klime.', en: 'Removes odours and bacteria from the cabin and air-con.' }, trajanje: 45, cena: 2500 },
                { id: 'dlake', naziv: { sr: 'Uklanjanje dlaka ljubimaca', en: 'Pet hair removal' }, opis: { sr: 'Gumene četke i usisavanje — cena zavisi od količine dlaka.', en: 'Rubber brushes and vacuum — price depends on the amount.' }, trajanje: 45, cena: 1500, cenaOd: true },
            ],
        },
        {
            id: 'zastita',
            naziv: { sr: 'Zaštita i sjaj', en: 'Protection & shine' },
            kratko: { sr: 'Vosak, siler i poliranje farova — sjaj koji traje.', en: 'Wax, sealant and headlight restoration — shine that lasts.' },
            opis: [
                { sr: 'Zaštita čini lak glatkim i hidrofobnim: voda se skuplja u kapi i odnosi prljavštinu, pa se auto ređe i lakše pere.', en: 'Protection makes paint slick and hydrophobic: water beads up and carries dirt away, so the car stays clean longer and washes easier.' },
            ],
            slika: '/slike/kapi.webp',
            usluge: [
                { id: 'vosak', naziv: { sr: 'Ručno nanošenje voska', en: 'Hand wax' }, opis: { sr: 'Dubok sjaj i zaštita do 6 nedelja. Uz kompletno pranje.', en: 'Deep gloss and up to 6 weeks of protection. Added to a full wash.' }, trajanje: 60, cena: { mali: 2500, srednji: 3000, suv: 3500, kombi: 4000 } },
                { id: 'siler', naziv: { sr: 'Siler (sealant)', en: 'Paint sealant' }, opis: { sr: 'Sintetička zaštita laka do 6 meseci.', en: 'Synthetic paint protection for up to 6 months.' }, trajanje: 90, cena: { mali: 5000, srednji: 6000, suv: 7000, kombi: 8000 } },
                { id: 'farovi', naziv: { sr: 'Poliranje farova', en: 'Headlight restoration' }, opis: { sr: 'Uklanjanje zamućenja i UV zaštita — par farova.', en: 'Haze removal and UV protection — per pair.' }, trajanje: 60, cena: 3500 },
            ],
        },
        {
            id: 'dodatno',
            naziv: { sr: 'Dodatne usluge', en: 'Extras' },
            kratko: { sr: 'Motorni prostor, felne i stakla — uz bilo koje pranje.', en: 'Engine bay, wheels and glass — with any wash.' },
            slika: '/slike/motor.webp',
            usluge: [
                { id: 'motor', naziv: { sr: 'Pranje motornog prostora', en: 'Engine bay clean' }, opis: { sr: 'Bezbedno, uz zaštitu elektronike i dresing plastike.', en: 'Safely, with electronics protected and plastics dressed.' }, trajanje: 45, cena: 2500 },
                { id: 'felne', naziv: { sr: 'Dubinsko čišćenje felni', en: 'Deep wheel clean' }, opis: { sr: 'Skidanje prašine od kočnica i katrana sa felni.', en: 'Removes brake dust and tar from the wheels.' }, trajanje: 30, cena: 1500 },
                { id: 'stakla', naziv: { sr: 'Hidrofobna zaštita stakala', en: 'Glass rain repellent' }, opis: { sr: 'Kiša klizi sa vetrobrana — bolja vidljivost noću.', en: 'Rain slides off the windscreen — better visibility at night.' }, trajanje: 30, cena: 2000 },
            ],
        },
    ],

    galerija: [
        { slika: '/slike/pranje-pena.webp', kategorija: 'pranje', opis: { sr: 'Pretpranje aktivnom penom', en: 'Snow-foam pre-wash' } },
        { slika: '/slike/felna.webp', kategorija: 'dodatno', opis: { sr: 'Felne posle dubinskog čišćenja', en: 'Wheels after a deep clean' } },
        { slika: '/slike/enterijer.webp', kategorija: 'enterijer', opis: { sr: 'Enterijer posle dubinskog pranja', en: 'Interior after a deep clean' } },
        { slika: '/slike/pranje-rucno.webp', kategorija: 'pranje', opis: { sr: 'Ručno pranje', en: 'Hand wash' } },
        { slika: '/slike/kapi.webp', kategorija: 'zastita', opis: { sr: 'Voda klizi sa zaštićenog laka', en: 'Water beading on protected paint' } },
        { slika: '/slike/koza.webp', kategorija: 'enterijer', opis: { sr: 'Nega kožnih sedišta', en: 'Leather seat care' } },
        { slika: '/slike/susenje.webp', kategorija: 'pranje', opis: { sr: 'Sušenje mikrofiberom', en: 'Microfibre drying' } },
        { slika: '/slike/farovi.webp', kategorija: 'zastita', opis: { sr: 'Farovi posle poliranja', en: 'Headlights after restoration' } },
        { slika: '/slike/sjaj.webp', kategorija: '', opis: { sr: 'Spremno za put', en: 'Ready to go' } },
    ],

    pocetna: {
        hero: {
            nadnaslov: { sr: 'Ručno pranje · bez četki', en: 'Hand wash · no brushes' },
            naslov: { sr: 'Vaš auto, opran', en: 'Your car, washed' },
            akcenat: { sr: 'kako zaslužuje', en: 'the way it deserves' },
            uvod: {
                sr: 'Aktivna pena, metod dve kante i demineralizovana voda. Bez žurbe, bez riseva — termin zakazujete online za minut.',
                en: 'Snow foam, the two-bucket method and demineralised water. No rush, no swirls — book online in a minute.',
            },
            slike: ['/slike/pranje-pena.webp', '/slike/sjaj.webp', '/slike/pranje-rucno.webp'],
        },
        izjava: {
            sr: 'Pranje nije usputna stvar. To je pola sata u kojem se o vašem autu brine neko ko zna šta radi — i kome je stalo.',
            en: 'A wash is not an afterthought. It is half an hour when your car is looked after by someone who knows what they are doing — and cares.',
        },
        brojevi: [
            { vrednost: 'godine', oznaka: { sr: 'godina iskustva', en: 'years of experience' } },
            { vrednost: '25.000+', oznaka: { sr: 'opranih vozila', en: 'cars washed' } },
            { vrednost: '4,9', oznaka: { sr: 'prosečna ocena na Google-u', en: 'average Google rating' } },
        ],
        zastoMi: [
            { naslov: { sr: 'Bez četki, samo ruke', en: 'No brushes, only hands' }, tekst: { sr: 'Metod dve kante i čist mitt za svaki deo vozila — lak ostaje bez riseva.', en: 'Two buckets and a clean mitt for every panel — the paint stays swirl-free.' } },
            { naslov: { sr: 'Demineralizovana voda', en: 'Demineralised water' }, tekst: { sr: 'Ne ostavlja kamenac ni fleke, ni na tamnim felnama i hromu.', en: 'Leaves no spots or limescale, even on dark wheels and chrome.' } },
            { naslov: { sr: 'Termin bez čekanja', en: 'No queue' }, tekst: { sr: 'Dođete u zakazano vreme, auto preuzimamo odmah.', en: 'Arrive at your time and we take the car straight away.' } },
        ],
        proces: [
            { naslov: { sr: 'Zakažite online', en: 'Book online' }, tekst: { sr: 'Izaberite vozilo, uslugu i slobodan termin.', en: 'Choose your vehicle, service and a free slot.' } },
            { naslov: { sr: 'Dovezite vozilo', en: 'Drop the car off' }, tekst: { sr: 'Sačekajte uz kafu ili se vratite kad vam javimo.', en: 'Wait with a coffee, or come back when we message you.' } },
            { naslov: { sr: 'Preuzmite sjaj', en: 'Collect the shine' }, tekst: { sr: 'Auto vas čeka čist, suv i spreman za put.', en: 'Your car is waiting clean, dry and ready to go.' } },
        ],
        poziv: {
            naslov: { sr: 'Vreme je za pranje', en: 'Time for a wash' },
            tekst: { sr: 'Izaberite termin — potvrdu dobijate porukom.', en: 'Pick a time — we confirm by message.' },
            slika: '/slike/susenje.webp',
        },
    },

    oNama: {
        naslov: { sr: 'Perionica koja pere kao za sebe', en: 'A car wash that washes like it’s our own car' },
        tekst: [
            { sr: 'Počeli smo kao mala ekipa zaljubljenika u automobile, umorna od četki koje ostavljaju riseve i pranja „na brzinu”. Danas peremo stotine vozila mesečno — i dalje ručno, i dalje sa istom pažnjom.', en: 'We started as a small crew of car lovers, tired of brushes that leave swirls and “quick” washes. Today we wash hundreds of cars a month — still by hand, still with the same care.' },
            { sr: 'Koristimo demineralizovanu vodu, pH neutralne šampone i mikrofiber koji se pere posle svakog vozila. To nije dodatak koji se doplaćuje, već standard svakog pranja.', en: 'We use demineralised water, pH-neutral shampoos and microfibre washed after every car. That is not an upgrade you pay extra for — it is how every wash is done.' },
            { sr: 'Bilo da je u pitanju gradski auto ili kolekcionarski primerak, pristup je isti: pažljivo, bez prečica, i uz iskren savet šta vozilu zaista treba.', en: 'Whether it is a city car or a collector’s piece, the approach is the same: careful, no shortcuts, and honest advice on what the car actually needs.' },
        ],
        slika: '/slike/pranje-rucno.webp',
        vrednosti: [
            { naslov: { sr: 'Pažnja', en: 'Care' }, tekst: { sr: 'Svaki auto peremo kao da je naš.', en: 'We wash every car as if it were ours.' } },
            { naslov: { sr: 'Preciznost', en: 'Precision' }, tekst: { sr: 'Felne, pragovi, šarke — detalji koje drugi preskoče.', en: 'Wheels, sills, hinges — the details others skip.' } },
            { naslov: { sr: 'Iskrenost', en: 'Honesty' }, tekst: { sr: 'Preporučujemo samo ono što vozilu stvarno treba.', en: 'We only recommend what the car really needs.' } },
        ],
    },

    recenzije: {
        prosek: 4.9,
        broj: 312,
        izvor: 'Google',
        lista: [
            { autor: 'Demo recenzija', ocena: 5, tekst: { sr: 'Auto nikad nije bio ovako čist, a felne izgledaju kao nove. Termin tačno na vreme.', en: 'The car has never been this clean and the wheels look new. Right on time.' } },
            { autor: 'Demo recenzija', ocena: 5, tekst: { sr: 'Dubinsko pranje enterijera posle ljubimaca — ni traga od dlaka i mirisa.', en: 'Deep interior clean after the dog — not a hair or smell left.' } },
            { autor: 'Demo recenzija', ocena: 5, tekst: { sr: 'Konačno perionica koja ne ostavlja riseve. Zakazivanje online je super.', en: 'Finally a car wash that leaves no swirls. Online booking is great.' } },
        ],
    },

    brendovi: ['Koch-Chemie', 'Gyeon', 'Sonax', 'Meguiar’s', 'CarPro', 'Kärcher'],

    poklonVaucer: {
        tekst: {
            sr: 'Poklonite čist auto. Vaučer za bilo koju uslugu ili iznos, važi šest meseci.',
            en: 'Give the gift of a clean car. A voucher for any service or amount, valid for six months.',
        },
    },

    pitanja: [
        { pitanje: { sr: 'Koliko traje pranje?', en: 'How long does a wash take?' }, odgovor: { sr: 'Spoljno pranje 30–45 minuta, kompletno oko sat vremena, premium do dva i po sata — zavisi od veličine vozila. Tačno trajanje vidite pri zakazivanju.', en: 'An exterior wash takes 30–45 minutes, a full wash about an hour and a premium wash up to two and a half hours, depending on the vehicle. You see the exact time when booking.' } },
        { pitanje: { sr: 'Da li mogu da sačekam auto?', en: 'Can I wait for my car?' }, odgovor: { sr: 'Naravno — imamo čekaonicu sa kafom i Wi-Fi-jem. Za duže usluge javljamo vam porukom kad je vozilo gotovo.', en: 'Of course — we have a waiting area with coffee and Wi-Fi. For longer services we message you when the car is ready.' } },
        { pitanje: { sr: 'Zašto cena zavisi od vozila?', en: 'Why does the price depend on the vehicle?' }, odgovor: { sr: 'Veće vozilo znači više površine, više sredstava i više vremena. Zato su cene podeljene u četiri grupe vozila.', en: 'A bigger vehicle means more surface, more product and more time, so prices are split into four vehicle groups.' } },
        { pitanje: { sr: 'Da li perete i zimi?', en: 'Do you wash in winter?' }, odgovor: { sr: 'Da. Zimi je pranje i najvažnije — so i rizla brzo oštećuju lak i donji deo vozila. Perionica je zatvorena i grejana.', en: 'Yes. Winter is when washing matters most — salt and grit damage paint and the underbody quickly. The wash bay is indoors and heated.' } },
        { pitanje: { sr: 'Šta ako moram da otkažem?', en: 'What if I need to cancel?' }, odgovor: { sr: 'Otkazivanje je besplatno do 2 sata pre termina — dovoljno je da nam se javite pozivom ili porukom.', en: 'Cancelling is free up to 2 hours before your slot — just call or message us.' } },
        { pitanje: { sr: 'Da li radite sa firmama?', en: 'Do you work with companies?' }, odgovor: { sr: 'Da, imamo posebne uslove za flote i redovno pranje službenih vozila, uz mesečni račun. Pišite nam za ponudu.', en: 'Yes, we have special terms for fleets and regular company-car washes, with a monthly invoice. Write to us for a quote.' } },
    ],

    placanje: ['Gotovina', 'Visa', 'Mastercard', 'Dina', 'Račun za firme'],

    zakazivanje: {
        korakMinuta: 15,
        najranijeSati: 1,
        otkazivanjeSati: 2,
        maksUsluga: 3,
        poljaVozila: { model: 'opciono', tablice: 'ne' },
    },
};
