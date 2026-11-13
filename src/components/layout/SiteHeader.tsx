'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu as MenuIcon, ShoppingBag, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Logo } from './Logo';
import { useCart, useItemCount } from '@/store/cart';
import { useUI } from '@/store/ui';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/reserve', label: 'Reservations' },
  { href: '/#visit', label: 'Visit' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const count = useItemCount();
  const hydrated = useCart((s) => s.hydrated);
  const openCart = useUI((s) => s.openCart);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const prevCount = useRef(count);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu after navigating.
  useEffect(() => setMobileOpen(false), [pathname]);

  // Small "bump" on the badge when items are added.
  useEffect(() => {
    if (count > prevCount.current && badgeRef.current) {
      badgeRef.current.classList.remove('animate-bump');
      void badgeRef.current.offsetWidth;
      badgeRef.current.classList.add('animate-bump');
    }
    prevCount.current = count;
  }, [count]);

  const isCurrent = (href: string) => (href.includes('#') ? false : href === pathname);
  const showCount = hydrated && count > 0;

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-bg/90 backdrop-blur-md backdrop-saturate-150 transition-colors ${
        scrolled ? 'border-line' : 'border-transparent'
      }`}
    >
      <div className="page-container flex h-[72px] items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-1.5">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent(item.href) ? 'page' : undefined}
                  className="relative inline-flex rounded-full px-3.5 py-2.5 text-[0.95rem] font-medium text-ink-2 hover:bg-surface-2 hover:text-ink aria-[current=page]:text-ink aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-3.5 aria-[current=page]:after:bottom-1 aria-[current=page]:after:h-0.5 aria-[current=page]:after:rounded aria-[current=page]:after:bg-terra"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/reserve" className="btn btn-outline btn-sm hidden md:inline-flex">
            Book a table
          </Link>
          <button
            type="button"
            onClick={openCart}
            aria-haspopup="dialog"
            aria-label={`Your order, ${showCount ? count : 0} ${count === 1 ? 'item' : 'items'}`}
            className="relative grid size-11 place-items-center rounded-full border border-line-strong bg-surface transition-colors hover:border-ink"
          >
            <ShoppingBag aria-hidden className="size-5" strokeWidth={1.75} />
            {showCount && (
              <span
                ref={badgeRef}
                aria-hidden
                className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full border-2 border-bg bg-terra px-1 text-[0.7rem] font-bold text-white"
              >
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full hover:bg-surface-2 md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X aria-hidden className="size-5" /> : <MenuIcon aria-hidden className="size-5" />}
          </button>
        </div>
      </div>

      <nav id="mobile-nav" aria-label="Mobile" hidden={!mobileOpen} className="border-t border-line bg-bg md:hidden">
        <ul className="page-container pt-2 pb-4">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                aria-current={isCurrent(item.href) ? 'page' : undefined}
                className="block border-b border-line px-1 py-3.5 font-serif text-[1.4rem] aria-[current=page]:text-terra"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="pt-4">
            <Link href="/reserve" onClick={() => setMobileOpen(false)} className="btn btn-primary w-full">
              Book a table
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
