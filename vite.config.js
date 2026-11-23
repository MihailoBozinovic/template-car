import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TEME } from './src/config/teme.js';
import { DELATNOSTI } from './src/config/delatnosti/index.js';

/*
 * „Postavi kao temu / delatnost sajta” iz biraca (samo u `npm run dev`):
 * upisuje izbor u src/config/servis.js. Vite zatim sam osveži stranicu.
 */
const upisIzbora = () => ({
    name: 'upis-izbora',
    apply: 'serve',
    configureServer(server) {
        server.middlewares.use('/__tema', (req, res) => {
            if (req.method !== 'POST') { res.statusCode = 405; return res.end(); }
            let telo = '';
            req.on('data', (d) => { telo += d; if (telo.length > 1000) req.destroy(); });
            req.on('end', () => {
                try {
                    const { polje, id } = JSON.parse(telo || '{}');
                    const dozvoljeno = polje === 'delatnost' ? DELATNOSTI : polje === 'tema' ? TEME : null;
                    if (!dozvoljeno) throw new Error(`Nepoznato polje: ${polje}`);
                    if (!dozvoljeno[id]) throw new Error(`Nepoznata vrednost: ${id}`);
                    const fajl = path.resolve('src/config/servis.js');
                    const izvor = fs.readFileSync(fajl, 'utf8');
                    let novo = izvor.replace(new RegExp(`^(\\s*${polje}:\\s*)(['"])[a-z]+\\2(\\s*,)`, 'm'), `$1'${id}'$3`);
                    if (novo === izvor && polje === 'tema') novo = izvor.replace(/(^\s*tema:\s*\{[^\n]*?osnova:\s*)(['"])[a-z]+\2/m, `$1'${id}'`);
                    if (novo === izvor && !new RegExp(`${polje}:\\s*['"]${id}['"]`).test(izvor)) throw new Error(`U servis.js nije pronađena linija \`${polje}: ...\`.`);
                    fs.writeFileSync(fajl, novo);
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ ok: true, polje, id }));
                } catch (e) {
                    res.statusCode = 400;
                    res.end(String(e.message || e));
                }
            });
        });
    },
});

export default defineConfig({
    plugins: [react(), upisIzbora()],
    server: { port: 3000 },
    // Podfolder (npr. GitHub Pages: BAZA=/template-demo/); podrazumevano koren domena.
    base: process.env.BAZA || '/',
    build: { outDir: 'dist', emptyOutDir: true },
    ssr: { noExternal: ['lucide-react'] },
});
