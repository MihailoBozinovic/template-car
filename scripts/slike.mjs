/*
 * FOTOGRAFIJE — `npm run slike`  (ili `npm run slike -- putanja/do/fascikle`)
 *
 * Uzima originalne fotografije klijenta (JPG, PNG, WebP, TIFF, AVIF — bilo
 * koje veličine) iz fascikle `slike-izvor/` i pravi u `public/slike/`:
 *
 *   ime.webp        — 4K: najviše 3840 px širine, WebP (kvalitet 82)
 *   ime-640.webp    — za telefone
 *   ime-1280.webp   — za tablete i kartice
 *   ime-1920.webp   — za laptop / Full HD
 *
 * i upisuje src/config/slike.json (dimenzije i varijante), iz kog komponenta
 * Foto pravi `srcset` — browser bira najmanju dovoljnu verziju, pa 4K stiže
 * samo na ekrane kojima treba. Rotacija iz EXIF-a se primenjuje, a EXIF
 * (lokacija, aparat) se NE prenosi u objavljene fajlove.
 *
 * Naziv fajla u slike-izvor/ = naziv u servis.js, npr. `hero-1.jpg` →
 * `/slike/hero-1.webp`. Već obrađene (novije od originala) se preskaču.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const koren = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ulaz = path.resolve(koren, process.argv[2] || 'slike-izvor');
const izlaz = path.join(koren, 'public', 'slike');
const manifestFajl = path.join(koren, 'src', 'config', 'slike.json');

const MAKS = 3840;
const SIRINE = [640, 1280, 1920];
const KVALITET = 82;

if (!fs.existsSync(ulaz)) {
    console.error(`Nema fascikle ${ulaz}. Napravi je i ubaci originalne fotografije (npr. hero-1.jpg).`);
    process.exit(1);
}
fs.mkdirSync(izlaz, { recursive: true });

const manifest = fs.existsSync(manifestFajl) ? JSON.parse(fs.readFileSync(manifestFajl, 'utf8')) : {};
const fajlovi = fs.readdirSync(ulaz).filter((f) => /\.(jpe?g|png|webp|tiff?|avif)$/i.test(f));
let obradjeno = 0;
let bajtova = 0;

for (const f of fajlovi) {
    const ime = path.parse(f).name.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
    const izvor = path.join(ulaz, f);
    const glavni = path.join(izlaz, `${ime}.webp`);
    const kljuc = `/slike/${ime}.webp`;
    if (fs.existsSync(glavni) && fs.statSync(glavni).mtimeMs > fs.statSync(izvor).mtimeMs && manifest[kljuc]) continue;

    const osnova = sharp(izvor, { failOn: 'none' }).rotate();
    const { width, height } = await osnova.metadata().then(async () => {
        const buf = await osnova.clone().toBuffer({ resolveWithObject: true });
        return buf.info;
    });
    const w = Math.min(width, MAKS);
    const h = Math.round((height * w) / width);
    if (width < MAKS) console.warn(`  ! ${f}: ${width}px širine — manje od 4K (${MAKS}px), ostaje u originalnoj veličini.`);

    await osnova.clone().resize({ width: w, withoutEnlargement: true }).webp({ quality: KVALITET, effort: 5, smartSubsample: true }).toFile(glavni);
    const varijante = [];
    for (const s of SIRINE) {
        if (s >= w) continue;
        await osnova.clone().resize({ width: s }).webp({ quality: KVALITET, effort: 5 }).toFile(path.join(izlaz, `${ime}-${s}.webp`));
        varijante.push(s);
    }
    manifest[kljuc] = { w, h, varijante };
    bajtova += fs.statSync(glavni).size;
    obradjeno++;
    console.log(`  ✓ ${kljuc}  ${w}×${h}  ${(fs.statSync(glavni).size / 1024).toFixed(0)} KB  (+ ${varijante.join(', ')})`);
}

fs.writeFileSync(manifestFajl, `${JSON.stringify(Object.fromEntries(Object.entries(manifest).sort()), null, 2)}\n`);
console.log(`\n${obradjeno} obrađeno, ${fajlovi.length - obradjeno} preskočeno (već gotovo)${obradjeno ? `, 4K ukupno ${(bajtova / 1048576).toFixed(1)} MB` : ''}.\n`);
