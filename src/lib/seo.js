/*
 * SEO — naslov, opis, canonical, hreflang, Open Graph i JSON-LD za svaku
 * stranicu na svakom jeziku. Isti kod koristi prerender (statički <head> u
 * dist/) i browser (pri promeni stranice), pa se nikad ne raziđu.
 *
 * Tip preduzeća za Google dolazi iz delatnosti (AutoWash, TireShop,
 * AutoRepair…), a svaka stranica usluge dobija Service + Offer + FAQ podatke —
 * isto kao ServicePage u Eclectic-u, samo generisano iz konfiguracije.
 */
import { servis as servisSajta } from '../config/sajt.js';
import { SVI_JEZICI, putanja, tx, RUTE } from '../i18n/jezici.js';
import { recnik } from '../i18n/index.js';
import { DANI_PO_INDEKSU } from './vreme.js';
import { sveUsluge } from './zakazivanje.js';
import { najnizaCena } from './cene.js';
import { DOMEN, apsolutno } from './baza.js';

export const aktivniJezici = (s = servisSajta) => (s.jezici?.length ? s.jezici : ['sr']).filter((j) => SVI_JEZICI[j]);

/** Stranice koje idu u sitemap (pravne su indeksirane, ali niskog prioriteta). */
export const INDEKSIRANE = Object.keys(RUTE);

const DAN_SCHEMA = { pon: 'Monday', uto: 'Tuesday', sre: 'Wednesday', cet: 'Thursday', pet: 'Friday', sub: 'Saturday', ned: 'Sunday' };

const podaciZaTekst = (s, jezik) => ({
    naziv: s.naziv,
    slogan: tx(s.slogan, jezik),
    grad: tx(s.lokacija.grad, jezik),
    adresa: s.lokacija.adresa,
    usluge: s.kategorije.slice(0, 4).map((k) => tx(k.naziv, jezik).toLowerCase()).join(', '),
});

const naslovOpis = (s, kljuc, jezik, kategorija) => {
    const t = recnik(jezik).seo;
    const d = podaciZaTekst(s, jezik);
    if (kljuc === 'usluga' && kategorija) {
        return {
            naslov: t.usluga({ ...d, usluga: tx(kategorija.naziv, jezik) }),
            opis: tx(kategorija.kratko, jezik) || tx(s.opis, jezik),
        };
    }
    const pravno = ['privatnost', 'uslovi', 'kolacici'].includes(kljuc);
    const podr = {
        naslov: t[kljuc] ? t[kljuc](d) : s.naziv,
        opis: kljuc === 'pocetna' ? tx(s.opis, jezik) : pravno ? t.pravnoOpis(d) : (t[`${kljuc}Opis`]?.(d) ?? tx(s.opis, jezik)),
    };
    const pregaz = s.seo?.stranice?.[kljuc] ?? {};
    return {
        naslov: tx(pregaz.naslov, jezik) || podr.naslov,
        opis: tx(pregaz.opis, jezik) || podr.opis,
    };
};

const schemaPreduzeca = (s, jezik) => {
    const id = `${DOMEN}/#servis`;
    const k = s.kontakt;
    const l = s.lokacija;
    const sameAs = [k.instagram, k.facebook, k.tiktok].filter(Boolean);
    const sati = Object.entries(s.radnoVreme)
        .filter(([, v]) => v)
        .map(([dan, [od, do_]]) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: `https://schema.org/${DAN_SCHEMA[dan]}`, opens: od, closes: do_ }));
    const specijalni = (s.neradniDani ?? []).map((n) => ({
        '@type': 'OpeningHoursSpecification', validFrom: n.datum, validThrough: n.datum, opens: '00:00', closes: '00:00',
    }));
    const cene = sveUsluge(s).map(najnizaCena).filter((c) => c > 0);
    const r = s.recenzije;
    const praveRecenzije = r?.lista?.length && !r.lista.some((x) => /demo/i.test(x.autor));
    return {
        '@type': s.delatnostInfo?.schema || 'AutomotiveBusiness',
        '@id': id,
        name: s.naziv,
        description: tx(s.opis, jezik),
        url: apsolutno(putanja('pocetna', jezik)),
        telephone: k.telefon,
        email: k.email || undefined,
        image: apsolutno(s.seo?.slikaZaDeljenje || '/og-slika.jpg'),
        logo: apsolutno(s.logo || '/ikona-512.png'),
        priceRange: cene.length ? `${Math.min(...cene)}–${Math.max(...cene)} RSD` : undefined,
        currenciesAccepted: 'RSD',
        paymentAccepted: (s.placanje ?? []).join(', ') || undefined,
        foundingDate: s.osnovan ? String(s.osnovan) : undefined,
        address: {
            '@type': 'PostalAddress',
            streetAddress: l.adresa,
            postalCode: l.postanskiBroj,
            addressLocality: tx(l.grad, jezik),
            addressCountry: l.drzava || 'RS',
        },
        geo: l.koordinate ? { '@type': 'GeoCoordinates', latitude: l.koordinate.lat, longitude: l.koordinate.lng } : undefined,
        hasMap: l.googleMape || (l.koordinate ? `https://www.google.com/maps?q=${l.koordinate.lat},${l.koordinate.lng}` : undefined),
        openingHoursSpecification: [...sati, ...specijalni],
        // Ocena ide Google-u samo kad recenzije nisu demo — lažna ocena krši pravila Google-a.
        aggregateRating: praveRecenzije && r.prosek && r.broj ? { '@type': 'AggregateRating', ratingValue: r.prosek, reviewCount: r.broj } : undefined,
        sameAs: sameAs.length ? sameAs : undefined,
    };
};

