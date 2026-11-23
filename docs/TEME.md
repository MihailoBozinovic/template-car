# Teme — šta je izvučeno sa referentnih sajtova

Prvih šest tema je napravljeno po živim sajtovima iz brifa. Vrednosti ispod su
**izmerene u browseru 23. 11. 2026.** alatom `alati/istrazivanje/izvuci-dizajn.mjs`
(computed style, `document.fonts`, `@keyframes`, CSS promenljive, header po
stanjima skrola, detekcija biblioteka) — ne procenjene sa slike. Snimci i
sirovi podaci su u `alati/istrazivanje/izlaz/` (van git-a, samo za internu referencu).

Tri teme su po **dizajn konceptima** sa Dribbble-a / Zarle (Marque, Autovera,
Blackbridge) — to nisu živi sajtovi, pa su napisane po opisu iz brifa
(paleta, tipografija, raspored), a ne izmerene. Deseta, `kinematik`, prenosi
dizajn sistem Eclectic sajta (`eclectic-front/DESIGN_SYSTEM.md`).

Kod, slike i tekstovi tih sajtova **nisu kopirani**: tema ponavlja *dizajnerske
odluke* (paleta, tipografska hijerarhija, krive i trajanja animacija, raspored),
a sve je napisano iznova. Licencirani fontovi su zamenjeni najbližim besplatnim
(`@fontsource`, isporučuju se sa sajta, bez Google Fonts poziva).

Tema se bira jednim klikom (birač u uglu, dok je `demo: true` ili u
`npm run dev`) ili upisom `tema: 'ime'` u `src/config/servis.js`.

| Tema | Po uzoru na | Platforma i biblioteke (izmereno) |
|---|---|---|
| `hotel` | Topaz Detailing | Shopify, jQuery |
| `atelje` | Forge Automotive | React (styled-components), **Lenis** glatki skrol, prelaz stranica |
| `laboratorija` | AMMO NYC | Shopify, Swiper |
| `studio` | ESOTERIC Detail | WordPress + Divi, Swiper |
| `konsijerz` | Voiture Detailing | WordPress + Divi, Swiper, LatePoint zakazivanje |
| `velnes` | Wash Haus | React (CSS moduli) + Tailwind |
| `galerija` | Marque Auto Atelier (koncept) | — |
| `magazin` | Autovera (koncept) | — |
| `most` | Blackbridge (koncept) | — |
| `kinematik` | Eclectic (dark cinematic) | — |

---

## hotel — Topaz Detailing

- **Fontovi:** Abel (uski grotesk) za naslove i dugmad, Work Sans 400/700 za tekst i meni (15 px). Zamena za Abel: **Barlow Condensed** (ima č/ć/š/ž/đ).
- **Boje (CSS promenljive sajta):** tekst `#3A3A3A` / `#333232`, beo header, tamna traka `#313030`, crveni znak u logotipu.
- **Header:** fiksan, beo, 80 px, `border-bottom: 1px solid #EBEBEB`, senka `0 2px 4px rgba(0,0,0,.1)`; ostaje isti pri skrolu.
- **Dugmad:** obris `1px`, `border-radius: 2px`, Abel 14 px, padding `12px 35px`.
- **Tranzicije:** `color/background .2s cubic-bezier(.44,.13,.48,.87)`, `.45s cubic-bezier(.29,.63,.44,1)`.
- **Raspored:** hero banner preko cele širine sa tekstom levo; pločice usluga 300×372 („ENHANCE · PROTECT · MAINTAIN · CUSTOMISE”); tamna traka pri dnu.
- **U temi:** `puna-levo` hero, `plocice` usluge, obris-dugmad 2 px, tamni footer, crveni akcenat.

## atelje — Forge Automotive (Awwwards SOTD)

- **Fontovi:** „editorial” 200/300 (tanak urednički serif, naslov 80 px / lh 96 px / `letter-spacing: -1px`), GeistSans 100–900, sitan verzal ~10 px sa širokim razmakom. Zamena: **Cormorant Garamond 300** + **Inter**.
- **Boje (CSS promenljive sajta):** `--brand-bc1 #0C0C0C`, `--bc2 #161616`, `--bc3 #410306` (oksblad), `--bc4 #C5A064` (zlato), `--bc5 #F2F1ED` (slonovača).
- **Pokret:** `--page-enter-ease: cubic-bezier(.2,.7,.2,1)`, `--page-beat-dur: .6s`; **Lenis**; `clip-path` + `scale` otkrivanja.
- **Dugmad:** obris `1px` slonovače na 10%, bez zaobljenja, verzal ~10 px.
- **Napomena:** sajt otvara kapiju „Accept & Enter” za kolačiće, pa je izmereno samo prvo stanje (header providan, 100 px, logo u sredini).
- **U temi:** tamna, `puna-centar` hero, logo u sredini, reči koje izranjaju, Lenis, `lista` usluga.

## laboratorija — AMMO NYC

- **Fontovi:** Helvetica 700 verzal (h1 72 px / lh 66 px / `letter-spacing: -2.16px`), Helvetica 400 za tekst. Bez web fonta — sistemski Helvetica/Arial.
- **Boje:** bela, tinta `#191818`, crvena `#E11E23` (dugmad, traka sa obaveštenjem, nadnaslovi), tamni hero `#0D0D0D`.
- **Dugmad:** puna crvena, `border-radius: 4px`, 12–14 px 700 verzal, tranzicije `.15s`.
- **Slike:** `filter: saturate(1.12) contrast(1.04)`, kartice 4 px, hover `transform .6s`.
- **Header:** logo u sredini, meni levo, CTA desno.
- **U temi:** `puna-levo` hero, logo `centar`, `kartice` usluga, filter slika kao na sajtu.

