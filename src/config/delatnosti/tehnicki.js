/*
 * PREDLOŽAK: TEHNIČKI PREGLED I REGISTRACIJA VOZILA
 *
 * Cena tehničkog pregleda zavisi od kategorije vozila, pa su kategorije ovde
 * vrste vozila, a izbor vozila u zakazivanju se ne prikazuje. Cene su okvirne
 * (2026), samo za demo — takse i osiguranje se ne prikazuju kao fiksni iznos.
 */
export default {
    naziv: 'Tehnički pregled Tačka',
    kratkiNaziv: 'Tačka',
    slogan: { sr: 'Tehnički pregled i registracija vozila', en: 'Vehicle inspection & registration' },
    opis: {
        sr: 'Tehnički pregled i registracija vozila na jednom mestu: putnička, teretna vozila, motocikli i atest za plin. Zakažite termin online, bez čekanja u redu.',
        en: 'Vehicle inspection and registration in one place: cars, vans, motorcycles and LPG certification. Book online and skip the queue.',
    },

    izborVozila: { opcije: [] },

    kategorije: [
        {
            id: 'putnicka-vozila',
            naziv: { sr: 'Putnička vozila', en: 'Passenger cars' },
            kratko: { sr: 'Redovni tehnički pregled za automobile, uključujući hibride i električna vozila.', en: 'Regular inspection for cars, including hybrids and EVs.' },
            opis: [
                { sr: 'Pregled obuhvata kočnice, trap, svetla, izduvne gasove, pneumatike i opremu vozila, na savremenoj liniji za tehnički pregled. Prosečno traje oko pola sata.', en: 'The inspection covers brakes, suspension, lights, emissions, tyres and equipment, on a modern test line. It takes about half an hour on average.' },
                { sr: 'Ako je vozilo ispravno, registraciju možete završiti odmah, na istom mestu — bez odlaska u MUP.', en: 'If the vehicle passes, you can complete the registration on the spot — no trip to the police station.' },
            ],
            slika: '/slike/tehnicki.webp',
            ukljuceno: [
                { sr: 'Provera kočnica na valjcima', en: 'Roller brake test' },
                { sr: 'Pregled trapa i upravljača', en: 'Suspension and steering check' },
                { sr: 'Merenje izduvnih gasova', en: 'Emissions test' },
                { sr: 'Svetla, signalizacija i stakla', en: 'Lights, signals and glass' },
                { sr: 'Pneumatici i obavezna oprema', en: 'Tyres and mandatory equipment' },
            ],
            koraci: [
                { naslov: { sr: 'Dolazak', en: 'Arrival' }, tekst: { sr: 'Dođite u zakazano vreme sa saobraćajnom dozvolom i ličnom kartom.', en: 'Arrive at your time with the registration certificate and ID.' } },
                { naslov: { sr: 'Pregled', en: 'Inspection' }, tekst: { sr: 'Vozilo prolazi kroz liniju, a vi čekate u čekaonici.', en: 'The car goes through the line while you wait in the lounge.' } },
                { naslov: { sr: 'Zapisnik', en: 'Report' }, tekst: { sr: 'Dobijate zapisnik i objašnjenje ako nešto treba popraviti.', en: 'You get a report and an explanation if anything needs fixing.' } },
                { naslov: { sr: 'Registracija', en: 'Registration' }, tekst: { sr: 'Po želji, registraciju i polisu završavamo odmah.', en: 'If you like, we complete the registration and policy right away.' } },
            ],
            usluge: [
                { id: 'tp-putnicko', naziv: { sr: 'Tehnički pregled — putničko vozilo', en: 'Inspection — passenger car' }, opis: { sr: 'Benzin, dizel, hibrid i električna vozila.', en: 'Petrol, diesel, hybrid and electric.' }, trajanje: 30, cena: 3400 },
                { id: 'tp-plin', naziv: { sr: 'Tehnički pregled sa atestom za plin', en: 'Inspection with LPG/CNG certificate' }, opis: { sr: 'Pregled i godišnji atest TNG/KPG instalacije.', en: 'Inspection plus the annual LPG/CNG certificate.' }, trajanje: 45, cena: 5600 },
            ],
        },
        {
            id: 'motocikli',
            naziv: { sr: 'Motocikli i mopedi', en: 'Motorcycles & mopeds' },
            kratko: { sr: 'Pregled motocikala, skutera, mopeda i kvadova.', en: 'Inspection for motorcycles, scooters, mopeds and quads.' },
            slika: '/slike/motor-bicikl.webp',
            usluge: [
                { id: 'tp-motocikl', naziv: { sr: 'Tehnički pregled — motocikl', en: 'Inspection — motorcycle' }, opis: { sr: 'Motocikli i kvadovi.', en: 'Motorcycles and quads.' }, trajanje: 20, cena: 2600 },
                { id: 'tp-moped', naziv: { sr: 'Tehnički pregled — moped i skuter', en: 'Inspection — moped & scooter' }, opis: { sr: 'Do 50 cm³.', en: 'Up to 50 cc.' }, trajanje: 20, cena: 2000 },
            ],
        },
        {
            id: 'teretna-vozila',
            naziv: { sr: 'Teretna i priključna vozila', en: 'Vans & trailers' },
            kratko: { sr: 'Laka teretna vozila do 3,5 t, kombiji i prikolice.', en: 'Light commercial vehicles up to 3.5 t, vans and trailers.' },
            slika: '/slike/kombi.webp',
            usluge: [
                { id: 'tp-teretno', naziv: { sr: 'Tehnički pregled — teretno do 3,5 t', en: 'Inspection — van up to 3.5 t' }, opis: { sr: 'Kombiji i laka teretna vozila.', en: 'Vans and light commercials.' }, trajanje: 40, cena: 4300 },
                { id: 'tp-prikolica', naziv: { sr: 'Tehnički pregled — prikolica', en: 'Inspection — trailer' }, opis: { sr: 'Laka priključna vozila.', en: 'Light trailers.' }, trajanje: 20, cena: 2300 },
            ],
        },
        {
            id: 'registracija',
            naziv: { sr: 'Registracija i dokumenta', en: 'Registration & paperwork' },
            kratko: { sr: 'Registracija, osiguranje i prenos vlasništva — sve na jednom šalteru.', en: 'Registration, insurance and change of ownership — all at one desk.' },
            opis: [
                { sr: 'Uz tehnički pregled završavamo registraciju, polisu obaveznog osiguranja i plaćanje taksi. Iznos taksi i premije zavisi od vozila i propisa, pa ga dobijate pre plaćanja.', en: 'Along with the inspection we handle the registration, compulsory insurance and fees. Fees and premiums depend on the vehicle and regulations, so you see the total before paying.' },
            ],
            slika: '/slike/kljucevi.webp',
            usluge: [
                { id: 'registracija-vozila', naziv: { sr: 'Registracija vozila', en: 'Vehicle registration' }, opis: { sr: 'Usluga agencije; takse i osiguranje po važećem cenovniku.', en: 'Agency fee; fees and insurance per current tariff.' }, trajanje: 20, cena: 1500 },
                { id: 'prenos-vlasnistva', naziv: { sr: 'Prenos vlasništva', en: 'Change of ownership' }, opis: { sr: 'Priprema dokumentacije i predaja zahteva.', en: 'Paperwork preparation and submission.' }, trajanje: 30, cena: 3000, cenaOd: true },
                { id: 'vanredni-pregled', naziv: { sr: 'Vanredni tehnički pregled', en: 'Extraordinary inspection' }, opis: { sr: 'Posle saobraćajne nezgode ili preinake vozila.', en: 'After an accident or vehicle modification.' }, trajanje: 45, cena: 4000 },
                { id: 'preventivni-pregled', naziv: { sr: 'Preventivni pregled', en: 'Preventive check' }, opis: { sr: 'Pred put ili kupovinu polovnog vozila — sa zapisnikom.', en: 'Before a trip or buying a used car — with a written report.' }, trajanje: 30, cena: 2500 },
            ],
        },
    ],

    galerija: [
        { slika: '/slike/tehnicki.webp', kategorija: 'putnicka-vozila', opis: { sr: 'Linija za tehnički pregled', en: 'Inspection line' } },
        { slika: '/slike/lift.webp', kategorija: 'putnicka-vozila', opis: { sr: 'Pregled donjeg postroja', en: 'Underbody check' } },
        { slika: '/slike/dijagnostika.webp', kategorija: '', opis: { sr: 'Dijagnostika', en: 'Diagnostics' } },
        { slika: '/slike/kljucevi.webp', kategorija: 'registracija', opis: { sr: 'Registracija na licu mesta', en: 'On-site registration' } },
        { slika: '/slike/motor-bicikl.webp', kategorija: 'motocikli', opis: { sr: 'Motocikli', en: 'Motorcycles' } },
        { slika: '/slike/kombi.webp', kategorija: 'teretna-vozila', opis: { sr: 'Teretna vozila', en: 'Vans' } },
        { slika: '/slike/radionica.webp', kategorija: '', opis: { sr: 'Naša stanica', en: 'Our station' } },
        { slika: '/slike/gume-stalak.webp', kategorija: 'putnicka-vozila', opis: { sr: 'Provera pneumatika', en: 'Tyre check' } },
        { slika: '/slike/sjaj.webp', kategorija: '', opis: { sr: 'Spremno za put', en: 'Road-ready' } },
    ],

    pocetna: {
        hero: {
            nadnaslov: { sr: 'Tehnički pregled · registracija · osiguranje', en: 'Inspection · registration · insurance' },
            naslov: { sr: 'Tehnički pregled', en: 'Vehicle inspection' },
            akcenat: { sr: 'bez čekanja u redu', en: 'without the queue' },
            uvod: {
                sr: 'Zakažite tačno vreme, dođite i za pola sata završite pregled i registraciju na istom mestu.',
                en: 'Book an exact time, come in, and finish the inspection and registration in half an hour, in one place.',
            },
            slike: ['/slike/tehnicki.webp', '/slike/lift.webp', '/slike/radionica.webp'],
        },
        izjava: {
            sr: 'Tehnički pregled ne mora da bude pola dana u redu. Zakazano vreme je vaše vreme — i poštujemo ga.',
            en: 'An inspection does not have to mean half a day in a queue. Your booked time is your time — and we respect it.',
        },
        brojevi: [
            { vrednost: 'godine', oznaka: { sr: 'godina rada', en: 'years in business' } },
            { vrednost: '30 min', oznaka: { sr: 'prosečno trajanje pregleda', en: 'average inspection time' } },
            { vrednost: '40.000+', oznaka: { sr: 'pregledanih vozila', en: 'vehicles inspected' } },
        ],
        zastoMi: [
            { naslov: { sr: 'Termin na minut', en: 'A slot to the minute' }, tekst: { sr: 'Online zakazivanje znači da ne čekate u redu iza drugih vozila.', en: 'Online booking means you do not wait behind other cars.' } },
            { naslov: { sr: 'Sve na jednom mestu', en: 'Everything in one place' }, tekst: { sr: 'Pregled, registracija, osiguranje i takse — jedan šalter.', en: 'Inspection, registration, insurance and fees — one desk.' } },
            { naslov: { sr: 'Jasan zapisnik', en: 'A clear report' }, tekst: { sr: 'Ako nešto ne valja, objasnimo šta i zašto, bez nagađanja.', en: 'If something is wrong, we explain what and why — no guesswork.' } },
        ],
        proces: [
            { naslov: { sr: 'Zakažite online', en: 'Book online' }, tekst: { sr: 'Izaberite vrstu pregleda i slobodan termin.', en: 'Pick the inspection type and a free slot.' } },
            { naslov: { sr: 'Ponesite dokumenta', en: 'Bring your documents' }, tekst: { sr: 'Saobraćajnu dozvolu, ličnu kartu i polisu (ako je imate).', en: 'Registration certificate, ID and policy (if you have it).' } },
            { naslov: { sr: 'Vozite dalje', en: 'Drive on' }, tekst: { sr: 'Za pola sata ste gotovi, sa novom nalepnicom.', en: 'Half an hour later you are done, with a new sticker.' } },
        ],
        poziv: {
            naslov: { sr: 'Ističe vam registracija?', en: 'Registration due?' },
            tekst: { sr: 'Zakažite pregled za par klikova — potvrdu dobijate porukom.', en: 'Book an inspection in a few clicks — we confirm by message.' },
            slika: '/slike/lift.webp',
        },
    },

    oNama: {
        naslov: { sr: 'Stanica tehničkog pregleda kojoj se veruje', en: 'An inspection station you can trust' },
        tekst: [
            { sr: 'Radimo tehničke preglede i registraciju vozila više od decenije, sa ovlašćenjem nadležnog ministarstva i opremom koja se redovno etalonira.', en: 'We have carried out inspections and registrations for over a decade, licensed by the ministry, with regularly calibrated equipment.' },
            { sr: 'Naš cilj je jednostavan: da pregled bude brz, tačan i pošten — da znate šta je provereno i zašto, i da ne gubite vreme u redu.', en: 'Our aim is simple: a quick, accurate and fair inspection — you know what was checked and why, and you do not lose time in a queue.' },
        ],
        slika: '/slike/radionica.webp',
        vrednosti: [
            { naslov: { sr: 'Tačnost', en: 'Accuracy' }, tekst: { sr: 'Etalonirana oprema i licencirani kontrolori.', en: 'Calibrated equipment and licensed inspectors.' } },
            { naslov: { sr: 'Brzina', en: 'Speed' }, tekst: { sr: 'Zakazan termin, pregled za oko pola sata.', en: 'A booked slot, done in about half an hour.' } },
            { naslov: { sr: 'Poštenje', en: 'Fairness' }, tekst: { sr: 'Isti kriterijumi za svako vozilo.', en: 'The same standard for every vehicle.' } },
        ],
    },

    recenzije: {
        prosek: 4.8,
        broj: 527,
        izvor: 'Google',
        lista: [
            { autor: 'Demo recenzija', ocena: 5, tekst: { sr: 'Zakazao sam online, stigao u 9 i u 9:35 izašao sa registracijom.', en: 'Booked online, arrived at 9, left at 9:35 with the registration done.' } },
            { autor: 'Demo recenzija', ocena: 5, tekst: { sr: 'Ljubazni i jasni — objasnili su mi šta treba popraviti pre sledećeg pregleda.', en: 'Friendly and clear — they explained what to fix before next time.' } },
            { autor: 'Demo recenzija', ocena: 5, tekst: { sr: 'Bez gužve i bez čekanja. Registracija i polisa na istom šalteru.', en: 'No crowd, no wait. Registration and insurance at one desk.' } },
        ],
    },

    brendovi: [],

    poklonVaucer: { tekst: '' },

    pitanja: [
        { pitanje: { sr: 'Šta treba da ponesem?', en: 'What should I bring?' }, odgovor: { sr: 'Saobraćajnu dozvolu, ličnu kartu (ili ovlašćenje ako vozilo nije vaše) i polisu osiguranja ako je već imate. Za vozila na plin i važeći atest.', en: 'The registration certificate, ID (or an authorisation if the car is not yours) and the insurance policy if you have it. For LPG cars, the valid certificate.' } },
        { pitanje: { sr: 'Koliko ranije mogu da uradim tehnički pregled?', en: 'How early can I do the inspection?' }, odgovor: { sr: 'Tehnički pregled važi 30 dana, pa ga možete uraditi do mesec dana pre isteka registracije.', en: 'An inspection is valid for 30 days, so you can do it up to a month before your registration expires.' } },
        { pitanje: { sr: 'Šta ako vozilo ne prođe pregled?', en: 'What if the car fails?' }, odgovor: { sr: 'Dobijate zapisnik sa nedostacima. Kada ih otklonite, ponovni pregled radimo pod povoljnijim uslovima u roku od 15 dana.', en: 'You get a report listing the defects. Once fixed, the re-test is discounted within 15 days.' } },
        { pitanje: { sr: 'Koliko košta registracija ukupno?', en: 'How much is registration in total?' }, odgovor: { sr: 'Zavisi od vozila: zapremine motora, starosti i polise osiguranja. Tačan iznos taksi i premije dobijate pre plaćanja.', en: 'It depends on the vehicle: engine size, age and insurance policy. You see the exact fees and premium before paying.' } },
        { pitanje: { sr: 'Mogu li da platim karticom?', en: 'Can I pay by card?' }, odgovor: { sr: 'Da — gotovinom ili karticom, a takse i osiguranje mogu i na rate, kod banaka sa kojima sarađujemo.', en: 'Yes — cash or card, and fees and insurance can be paid in instalments with partner banks.' } },
        { pitanje: { sr: 'Da li moram da zakažem?', en: 'Do I have to book?' }, odgovor: { sr: 'Ne morate, ali zakazani termin ima prednost — bez čekanja.', en: 'No, but booked slots go first — no waiting.' } },
    ],

    placanje: ['Gotovina', 'Visa', 'Mastercard', 'Dina', 'Plaćanje na rate'],

    zakazivanje: {
        korakMinuta: 20,
        najranijeSati: 1,
        danaUnapred: 30,
        otkazivanjeSati: 2,
        maksUsluga: 2,
        poljaVozila: { model: 'opciono', tablice: 'obavezno' },
    },
};
