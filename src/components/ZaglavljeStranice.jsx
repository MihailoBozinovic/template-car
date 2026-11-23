import React from 'react';
import { Foto, Kontejner, Nadnaslov, Naslov, Pojava, cx } from './primitivi.jsx';

/** Naslov podstranice: nadnaslov, h1, jedna rečenica uvoda; opciono fotografija desno. */
export default function ZaglavljeStranice({ nadnaslov, naslov, akcenat, uvod, slika, children, className }) {
    return (
        <header className={cx('pt-[120px] md:pt-[150px]', className)}>
            <Kontejner className={cx('grid gap-10 pb-12 md:pb-16', slika && 'lg:grid-cols-12 lg:items-end')}>
                <div className={slika ? 'lg:col-span-7' : 'max-w-4xl'}>
                    {nadnaslov && <Nadnaslov className="animate-fade-up mb-5">{nadnaslov}</Nadnaslov>}
                    <Naslov as="h1" nivo={1} tekst={naslov} akcenat={akcenat} odmah />
                    {uvod && <Pojava as="p" className="tekst-uvod m-0 mt-6 max-w-2xl opacity-75">{uvod}</Pojava>}
                    {children}
                </div>
                {slika && (
                    <Pojava className="lg:col-span-5">
                        <Foto src={slika} alt="" okvirKlasa="aspect-[4/3]" prioritet />
                    </Pojava>
                )}
            </Kontejner>
        </header>
    );
}
