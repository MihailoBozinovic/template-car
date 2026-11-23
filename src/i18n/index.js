import sr from './sr.js';
import en from './en.js';
import ru from './ru.js';

const RECNICI = { sr, en, ru };

export const recnik = (jezik) => RECNICI[jezik] ?? sr;