## studio — ESOTERIC Detail

- **Fontovi:** **Bebas Neue** (naslovi do 96 px), Montserrat 100–900, Roboto. Isti fontovi u temi.
- **Boje:** bela + tamne trake `#0B0B0B`, crvena `#EC0928` (`--gcid-primary-color`).
- **Header:** beo, crni CTA „Begin your project” (pravougaon), sekundarno obris-dugme.
- **Tranzicije:** pretežno `0.6s ease-in-out`, slike `1s cubic-bezier(.2,0,.3,1)`.
- **Raspored:** hero slideshow sa sličicama, čist grid pločica, edukativni blokovi.
- **U temi:** `puna-levo` hero (Ken Burns), `plocice` usluga, crni pravougaoni CTA.

## konsijerz — Voiture Detailing (London)

- **Fontovi:** Montserrat 600 (h1 72 px / lh 79 px / `-0.72px`), Inter 500 za dugmad (verzal, `letter-spacing: 2.6px`); tekst i meni u serifu. Zamena za serif: **Cormorant Garamond**.
- **Boje:** grafit `#111` / `#222`, krem `#F7E7CE` (dugmad i akcenti), tekst `#F8F8F8`.
- **Dugmad:** pill (`border-radius: 50px`), krem pun ili obris `2px`, verzal sa širokim razmakom.
- **Pokret:** `0.4s cubic-bezier(.05,.45,.1,1)`, `latepointFadeUp` (40 px).
- **Raspored:** usluge kao **kurirani paketi** (Maintain / Restore / Protect), centriran hero.
- **U temi:** tamna, `puna-centar` hero, novi raspored usluga `paketi` (spisak „uključuje”, istaknut srednji paket).

## velnes — Wash Haus

- **Fontovi:** Inter (h1 84 px / 450 / lh 1.06 / `letter-spacing: -4.62px` ≈ −0.055em), nadnaslov verzal sa širokim razmakom.
- **Boje:** tamnozelena-crna `#171A18` (header sa `blur(12px)`), krem `#F1EFE9`, žuta `#F2C230` (dugmad).
- **Dugmad:** `border-radius: 5px`, tekst + strelica ↗ na kraju, `background .2s`.
- **Naslov:** „Car care. **By hand.**” — drugi red u sivoj.
- **Animacije:** `@keyframes fadeUp` (12 px), `shine`.
- **U temi:** novi hero `blok` (tamni tekstualni blok + fotografija ispod), tamni header, akcenat `siva`, dugme `ugao` (↗).

## galerija — Marque Auto Atelier (koncept)

Appointment-only atelje, tamnija „gallery-grade” estetika, fotografije kao u
modnom magazinu: topla crna `#0F0E0C`, slonovača `#EDE6DA`, mesing `#B08D57`,
**Bodoni Moda** naslovi sa kurzivnim akcentom, Manrope, `uvuceno` hero, Lenis,
spori Ken Burns. Galerija sajta je masonry (kolone) u svim temama.

## magazin — Autovera (koncept)

Urednička tipografija i mikro-interakcije: krem `#F4F0E8`, **Playfair Display**
sa kurzivnim akcentom u boji rđe `#B5532A`, DM Sans, logo u sredini, `dupla`
hero sa ogromnim rečima u poljima, numerisana `lista` usluga, hover gasi ostale
stavke, reči izranjaju, Lenis.

## most — Blackbridge (koncept)

Ravnoteža luksuznih serifnih naslova i modernog rasporeda: topla bela `#FAF9F6`,
šampanj `#C9B79C`, Cormorant Garamond + Manrope, `split` hero, visoke kartice
usluga, pill dugme sa kružnom strelicom.

## kinematik — Eclectic

Iz `eclectic-front/DESIGN_SYSTEM.md`: skoro crna osnova `#0C0C0F` / `#15151A`,
tekst `#ECEAE3`, jedan narandžasti akcenat `#FC9303`, **Archivo** 800–900 verzal
(lh 0.9), Inter za tekst, nadnaslov `tracking .25em`, kartice 16 px, slike
24 px, `ease-out-expo` `cubic-bezier(.23,1,.32,1)`, bez Ken Burns-a.

---

## Šta tema određuje (src/config/teme.js)

| Polje | Vrednosti |
|---|---|
| `hero` | `puna-levo`, `puna-centar`, `dupla`, `uvuceno`, `split`, `blok` |
| `usluge` | `plocice`, `kartice`, `lista`, `visoke-kartice`, `paketi` |
| `header.tip` | `providan` (preko fotografije), `pun`, `tamni` |
| `header.logo` | `levo`, `centar` |
| `dugme.oblik` / `stil` | `pill`, `meko`, `blago`, `mali`, `pravo` / `puno`, `obris`, `strelica`, `ugao` |
| `naslov.akcenat` | `boja`, `kurziv`, `kurziv-boja`, `kurziv-verzal`, `kurziv-akcenat`, `akcenat`, `siva`, `nista` |
| `pokret` | kriva, trajanja, reveal (`fade`, `fade-up`, `slide`, `skala`, `reci`), efekat heroja, paralaksa, Lenis |

Boje i fontovi mogu da se pregaze bez nove teme:

```js
tema: { osnova: 'hotel', boje: { brand: '#0B5FA5' }, fontovi: { naslov: 'Montserrat, sans-serif' } }
```
