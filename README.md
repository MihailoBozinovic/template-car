# Template Car

Sajt za **perionice, detailing studije, tehnički pregled, vulkanizere i auto
servise** koji se za novog klijenta pravi **izborom delatnosti i teme i
popunjavanjem jednog fajla** (`src/config/servis.js`) — bez diranja koda.
Izlaz je statički sajt (`dist/`) koji radi na bilo kom hostingu.

Arhitektura je ista kao u **Template Frizeri** (jedan izvor podataka, teme koje
se biraju jednim klikom, vođeno zakazivanje, prerender za SEO, podaci firme po
zakonu), a logika auto-usluga je preneta iz **Eclectic** projekta: stranica za
svaku uslugu (kao `ServicePage`), cene po veličini vozila, obaveštenje na vrhu
sajta, cenovnik koji vodi pravo u zakazivanje, pravni podaci i PDV napomena iz
jednog mesta.

| | |
|---|---|
| Stack | React 18 · Vite 6 · Tailwind 3 · react-router 6 |
| Delatnosti | 5 gotovih predložaka sa realnim uslugama i cenama — [docs/DELATNOSTI.md](docs/DELATNOSTI.md) |
| Teme | 10 — po Topaz, Forge, AMMO NYC, Esoteric, Voiture, Wash Haus (izmereno), Marque, Autovera, Blackbridge (koncepti) i Eclectic — [docs/TEME.md](docs/TEME.md) |
| Jezici | srpski (`/`), engleski (`/en/…`), ruski (`/ru/…`, interfejs) — prevedene adrese, `hreflang` |
| Stranice | Početna, Usluge i cene, **stranica za svaku uslugu** (`/usluge/pranje`…), Galerija, O nama, Zakazivanje, Kontakt, Pitanja, Politika privatnosti, Uslovi, Kolačići, 404 |
| Cene | jedna cena ili **po vozilu** (gradsko / limuzina / SUV / kombi, ili veličina felne); izabrano vozilo se pamti kroz ceo sajt |
| Zakazivanje | koraci Vozilo → Usluga → Termin → Podaci → Potvrda; marka/model i tablice po delatnosti; usluge od više dana zakazuju prijem vozila |
| SEO | svaka stranica unapred iscrtana, title/opis/canonical/hreflang/Open Graph, JSON-LD (`AutoWash` / `TireShop` / `AutoRepair`…, radno vreme, cenovnik, Service po usluzi, FAQ), sitemap, robots |
| Mapa | MapLibre + OpenFreeMap (bez API ključa i kolačića), u bojama teme |
| Fotografije | 28 demo fotografija (Unsplash), 4K WebP + 640/1280/1920 varijante (`npm run slike`) |

---

## Brzi start

```bash
npm install
npm run dev          # http://localhost:3000
```

U uglu ekrana je **birač** sa dve kartice — **Tema** i **Delatnost**. Klik menja
izgled ili sadržaj odmah. U `npm run dev` dugme **„Postavi kao …”** upisuje izbor
u `servis.js`; **„Kopiraj link za klijenta”** daje adresu sa `?tema=…&delatnost=…`.

| Komanda | Šta radi |
|---|---|
| `npm run dev` | razvojni server sa biračem |
| `npm run slike` | originalne fotografije iz `slike-izvor/` → 4K WebP + manje verzije u `public/slike/` |
| `npm run provera` | kaže šta je u `servis.js` ostalo demo ili nepopunjeno (prekida ako ima grešaka) |
| `npm run build` | gotov sajt u `dist/` (provera → build → prerender svih stranica na svim jezicima) |
| `npm run preview` | lokalni pregled `dist/` na http://localhost:4173 — otvaraj adrese sa kosom crtom na kraju (`/usluge/pranje/`): `vite preview` ne prepisuje `/usluge/pranje` → `index.html` kao Apache i nginx, pa bi bez nje servirao početnu |

---

## Novi klijent — redosled rada

1. **Kopiraj ceo projekat** u novu fasciklu (npr. `Perionica-Ime`), `npm install`.
2. **Delatnost i tema:** u `npm run dev` izaberi u biraču i klikni „Postavi kao …”
   (ili upiši `delatnost: 'vulkanizer'`, `tema: 'velnes'` u `servis.js`).
