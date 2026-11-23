/*
 * PROVERA PRE OBJAVE — `npm run provera`
 *
 * Prolazi kroz src/config/servis.js (sa predloškom delatnosti) i public/ i
 * kaže šta je ostalo od demo sadržaja ili nije popunjeno. Greške (✗)
 * zaustavljaju `npm run provera`; upozorenja (!) samo informišu. `npm run
 * build` je pokreće u blagom režimu (--blago): ispisuje sve, ali ne prekida
 * build — da bi demo mogao da se gradi.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const koren = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const uvezi = (f) => import(pathToFileURL(path.join(koren, f)).href);
const { servis: podesavanja } = await uvezi('src/config/servis.js');
const { servis, DELATNOSTI } = await uvezi('src/config/sajt.js');
const { TEME } = await uvezi('src/config/teme.js');
const predlozak = DELATNOSTI[servis.delatnost].predlozak;
const blago = process.argv.includes('--blago');

const greske = [];
const upozorenja = [];
const g = (m) => greske.push(m);
const u = (m) => upozorenja.push(m);

if (servis.demo) g('`demo: true` — sajt je zaključan za Google (noindex) i prikazuje birač tema. Prebaci na `false` kad su podaci pravi.');
if (!DELATNOSTI[podesavanja.delatnost]) g(`Nepoznata delatnost „${podesavanja.delatnost}”. Postoje: ${Object.keys(DELATNOSTI).join(', ')}.`);
if (!/^https:\/\/[^/]+[^/]$/.test(servis.domen || '')) g('`domen` mora biti puna https adresa bez kose crte na kraju, npr. https://www.perionica.rs');
if (/sjaj-carwash|example|primer/i.test(servis.domen)) g(`\`domen\` je još demo (${servis.domen}).`);
const temaId = typeof servis.tema === 'string' ? servis.tema : servis.tema?.osnova;
if (!TEME[temaId]) g(`Nepoznata tema „${temaId}”. Postoje: ${Object.keys(TEME).join(', ')}.`);
if (!podesavanja.naziv) g('`naziv` nije upisan — koristi se demo naziv iz predloška.');
if (/^(Sjaj Car Wash|Atelje Lak|Tehnički pregled Tačka|Gume Centar|Servis Ključ)$/.test(servis.naziv)) g(`\`naziv\` je demo („${servis.naziv}”).`);

const k = servis.kontakt;
if (!/^\+\d{9,15}$/.test(k.telefon || '')) g('`kontakt.telefon` mora biti u formatu +3816…');
if (/1234567/.test(k.telefon)) g('`kontakt.telefon` je demo broj.');
if (k.email && /sjaj-carwash/.test(k.email)) g('`kontakt.email` je demo adresa.');
for (const m of ['instagram', 'facebook', 'tiktok']) if (k[m] && /sjaj/.test(k[m])) u(`\`kontakt.${m}\` je demo profil — upiši pravi ili ostavi prazno.`);

const f = servis.firma;
if (!/^\d{9}$/.test(f.pib) || /^0+$/.test(f.pib)) g('`firma.pib` — 9 cifara, pravi PIB (proveri na apr.gov.rs).');
if (!/^\d{8}$/.test(f.maticniBroj) || /^0+$/.test(f.maticniBroj)) g('`firma.maticniBroj` — 8 cifara, pravi matični broj.');
if (/Marko Marković/.test(f.naziv)) g('`firma.naziv` je demo.');
if (/Bulevar oslobođenja 100/.test(servis.lokacija.adresa)) g('`lokacija.adresa` je demo — upiši pravu adresu i koordinate.');

const z = servis.zakazivanje;
if (z.nacin === 'link' && !/^https?:\/\//.test(z.link)) g('`zakazivanje.nacin: \'link\'` traži `zakazivanje.link`.');
if (z.nacin === 'zahtev') {
    if (z.kanal.tip === 'webhook' && !/^https:\/\//.test(z.kanal.url)) g('`zakazivanje.kanal.tip: \'webhook\'` traži https `kanal.url`.');
    if (z.kanal.tip === 'whatsapp' && !k.whatsapp) g('Kanal je WhatsApp, a `kontakt.whatsapp` je prazan.');
    if (z.kanal.tip === 'viber' && !k.viber) g('Kanal je Viber, a `kontakt.viber` je prazan.');
    if (z.kanal.tip === 'email' && !k.email) g('Kanal je e-mail, a `kontakt.email` je prazan.');
    if (z.kanal.tip !== 'webhook') u(`Zahtevi stižu preko „${z.kanal.tip}” — klijent mora da pošalje poruku iz aplikacije. Webhook (Formspree, Make, n8n…) je pouzdaniji.`);
}

// Usluge i cene
const vozila = new Set((servis.izborVozila?.opcije ?? []).map((o) => o.id));
const ids = new Set();
const katIds = new Set();
for (const kat of servis.kategorije) {
    if (!/^[a-z0-9-]+$/.test(kat.id)) g(`Kategorija „${kat.id}”: id je i adresa stranice — samo mala slova bez kvačica, cifre i crtice.`);
    if (katIds.has(kat.id)) g(`Kategorija „${kat.id}” se ponavlja.`);
    katIds.add(kat.id);
    if (!kat.usluge.length) g(`Kategorija „${kat.id}” nema usluga.`);
    for (const s of kat.usluge) {
        if (ids.has(s.id)) g(`Usluga „${s.id}” se ponavlja — id mora biti jedinstven.`);
        ids.add(s.id);
        for (const [polje, v] of [['cena', s.cena], ['trajanje', s.trajanje]]) {
            if (v && typeof v === 'object') {
                for (const kljuc of Object.keys(v)) if (!vozila.has(kljuc)) g(`Usluga „${s.id}”: \`${polje}.${kljuc}\` — nema te opcije u \`izborVozila\` (${[...vozila].join(', ') || 'prazno'}).`);
                for (const o of vozila) if (!(o in v)) u(`Usluga „${s.id}”: \`${polje}\` nema vrednost za vozilo „${o}” — prikazuje se najniža.`);
                if (Object.values(v).some((x) => !(x > 0))) g(`Usluga „${s.id}”: \`${polje}\` mora biti pozitivan broj.`);
            } else if (!(v > 0)) g(`Usluga „${s.id}” nema \`${polje}\`.`);
        }
    }
}
if (!podesavanja.kategorije) (servis.demo ? u : g)('`kategorije` nisu pregažene — prikazuje se demo cenovnik iz predloška. Upiši prave usluge i cene klijenta.');
for (const gl of servis.galerija) if (gl.kategorija && !katIds.has(gl.kategorija)) u(`Galerija: kategorija „${gl.kategorija}” ne postoji.`);

for (const [dan, v] of Object.entries(servis.radnoVreme)) {
    if (v && (!/^\d\d:\d\d$/.test(v[0]) || !/^\d\d:\d\d$/.test(v[1]) || v[0] >= v[1])) g(`Radno vreme za „${dan}” nije ispravno (${v}).`);
}

// Fotografije
const slike = [
    ...(servis.pocetna.hero.slike ?? []), servis.pocetna.poziv?.slika, servis.oNama.slika,
    ...servis.kategorije.map((x) => x.slika), ...servis.tim.map((r) => r.slika), ...servis.galerija.map((x) => x.slika),
].filter((s) => s && s.startsWith('/'));
const nema = [...new Set(slike.filter((s) => !fs.existsSync(path.join(koren, 'public', s))))];
if (nema.length) (servis.demo ? u : g)(`Nedostaje ${nema.length} fotografija u public/: ${nema.slice(0, 6).join(', ')}${nema.length > 6 ? '…' : ''} (do tada se prikazuje zamena u bojama teme).`);
if (!servis.demo && !podesavanja.galerija && servis.galerija.length) u('`galerija` nije pregažena — prikazuju se demo fotografije (Unsplash). Za pravi sajt koristi fotografije klijenta.');
if (!fs.existsSync(path.join(koren, 'public', (servis.seo?.slikaZaDeljenje || '/og-slika.jpg').replace(/^\//, '')))) u('Nema slike za deljenje (public/og-slika.jpg, 1200×630) — build je pravi iz prve fotografije heroja sa nazivom servisa.');

// Tekstovi iz predloška koji pominju demo naziv
if (!podesavanja.oNama && servis.naziv !== predlozak.naziv) u('`oNama` dolazi iz predloška i pominje demo naziv — prepiši tekst „O nama” za klijenta.');

// Prevodi
for (const j of servis.jezici ?? []) {
    if (j === 'sr') continue;
    const fale = [];
    const proveri = (v, gde) => { if (v && typeof v === 'object' && !Array.isArray(v) && 'sr' in v && !(j in v)) fale.push(gde); };
    proveri(servis.slogan, 'slogan'); proveri(servis.opis, 'opis');
    servis.kategorije.forEach((x) => { proveri(x.naziv, `kategorija ${x.id}`); x.usluge.forEach((s) => proveri(s.naziv, `usluga ${s.id}`)); });
    if (typeof servis.opis === 'string') fale.push('opis (običan tekst — isti na svim jezicima)');
    if (fale.length) u(`Jezik „${j}”: nema prevoda za ${fale.slice(0, 5).join(', ')}${fale.length > 5 ? ` i još ${fale.length - 5}` : ''} — prikazuje se srpski.`);
}
if ((servis.recenzije?.lista ?? []).some((r) => /demo/i.test(r.autor))) g('Recenzije su demo — zameni ih pravim (sa Google profila, uz dozvolu) ili isprazni listu (`recenzije: { lista: [] }`).');

console.log(`\nProvera servis.js — delatnost „${servis.delatnost}”, tema „${temaId}”\n`);
for (const m of greske) console.log(`  ✗ ${m}`);
for (const m of upozorenja) console.log(`  ! ${m}`);
if (!greske.length && !upozorenja.length) console.log('  ✓ Sve je popunjeno.');
console.log(`\n  ${greske.length} grešaka, ${upozorenja.length} upozorenja.\n`);
if (greske.length && !blago) process.exit(1);
