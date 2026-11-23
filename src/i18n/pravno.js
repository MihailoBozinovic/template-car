/*
 * PRAVNI TEKSTOVI — šablon, popunjen podacima iz servis.js.
 *
 * Pisani su prema Zakonu o zaštiti podataka o ličnosti („Sl. glasnik RS”,
 * br. 87/2018) i Zakonu o zaštiti potrošača („Sl. glasnik RS”, br. 88/2021),
 * za sajt koji prima zahteve za termin. Šablon nije pravni savet: pre objave
 * za klijenta neka ga pogleda pravnik, naročito ako servis koristi analitiku,
 * newsletter ili prodaje online.
 *
 * Engleska i ruska verzija su prevodi; merodavna je srpska (to piše i u njima).
 */
import { tx } from './jezici.js';

const podaci = (s, j) => {
    const f = s.firma;
    const kanal = s.zakazivanje?.kanal?.tip ?? 'whatsapp';
    return {
        naziv: f.naziv, adresa: f.adresa, pib: f.pib, mb: f.maticniBroj, email: f.emailZaPodatke || s.kontakt.email,
        telefon: s.kontakt.telefonPrikaz, servisNaziv: s.naziv, domen: s.domen.replace(/^https?:\/\//, ''),
        otkaz: s.zakazivanje?.otkazivanjeSati ?? 24, analitika: Boolean(s.analitika?.ga4 || s.analitika?.metaPixel),
        ga: Boolean(s.analitika?.ga4), meta: Boolean(s.analitika?.metaPixel), kanal, grad: tx(s.lokacija.grad, j),
        pdv: f.pdvObveznik,
    };
};

const KANAL = {
    sr: { webhook: 'servis za prijem formulara koji koristimo', whatsapp: 'WhatsApp (Meta Platforms Ireland Ltd.)', viber: 'Viber (Rakuten Viber)', email: 'e-poštu' },
    en: { webhook: 'the form-processing service we use', whatsapp: 'WhatsApp (Meta Platforms Ireland Ltd.)', viber: 'Viber (Rakuten Viber)', email: 'e-mail' },
    ru: { webhook: 'сервис обработки форм, который мы используем', whatsapp: 'WhatsApp (Meta Platforms Ireland Ltd.)', viber: 'Viber (Rakuten Viber)', email: 'электронную почту' },
};

const PRIVATNOST = {
    sr: (d) => [
        { naslov: 'Rukovalac podacima', p: [`Rukovalac vašim podacima o ličnosti je ${d.naziv}, ${d.adresa}, PIB ${d.pib}, MB ${d.mb} (u daljem tekstu: servis). Za sva pitanja o podacima pišite na ${d.email}.`] },
        { naslov: 'Koje podatke prikupljamo', p: ['Kada pošaljete zahtev za termin: ime i prezime, broj telefona, e-mail (ako ga unesete), vrsta vozila, izabrane usluge, datum i vreme, marka, model i registarska oznaka vozila (ako ih unesete) i napomena koju sami napišete.', 'Ne tražimo i ne čuvamo podatke o platnim karticama. U napomeni ne navodite podatke koji nisu potrebni za uslugu.'] },
        { naslov: 'Svrha i pravni osnov', p: ['Podatke koristimo isključivo da bismo obradili vaš zahtev, potvrdili, pomerili ili otkazali termin i kontaktirali vas u vezi sa njim. Pravni osnov je preduzimanje radnji na vaš zahtev pre zaključenja ugovora i izvršenje ugovora (član 12. stav 1. tačka 2) ZZPL), kao i vaš pristanak koji dajete pri slanju zahteva.'] },
        { naslov: 'Kako podaci stižu do servisa', p: [`Zahtev nam se šalje preko kanala: ${KANAL.sr[d.kanal] ?? KANAL.sr.whatsapp}. Ako je to aplikacija za poruke, poruku šaljete vi iz svoje aplikacije i na nju se primenjuju i uslovi te aplikacije.`] },
        { naslov: 'Koliko dugo čuvamo podatke', p: ['Podatke o terminu čuvamo dok traje poslovni odnos i najduže dve godine od poslednje posete, osim kada propisi (npr. računovodstveni) nalažu duži rok. Posle toga se brišu ili anonimizuju.'] },
        { naslov: 'Kome ih dajemo', p: ['Podatke ne prodajemo i ne ustupamo trećim licima u marketinške svrhe. Mogu im pristupiti samo naši zaposleni i obrađivači koji nam pružaju tehničke usluge (hosting sajta, e-pošta, aplikacija za poruke), uz obavezu čuvanja poverljivosti, kao i nadležni organi kada to zakon zahteva.'] },
        { naslov: 'Vaša prava', p: ['Imate pravo na pristup, ispravku, brisanje i ograničenje obrade podataka, pravo na prenosivost, pravo na prigovor i pravo da u svakom trenutku opozovete pristanak, bez uticaja na zakonitost ranije obrade (članovi 26–40. ZZPL). Zahtev pošaljite na ' + d.email + '; odgovaramo bez odlaganja, najkasnije u roku od 30 dana.', 'Ako smatrate da je obrada nezakonita, možete podneti pritužbu Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti, Bulevar kralja Aleksandra 15, 11000 Beograd, www.poverenik.rs.'] },
        { naslov: 'Kolačići', p: [d.analitika ? 'Sajt koristi neophodno skladište u browseru i, samo uz vaš pristanak, analitičke kolačiće. Detalji su na stranici Kolačići.' : 'Sajt ne koristi kolačiće za praćenje; koristi samo neophodno skladište u browseru. Detalji su na stranici Kolačići.'] },
    ],
    en: (d) => [
        { naslov: 'Data controller', p: [`The controller of your personal data is ${d.naziv}, ${d.adresa}, tax ID ${d.pib}, reg. no. ${d.mb} (“we”). For any question about your data, write to ${d.email}. This is a translation; the Serbian version prevails.`] },
        { naslov: 'What we collect', p: ['When you send a booking request: your name, phone number, e-mail (if provided), vehicle type, chosen services, date and time, the vehicle make, model and plate (if provided) and any note you write.', 'We never ask for or store card details. Please don’t include information in the note that is not needed for the service.'] },
        { naslov: 'Purpose and legal basis', p: ['We use your data only to handle your request, confirm, move or cancel the appointment and contact you about it. The legal basis is taking steps at your request before entering into a contract and performing that contract (Art. 12(1)(2) of the Serbian Personal Data Protection Act), and the consent you give when sending the request.'] },
        { naslov: 'How your request reaches us', p: [`Requests are sent via ${KANAL.en[d.kanal] ?? KANAL.en.whatsapp}. If this is a messaging app, you send the message from your own app and that app’s terms also apply.`] },
        { naslov: 'How long we keep it', p: ['We keep appointment data for as long as we have a business relationship and at most two years after your last visit, unless the law (e.g. accounting rules) requires longer. It is then deleted or anonymised.'] },
        { naslov: 'Who we share it with', p: ['We don’t sell your data or share it for marketing. Only our staff and processors providing technical services (website hosting, e-mail, messaging) can access it, under confidentiality obligations, and authorities where required by law.'] },
        { naslov: 'Your rights', p: [`You have the right to access, rectify, erase and restrict processing of your data, to data portability, to object, and to withdraw consent at any time without affecting earlier lawful processing. Send requests to ${d.email}; we reply without delay and within 30 days at the latest.`, 'You may lodge a complaint with the Commissioner for Information of Public Importance and Personal Data Protection, Bulevar kralja Aleksandra 15, 11000 Belgrade, www.poverenik.rs.'] },
        { naslov: 'Cookies', p: [d.analitika ? 'The site uses essential browser storage and, only with your consent, analytics cookies. See the Cookies page for details.' : 'The site uses no tracking cookies — only essential browser storage. See the Cookies page for details.'] },
    ],
    ru: (d) => [
        { naslov: 'Оператор данных', p: [`Оператором ваших персональных данных является ${d.naziv}, ${d.adresa}, ИНН ${d.pib}, рег. номер ${d.mb} («сервис»). По любым вопросам о данных пишите на ${d.email}. Это перевод; приоритет имеет сербская версия.`] },
        { naslov: 'Какие данные мы собираем', p: ['При отправке заявки на запись: имя и фамилия, номер телефона, e-mail (если указан), тип автомобиля, выбранные услуги, дата и время, марка, модель и госномер (если указаны) и ваш комментарий.', 'Мы не запрашиваем и не храним данные банковских карт. Не указывайте в комментарии сведения, не нужные для услуги.'] },
        { naslov: 'Цель и правовое основание', p: ['Данные используются только для обработки заявки, подтверждения, переноса или отмены записи и связи с вами по этому поводу. Основание — действия по вашему запросу до заключения договора и исполнение договора (ст. 12 ч. 1 п. 2 Закона Сербии о защите персональных данных), а также согласие, которое вы даёте при отправке заявки.'] },
        { naslov: 'Как заявка попадает в салон', p: [`Заявка отправляется через ${KANAL.ru[d.kanal] ?? KANAL.ru.whatsapp}. Если это мессенджер, вы отправляете сообщение из своего приложения, и к нему применяются также условия этого приложения.`] },
        { naslov: 'Срок хранения', p: ['Данные о записи хранятся в течение деловых отношений и не более двух лет после последнего визита, если закон (например, правила бухучёта) не требует дольше. Затем они удаляются или обезличиваются.'] },
        { naslov: 'Кому передаются данные', p: ['Мы не продаём данные и не передаём их для маркетинга. Доступ имеют только наши сотрудники и обработчики, оказывающие технические услуги (хостинг, почта, мессенджер), с обязательством конфиденциальности, а также органы власти в случаях, предусмотренных законом.'] },
        { naslov: 'Ваши права', p: [`Вы вправе получить доступ к данным, исправить, удалить их и ограничить обработку, на переносимость, на возражение и на отзыв согласия в любой момент без влияния на законность прежней обработки. Направьте запрос на ${d.email}; мы ответим без промедления, не позднее 30 дней.`, 'Вы можете подать жалобу Уполномоченному по информации общественного значения и защите персональных данных, Bulevar kralja Aleksandra 15, 11000 Белград, www.poverenik.rs.'] },
        { naslov: 'Cookie', p: [d.analitika ? 'Сайт использует необходимое хранилище браузера и, только с вашего согласия, аналитические cookie. Подробнее — на странице Cookie.' : 'Сайт не использует отслеживающие cookie — только необходимое хранилище браузера. Подробнее — на странице Cookie.'] },
    ],
};

const USLOVI = {
    sr: (d) => [
        { naslov: 'O sajtu', p: [`Sajt ${d.domen} vodi ${d.naziv}, ${d.adresa}, PIB ${d.pib}, MB ${d.mb}. Korišćenjem sajta prihvatate ove uslove.`] },
        { naslov: 'Zakazivanje', p: ['Zahtev poslat preko sajta nije rezervacija dok ga ne potvrdimo porukom ili pozivom. Možemo predložiti drugi termin ako izabrani nije slobodan.', 'Molimo vas da dođete na vreme. Kod kašnjenja dužeg od 15 minuta termin možemo pomeriti, kako ne bi kasnili sledeći klijenti.'] },
        { naslov: 'Otkazivanje', p: [`Termin možete besplatno otkazati ili pomeriti najkasnije ${d.otkaz} sati ranije, pozivom ili porukom na ${d.telefon}. Kod ponovljenog nedolaska bez otkazivanja možemo tražiti potvrdu ili avans za sledeće zakazivanje.`] },
        { naslov: 'Cene', p: [`Cene na sajtu su u dinarima${d.pdv ? ' i sadrže PDV' : '; nismo u sistemu PDV-a'}. Cena zavisi od izabranog vozila; kod usluga označenih sa „od” konačna cena zavisi od stanja vozila i potrebnih delova i dogovara se pre početka rada. Zadržavamo pravo izmene cena; važi cena važeća na dan usluge.`] },
        { naslov: 'Predaja vozila', p: ['Pre predaje vozila iz njega uklonite vredne lične stvari. Postojeća oštećenja beležimo pri prijemu, po potrebi i fotografijama. Vozilo koje nije preuzeto do kraja radnog vremena dana kada je gotovo ostaje kod nas na čuvanju, uz prethodni dogovor.'] },
        { naslov: 'Reklamacije', p: [`Ako niste zadovoljni uslugom, javite nam se u roku od 7 dana na ${d.email} ili ${d.telefon}. Reklamacije rešavamo u skladu sa Zakonom o zaštiti potrošača; na reklamaciju odgovaramo u roku od 8 dana.`] },
        { naslov: 'Sadržaj sajta', p: ['Tekstovi i fotografije na sajtu naše su vlasništvo ili se koriste uz dozvolu autora i ne smeju se preuzimati bez saglasnosti.'] },
    ],
    en: (d) => [
        { naslov: 'About this site', p: [`${d.domen} is run by ${d.naziv}, ${d.adresa}, tax ID ${d.pib}, reg. no. ${d.mb}. By using the site you accept these terms. This is a translation; the Serbian version prevails.`] },
        { naslov: 'Booking', p: ['A request sent through the site is not a reservation until we confirm it by message or phone. We may suggest another time if the chosen one is not available.', 'Please arrive on time. If you are more than 15 minutes late, we may move the appointment so that other clients are not delayed.'] },
        { naslov: 'Cancellation', p: [`You can cancel or move your appointment free of charge up to ${d.otkaz} hours in advance by calling or messaging ${d.telefon}. After repeated no-shows we may ask for a confirmation or deposit for future bookings.`] },
        { naslov: 'Prices', p: [`Prices are in Serbian dinars${d.pdv ? ' and include VAT' : '; we are not VAT-registered'}. Prices depend on the chosen vehicle; for services marked “from”, the final price depends on the vehicle’s condition and parts needed and is agreed before work begins. Prices may change; the price valid on the day of service applies.`] },
        { naslov: 'Vehicle handover', p: ['Please remove valuables from the vehicle before handing it over. Existing damage is recorded at check-in, with photos where needed. A vehicle not collected by closing time on the day it is ready stays with us by prior arrangement.'] },
        { naslov: 'Complaints', p: [`If you are not satisfied, contact us within 7 days at ${d.email} or ${d.telefon}. Complaints are handled under the Serbian Consumer Protection Act; we reply within 8 days.`] },
        { naslov: 'Site content', p: ['Texts and photographs on this site belong to us or are used with the author’s permission and may not be reused without consent.'] },
    ],
    ru: (d) => [
        { naslov: 'О сайте', p: [`Сайт ${d.domen} принадлежит ${d.naziv}, ${d.adresa}, ИНН ${d.pib}, рег. номер ${d.mb}. Пользуясь сайтом, вы принимаете эти условия. Это перевод; приоритет имеет сербская версия.`] },
        { naslov: 'Запись', p: ['Заявка, отправленная через сайт, не является бронированием, пока мы не подтвердим её сообщением или звонком. Если выбранное время занято, мы можем предложить другое.', 'Пожалуйста, приходите вовремя. При опоздании более чем на 15 минут мы можем перенести запись, чтобы не задерживать других клиентов.'] },
        { naslov: 'Отмена', p: [`Отменить или перенести запись бесплатно можно не позднее чем за ${d.otkaz} ч, позвонив или написав на ${d.telefon}. При повторных неявках мы можем попросить подтверждение или предоплату для следующих записей.`] },
        { naslov: 'Цены', p: [`Цены указаны в сербских динарах${d.pdv ? ' и включают НДС' : '; мы не являемся плательщиком НДС'}. Цена зависит от автомобиля; для услуг с пометкой «от» итоговая цена зависит от состояния автомобиля и запчастей и согласуется до начала работ. Цены могут меняться; действует цена на день оказания услуги.`] },
        { naslov: 'Передача автомобиля', p: ['Перед передачей автомобиля заберите из него ценные вещи. Имеющиеся повреждения фиксируются при приёме, при необходимости — на фото. Автомобиль, не забранный до конца рабочего дня, в который он готов, остаётся у нас по предварительной договорённости.'] },
        { naslov: 'Претензии', p: [`Если вы недовольны услугой, свяжитесь с нами в течение 7 дней: ${d.email} или ${d.telefon}. Претензии рассматриваются по Закону Сербии о защите прав потребителей; ответ — в течение 8 дней.`] },
        { naslov: 'Материалы сайта', p: ['Тексты и фотографии на сайте принадлежат нам или используются с разрешения автора и не могут копироваться без согласия.'] },
    ],
};

const KOLACICI = {
    sr: (d) => [
        { naslov: 'Šta sajt čuva u vašem browseru', p: ['Neophodno skladište (localStorage): vaš izbor u vezi sa kolačićima i, ako ste ga menjali, izbor izgleda sajta. Ovi podaci ne napuštaju vaš uređaj i ne služe za praćenje.', 'Mapa na stranici Kontakt koristi OpenFreeMap (podaci OpenStreetMap), bez kolačića i bez praćenja; učitava se tek kad stignete do nje.'] },
        d.analitika
            ? { naslov: 'Analitički kolačići (samo uz pristanak)', p: [[d.ga && 'Google Analytics 4 (Google Ireland Ltd.) — anonimizovana statistika poseta', d.meta && 'Meta Pixel (Meta Platforms Ireland Ltd.) — merenje oglasa'].filter(Boolean).join('; ') + '. Učitavaju se tek kada kliknete „Prihvati sve”; dok to ne uradite, ne postoje.'] }
            : { naslov: 'Analitika', p: ['Sajt trenutno ne koristi analitičke ni marketinške kolačiće.'] },
        { naslov: 'Promena izbora', p: ['Izbor možete promeniti u svakom trenutku preko linka „Podešavanja kolačića” u dnu stranice, ili brisanjem podataka sajta u podešavanjima browsera.'] },
    ],
    en: (d) => [
        { naslov: 'What the site stores in your browser', p: ['Essential storage (localStorage): your cookie choice and, if you changed it, the site’s look. This data never leaves your device and isn’t used for tracking.', 'The map on the Contact page uses OpenFreeMap (OpenStreetMap data), with no cookies or tracking; it loads only when you scroll to it.'] },
        d.analitika
            ? { naslov: 'Analytics cookies (only with consent)', p: [[d.ga && 'Google Analytics 4 (Google Ireland Ltd.) — anonymised visit statistics', d.meta && 'Meta Pixel (Meta Platforms Ireland Ltd.) — ad measurement'].filter(Boolean).join('; ') + '. They load only after you click “Accept all”; until then they don’t exist.'] }
            : { naslov: 'Analytics', p: ['The site currently uses no analytics or marketing cookies.'] },
        { naslov: 'Changing your choice', p: ['You can change your choice at any time via “Cookie settings” at the bottom of the page, or by clearing site data in your browser settings.'] },
    ],
    ru: (d) => [
        { naslov: 'Что сайт хранит в браузере', p: ['Необходимое хранилище (localStorage): ваш выбор по cookie и, если вы его меняли, вид сайта. Эти данные не покидают устройство и не используются для отслеживания.', 'Карта на странице «Контакты» использует OpenFreeMap (данные OpenStreetMap), без cookie и отслеживания; загружается только при прокрутке к ней.'] },
        d.analitika
            ? { naslov: 'Аналитические cookie (только с согласия)', p: [[d.ga && 'Google Analytics 4 (Google Ireland Ltd.) — анонимная статистика посещений', d.meta && 'Meta Pixel (Meta Platforms Ireland Ltd.) — измерение рекламы'].filter(Boolean).join('; ') + '. Загружаются только после нажатия «Принять все»; до этого их нет.'] }
            : { naslov: 'Аналитика', p: ['Сейчас сайт не использует аналитические и маркетинговые cookie.'] },
        { naslov: 'Изменение выбора', p: ['Изменить выбор можно в любой момент по ссылке «Настройки cookie» внизу страницы или очистив данные сайта в настройках браузера.'] },
    ],
};

const SKUP = { privatnost: PRIVATNOST, uslovi: USLOVI, kolacici: KOLACICI };

/** Odeljci pravne stranice: [{ naslov, p: [pasusi] }]. */
export const pravniTekst = (vrsta, servis, jezik) => {
    const sk = SKUP[vrsta];
    return (sk[jezik] ?? sk.sr)(podaci(servis, jezik));
};