3. **Popuni `src/config/servis.js`** — sve je komentarisano u samom fajlu:
   - `naziv`, `domen` (puna https adresa), godina osnivanja, logo (opciono);
   - kontakt (telefon `+381…`, WhatsApp/Viber, e-mail, mreže);
   - adresa i koordinate (Google Maps → desni klik na lokaciju);
   - radno vreme po danima i neradni dani;
   - **podaci firme** (naziv, PIB, matični broj, PDV) — zakon traži da budu na sajtu;
   - **pravi cenovnik**: pregazi `kategorije` (struktura u [docs/DELATNOSTI.md](docs/DELATNOSTI.md));
   - tekstovi koji pominju naziv (`oNama`, `pocetna.hero`), recenzije (**samo prave**), galerija.
   Tekst može biti običan string ili `{ sr: '…', en: '…' }`; kad prevod fali, prikazuje se srpski.
4. **Fotografije:** originale (bilo koja veličina) stavi u `slike-izvor/` i pokreni
   `npm run slike`. Isti naziv kao demo (`pranje-pena.jpg`, `radionica.jpg`…)
   automatski zamenjuje demo fotografiju; novi nazivi se upisuju u `servis.js`.
   Demo fotografije su sa Unsplash-a — **za klijenta ih zameni pravim**
   ([docs/SLIKE-IZVORI.md](docs/SLIKE-IZVORI.md)).
5. **Zakazivanje** (`zakazivanje` u `servis.js`):
   - `nacin: 'zahtev'` — klijent bira vozilo → uslugu → dan i vreme (u beogradskom
     vremenu, rad mora da se završi pre zatvaranja) → podatke → potvrdu. Servis
     potvrđuje termin. Zahtev stiže preko `kanal.tip`:
     - `'webhook'` + `kanal.url` — POST JSON (Formspree, Make, n8n, Google Apps Script,
       ili sopstveni API — npr. Laravel backend kao u Eclectic-u). **Preporučeno.**
       Ako ne uspe, klijentu se odmah nude WhatsApp/Viber/poziv.
     - `'whatsapp'` / `'viber'` / `'email'` — otvara aplikaciju sa popunjenom porukom.
   - `nacin: 'link'` + `link` — sve „Zakaži” vodi na spoljni sistem.
   - Mreža termina, najraniji termin, otkazivanje, polja za marku/model i tablice
     dolaze iz predloška delatnosti i mogu da se pregaze.
6. **Obaveštenje** (opciono): `obavestenje: { tekst, do, link }` — praznici, promena radnog vremena, akcija.
7. **Analitika** (opciono): `analitika.ga4` / `analitika.metaPixel` — učitavaju se tek
   kad posetilac prihvati kolačiće; bez njih se traka za kolačiće ni ne prikazuje.
8. **`demo: false`** — tek kad su podaci pravi. Dok je `true`: sajt je `noindex`,
   robots.txt zatvara sve, a birač se vidi i na objavljenom sajtu.
9. `npm run provera` → ispravi sve ✗ → `npm run build` → objavi `dist/`.

### JSON koji stiže na webhook

```json
{
  "usluge": [{ "id": "premium", "naziv": "Premium pranje", "trajanje": 150, "dana": null, "cena": 5200, "cenaOd": false }],
  "vozilo": { "id": "suv", "naziv": "SUV i džip" },
  "datum": "2026-11-24", "vreme": "10:00", "trajanje": 150, "dana": null, "ukupno": 5200,
  "ime": "…", "telefon": "+38160…", "email": null, "model": "VW Golf 7", "tablice": null,
  "napomena": null, "jezik": "sr", "saglasnost": true, "poslato": "2026-11-23T14:00:00.000Z",
  "poruka": "Zahtev za termin\n…", "servis": "Sjaj Car Wash", "izvor": "sajt"
}
```

---

## Objava (`dist/` na hosting)

