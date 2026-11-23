/*
 * PREDLOŽAK: DETAILING STUDIO (korekcija laka, keramika, PPF folija, enterijer)
 *
 * Duge usluge imaju `dana` — vozilo ostaje u studiju, a termin je prijem
 * vozila. Cene su okvirne (Beograd, 2026), samo za demo.
 */
export default {
    naziv: 'Atelje Lak',
    kratkiNaziv: 'Lak',
    slogan: { sr: 'Detailing studio', en: 'Detailing studio' },
    opis: {
        sr: 'Detailing studio: korekcija laka, keramička zaštita, PPF folija i detailing enterijera. Rad po dogovoru, samo uz termin.',
        en: 'Detailing studio: paint correction, ceramic coatings, PPF and interior detailing. By appointment only.',
    },

    izborVozila: {
        naslov: { sr: 'Koje vozilo dovozite?', en: 'Which vehicle are you bringing?' },
        oznaka: { sr: 'Vozilo', en: 'Vehicle' },
        opcije: [
            { id: 'mali', naziv: { sr: 'Malo i kompaktno', en: 'Small & compact' }, opis: { sr: 'Mini, Polo, Golf, Serija 1…', en: 'Mini, Polo, Golf, 1 Series…' } },
            { id: 'srednji', naziv: { sr: 'Limuzina, karavan, kupe', en: 'Saloon, estate, coupé' }, opis: { sr: 'Serija 3–5, A4–A6, C i E klasa…', en: '3–5 Series, A4–A6, C and E Class…' } },
            { id: 'veliki', naziv: { sr: 'SUV, džip, kombi', en: 'SUV, 4×4, van' }, opis: { sr: 'X5, Q7, GLE, Cayenne, V klasa…', en: 'X5, Q7, GLE, Cayenne, V Class…' } },
        ],
    },

    kategorije: [
        {
            id: 'korekcija-laka',
            naziv: { sr: 'Korekcija laka', en: 'Paint correction' },
            kratko: { sr: 'Mašinsko poliranje koje uklanja riseve, hologram i oksidaciju.', en: 'Machine polishing that removes swirls, holograms and oxidation.' },
            opis: [
                { sr: 'Pre poliranja lak dekontaminiramo — glinom i hemijski uklanjamo čestice gvožđa i katrana. Debljinu laka merimo na svakom panelu, pa znamo koliko smemo da skinemo.', en: 'Before polishing we decontaminate the paint — clay and chemical removal of iron fallout and tar. Paint thickness is measured on every panel, so we know exactly how much we can take off.' },
                { sr: 'Broj faza biramo zajedno, pod svetlom koje otkriva svaki ris: od osvežavanja sjaja do korekcije za izložbu.', en: 'We choose the number of stages together, under lighting that reveals every swirl: from a gloss enhancement to a show-car correction.' },
            ],
            slika: '/slike/poliranje.webp',
            ukljuceno: [
                { sr: 'Pranje i hemijska dekontaminacija', en: 'Wash and chemical decontamination' },
                { sr: 'Glinovanje laka', en: 'Clay bar treatment' },
                { sr: 'Merenje debljine laka', en: 'Paint depth measurement' },
                { sr: 'Mašinsko poliranje u izabranom broju faza', en: 'Machine polishing in the chosen number of stages' },
                { sr: 'Zaštita voskom ili silerom', en: 'Wax or sealant protection' },
            ],
            koraci: [
                { naslov: { sr: 'Procena', en: 'Assessment' }, tekst: { sr: 'Pod svetlom pregledamo lak i merimo debljinu.', en: 'We inspect the paint under lights and measure its depth.' } },
                { naslov: { sr: 'Priprema', en: 'Preparation' }, tekst: { sr: 'Pranje, dekontaminacija i glinovanje.', en: 'Wash, decontamination and clay.' } },
                { naslov: { sr: 'Korekcija', en: 'Correction' }, tekst: { sr: 'Poliranje panel po panel, uz proveru posle svake faze.', en: 'Panel-by-panel polishing, checked after every stage.' } },
                { naslov: { sr: 'Zaštita', en: 'Protection' }, tekst: { sr: 'Završni sloj koji čuva rezultat.', en: 'A final layer that preserves the result.' } },
            ],
            pitanja: [
                { pitanje: { sr: 'Da li poliranje tanji lak?', en: 'Does polishing thin the paint?' }, odgovor: { sr: 'Da, minimalno — zato merimo debljinu i skidamo samo onoliko koliko je potrebno, obično nekoliko mikrona.', en: 'Yes, minimally — that is why we measure and remove only what is needed, usually a few microns.' } },
            ],
            usluge: [
                { id: 'osvezavanje-sjaja', naziv: { sr: 'Osvežavanje sjaja (1 faza)', en: 'Gloss enhancement (1 stage)' }, opis: { sr: 'Uklanja 50–70% sitnih riseva i vraća dubinu boje.', en: 'Removes 50–70% of light swirls and restores colour depth.' }, trajanje: 480, cena: { mali: 18000, srednji: 22000, veliki: 26000 }, dana: 1 },
                { id: 'dvofazna-korekcija', naziv: { sr: 'Dvofazna korekcija', en: 'Two-stage correction' }, opis: { sr: 'Uklanja 80–90% riseva i hologram, za lak kao nov.', en: 'Removes 80–90% of swirls and holograms, for paint like new.' }, trajanje: 960, cena: { mali: 35000, srednji: 42000, veliki: 50000 }, dana: 2 },
                { id: 'visefazna-korekcija', naziv: { sr: 'Višefazna korekcija', en: 'Multi-stage correction' }, opis: { sr: 'Za izložbe i kolekcionarska vozila — maksimum koji lak dozvoljava.', en: 'For shows and collector cars — the most the paint allows.' }, trajanje: 1440, cena: { mali: 55000, srednji: 65000, veliki: 75000 }, cenaOd: true, dana: 3 },
            ],
        },
        {
            id: 'keramicka-zastita',
            naziv: { sr: 'Keramička zaštita', en: 'Ceramic coating' },
            kratko: { sr: 'Tvrd, sjajan i hidrofoban sloj koji traje godinama.', en: 'A hard, glossy, hydrophobic layer that lasts for years.' },
            opis: [
                { sr: 'Keramika se vezuje za lak i stvara sloj tvrđi od fabričkog laka. Štiti od UV zraka, ptičjeg izmeta, soli i hemije, a auto se pere brže i ređe.', en: 'A ceramic coating bonds to the paint and forms a layer harder than the factory clear coat. It protects against UV, bird droppings, salt and chemicals, and the car washes faster and less often.' },
                { sr: 'Svaki paket uključuje korekciju laka — keramika „zaključava” stanje laka ispod sebe, pa ga pre nanošenja dovodimo do najboljeg.', en: 'Every package includes paint correction — a coating locks in whatever is underneath, so we perfect the paint first.' },
            ],
            slika: '/slike/keramika.webp',
            ukljuceno: [
                { sr: 'Kompletna priprema i korekcija laka', en: 'Full preparation and paint correction' },
                { sr: 'Keramika na lak, felne i plastiku', en: 'Coating on paint, wheels and trim' },
                { sr: 'Sušenje pod infracrvenim lampama', en: 'Curing under infrared lamps' },
                { sr: 'Sertifikat i plan održavanja', en: 'Certificate and care plan' },
            ],
            usluge: [
                { id: 'keramika-1', naziv: { sr: 'Keramika — 1 godina', en: 'Ceramic — 1 year' }, opis: { sr: 'Ulazni paket, uz osvežavanje sjaja.', en: 'Entry package, with a gloss enhancement.' }, trajanje: 600, cena: { mali: 28000, srednji: 33000, veliki: 38000 }, dana: 1 },
                { id: 'keramika-3', naziv: { sr: 'Keramika — 3 godine', en: 'Ceramic — 3 years' }, opis: { sr: 'Dvofazna korekcija i dva sloja keramike.', en: 'Two-stage correction and two coating layers.' }, trajanje: 1200, cena: { mali: 48000, srednji: 56000, veliki: 64000 }, dana: 2 },
                { id: 'keramika-5', naziv: { sr: 'Keramika — 5 godina', en: 'Ceramic — 5 years' }, opis: { sr: 'Višefazna korekcija, tri sloja i keramika na stakla.', en: 'Multi-stage correction, three layers and coated glass.' }, trajanje: 1800, cena: { mali: 68000, srednji: 78000, veliki: 88000 }, dana: 3 },
            ],
        },
        {
            id: 'ppf-folija',
            naziv: { sr: 'PPF zaštitna folija', en: 'Paint protection film' },
            kratko: { sr: 'Providna folija koja prima udarce kamenčića umesto laka.', en: 'A clear film that takes stone chips instead of your paint.' },
            opis: [
                { sr: 'PPF je providna poliuretanska folija debljine oko 200 mikrona. Sitna oštećenja se sama „zaleče” na toploti, a folija se može skinuti bez traga i posle više godina.', en: 'PPF is a clear polyurethane film about 200 microns thick. Light marks self-heal with heat, and the film can be removed without a trace years later.' },
            ],
            slika: '/slike/folija.webp',
            usluge: [
                { id: 'ppf-prednji', naziv: { sr: 'Prednji paket', en: 'Front package' }, opis: { sr: 'Branik, hauba, blatobrani, farovi i retrovizori.', en: 'Bumper, bonnet, wings, headlights and mirrors.' }, trajanje: 960, cena: { mali: 95000, srednji: 110000, veliki: 130000 }, cenaOd: true, dana: 2 },
                { id: 'ppf-kompletno', naziv: { sr: 'Kompletno vozilo', en: 'Full vehicle' }, opis: { sr: 'Sve lakirane površine, sjajna ili mat folija.', en: 'Every painted panel, gloss or matte film.' }, trajanje: 2400, cena: { mali: 290000, srednji: 330000, veliki: 390000 }, cenaOd: true, dana: 5 },
            ],
        },
        {
            id: 'detailing-enterijera',
            naziv: { sr: 'Detailing enterijera', en: 'Interior detailing' },
            kratko: { sr: 'Koža, alkantara i tekstil — čisto, hidrirano i zaštićeno.', en: 'Leather, Alcantara and fabric — clean, conditioned and protected.' },
            slika: '/slike/koza.webp',
            usluge: [
                { id: 'enterijer-kompletno', naziv: { sr: 'Kompletan detailing enterijera', en: 'Full interior detail' }, opis: { sr: 'Dubinsko čišćenje svih površina, para, ekstrakcija i zaštita.', en: 'Deep clean of every surface, steam, extraction and protection.' }, trajanje: 360, cena: { mali: 12000, srednji: 14000, veliki: 17000 } },
                { id: 'koza-nega', naziv: { sr: 'Čišćenje i hidratacija kože', en: 'Leather clean & condition' }, opis: { sr: 'Sedišta, volan i obloge — prirodan mat izgled.', en: 'Seats, wheel and trims — a natural matte finish.' }, trajanje: 180, cena: { mali: 8000, srednji: 9000, veliki: 11000 } },
                { id: 'enterijer-keramika', naziv: { sr: 'Keramička zaštita enterijera', en: 'Interior ceramic protection' }, opis: { sr: 'Koža i tekstil otporni na fleke i habanje.', en: 'Leather and fabric that resist stains and wear.' }, trajanje: 120, cena: 9000, cenaOd: true },
            ],
        },
        {
            id: 'felne-stakla-farovi',
            naziv: { sr: 'Felne, stakla i farovi', en: 'Wheels, glass & lights' },
            kratko: { sr: 'Detalji koji završavaju utisak.', en: 'The details that finish the look.' },
            slika: '/slike/felna.webp',
            usluge: [
                { id: 'restauracija-farova', naziv: { sr: 'Restauracija farova', en: 'Headlight restoration' }, opis: { sr: 'Brušenje, poliranje i UV keramika.', en: 'Sanding, polishing and UV ceramic.' }, trajanje: 120, cena: 6000 },
                { id: 'keramika-felni', naziv: { sr: 'Keramika felni (skinute)', en: 'Wheel coating (wheels off)' }, opis: { sr: 'Felne skidamo, čistimo iznutra i spolja i štitimo keramikom.', en: 'Wheels off, cleaned inside and out, then coated.' }, trajanje: 240, cena: 14000 },
                { id: 'keramika-stakala', naziv: { sr: 'Keramika stakala', en: 'Glass coating' }, opis: { sr: 'Sva stakla — vidljivost po kiši bez brisača.', en: 'All glass — visibility in rain without wipers.' }, trajanje: 90, cena: 5000 },
            ],
        },
    ],

    galerija: [
        { slika: '/slike/poliranje.webp', kategorija: 'korekcija-laka', opis: { sr: 'Korekcija laka pod svetlom', en: 'Paint correction under lights' } },
        { slika: '/slike/sjaj.webp', kategorija: 'keramicka-zastita', opis: { sr: 'Dubina boje posle keramike', en: 'Colour depth after coating' } },
        { slika: '/slike/kapi.webp', kategorija: 'keramicka-zastita', opis: { sr: 'Hidrofobni efekat', en: 'Hydrophobic effect' } },
        { slika: '/slike/studio.webp', kategorija: '', opis: { sr: 'Studio', en: 'The studio' } },
        { slika: '/slike/koza.webp', kategorija: 'detailing-enterijera', opis: { sr: 'Koža posle hidratacije', en: 'Leather after conditioning' } },
        { slika: '/slike/folija.webp', kategorija: 'ppf-folija', opis: { sr: 'Postavljanje PPF folije', en: 'Fitting paint protection film' } },
        { slika: '/slike/felna.webp', kategorija: 'felne-stakla-farovi', opis: { sr: 'Keramika felni', en: 'Coated wheels' } },
        { slika: '/slike/farovi.webp', kategorija: 'felne-stakla-farovi', opis: { sr: 'Restauracija farova', en: 'Restored headlights' } },
        { slika: '/slike/tabla.webp', kategorija: 'detailing-enterijera', opis: { sr: 'Detaljno čišćenje table', en: 'Detailed dashboard' } },
    ],

    pocetna: {
        hero: {
            nadnaslov: { sr: 'Detailing studio · samo uz termin', en: 'Detailing studio · by appointment' },
            naslov: { sr: 'Preciznost koja se', en: 'Precision you can' },
            akcenat: { sr: 'vidi pod svetlom', en: 'see under the lights' },
            uvod: {
                sr: 'Korekcija laka, keramika i PPF folija za vlasnike kojima je stalo do detalja. Jedno vozilo u isto vreme, bez žurbe.',
                en: 'Paint correction, ceramic coatings and PPF for owners who care about detail. One car at a time, never rushed.',
            },
            slike: ['/slike/studio.webp', '/slike/poliranje.webp', '/slike/sjaj.webp'],
        },
        izjava: {
            sr: 'Ne prodajemo pranje. Prodajemo mir — znanje da je lak vašeg vozila zaštićen, i da će tako i ostati.',
            en: 'We do not sell washes. We sell peace of mind — knowing your paint is protected, and will stay that way.',
        },
        brojevi: [
            { vrednost: 'godine', oznaka: { sr: 'godina u detailingu', en: 'years in detailing' } },
            { vrednost: '1.800+', oznaka: { sr: 'zaštićenih vozila', en: 'cars protected' } },
            { vrednost: '5', oznaka: { sr: 'godina garancije na keramiku', en: 'year coating warranty' } },
        ],
        zastoMi: [
            { naslov: { sr: 'Jedno vozilo u isto vreme', en: 'One car at a time' }, tekst: { sr: 'Vaš auto ima studio i tim samo za sebe, od prijema do predaje.', en: 'Your car has the studio and the team to itself, from drop-off to collection.' } },
            { naslov: { sr: 'Merimo, ne pogađamo', en: 'We measure, not guess' }, tekst: { sr: 'Debljina laka, svetlo za inspekciju i dokumentovan rezultat — pre i posle.', en: 'Paint depth, inspection lighting and documented results — before and after.' } },
            { naslov: { sr: 'Sertifikovani proizvodi', en: 'Certified products' }, tekst: { sr: 'Radimo sa proverenim profesionalnim linijama, uz pisanu garanciju.', en: 'We use proven professional lines, with a written warranty.' } },
        ],
        proces: [
            { naslov: { sr: 'Konsultacija', en: 'Consultation' }, tekst: { sr: 'Pregledamo vozilo i predložimo paket — bez obaveze.', en: 'We inspect the car and suggest a package — no obligation.' } },
            { naslov: { sr: 'Prijem vozila', en: 'Drop-off' }, tekst: { sr: 'Dovezete auto u dogovoreni termin; javljamo se sa fotografijama tokom rada.', en: 'Bring the car at the agreed time; we send photos as we work.' } },
            { naslov: { sr: 'Predaja', en: 'Handover' }, tekst: { sr: 'Prolazimo rezultat zajedno i dobijate plan održavanja.', en: 'We walk you through the result and hand over a care plan.' } },
        ],
        poziv: {
            naslov: { sr: 'Zakažite konsultaciju', en: 'Book a consultation' },
            tekst: { sr: 'Izaberite uslugu i termin prijema — javljamo se sa potvrdom.', en: 'Choose a service and drop-off time — we will confirm.' },
            slika: '/slike/sjaj.webp',
        },
    },

    oNama: {
        naslov: { sr: 'Studio za one koji primećuju razliku', en: 'A studio for people who notice the difference' },
        tekst: [
            { sr: 'Atelje Lak je nastao iz jednostavne frustracije: previše „detailinga” koji je zapravo bio brzo pranje sa sjajnim imenom. Hteli smo mesto gde se radi polako, pod pravim svetlom, sa merenjem i dokumentacijom.', en: 'Atelje Lak was born from a simple frustration: too much “detailing” that was really a quick wash with a shiny name. We wanted a place that works slowly, under proper lighting, with measurements and documentation.' },
            { sr: 'U studiju je uvek jedno vozilo. Tako svaki auto dobija punu pažnju tima, a vi znate tačno ko radi na vašem vozilu i šta je urađeno.', en: 'There is only ever one car in the studio. Every car gets the team’s full attention, and you know exactly who worked on it and what was done.' },
        ],
        slika: '/slike/studio.webp',
        vrednosti: [
            { naslov: { sr: 'Strpljenje', en: 'Patience' }, tekst: { sr: 'Dobar rezultat traje koliko mora.', en: 'A good result takes as long as it takes.' } },
            { naslov: { sr: 'Transparentnost', en: 'Transparency' }, tekst: { sr: 'Fotografije i merenja pre i posle rada.', en: 'Photos and measurements before and after.' } },
            { naslov: { sr: 'Dugotrajnost', en: 'Longevity' }, tekst: { sr: 'Zaštita koja traje, uz plan održavanja.', en: 'Protection that lasts, with a care plan.' } },
        ],
    },

    recenzije: {
        prosek: 5.0,
        broj: 148,
        izvor: 'Google',
        lista: [
            { autor: 'Demo recenzija', ocena: 5, tekst: { sr: 'Posle dvofazne korekcije lak izgleda bolje nego kad sam auto kupio.', en: 'After the two-stage correction the paint looks better than when I bought the car.' } },
            { autor: 'Demo recenzija', ocena: 5, tekst: { sr: 'Fotografije tokom rada i iskren savet — dobio sam tačno ono što je dogovoreno.', en: 'Photos throughout and honest advice — I got exactly what we agreed.' } },
            { autor: 'Demo recenzija', ocena: 5, tekst: { sr: 'Keramika posle godinu dana i dalje odbija vodu kao prvog dana.', en: 'A year on, the coating still beads water like day one.' } },
        ],
    },

    brendovi: ['Gyeon', 'Gtechniq', 'CarPro', 'Rupes', 'Koch-Chemie', 'XPEL'],

    poklonVaucer: {
        tekst: {
            sr: 'Poklonite detailing. Vaučer za bilo koji paket ili iznos, važi godinu dana.',
            en: 'Give the gift of detailing. A voucher for any package or amount, valid for a year.',
        },
    },

    pitanja: [
        { pitanje: { sr: 'Koliko dugo vozilo ostaje kod vas?', en: 'How long will you keep the car?' }, odgovor: { sr: 'Od jednog dana za osvežavanje sjaja do pet dana za kompletnu PPF foliju. Pri zakazivanju birate termin prijema, a tačan dan predaje potvrđujemo porukom.', en: 'From one day for a gloss enhancement to five days for full PPF. You book a drop-off time and we confirm the handover day by message.' } },
        { pitanje: { sr: 'Šta je bolje — keramika ili folija?', en: 'Ceramic or PPF — which is better?' }, odgovor: { sr: 'Folija fizički štiti od kamenčića, keramika daje sjaj, hidrofobnost i hemijsku zaštitu. Najčešće preporučujemo foliju napred i keramiku na ostatku vozila.', en: 'Film physically stops stone chips; a coating adds gloss, water beading and chemical resistance. We most often recommend film on the front and a coating on the rest.' } },
        { pitanje: { sr: 'Da li dajete garanciju?', en: 'Do you offer a warranty?' }, odgovor: { sr: 'Da — pisanu garanciju na keramiku i foliju, uz uslov redovnog održavanja po planu koji dobijate.', en: 'Yes — a written warranty on coatings and film, provided the car is maintained to the care plan you receive.' } },
        { pitanje: { sr: 'Zašto su cene „od”?', en: 'Why are some prices “from”?' }, odgovor: { sr: 'Stanje laka i veličina vozila menjaju obim posla. Tačnu cenu dobijate posle besplatnog pregleda, pre početka rada.', en: 'Paint condition and vehicle size change the scope. You get the exact price after a free inspection, before we start.' } },
        { pitanje: { sr: 'Kako se održava keramika?', en: 'How do I look after a coating?' }, odgovor: { sr: 'Ručnim pranjem pH neutralnim šamponom, bez četki. Jednom godišnje preporučujemo kontrolni pregled i osvežavanje.', en: 'Hand wash with a pH-neutral shampoo, no brushes. We recommend a yearly check and top-up.' } },
        { pitanje: { sr: 'Mogu li da vidim vozilo tokom rada?', en: 'Can I see the car during the work?' }, odgovor: { sr: 'Naravno — šaljemo fotografije, a uz najavu možete i da svratite u studio.', en: 'Of course — we send photos, and you are welcome to visit the studio by arrangement.' } },
    ],

    placanje: ['Gotovina', 'Visa', 'Mastercard', 'Dina', 'Uplata na račun'],

    zakazivanje: {
        korakMinuta: 30,
        najranijeSati: 24,
        danaUnapred: 60,
        otkazivanjeSati: 48,
        maksUsluga: 3,
        prijemMinuta: 30,
        poljaVozila: { model: 'obavezno', tablice: 'ne' },
    },
};
