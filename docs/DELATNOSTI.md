# Delatnosti — predlošci sadržaja

Jedan template pokriva pet vrsta auto-posla. Svaka delatnost je jedan fajl u
`src/config/delatnosti/` i donosi kompletan, realan sadržaj: usluge sa cenama i
trajanjem, izbor vozila (kad cena zavisi od njega), tekstove početne i „O nama”,
galeriju, česta pitanja, brendove i podešavanja zakazivanja.

U `src/config/servis.js` se bira jednim redom:

```js
delatnost: 'vulkanizer',
```

Sve iz predloška može da se pregazi u `servis.js` istim imenom polja — najčešće
`kategorije` (pravi cenovnik), `pocetna.hero` (naslov) i `oNama`.

| Delatnost | Google tip (schema.org) | Izbor vozila | Posebno |
|---|---|---|---|
| `perionica` | `AutoWash` | 4 veličine vozila | spoljno / kompletno / premium pranje, enterijer, zaštita |
| `detailing` | `AutoBodyShop` | 3 veličine vozila | usluge od više dana (`dana`), termin = prijem vozila, obavezna marka i model |
| `tehnicki` | `AutomotiveBusiness` | — (kategorije su vrste vozila) | obavezne tablice, termini na 20 min, šifra delatnosti 7120 |
| `vulkanizer` | `TireShop` | 4 veličine felne | sezonska zamena, hotel za gume, geometrija |
| `servis` | `AutoRepair` | — (cene „od”) | ponuda pre rada, veliki servis traje dan |

## Kako izgleda usluga

```js
{
    id: 'kompletno',                              // jedinstven; ide u link zakazivanja (?usluga=kompletno)
    naziv: { sr: 'Kompletno pranje', en: 'Full wash' },
    opis: { sr: 'Spolja i iznutra…', en: '…' },
    trajanje: { mali: 60, srednji: 70, suv: 80 }, // minuti; ili samo broj: 60
    cena: { mali: 2200, srednji: 2500, suv: 2900 },// RSD; ili samo broj: 2500
    cenaOd: true,                                 // prikazuje „od …” (konačna cena posle pregleda)
    dana: 2,                                      // vozilo ostaje kod servisa — termin je samo prijem
}
```

Ključevi u `cena` i `trajanje` su id-jevi iz `izborVozila.opcije`
(`npm run provera` javlja ako se ne slažu). Dok posetilac ne izabere vozilo,
prikazuje se najniža cena kao „od …”. Izabrano vozilo se pamti tokom posete i
prenosi u cenovnik, stranice usluga i zakazivanje.

## Kako izgleda kategorija

Svaka kategorija dobija sopstvenu stranicu `/usluge/<id>` (en: `/services/<id>`)
sa SEO podacima (Service + Offer + FAQ + breadcrumb) — isto kao ServicePage u
Eclectic-u, samo generisano iz konfiguracije:

```js
{
    id: 'pranje',                                 // i adresa stranice: mala slova, cifre, crtice
    naziv: { sr: 'Pranje vozila', en: 'Car wash' },
    kratko: { sr: 'Jedna rečenica za kartice i Google.' },
    opis: [ { sr: 'Pasus…' }, { sr: 'Pasus…' } ], // opciono — „O usluzi”
    slika: '/slike/pranje-pena.webp',
    ukljuceno: [ { sr: 'Pretpranje aktivnom penom' }, … ],      // opciono — „Šta je uključeno”
    koraci: [ { naslov: { sr: 'Pregled' }, tekst: { sr: '…' } } ], // opciono — „Kako radimo”
    pitanja: [ { pitanje: { sr: '…' }, odgovor: { sr: '…' } } ],  // opciono — FAQ na stranici usluge
    usluge: [ … ],
}
```

Sekcija bez podataka se ne prikazuje.

## Nova delatnost

1. Kopiraj najsličniji predložak, npr. `perionica.js` → `limarija.js`.
2. Izmeni sadržaj.
3. Dodaj red u `src/config/delatnosti/index.js`:
   ```js
   limarija: { naziv: { sr: 'Limarija i farbanje', en: 'Body shop' }, opis: { … }, schema: 'AutoBodyShop', sifraDelatnosti: '4520', predlozak: limarija },
   ```
4. Ikonicu za birač dodaj u `IKONE` u `src/components/BiracTema.jsx` (lucide-react).

## Demo za klijenta

Birač (dok je `demo: true`) ima dve kartice — **Tema** i **Delatnost** — i dugme
„Kopiraj link za klijenta”, koje daje adresu sa `?tema=…&delatnost=…`. Vlasnik
vulkanizera dobija link na kojem vidi svoj posao u izgledu koji mu se dopada,
pre nego što se napiše ijedna linija njegovog sadržaja.

Pri pregledu druge delatnosti sadržaj (naziv, usluge, tekstovi) dolazi iz njenog
predloška, a kontakt, adresa, radno vreme i podaci firme ostaju iz `servis.js`.
