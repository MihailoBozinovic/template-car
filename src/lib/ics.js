/* Fajl za kalendar (.ics) — „Dodaj u kalendar” posle zakazivanja. Vreme je beogradsko (TZID). */
const pad = (n) => String(n).padStart(2, '0');
const esc = (s) => String(s).replace(/[\\,;]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');

export const napraviIcs = ({ naslov, opis, lokacija, datum, vreme, trajanje }) => {
    const [g, m, d] = datum.split('-').map(Number);
    const [h, min] = vreme.split(':').map(Number);
    const kraj = h * 60 + min + trajanje;
    const lok = (hh, mm) => `${g}${pad(m)}${pad(d)}T${pad(hh)}${pad(mm)}00`;
    const sada = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
    return [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Template Car//SR', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
        `UID:${Date.now()}-${Math.random().toString(36).slice(2)}@sajt`, `DTSTAMP:${sada}`,
        `DTSTART;TZID=Europe/Belgrade:${lok(h, min)}`, `DTEND;TZID=Europe/Belgrade:${lok(Math.floor(kraj / 60), kraj % 60)}`,
        `SUMMARY:${esc(naslov)}`, `DESCRIPTION:${esc(opis)}`, `LOCATION:${esc(lokacija)}`,
        'BEGIN:VALARM', 'TRIGGER:-PT2H', 'ACTION:DISPLAY', `DESCRIPTION:${esc(naslov)}`, 'END:VALARM',
        'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
};

export const preuzmiIcs = (sadrzaj, ime = 'termin.ics') => {
    const url = URL.createObjectURL(new Blob([sadrzaj], { type: 'text/calendar;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = ime;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
};
