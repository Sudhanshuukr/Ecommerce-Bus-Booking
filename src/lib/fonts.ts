import { Raleway, Manrope } from 'next/font/google';

export const fontHeading = Raleway({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-raleway',
  display: 'swap',
});

export const fontBody = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});
