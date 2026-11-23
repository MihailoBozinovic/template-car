/*
 * DETALJNO IZVLAČENJE DIZAJNA referentnih sajtova (za teme template-a).
 *
 *   node izvuci-dizajn.mjs              → svih 6 sajtova, desktop + telefon
 *   node izvuci-dizajn.mjs palma soho   → samo navedeni
 *
 * Za svaki sajt i širinu ekrana (1440×900 i 390×844, telefon sa dodirom):
 *   - snimci: ceo ekran po ekran dok se skroluje (pojavljivanja), header u
 *     stanjima vrh / skrol nadole / skrol nagore, otvoren mobilni meni,
 *     hover stanja dugmadi, linkova i kartica;
 *   - podaci (podaci.json): tipografska skala, sekcije redom (visina, pozadina,
 *     razmaci, kolone), header po stanjima, dugmad i hover razlike, CSS pravila
 *     za :hover/tranzicije/animacije, @keyframes, podešavanja karusela (Swiper,
 *     Splide, Slick, Flickity — brzina, efekat, autoplay), GSAP/ScrollTrigger,
 *     Lenis, Elementor/Webflow/Squarespace animacije, paralaksa (pomeraj slika
 *     po skrolu), slike (odnos, filter, zaobljenje), footer, forme.
 *
 * Koristi Chrome instaliran na računaru, u privremenom profilu (bez naloga i
 * kolačića korisnika). Kolačić-trake i pop-upi se SAKRIVAJU, ništa se ne
 * prihvata. Rezultati idu u izlaz/ (van git-a: snimci tuđih sajtova su samo
 * za internu referencu).
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const SAJTOVI = {
    topaz: "https://topazdetailing.com/",
    forge: "https://forgeautomotive.co.uk/",
    ammo: "https://ammonyc.com/",
    esoteric: "https://esotericdetail.com/",
    voiture: "https://voituredetailing.co.uk/",
    washhaus: "https://washhaus.us/",
};

const EKRANI = {
    desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
    telefon: {
        viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
    },
};

const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find((p) => fs.existsSync(p));
const izabrani = process.argv.slice(2).filter((a) => SAJTOVI[a]);
const spavaj = (ms) => new Promise((r) => setTimeout(r, ms));

/* ── Kod koji radi u stranici ─────────────────────────────────────────── */

// Sakriva kolačić-trake, pop-upe i chat dugmad (bez klika na „prihvati”).
const SAKRIJ_SMETNJE = () => {
    const re = /(cookie|consent|gdpr|onetrust|cky-|cmplz|popup|modal|newsletter|klaviyo|privy|intercom|tidio|chat-widget|livechat|recaptcha|announcement-bar__close)/i;
    for (const el of document.querySelectorAll('body *')) {
        const s = getComputedStyle(el);
        if ((s.position === 'fixed' || s.position === 'sticky') && el.tagName !== 'HEADER' && !el.querySelector('nav') && re.test(`${el.id} ${el.className}`)) el.style.setProperty('display', 'none', 'important');
        if (s.position === 'fixed' && parseInt(s.zIndex, 10) > 900 && el.offsetHeight > innerHeight * 0.6 && !el.querySelector('nav')) el.style.setProperty('display', 'none', 'important');
    }
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
};