const ponuda = (u, jezik) => ({
    '@type': 'Offer',
    price: najnizaCena(u),
    priceCurrency: 'RSD',
    ...(u.cenaOd || typeof u.cena === 'object' ? { priceSpecification: { '@type': 'PriceSpecification', minPrice: najnizaCena(u), priceCurrency: 'RSD' } } : {}),
    itemOffered: { '@type': 'Service', name: tx(u.naziv, jezik), description: tx(u.opis, jezik) || undefined },
});

const katalog = (s, jezik) => ({
    '@type': 'OfferCatalog',
    name: recnik(jezik).cenovnik.naslov,
    itemListElement: s.kategorije.map((k) => ({
        '@type': 'OfferCatalog',
        name: tx(k.naziv, jezik),
        itemListElement: k.usluge.map((u) => ponuda(u, jezik)),
    })),
});

const faq = (pitanja, jezik) => ({
    '@type': 'FAQPage',
    mainEntity: pitanja.map((p) => ({ '@type': 'Question', name: tx(p.pitanje, jezik), acceptedAnswer: { '@type': 'Answer', text: tx(p.odgovor, jezik) } })),
});

const mrvice = (jezik, stavke) => ({
    '@type': 'BreadcrumbList',
    itemListElement: [
        { '@type': 'ListItem', position: 1, name: recnik(jezik).nav.pocetna, item: apsolutno(putanja('pocetna', jezik)) },
        ...stavke.map((st, i) => ({ '@type': 'ListItem', position: i + 2, name: st.naziv, item: st.url })),
    ],
});

/** Kompletni meta podaci za stranicu. `kljuc` null = 404. */
export const metaStranice = (kljuc, jezik, slug = null, s = servisSajta) => {
    const jezici = aktivniJezici(s);
    const lang = SVI_JEZICI[jezik];
    const kategorija = kljuc === 'usluga' ? s.kategorije.find((k) => k.id === slug) : null;
    if (!kljuc || (kljuc === 'usluga' && !kategorija)) {
        const t = recnik(jezik).nijePronadjeno;
        return { lang: jezik, naslov: `${t.naslov} — ${s.naziv}`, opis: t.tekst, robots: 'noindex, follow', alternativni: [], jsonLd: null };
    }
    const { naslov, opis } = naslovOpis(s, kljuc, jezik, kategorija);
    const canonical = apsolutno(putanja(kljuc, jezik, slug));
    const alternativni = jezici.map((j) => ({ hreflang: j, href: apsolutno(putanja(kljuc, j, slug)) }));
    if (jezici.length > 1) alternativni.push({ hreflang: 'x-default', href: apsolutno(putanja(kljuc, jezici[0], slug)) });

    const graf = [];
    const biz = schemaPreduzeca(s, jezik);
    const kratakNaslov = naslov.split(' — ')[0];
    if (kljuc === 'pocetna') {
        graf.push({ '@type': 'WebSite', '@id': `${DOMEN}/#sajt`, url: canonical, name: s.naziv, inLanguage: lang.locale, publisher: { '@id': biz['@id'] } });
        graf.push({ ...biz, hasOfferCatalog: katalog(s, jezik) });
    } else if (kljuc === 'cenovnik') {
        graf.push({ ...biz, hasOfferCatalog: katalog(s, jezik) });
    } else if (kljuc === 'kontakt') {
        graf.push(biz);
    } else if (kljuc === 'pitanja' && s.pitanja?.length) {
        graf.push(faq(s.pitanja, jezik));
    } else if (kljuc === 'usluga') {
        graf.push({
            '@type': 'Service',
            name: tx(kategorija.naziv, jezik),
            description: opis,
            provider: { '@id': biz['@id'] },
            areaServed: { '@type': 'City', name: tx(s.lokacija.grad, jezik) },
            hasOfferCatalog: { '@type': 'OfferCatalog', name: tx(kategorija.naziv, jezik), itemListElement: kategorija.usluge.map((u) => ponuda(u, jezik)) },
        });
        graf.push(biz);
        if (kategorija.pitanja?.length) graf.push(faq(kategorija.pitanja, jezik));
    }
    if (kljuc === 'usluga') {
        graf.push(mrvice(jezik, [
            { naziv: recnik(jezik).nav.cenovnik, url: apsolutno(putanja('cenovnik', jezik)) },
            { naziv: tx(kategorija.naziv, jezik), url: canonical },
        ]));
    } else if (kljuc !== 'pocetna') {
        graf.push(mrvice(jezik, [{ naziv: kratakNaslov, url: canonical }]));
    }

    const slika = kategorija?.slika || s.seo?.slikaZaDeljenje || '/og-slika.jpg';
    return {
        lang: jezik,
        locale: lang.locale,
        naslov,
        opis,
        canonical,
        alternativni,
        robots: s.demo ? 'noindex, nofollow' : 'index, follow, max-image-preview:large',
        og: {
            type: 'website', title: naslov, description: opis, url: canonical,
            image: apsolutno(slika), locale: lang.og,
            alternate: jezici.filter((j) => j !== jezik).map((j) => SVI_JEZICI[j].og), siteName: s.naziv,
        },
        jsonLd: graf.length ? { '@context': 'https://schema.org', '@graph': graf } : null,
    };
};

