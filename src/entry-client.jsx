import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './fontovi.js';
import './index.css';
import App from './App.jsx';
import { pocetnaDelatnost, pocetnaTema, primeniTemu } from './lib/tema.js';
import { BAZA } from './lib/baza.js';

document.documentElement.classList.add('js');

/*
 * Stranice u dist/ su unapred iscrtane (prerender) u temi i delatnosti iz
 * servis.js. Ako je posetilac u biraču izabrao drugu temu ili delatnost, ista
 * stranica se crta iznova umesto hidratacije — markup se razlikuje (hero,
 * raspored usluga, sadržaj…).
 */
const tema = pocetnaTema();
const delatnost = pocetnaDelatnost();
primeniTemu(tema);

const koren = document.getElementById('app');
const app = (
    <React.StrictMode>
        <BrowserRouter basename={BAZA || undefined}>
            <App tema={tema} delatnost={delatnost} />
        </BrowserRouter>
    </React.StrictMode>
);

if (koren.hasChildNodes() && koren.dataset.tema === tema.id && koren.dataset.delatnost === delatnost) {
    hydrateRoot(koren, app);
} else {
    koren.innerHTML = '';
    createRoot(koren).render(app);
}