const IZVUCI = () => {
    const cs = (e) => getComputedStyle(e);
    const vidljiv = (e) => { const r = e.getBoundingClientRect(); const s = cs(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && parseFloat(s.opacity) > 0.05; };
    const tekstDirektno = (e) => [...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(' ').trim();
    const skrati = (t, n = 40) => (t || '').replace(/\s+/g, ' ').trim().slice(0, n);
    const Y = (e) => Math.round(e.getBoundingClientRect().top + scrollY);

    /* Tipografska skala: grupisano po stilu */
    const tipovi = new Map();
    for (const e of document.querySelectorAll('body *')) {
        if (!vidljiv(e)) continue;
        const t = tekstDirektno(e);
        if (!t || t.length < 2) continue;
        const s = cs(e);
        const k = [s.fontFamily.split(',')[0].replace(/"/g, ''), s.fontSize, s.fontWeight, s.lineHeight, s.letterSpacing, s.textTransform, s.fontStyle, s.color].join(' | ');
        const v = tipovi.get(k) || { broj: 0, primeri: [], tagovi: new Set() };
        v.broj++; v.tagovi.add(e.tagName.toLowerCase());
        if (v.primeri.length < 2) v.primeri.push(skrati(t, 32));
        tipovi.set(k, v);
    }
    const tipografija = [...tipovi.entries()].map(([k, v]) => ({ stil: k, broj: v.broj, tagovi: [...v.tagovi].join(','), primeri: v.primeri }))
        .sort((a, b) => parseFloat(b.stil.split(' | ')[1]) - parseFloat(a.stil.split(' | ')[1])).slice(0, 30);

    /* Sekcije redom: najdublji nivo koji deli stranicu na pune trake */
    const kandidati = [];
    const obidji = (el, dubina) => {
        if (dubina > 7) return;
        for (const d of el.children) {
            const r = d.getBoundingClientRect();
            if (r.height < 120 || !vidljiv(d)) continue;
            const puna = r.width >= innerWidth * 0.9;
            const deca = [...d.children].filter((x) => x.getBoundingClientRect().height >= 120 && x.getBoundingClientRect().width >= innerWidth * 0.9);
            if (puna && deca.length >= 2 && r.height > innerHeight * 1.5) obidji(d, dubina + 1);
            else if (puna) kandidati.push(d);
        }
    };
    obidji(document.body, 0);
    const sekcije = kandidati.slice(0, 40).map((d) => {
        const s = cs(d);
        const r = d.getBoundingClientRect();
        const unutra = d.querySelector('[class*=container], [class*=wrapper], [class*=inner]') || d.firstElementChild;
        const naslov = d.querySelector('h1,h2,h3');
        const kolone = (() => {
            let najvise = 0;
            for (const x of d.querySelectorAll('*')) {
                const st = cs(x);
                if (st.display.includes('grid') || st.display.includes('flex')) {
                    const red = [...x.children].filter((c) => c.getBoundingClientRect().width > 60 && Math.abs(c.getBoundingClientRect().top - x.children[0].getBoundingClientRect().top) < 4).length;
                    najvise = Math.max(najvise, red);
                }
            }
            return najvise;
        })();
        let bg = s.backgroundColor;
        if (bg === 'rgba(0, 0, 0, 0)') { const pb = [...d.querySelectorAll('*')].slice(0, 8).map((x) => cs(x).backgroundColor).find((c) => c !== 'rgba(0, 0, 0, 0)'); if (pb) bg = `~${pb}`; }
        return {
            y: Y(d), visina: Math.round(r.height), tag: d.tagName.toLowerCase(), klasa: skrati(String(d.className), 60),
            pozadina: bg, pozadinaSlika: s.backgroundImage !== 'none' ? skrati(s.backgroundImage, 80) : '',
            padding: `${s.paddingTop} / ${s.paddingBottom}`, sirinaSadrzaja: unutra ? Math.round(unutra.getBoundingClientRect().width) : null,
            kolone, slika: d.querySelectorAll('img').length, video: d.querySelectorAll('video').length,
            naslov: naslov ? skrati(naslov.innerText, 50) : '', tekst: skrati(d.innerText, 90),
        };
    });

    /* Dugmad (izgled) */
    const dugmad = new Map();
    for (const e of document.querySelectorAll('a, button, input[type=submit]')) {
        if (!vidljiv(e)) continue;
        const s = cs(e);
        const izgledaKaoDugme = (s.backgroundColor !== 'rgba(0, 0, 0, 0)' || parseFloat(s.borderTopWidth) > 0) && parseFloat(s.paddingLeft) >= 8 && e.innerText.trim().length < 40;
        if (!izgledaKaoDugme) continue;
        const k = [s.backgroundColor, s.color, s.borderTop, s.borderRadius, s.fontFamily.split(',')[0], s.fontSize, s.fontWeight, s.textTransform, s.letterSpacing, `${s.paddingTop} ${s.paddingRight}`, s.transition.slice(0, 90)].join(' | ');
        const v = dugmad.get(k) || { broj: 0, primer: skrati(e.innerText, 30), visina: Math.round(e.getBoundingClientRect().height) };
        v.broj++; dugmad.set(k, v);
    }

    /* CSS pravila: hover/focus, tranzicije, animacije, keyframes, promenljive */
    const hover = []; const keyframes = []; const prom = {}; let blokirano = 0;
    const tranzicije = new Map();
    for (const sh of document.styleSheets) {
        let rules; try { rules = sh.cssRules; } catch { blokirano++; continue; }
        const idi = (rs, media = '') => {
            for (const r of rs) {
                if (r.type === 7) { const t = r.cssText.replace(/\s+/g, ' '); if (!/spin|rotate\((0deg|360|1turn)|shopify|fa-|woofc|loader|preloader|skeleton/i.test(t)) keyframes.push(t.slice(0, 400)); continue; }
                if (r.cssRules && !r.selectorText) { idi(r.cssRules, r.conditionText || media); continue; }
                const sel = r.selectorText || '';
                const st = r.style;
                if (!st) continue;
                if (/:hover|:focus-visible/.test(sel) && hover.length < 140 && !/cookie|cky|klaviyo|shopify-|pswp|fancybox|wp-block|woocommerce/i.test(sel)) hover.push(`${media ? `@${media} ` : ''}${sel.slice(0, 140)} { ${st.cssText.slice(0, 220)} }`);
                const tr = st.getPropertyValue('transition') || st.getPropertyValue('transition-duration');
                if (tr) { const k = st.getPropertyValue('transition').slice(0, 120) || `dur ${tr}`; tranzicije.set(k, (tranzicije.get(k) || 0) + 1); }
                if (/^(:root|html|body)$/.test(sel)) for (const p of st) if (p.startsWith('--') && !/--(wp|wc|woo|toastify|swiper|fa|tw-)/.test(p) && Object.keys(prom).length < 120) prom[p] = st.getPropertyValue(p).trim().slice(0, 80);
            }
        };
        idi(rules);
    }

    /* Biblioteke i njihova podešavanja */
    const w = window;
    const karuseli = [];
    for (const el of document.querySelectorAll('.swiper, .swiper-container')) {
        const p = el.swiper?.params;
        if (p) karuseli.push({ vrsta: 'swiper', klasa: skrati(String(el.className), 60), speed: p.speed, effect: p.effect, loop: p.loop, autoplay: p.autoplay?.enabled === false ? false : (p.autoplay?.delay ?? p.autoplay), slidesPerView: p.slidesPerView, spaceBetween: p.spaceBetween, centered: p.centeredSlides, freeMode: p.freeMode?.enabled ?? p.freeMode, direction: p.direction, breakpoints: p.breakpoints ? JSON.stringify(p.breakpoints).slice(0, 300) : null, slajdova: el.querySelectorAll('.swiper-slide').length });
    }
    for (const el of document.querySelectorAll('.splide')) { const o = el.splide?.options; if (o) karuseli.push({ vrsta: 'splide', klasa: skrati(String(el.className), 60), type: o.type, speed: o.speed, autoplay: o.autoplay, interval: o.interval, perPage: o.perPage, gap: o.gap, easing: o.easing, drag: o.drag, arrows: o.arrows, pagination: o.pagination }); }
    if (w.jQuery) for (const el of document.querySelectorAll('.slick-initialized')) { try { const o = w.jQuery(el).slick('getSlick').options; karuseli.push({ vrsta: 'slick', speed: o.speed, autoplay: o.autoplay, autoplaySpeed: o.autoplaySpeed, fade: o.fade, cssEase: o.cssEase, slidesToShow: o.slidesToShow, infinite: o.infinite }); } catch { /* */ } }
    for (const el of document.querySelectorAll('.flickity-enabled')) { const f = w.Flickity?.data(el); if (f) karuseli.push({ vrsta: 'flickity', o: JSON.stringify(f.options).slice(0, 300) }); }
    for (const el of document.querySelectorAll('[data-settings]')) {
        const t = el.getAttribute('data-settings');
        if (/slideshow|animation|ken_burns|motion_fx|_animation/.test(t)) karuseli.push({ vrsta: 'elementor', klasa: skrati(String(el.className), 60), podesavanja: t.slice(0, 500) });
    }

    let gsap = null;
    if (w.gsap) {
        const tw = w.gsap.globalTimeline?.getChildren?.(true, true, false) || [];
        const uzorak = tw.slice(0, 40).map((x) => { const v = { ...x.vars }; delete v.onComplete; delete v.onUpdate; delete v.scrollTrigger; delete v.onStart; return JSON.stringify({ d: x.duration?.(), ...v }).slice(0, 200); });
        const st = w.ScrollTrigger?.getAll?.() || [];
        gsap = { verzija: w.gsap.version, tweenova: tw.length, uzorak: [...new Set(uzorak)].slice(0, 25), scrollTriggera: st.length, triggeri: st.slice(0, 25).map((t) => JSON.stringify({ trigger: skrati(String(t.trigger?.className), 40), start: t.vars?.start, end: t.vars?.end, scrub: t.vars?.scrub, pin: !!t.vars?.pin, toggleActions: t.vars?.toggleActions }).slice(0, 220)) };
    }
    const lenis = w.lenis || w.__lenis || w.Lenis?.instance;
    const biblioteke = {
        generator: document.querySelector('meta[name=generator]')?.content || '',
        gsap: !!w.gsap, scrollTrigger: !!w.ScrollTrigger, splitText: !!w.SplitText, lenis: !!lenis || document.documentElement.className.includes('lenis'), lenisOpcije: lenis?.options ? JSON.stringify({ duration: lenis.options.duration, lerp: lenis.options.lerp, smoothWheel: lenis.options.smoothWheel }) : null,
        locomotive: !!document.querySelector('[data-scroll-container]'), aos: !!w.AOS || !!document.querySelector('[data-aos]'), swiper: !!w.Swiper || !!document.querySelector('.swiper'), splide: !!document.querySelector('.splide'),
        slick: !!document.querySelector('.slick-slider'), flickity: !!document.querySelector('.flickity-enabled'), jquery: !!w.jQuery, webflow: !!document.documentElement.dataset.wfPage, webflowIx: document.querySelectorAll('[data-w-id]').length,
        squarespace: !!(w.Static && w.Static.SQUARESPACE_CONTEXT), squarespaceAnimacija: w.Static?.SQUARESPACE_CONTEXT?.tweakJSON ? JSON.stringify(Object.fromEntries(Object.entries(w.Static.SQUARESPACE_CONTEXT.tweakJSON).filter(([k]) => /anim|ease|duration|header|button|font|color/i.test(k)))).slice(0, 900) : null,
        shopify: !!w.Shopify, wordpress: !!document.querySelector('link[href*=wp-content],script[src*=wp-content]'), elementor: !!document.querySelector('.elementor'), wix: !!document.querySelector('meta[content*=Wix]'), framer: !!document.querySelector('[data-framer-name]'),
        prilagodjenKursor: !!document.querySelector('[class*=cursor]:not(body):not(html)'), preloader: !!document.querySelector('[class*=preloader], [class*=loader-wrap], [class*=page-transition]'),
    };
    const atributiAnimacija = {};
    for (const e of document.querySelectorAll('*')) for (const a of e.getAttributeNames()) if (/^data-(aos|aos-duration|aos-easing|aos-delay|animation|animation-role|scroll|scroll-speed|speed|parallax|reveal|sal|splitting|w-id|animate|motion|cascade|delay)/.test(a)) { const k = `${a}=${skrati(e.getAttribute(a), 30)}`; atributiAnimacija[k] = (atributiAnimacija[k] || 0) + 1; }
    const klaseAnimacija = {};
    const reK = /(fade|reveal|anim|slide|parallax|marquee|split|stagger|appear|inview|in-view|zoom|ken|motion|aos|wow|lazy|scroll|hover|underline|line|mask|clip)/i;
    for (const e of document.querySelectorAll('*')) for (const c of String(e.className).split(/\s+/)) if (reK.test(c)) klaseAnimacija[c] = (klaseAnimacija[c] || 0) + 1;

    /* Slike */
    const slike = [...document.images].filter((i) => vidljiv(i) && i.getBoundingClientRect().width > 120).slice(0, 40).map((i) => {
        const s = cs(i); const r = i.getBoundingClientRect(); const o = i.parentElement ? cs(i.parentElement) : null;
        return `${Math.round(r.width)}×${Math.round(r.height)} (${(r.width / r.height).toFixed(2)}) fit=${s.objectFit} radius=${s.borderRadius !== '0px' ? s.borderRadius : o?.borderRadius} filter=${s.filter} tr=${s.transition.slice(0, 60)} @y${Y(i)}`;
    });

    const footer = document.querySelector('footer') || [...document.querySelectorAll('body > *')].pop();
    const fs_ = footer ? cs(footer) : null;
    const polja = [...document.querySelectorAll('input:not([type=hidden]), textarea, select')].filter(vidljiv).slice(0, 4).map((e) => { const s = cs(e); return `${e.tagName}/${e.type} bg=${s.backgroundColor} border=${s.border} radius=${s.borderRadius} pad=${s.padding} font=${s.fontSize}`; });

    return {
        url: location.href, naslov: document.title, sirina: innerWidth, visinaStranice: document.documentElement.scrollHeight,
        biblioteke, karuseli, gsap, atributiAnimacija: Object.entries(atributiAnimacija).sort((a, b) => b[1] - a[1]).slice(0, 30),
        klaseAnimacija: Object.entries(klaseAnimacija).sort((a, b) => b[1] - a[1]).slice(0, 40),
        tipografija, sekcije, dugmad: [...dugmad.entries()].map(([k, v]) => ({ stil: k, ...v })).sort((a, b) => b.broj - a.broj).slice(0, 14),
        tranzicije: [...tranzicije.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25), hover, keyframes: [...new Set(keyframes)].slice(0, 40), promenljive: prom, blokiranihStilova: blokirano,
        slike, footer: fs_ ? { pozadina: fs_.backgroundColor, boja: fs_.color, visina: Math.round(footer.getBoundingClientRect().height), padding: `${fs_.paddingTop} / ${fs_.paddingBottom}`, tekst: skrati(footer.innerText, 200) } : null,
        polja, fontovi: [...new Set([...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family.replace(/"/g, '')} ${f.weight} ${f.style}`))],
    };
};

const HEADER = () => {
    const h = document.querySelector('header') || document.querySelector('[class*=header]') || document.querySelector('nav');
    if (!h) return null;
    const s = getComputedStyle(h); const r = h.getBoundingClientRect();
    const logo = h.querySelector('img, svg, [class*=logo]');
    const linkovi = [...h.querySelectorAll('a')].filter((a) => a.getBoundingClientRect().width > 0).slice(0, 12).map((a) => a.innerText.trim()).filter(Boolean);
    const link = [...h.querySelectorAll('nav a, a')].find((a) => a.innerText.trim().length > 2 && a.getBoundingClientRect().width > 0);
    const ls = link ? getComputedStyle(link) : null;
    return {
        scrollY: Math.round(scrollY), position: s.position, top: Math.round(r.top), visina: Math.round(r.height), pozadina: s.backgroundColor, boja: s.color, senka: s.boxShadow.slice(0, 60),
        blur: s.backdropFilter, transform: s.transform, okvir: s.borderBottom, tranzicija: s.transition.slice(0, 120), logoVisina: logo ? Math.round(logo.getBoundingClientRect().height) : null,
        link: ls ? `${ls.fontFamily.split(',')[0]} ${ls.fontSize} ${ls.fontWeight} tt=${ls.textTransform} ls=${ls.letterSpacing} boja=${ls.color}` : null, stavke: linkovi,
    };
};

/* ── Tok za jedan sajt i jedan ekran ──────────────────────────────────── */
const obradi = async (browser, ime, url, ekran) => {
    const dir = path.join('izlaz', ime, ekran);
    fs.mkdirSync(dir, { recursive: true });
    const ctx = await browser.newContext({ ...EKRANI[ekran], locale: 'en-US', reducedMotion: 'no-preference' });
    const page = await ctx.newPage();
    const log = [];
    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
        await spavaj(2500);
        await page.screenshot({ path: path.join(dir, '00-prvi-ekran.jpg'), quality: 70, type: 'jpeg' });
        await page.evaluate(SAKRIJ_SMETNJE);

        const headeri = [await page.evaluate(HEADER)];
        // Skrol ekran po ekran (okida lazy slike i pojavljivanja), snimak svakog ekrana.
        const visina = await page.evaluate(() => document.documentElement.scrollHeight);
        const korak = EKRANI[ekran].viewport.height * 0.9;
        let n = 1;
        const paralaksa = [];
        for (let y = 0; y < Math.min(visina, 22000); y += korak) {
            await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
            await spavaj(900);
            if (n === 2) headeri.push(await page.evaluate(HEADER));
            if (n <= 14) await page.screenshot({ path: path.join(dir, `${String(n).padStart(2, '0')}-ekran.jpg`), quality: 62, type: 'jpeg' });
            // Paralaksa: pomeraj slika između dva bliska položaja skrola
            if (n <= 6) {
                const merenje = () => page.evaluate(() => {
                    const fiksiran = (e) => { for (let x = e; x && x !== document.body; x = x.parentElement) { const p = getComputedStyle(x).position; if (p === 'fixed' || p === 'sticky') return true; } return false; };
                    return { s: scrollY, t: [...document.querySelectorAll('img, video, [style*=background-image]')].slice(0, 80).map((i) => (fiksiran(i) ? null : i.getBoundingClientRect().top + scrollY)) };
                });
                const pre = await merenje();
                await page.evaluate(() => window.scrollBy(0, 120));
                await spavaj(300);
                const posle = await merenje();
                const pomak = posle.s - pre.s;
                if (pomak > 50) pre.t.forEach((v, i) => { if (v == null || posle.t[i] == null) return; const d = Math.round(posle.t[i] - v); if (Math.abs(d) >= 3 && Math.abs(d) < pomak - 3) paralaksa.push(`element ${i} @y${Math.round(v)}: pomeraj ${d}px na ${pomak}px skrola (brzina ${(1 - d / pomak).toFixed(2)})`); });
            }
            n++;
        }
        await page.evaluate(() => window.scrollBy(0, -300));
        await spavaj(900);
        headeri.push(await page.evaluate(HEADER)); // posle skrola nagore
        await page.screenshot({ path: path.join(dir, 'header-skrol-nagore.jpg'), quality: 62, type: 'jpeg', clip: { x: 0, y: 0, width: EKRANI[ekran].viewport.width, height: Math.min(260, EKRANI[ekran].viewport.height) } });

        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await spavaj(1200);
        const podaci = await page.evaluate(IZVUCI);
        podaci.header = headeri;
        podaci.paralaksa = [...new Set(paralaksa)].slice(0, 20);

        // Hover: dugmad, linkovi u meniju, kartice sa slikom (stanje pre/posle)
        podaci.hoverMerenja = [];
        if (ekran === 'desktop') {
            const mete = await page.evaluate(() => {
                const r = [];
                const dodaj = (e, vrsta) => { if (!e) return; const b = e.getBoundingClientRect(); if (b.width && b.height && b.top > 0 && b.top < 3000) { e.setAttribute('data-hover-meta', vrsta + r.length); r.push({ id: vrsta + r.length, vrsta, tekst: (e.innerText || '').trim().slice(0, 25) }); } };
                dodaj([...document.querySelectorAll('header nav a, nav a, header a')].find((a) => a.innerText.trim().length > 2 && a.innerText.trim().length < 20 && !a.querySelector('img,svg') && a.getBoundingClientRect().width > 0 && a.getBoundingClientRect().left > 150), 'nav');
                const dug = [...document.querySelectorAll('a, button')].filter((e) => { const s = getComputedStyle(e); return (s.backgroundColor !== 'rgba(0, 0, 0, 0)' || parseFloat(s.borderTopWidth) > 0) && parseFloat(s.paddingLeft) >= 8 && e.innerText.trim().length < 40 && e.getBoundingClientRect().width > 0; });
                dug.slice(0, 3).forEach((e) => dodaj(e, 'dugme'));
                const kart = [...document.querySelectorAll('a')].filter((a) => a.querySelector('img') && a.getBoundingClientRect().width > 200);
                kart.slice(0, 2).forEach((e) => dodaj(e, 'kartica'));
                return r;
            });
            for (const m of mete) {
                const sel = `[data-hover-meta="${m.id}"]`;
                const stanje = () => page.evaluate((s) => {
                    const e = document.querySelector(s); if (!e) return null; const c = getComputedStyle(e); const img = e.querySelector('img'); const ic = img ? getComputedStyle(img) : null;
                    const posle = getComputedStyle(e, '::after'); const pre = getComputedStyle(e, '::before');
                    return { bg: c.backgroundColor, boja: c.color, okvir: c.borderColor, op: c.opacity, transform: c.transform, dekoracija: c.textDecorationLine, senka: c.boxShadow.slice(0, 50), img: ic ? `${ic.transform} filter=${ic.filter} op=${ic.opacity}` : null, after: `${posle.content} w=${posle.width} tr=${posle.transform}`, before: `${pre.content} w=${pre.width} tr=${pre.transform}` };
                }, sel);
                try {
                    const bb = await page.evaluate((s) => { const e = document.querySelector(s); e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }, sel);
                    await page.mouse.move(2, 2);
                    await spavaj(500);
                    const a = await stanje();
                    await page.mouse.move(bb.x, bb.y, { steps: 6 });
                    await spavaj(900);
                    const b = await stanje();
                    const razlika = Object.fromEntries(Object.keys(a || {}).filter((k) => a[k] !== b?.[k]).map((k) => [k, `${a[k]}  →  ${b[k]}`]));
                    podaci.hoverMerenja.push({ ...m, razlika });
                    await page.screenshot({ path: path.join(dir, `hover-${m.id}.jpg`), quality: 62, type: 'jpeg' });
                    await page.mouse.move(2, 2);
                    await spavaj(400);
                } catch (e) { podaci.hoverMerenja.push({ ...m, greska: String(e.message).slice(0, 80) }); }
            }
        }

        // Mobilni meni: otvori, snimi, izmeri
        if (ekran === 'telefon') {
            const otvoren = await page.evaluate(() => {
                const kand = [...document.querySelectorAll('button, a, [role=button], div, span')].filter((e) => {
                    const b = e.getBoundingClientRect(); if (!b.width || b.top > 160 || b.width > 80 || b.height > 80) return false;
                    const t = `${e.getAttribute('aria-label') || ''} ${e.className} ${e.id} ${e.innerText || ''}`.toLowerCase();
                    return /menu|meni|burger|hamburger|nav-toggle|navbar-toggle|toggle|drawer|open/.test(t);
                });
                const e = kand.sort((a, b) => b.getBoundingClientRect().left - a.getBoundingClientRect().left)[0] || kand[0];
                if (!e) return false;
                e.setAttribute('data-meni-dugme', '1');
                return true;
            });
            if (otvoren) {
                try {
                    await page.evaluate(() => { for (const a of document.querySelectorAll('a')) { const b = a.getBoundingClientRect(); if (b.width && b.height && getComputedStyle(a).visibility !== 'hidden') a.setAttribute('data-vidljiv-pre', '1'); } });
                    await page.click('[data-meni-dugme]', { timeout: 3000, force: true });
                    await spavaj(350);
                    await page.screenshot({ path: path.join(dir, 'meni-tokom-otvaranja.jpg'), quality: 62, type: 'jpeg' });
                    await spavaj(1200);
                    await page.screenshot({ path: path.join(dir, 'meni-otvoren.jpg'), quality: 70, type: 'jpeg' });
                    podaci.mobilniMeni = await page.evaluate(() => {
                        const novi = [...document.querySelectorAll('a')].filter((a) => { const b = a.getBoundingClientRect(); return !a.hasAttribute('data-vidljiv-pre') && b.width && b.height && b.top >= 0 && b.top < innerHeight && getComputedStyle(a).visibility !== 'hidden' && a.innerText.trim(); });
                        if (!novi.length) return { greska: 'nema novih linkova posle klika' };
                        let m = novi[0];
                        while (m.parentElement && !novi.every((a) => m.contains(a))) m = m.parentElement;
                        let panel = m;
                        for (let x = m; x && x !== document.body; x = x.parentElement) { const p = getComputedStyle(x).position; if (p === 'fixed' || p === 'absolute') { panel = x; break; } }
                        const s = getComputedStyle(panel); const b = panel.getBoundingClientRect();
                        const velicine = {};
                        for (const a of novi) { const c = getComputedStyle(a); const k = `${c.fontFamily.split(',')[0]} ${c.fontSize}/${c.lineHeight} ${c.fontWeight} tt=${c.textTransform} ls=${c.letterSpacing} boja=${c.color}`; velicine[k] = (velicine[k] || 0) + 1; }
                        return { pozadina: s.backgroundColor, pozicija: s.position, levo: Math.round(b.left), sirina: Math.round(b.width), visina: Math.round(b.height), tranzicija: s.transition.slice(0, 140), transform: s.transform, animacija: s.animationName, stavke: novi.map((a) => a.innerText.trim()).slice(0, 16), stiloviLinkova: velicine };
                    });
                } catch (e) { log.push(`meni: ${e.message.slice(0, 80)}`); }
            } else log.push('meni: dugme nije nađeno');
        }

        podaci.log = log;
        fs.writeFileSync(path.join(dir, 'podaci.json'), JSON.stringify(podaci, null, 1));
        console.log(`  ✓ ${ime} / ${ekran}: ${podaci.sekcije.length} sekcija, ${podaci.tipografija.length} tip. stilova, ${podaci.karuseli.length} karusela, ${podaci.hover.length} hover pravila${log.length ? ` (${log.join('; ')})` : ''}`);
    } catch (e) {
        console.log(`  ✗ ${ime} / ${ekran}: ${e.message.slice(0, 120)}`);
        fs.writeFileSync(path.join(dir, 'greska.txt'), String(e.stack));
    } finally {
        await ctx.close();
    }
};

const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ['--disable-blink-features=AutomationControlled'] });
for (const [ime, url] of Object.entries(SAJTOVI)) {
    if (izabrani.length && !izabrani.includes(ime)) continue;
    console.log(`→ ${ime} (${url})`);
    for (const ekran of Object.keys(EKRANI)) await obradi(browser, ime, url, ekran);
}
await browser.close();
console.log('\nGotovo — izlaz/<tema>/<desktop|telefon>/');
