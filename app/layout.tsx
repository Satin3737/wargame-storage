import type {Metadata} from 'next';
import {Geist} from 'next/font/google';
import type {ReactNode} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import {ToastHost} from '@/components';
import '@/styles/general.scss';

const geistSans = Geist({
    variable: '--f-geist-sans',
    subsets: ['latin', 'cyrillic']
});

export const metadata: Metadata = {
    title: 'Склад',
    description: 'Учёт настольных игр и миниатюр'
};

export default function RootLayout({children}: Readonly<{children: ReactNode}>) {
    return (
        <html lang={'ru'} className={geistSans.variable} data-scroll-behavior={'smooth'}>
            <body>
                {children}
                <ToastHost />
            </body>
        </html>
    );
}
