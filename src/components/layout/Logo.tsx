import Link from 'next/link';

export function LogoMark({ className = 'size-[30px] text-sage-600' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M16 29V11" />
      <path d="M16 18c-5 0-8-3.5-8-8 5 0 8 3.5 8 8Z" fill="currentColor" fillOpacity=".18" />
      <path d="M16 14c4.5 0 7.5-3 7.5-7.5-4.5 0-7.5 3-7.5 7.5Z" fill="currentColor" fillOpacity=".18" />
      <path d="M10 29h12" />
    </svg>
  );
}

export function Logo({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 no-underline" aria-label="SAVORÉ — home">
      <LogoMark className={`size-[30px] ${tone === 'light' ? 'text-[#a9b897]' : 'text-sage-600'}`} />
      <span className={`font-serif text-[1.45rem] font-medium tracking-[0.14em] ${tone === 'light' ? 'text-[#f2eee3]' : ''}`}>
        SAVORÉ
      </span>
    </Link>
  );
}
