import Link from 'next/link';
import { Logo } from './Logo';
import { RESTAURANT } from '@/data/restaurant';

export function SiteFooter() {
  return (
    <footer className="mt-6 bg-sage-900 pt-14 pb-7 text-[0.92rem] text-[#d8d6ca]">
      <div className="page-container">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo tone="light" />
            <p className="mt-3.5 max-w-[26rem]">
              {RESTAURANT.tagline} An all-day kitchen for clean, seasonal cooking in Indiranagar.
            </p>
          </div>
          <FooterList title="Explore">
            <li><Link className="hover:underline" href="/menu">Menu</Link></li>
            <li><Link className="hover:underline" href="/reserve">Reservations</Link></li>
            <li><Link className="hover:underline" href="/cart">Your order</Link></li>
          </FooterList>
          <FooterList title="Hours">
            <li>Every day</li>
            <li>{RESTAURANT.hoursLabel}</li>
          </FooterList>
          <FooterList title="Find us">
            <li>12th Main Road, Indiranagar</li>
            <li>Bengaluru 560038</li>
            <li><a className="hover:underline" href={RESTAURANT.phoneHref}>{RESTAURANT.phone}</a></li>
          </FooterList>
        </div>
        <div className="mt-10 flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-white/12 pt-5 text-[0.8rem] text-[#b4b3a6]">
          <p>
            SAVORÉ is a fictional restaurant created for a portfolio project. Orders and reservations on this site are
            demonstrations only.
          </p>
          <p>Photography via Unsplash</p>
        </div>
      </div>
    </footer>
  );
}

function FooterList({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-3 font-sans text-[0.78rem] font-semibold tracking-[0.14em] text-[#a9b897] uppercase">{title}</h2>
      <ul className="space-y-1.5 text-[#e8e5d9]">{children}</ul>
    </div>
  );
}
