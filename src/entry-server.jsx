import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App.jsx';
import { BAZA, DOMEN, apsolutno } from './lib/baza.js';
import { servis } from './config/sajt.js';
import { TEME, resiTemu, cssTeme, atributiTeme } from './config/teme.js';
import { metaStranice, headHtml, aktivniJezici, INDEKSIRANE } from './lib/seo.js';
import { putanja, jezikIzPutanje, kljucIzPutanje, slugIzPutanje, SVI_JEZICI } from './i18n/jezici.js';

/** Za scripts/prerender.mjs — sve što je potrebno da se napravi statički sajt. */
export const render = (url) => {
    const tema = resiTemu(servis.tema);
    const html = renderToString(
        <StaticRouter location={`${BAZA}${url}`} basename={BAZA || undefined}>
            <App tema={tema} delatnost={servis.delatnost} />
        </StaticRouter>,
    );
    const jezik = jezikIzPutanje(url);
    const meta = metaStranice(kljucIzPutanje(url), jezik, slugIzPutanje(url));
    return { html, head: headHtml(meta), lang: SVI_JEZICI[jezik].locale.split('-')[0], tema };
};

export { BAZA, DOMEN, apsolutno, servis, TEME, resiTemu, cssTeme, atributiTeme, aktivniJezici, INDEKSIRANE, putanja, metaStranice };