const html = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** <head> deo kao HTML (za prerender). */
export const headHtml = (m) => {
    const r = [
        `<title>${html(m.naslov)}</title>`,
        `<meta name="description" content="${html(m.opis)}">`,
        `<meta name="robots" content="${m.robots}">`,
    ];
    if (m.canonical) r.push(`<link rel="canonical" href="${m.canonical}">`);
    for (const a of m.alternativni) r.push(`<link rel="alternate" hreflang="${a.hreflang}" href="${a.href}">`);
    if (m.og) {
        const o = m.og;
        r.push(
            `<meta property="og:type" content="${o.type}">`, `<meta property="og:site_name" content="${html(o.siteName)}">`,
            `<meta property="og:title" content="${html(o.title)}">`, `<meta property="og:description" content="${html(o.description)}">`,
            `<meta property="og:url" content="${o.url}">`, `<meta property="og:image" content="${o.image}">`,
            `<meta property="og:locale" content="${o.locale}">`,
            ...o.alternate.map((a) => `<meta property="og:locale:alternate" content="${a}">`),
            `<meta name="twitter:card" content="summary_large_image">`,
        );
    }
    if (m.jsonLd) r.push(`<script type="application/ld+json">${JSON.stringify(m.jsonLd).replace(/</g, '\\u003c')}</script>`);
    return r.join('\n    ');
};

/** U browseru: osvežava <head> pri promeni stranice. */
export const primeniMeta = (m) => {
    document.title = m.naslov;
    document.documentElement.lang = m.lang;
    const meta = (sel, attr, val) => {
        let el = document.head.querySelector(sel);
        if (!el) {
            el = document.createElement('meta');
            const [, k, v] = /\[(\w+(?::\w+)?)="([^"]+)"\]/.exec(sel) ?? [];
            if (k) el.setAttribute(k, v);
            document.head.appendChild(el);
        }
        el.setAttribute(attr, val);
    };
    meta('meta[name="description"]', 'content', m.opis);
    meta('meta[name="robots"]', 'content', m.robots);
    if (m.og) {
        meta('meta[property="og:title"]', 'content', m.og.title);
        meta('meta[property="og:description"]', 'content', m.og.description);
        meta('meta[property="og:url"]', 'content', m.og.url);
        meta('meta[property="og:image"]', 'content', m.og.image);
    }
    let can = document.head.querySelector('link[rel="canonical"]');
    if (m.canonical) {
        if (!can) { can = document.createElement('link'); can.rel = 'canonical'; document.head.appendChild(can); }
        can.href = m.canonical;
    }
    document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((e) => e.remove());
    for (const a of m.alternativni) {
        const l = document.createElement('link');
        l.rel = 'alternate'; l.hreflang = a.hreflang; l.href = a.href;
        document.head.appendChild(l);
    }
    document.head.querySelectorAll('script[type="application/ld+json"]').forEach((e) => e.remove());
    if (m.jsonLd) {
        const sc = document.createElement('script');
        sc.type = 'application/ld+json';
        sc.textContent = JSON.stringify(m.jsonLd);
        document.head.appendChild(sc);
    }
};

export { DANI_PO_INDEKSU };
