/*
 * DELATNOSTI — gotovi predlošci sadržaja po vrsti posla.
 *
 * Svaki predložak donosi usluge sa cenama (i izborom vozila kad cena zavisi od
 * njega), tekstove početne i „O nama”, galeriju, pitanja, brendove i
 * podešavanja zakazivanja. U src/config/servis.js se bira jednim redom
 * (`delatnost: 'vulkanizer'`), a svako polje predloška može da se pregazi.
 *
 * `schema` je tip preduzeća za Google (schema.org): AutoWash, AutoRepair,
 * TireShop… — ide u strukturirane podatke (JSON-LD).
 */
import perionica from './perionica.js';
import detailing from './detailing.js';
import tehnicki from './tehnicki.js';
import vulkanizer from './vulkanizer.js';
import servis from './servis.js';

export const DELATNOSTI = {
    perionica: { naziv: { sr: 'Perionica', en: 'Car wash' }, opis: { sr: 'Ručno pranje, enterijer i zaštita laka', en: 'Hand wash, interior & protection' }, schema: 'AutoWash', sifraDelatnosti: '4520', predlozak: perionica },
    detailing: { naziv: { sr: 'Detailing studio', en: 'Detailing studio' }, opis: { sr: 'Korekcija laka, keramika, PPF folija', en: 'Paint correction, ceramic, PPF' }, schema: 'AutoBodyShop', sifraDelatnosti: '4520', predlozak: detailing },
    tehnicki: { naziv: { sr: 'Tehnički pregled', en: 'Vehicle inspection' }, opis: { sr: 'Tehnički pregled i registracija', en: 'Inspection & registration' }, schema: 'AutomotiveBusiness', sifraDelatnosti: '7120', predlozak: tehnicki },
    vulkanizer: { naziv: { sr: 'Vulkanizer', en: 'Tyre shop' }, opis: { sr: 'Gume, balansiranje, hotel za gume', en: 'Tyres, balancing, tyre hotel' }, schema: 'TireShop', sifraDelatnosti: '4520', predlozak: vulkanizer },
    servis: { naziv: { sr: 'Auto servis', en: 'Car service' }, opis: { sr: 'Održavanje, dijagnostika, popravke', en: 'Maintenance, diagnostics, repairs' }, schema: 'AutoRepair', sifraDelatnosti: '4520', predlozak: servis },
};

export const PODRAZUMEVANA_DELATNOST = 'perionica';
