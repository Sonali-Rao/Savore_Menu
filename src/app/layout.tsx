import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { AppEffects } from '@/components/layout/AppEffects';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { DishCustomiser } from '@/components/menu/DishCustomiser';
import { Toast } from '@/components/ui/Toast';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  style: ['normal', 'italic'],
  axes: ['opsz'],
  display: 'swap',
});
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'SAVORÉ — Good food, honestly made', template: '%s — SAVORÉ' },
  description:
    'SAVORÉ is a fictional healthy, all-day kitchen in Bengaluru — a portfolio project with an interactive menu, dish customisation, cart and table reservations.',
};

export const viewport: Viewport = { themeColor: '#f5f0e6' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <a
          href="#main"
          className="absolute -top-16 left-4 z-[200] rounded-[10px] bg-ink px-4 py-2.5 text-white no-underline focus:top-3"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter />
        <CartDrawer />
        <DishCustomiser />
        <Toast />
        <AppEffects />
      </body>
    </html>
  );
}