Sajt je statičan: svaka stranica je `…/index.html`, plus `404.html`,
`sitemap.xml`, `robots.txt`, ikone, `site.webmanifest` i slika za deljenje
(`og-slika.jpg`, napravljena iz prve hero fotografije ako ne postoji u `public/`).

**Apache / cPanel** — `public/.htaccess` se kopira u `dist/` i već sadrži:
HTTPS preusmerenje, adrese bez kose crte na kraju, `ErrorDocument 404 /404.html`,
keširanje (`assets/` godinu dana) i bezbednosna zaglavlja. Prebaci sadržaj `dist/` u `public_html/`.

**Nginx:**

```nginx
server {
    server_name www.perionica.rs;
    root /var/www/perionica/dist;
    index index.html;
    error_page 404 /404.html;

    location / {
        try_files $uri $uri/index.html $uri/ =404;
    }
    location /assets/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    location ~* \.(webp|jpg|png|svg)$ {
        add_header Cache-Control "public, max-age=2592000";
    }
}
```

**Netlify:** Build command `npm run build`, Publish directory `dist`.
**Vercel:** Framework „Other”, Output `dist`, u `vercel.json` `{ "cleanUrls": true, "trailingSlash": false }`.

**GitHub Pages (demo):** `.github/workflows/pages.yml` na svaki push na `main`
pravi sajt i objavljuje ga na `https://<korisnik>.github.io/<repo>/`. Jednom
treba uključiti Settings → Pages → Source: „GitHub Actions”.

Posle objave: dodaj sajt u Google Search Console, pošalji `sitemap.xml`, i
proveri Google profil (adresa i radno vreme isti kao u `servis.js`).

---

## Struktura

```
src/config/servis.js          ← JEDINI fajl koji se menja za klijenta
src/config/delatnosti/*.js    ← predlošci: perionica, detailing, tehnicki, vulkanizer, servis
src/config/teme.js            ← 10 tema (boje, fontovi, raspored, pokret)
src/config/sajt.js            ← spaja predložak + servis.js (ne menja se)
src/stranice/                 ← Pocetna, Cenovnik, Usluga, Galerija, ONama, Zakazivanje, Kontakt, Pitanja, Pravno
src/sekcije/                  ← hero (6 rasporeda) i sekcije početne (5 rasporeda usluga)
src/lib/                      ← cene po vozilu, zakazivanje, radno vreme, SEO/JSON-LD, tema
src/i18n/                     ← tekstovi interfejsa (sr, en, ru) i pravni tekstovi
scripts/                      ← provera, prerender, obrada fotografija
alati/istrazivanje/           ← alat kojim su izmerene teme sa referentnih sajtova
```

## Teme

| Tema | Po uzoru na | Karakter |
|---|---|---|
| `hotel` | Topaz Detailing | belo, tanke linije, uski verzal, obris-dugmad, crveni akcenat |
| `atelje` | Forge Automotive | crno i slonovača, tanak urednički serif, Lenis, auto kao umetnički objekat |
| `laboratorija` | AMMO NYC | belo, Helvetica bold verzal, crvena dugmad, studijske fotografije |
| `studio` | ESOTERIC Detail | Bebas Neue, čist grid pločica, crni CTA |
| `konsijerz` | Voiture Detailing | grafit i šampanj, pill dugmad, usluge kao kurirani paketi |
| `velnes` | Wash Haus | krem i tamnozelena, žuta dugmad ↗, „Car care. By hand.” |
| `galerija` | Marque Auto Atelier | topla crna i mesing, Bodoni, galerijski raspored |
| `magazin` | Autovera | krem, Playfair kurziv, urednička lista, reči izranjaju |
| `most` | Blackbridge | serif naslovi + moderni raspored, visoke kartice |
| `kinematik` | Eclectic | tamno i filmski, Archivo verzal, narandžasti akcenat |

Izmerene vrednosti (fontovi, boje, krive, trajanja, biblioteke) i šta je čime
zamenjeno: [docs/TEME.md](docs/TEME.md). Kod, slike i tekstovi tih sajtova nisu
kopirani — teme ponavljaju dizajnerske odluke, napisane iznova.
