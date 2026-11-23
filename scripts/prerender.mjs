/*
 * PRERENDER — posle `vite build` pravi statički sajt spreman za bilo koji
 * hosting (Apache, Nginx, Netlify, Vercel, cPanel…):
 *
 *   dist/index.html, dist/cenovnik/index.html, dist/en/prices/index.html …
 *        svaka stranica na svakom jeziku, sa pravim sadržajem u HTML-u (Google
 *        ga čita bez JavaScript-a), sopstvenim <title>, opisom, canonical,
 *        hreflang, Open Graph i JSON-LD;
 *   dist/404.html, sitemap.xml (sa hreflang alternativama), robots.txt,
 *   site.webmanifest, favicon.svg, ikone (PNG) i slika za deljenje — sve iz
 *   servis.js i boja teme, osim ako su već stavljene u public/.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import sharp from 'sharp';

const koren = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(koren, 'dist');
const ssr = path.join(koren, '.ssr');

const server = await import(pathToFileURL(path.join(ssr, 'entry-server.js')).href);
const { render, servis, TEME, resiTemu, cssTeme, atributiTeme, aktivniJezici, INDEKSIRANE, putanja, BAZA, apsolutno } = server;

// Ikone i manifest pravi ovaj skript, pa im Vite ne zna za podfolder — dodaje se ovde.
const sablon = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
    .replace(/(href=")\/(favicon\.svg|ikona-180\.png|site\.webmanifest)"/g, `$1${BAZA}/$2"`);
const tema = resiTemu(servis.tema);
const atributi = (a) => Object.entries(a).map(([k, v]) => `${k}="${v}"`).join(' ');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

// U demo režimu birač tema radi i na objavljenom sajtu: sve teme idu u stranicu
// da bi izbor iz biraca bio primenjen pre prvog iscrtavanja (bez treptaja).
const temeSkripta = servis.demo
    ? `<script>window.__TEME__=${JSON.stringify(Object.fromEntries(Object.keys(TEME).map((id) => {
        const t = id === tema.id ? tema : resiTemu(id);
        return [id, { css: cssTeme(t), atr: atributiTeme(t) }];
    }))).replace(/</g, '\\u003c')}</script>`
    : '';

const strana = (url) => {
    const { html, head, lang } = render(url);
    return sablon
        .replace('lang="sr" data-ssr-html', `lang="${lang}" ${atributi(atributiTeme(tema))}`)
        .replace('<meta name="theme-color" content="#FFFCF5">', `<meta name="theme-color" content="${tema.boje.paper}">`)
        .replace('<!--head-->', head)
        .replace('<!--tema-->', `<style id="tema">${cssTeme(tema)}</style>${temeSkripta}`)
        .replace('data-ssr-app', `data-tema="${tema.id}" data-delatnost="${servis.delatnost}"`)
        .replace('<!--app-->', html);
};

const upisi = (url, sadrzaj) => {
    const fajl = url.endsWith('.html') ? path.join(dist, url) : path.join(dist, url, 'index.html');
    fs.mkdirSync(path.dirname(fajl), { recursive: true });
    fs.writeFileSync(fajl, sadrzaj);
};

/* ── Stranice ── */
const jezici = aktivniJezici();
let broj = 0;
for (const j of jezici) {
    for (const kljuc of INDEKSIRANE) {
        const url = putanja(kljuc, j);
        upisi(url, strana(url));
        broj++;
    }
    // Stranice usluga: /usluge/<id kategorije> (en: /services/…)
    for (const k of servis.kategorije) {
        const url = putanja('usluga', j, k.id);
        upisi(url, strana(url));
        broj++;
    }
}
upisi('404.html', strana('/__nije-pronadjeno'));

/* ── sitemap.xml i robots.txt ── */
const danas = new Date().toISOString().slice(0, 10);
const PRIORITET = { pocetna: '1.0', zakazivanje: '0.9', cenovnik: '0.9', usluga: '0.85', kontakt: '0.8', galerija: '0.7', oNama: '0.6', pitanja: '0.6' };
const sveStranice = [...INDEKSIRANE.map((kljuc) => [kljuc, '']), ...servis.kategorije.map((k) => ['usluga', k.id])];
const stavke = jezici.flatMap((j) => sveStranice.map(([kljuc, slug]) => {
    const alt = jezici.map((a) => `    <xhtml:link rel="alternate" hreflang="${a}" href="${apsolutno(putanja(kljuc, a, slug))}"/>`).join('\n');
    return `  <url>\n    <loc>${apsolutno(putanja(kljuc, j, slug))}</loc>\n    <lastmod>${danas}</lastmod>\n    <priority>${PRIORITET[kljuc] ?? '0.3'}</priority>\n${jezici.length > 1 ? `${alt}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${apsolutno(putanja(kljuc, jezici[0], slug))}"/>\n` : ''}  </url>`;
}));
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${stavke.join('\n')}\n</urlset>\n`);
fs.writeFileSync(
    path.join(dist, 'robots.txt'),
    servis.demo
        ? '# DEMO — sajt je zaključan za pretraživače dok je u servis.js `demo: true`.\nUser-agent: *\nDisallow: /\n'
        : `User-agent: *\nAllow: /\n\nSitemap: ${apsolutno('/sitemap.xml')}\n`,
);

/* ── Ikone, manifest, slika za deljenje (samo ako ih nema u public/) ── */
const postoji = (f) => fs.existsSync(path.join(koren, 'public', f));
const inicijali = (servis.kratkiNaziv || servis.naziv).trim().split(/\s+/).map((r) => r[0]).join('').slice(0, 2).toUpperCase();
const b = tema.boje;
const tamnaPodloga = tema.tamna ? b.paper : b.tamna;
const svetlo = tema.tamna ? b.brand : (b.akcenat && b.akcenat !== b.tamna ? b.akcenat : '#FFFFFF');
const fontIkone = /serif|Bodoni|Cormorant|Playfair/i.test(tema.fontovi.logo) ? 'Georgia, serif' : 'Arial, Helvetica, sans-serif';

const ikonaSvg = (velicina, zaobljenje) => `<svg xmlns="http://www.w3.org/2000/svg" width="${velicina}" height="${velicina}" viewBox="0 0 100 100"><rect width="100" height="100" rx="${zaobljenje}" fill="${tamnaPodloga}"/><text x="50" y="50" dy=".35em" text-anchor="middle" font-family="${fontIkone}" font-size="${inicijali.length > 1 ? 40 : 54}" fill="${svetlo}" letter-spacing="1">${esc(inicijali)}</text></svg>`;

if (!postoji('favicon.svg')) fs.writeFileSync(path.join(dist, 'favicon.svg'), ikonaSvg(64, 18));
for (const [ime, v] of [['ikona-180.png', 180], ['ikona-192.png', 192], ['ikona-512.png', 512]]) {
    if (!postoji(ime)) await sharp(Buffer.from(ikonaSvg(v, ime === 'ikona-180.png' ? 0 : 22))).png().toFile(path.join(dist, ime));
}
if (!postoji('site.webmanifest')) {
    fs.writeFileSync(path.join(dist, 'site.webmanifest'), JSON.stringify({
        name: servis.naziv, short_name: servis.kratkiNaziv || servis.naziv, start_url: `${BAZA}/`, display: 'standalone',
        background_color: b.paper, theme_color: b.paper,
        icons: [{ src: `${BAZA}/ikona-192.png`, sizes: '192x192', type: 'image/png' }, { src: `${BAZA}/ikona-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any maskable' }],
    }, null, 2));
}
const og = (servis.seo?.slikaZaDeljenje || '/og-slika.jpg').replace(/^\//, '');
if (!postoji(og)) {
    const slogan = typeof servis.slogan === 'object' ? servis.slogan.sr : servis.slogan;
    // Kad postoji prva fotografija heroja, ona je pozadina kartice (zatamnjena); inače boja teme.
    const heroSlika = servis.pocetna?.hero?.slike?.[0];
    const heroFajl = heroSlika && path.join(koren, 'public', heroSlika.replace(/^\//, ''));
    let pozadina = `<rect width="1200" height="630" fill="${tamnaPodloga}"/>`;
    if (heroFajl && fs.existsSync(heroFajl)) {
        const foto = await sharp(heroFajl).resize(1200, 630, { fit: 'cover', position: 'attention' }).jpeg({ quality: 88 }).toBuffer();
        pozadina = `<image href="data:image/jpeg;base64,${foto.toString('base64')}" width="1200" height="630"/><rect width="1200" height="630" fill="#000" fill-opacity=".52"/>`;
    }
    const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630">${pozadina}<rect x="40" y="40" width="1120" height="550" fill="none" stroke="${svetlo}" stroke-opacity=".35"/><text x="600" y="300" text-anchor="middle" font-family="${fontIkone}" font-size="86" fill="#FFFFFF">${esc(servis.naziv)}</text><text x="600" y="380" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" letter-spacing="6" fill="${svetlo}">${esc(String(slogan).toUpperCase())}</text><text x="600" y="520" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#FFFFFF" fill-opacity=".7">${esc(servis.domen.replace(/^https?:\/\//, ''))}</text></svg>`;
    fs.mkdirSync(path.dirname(path.join(dist, og)), { recursive: true });
    await sharp(Buffer.from(ogSvg)).jpeg({ quality: 86 }).toFile(path.join(dist, og));
}

fs.rmSync(ssr, { recursive: true, force: true });
console.log(`\n✓ Prerender: ${broj} stranica (${jezici.join(', ')}) + 404, sitemap.xml, robots.txt — tema „${tema.id}”${servis.demo ? ' — DEMO (noindex)' : ''}\n`);
