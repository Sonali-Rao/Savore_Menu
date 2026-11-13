import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, Clock, Droplet, FlaskConical, Leaf, ShoppingBag, Sprout, UtensilsCrossed } from 'lucide-react';
import { CHEFS_PICK_ID, SITE_IMAGES, dishById } from '@/data/menu';
import { RESTAURANT } from '@/data/restaurant';
import { formatRupees } from '@/lib/format';
import { unsplash } from '@/lib/images';

const Arrow = () => <ArrowRight aria-hidden className="size-4" />;

export function Hero() {
  const pick = dishById(CHEFS_PICK_ID)!;
  return (
    <section aria-labelledby="hero-title" className="pt-8 pb-16 lg:pt-12 lg:pb-24">
      <div className="page-container grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <p className="eyebrow">All-day kitchen · Indiranagar, Bengaluru</p>
          <h1 id="hero-title" className="mt-4.5 mb-5.5 text-[clamp(2.8rem,7.2vw,5.2rem)] font-normal">
            Good food, <em className="font-normal text-sage-600">honestly</em> made.
          </h1>
          <p className="max-w-[34rem] text-[1.125rem] text-ink-2">
            Seasonal bowls, slow coffee and house-brewed kombucha — cooked from whole, clean ingredients, with nothing we
            wouldn’t eat at home.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/menu" className="btn btn-primary">Explore the menu <Arrow /></Link>
            <Link href="/reserve" className="btn btn-outline">Book a table</Link>
          </div>
          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2.5 text-[0.9rem] text-muted">
            <li className="inline-flex items-center gap-2">
              <Clock aria-hidden className="size-4 text-sage-600" /> Open daily, 8 AM – 10:30 PM
            </li>
            <li className="inline-flex items-center gap-2">
              <ShoppingBag aria-hidden className="size-4 text-sage-600" /> Dine in or take away
            </li>
          </ul>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3.4] overflow-hidden rounded-[28px] bg-surface-2 shadow-soft lg:aspect-[4/4.6]">
            <Image
              src={unsplash(SITE_IMAGES.hero)}
              alt="A colourful grain bowl with greens, chickpeas, roasted sweet potato and avocado on a wooden table"
              fill
              priority
              sizes="(min-width: 1024px) 520px, 100vw"
              className="object-cover"
            />
          </div>
          <Link
            href={`/menu?dish=${pick.id}`}
            className="absolute inset-x-4 -bottom-7 flex items-center gap-3.5 rounded-[18px] bg-surface py-3 pr-4 pl-3 shadow-lift transition-transform duration-300 hover:-translate-y-0.5 sm:right-auto sm:-left-5 sm:max-w-[340px]"
          >
            <span className="relative size-[60px] shrink-0 overflow-hidden rounded-xl">
              <Image src={unsplash(pick.image)} alt="" fill sizes="60px" className="object-cover" />
            </span>
            <span>
              <span className="block text-[0.72rem] font-semibold tracking-[0.12em] text-terra-700 uppercase">Chef’s pick today</span>
              <span className="block font-serif text-[1.1rem] leading-tight font-medium">{pick.name}</span>
              <span className="text-[0.82rem] text-muted">
                {pick.kcal} kcal · {pick.protein} g protein · {formatRupees(pick.price)}
              </span>
            </span>
            <ArrowRight aria-hidden className="ml-auto size-5 shrink-0 text-ink-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}

const VALUES = [
  { Icon: Droplet, title: 'Cold-pressed oils only', text: 'Groundnut, coconut and sesame — never refined.' },
  { Icon: Leaf, title: 'No refined sugar', text: 'Sweetened with dates, jaggery and fruit.' },
  { Icon: Sprout, title: 'Millets & whole grains', text: 'Ragi, foxtail and barnyard, cooked with care.' },
  { Icon: FlaskConical, title: 'Fermented in-house', text: 'Small-batch kombucha, brewed every week.' },
];

export function ValuesStrip() {
  return (
    <section aria-labelledby="values-title" className="border-y border-line">
      <h2 id="values-title" className="sr-only">What we stand for</h2>
      <ul className="page-container grid grid-cols-2 lg:grid-cols-4">
        {VALUES.map(({ Icon, title, text }, i) => (
          <li
            key={title}
            className={`flex flex-col gap-2.5 py-7 lg:px-7 lg:py-9 lg:first:pl-0 ${i % 2 ? 'border-l border-line pl-4' : 'pr-4'} ${
              i > 1 ? 'border-t border-line lg:border-t-0' : ''
            } ${i === 2 ? 'lg:border-l' : ''}`}
          >
            <Icon aria-hidden className="size-[26px] text-sage-600" strokeWidth={1.6} />
            <h3 className="text-[1.15rem] leading-tight">{title}</h3>
            <p className="text-[0.88rem] text-muted">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Story() {
  const points = [
    'Calories, protein and allergens listed on every dish.',
    'Plenty for vegans, meat-eaters and fussy little ones alike.',
    'Coffee roasted in Chikmagalur, brewed by people who care.',
  ];
  return (
    <section aria-labelledby="story-title" className="py-18 lg:py-24">
      <div className="page-container grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="relative aspect-[4/5] w-full max-w-[460px] overflow-hidden rounded-[999px_999px_24px_24px] bg-surface-2">
          <Image
            src={unsplash(SITE_IMAGES.story)}
            alt="A cook chopping fresh herbs and mushrooms on a wooden board"
            fill
            sizes="(min-width: 1024px) 460px, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="eyebrow">Our kitchen</p>
          <h2 id="story-title" className="mt-4 mb-5 max-w-[16ch] text-[clamp(2rem,4.2vw,3rem)]">
            The food you’d cook every day, if you had the time.
          </h2>
          <p className="max-w-[34rem] text-[1.125rem] text-ink-2">
            SAVORÉ is a neighbourhood kitchen for weekday lunches, slow Sunday breakfasts and easy dinners. We keep the
            menu short so everything on it can be made properly — from scratch, each morning.
          </p>
          <ul className="mt-7 grid gap-3.5">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-ink-2">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-sage-100 text-sage-800">
                  <Check aria-hidden className="size-[15px]" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function OrderModes() {
  const modes = [
    {
      Icon: UtensilsCrossed, title: 'Dine in', href: '/reserve', cta: 'Reserve a table',
      text: 'Sunlit tables, a small garden patio and no rush. Order at your table or book ahead for the weekend.',
    },
    {
      Icon: ShoppingBag, title: 'Takeaway', href: '/menu', cta: 'Start an order',
      text: 'Pre-order from the menu, choose a pickup time, and we’ll have it packed in compostable boxes.',
    },
  ];
  return (
    <section aria-labelledby="modes-title" className="py-18 lg:py-24">
      <div className="page-container">
        <p className="eyebrow">Your way</p>
        <h2 id="modes-title" className="mt-3.5 mb-9 text-[clamp(2rem,4vw,2.8rem)]">Stay a while, or take it with you</h2>
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          {modes.map(({ Icon, title, href, cta, text }) => (
            <div key={title} className="card grid gap-2.5 p-7 md:p-9">
              <span className="grid size-12 place-items-center rounded-[14px] bg-terra-50 text-terra-700">
                <Icon aria-hidden className="size-5" />
              </span>
              <h3 className="text-[1.5rem]">{title}</h3>
              <p className="text-ink-2">{text}</p>
              <Link href={href} className="link-arrow">{cta} <Arrow /></Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReserveCta() {
  return (
    <section aria-labelledby="cta-title">
      <div className="page-container">
        <div className="relative grid gap-6 overflow-hidden rounded-[28px] bg-sage-800 px-7 py-12 text-[#f2eee3] lg:grid-cols-[1.4fr_auto] lg:items-center lg:p-16">
          <Leaf aria-hidden className="absolute -right-10 -bottom-14 size-[280px] fill-white/5 text-white/5" strokeWidth={1} />
          <div>
            <h2 id="cta-title" className="text-[clamp(2.1rem,5vw,3.4rem)] font-normal">
              We’ll save you <em className="text-[#c9d3b8]">a seat.</em>
            </h2>
            <p className="mt-3.5 max-w-[32rem] text-[#d5d9c9]">
              Weekend brunch fills up quickly. Pick a time that suits you — it takes less than a minute.
            </p>
          </div>
          <div className="relative">
            <Link href="/reserve" className="btn btn-light">Book a table</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function VisitUs() {
  return (
    <section id="visit" aria-labelledby="visit-title" className="scroll-mt-24 py-18 lg:py-24">
      <div className="page-container grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <p className="eyebrow">Visit us</p>
          <h2 id="visit-title" className="mt-3.5 mb-6 text-[clamp(2rem,4vw,2.8rem)]">Find us in Indiranagar</h2>
          <dl className="grid gap-5">
            <div>
              <dt className="mb-1 text-[0.78rem] font-semibold tracking-[0.12em] text-muted uppercase">Address</dt>
              <dd className="text-[1.05rem]">
                <address className="not-italic">{RESTAURANT.address.line1}<br />{RESTAURANT.address.line2}</address>
              </dd>
            </div>
            <div>
              <dt className="mb-1 text-[0.78rem] font-semibold tracking-[0.12em] text-muted uppercase">Hours</dt>
              <dd className="text-[1.05rem]">
                Every day, {RESTAURANT.hoursLabel}
                <span className="block text-[0.92rem] text-muted">Breakfast served until 12 noon</span>
              </dd>
            </div>
            <div>
              <dt className="mb-1 text-[0.78rem] font-semibold tracking-[0.12em] text-muted uppercase">Contact</dt>
              <dd className="text-[1.05rem]">
                <a className="underline-offset-3 hover:underline" href={RESTAURANT.phoneHref}>{RESTAURANT.phone}</a>
                {' · '}
                <a className="underline-offset-3 hover:underline" href={`mailto:${RESTAURANT.email}`}>{RESTAURANT.email}</a>
              </dd>
            </div>
          </dl>
        </div>
        <IllustratedMap />
      </div>
    </section>
  );
}

function IllustratedMap() {
  return (
    <div
      role="img"
      aria-label="Illustrated map showing SAVORÉ on 12th Main Road, Indiranagar, near the metro station"
      className="relative min-h-[300px] overflow-hidden rounded-[22px] border border-line bg-[#e7e0cf]"
    >
      <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" aria-hidden className="absolute inset-0 size-full">
        <rect width="600" height="400" fill="#e9e2d2" />
        <path d="M0 120 L600 90" stroke="#f8f4ea" strokeWidth="22" />
        <path d="M0 300 L600 270" stroke="#f8f4ea" strokeWidth="16" />
        <path d="M180 0 L220 400" stroke="#f8f4ea" strokeWidth="18" />
        <path d="M430 0 L400 400" stroke="#f8f4ea" strokeWidth="26" />
        <path d="M0 210 Q300 180 600 200" stroke="#f8f4ea" strokeWidth="10" fill="none" />
        <rect x="250" y="130" width="120" height="60" rx="10" fill="#d6ddc9" />
        <rect x="40" y="150" width="110" height="40" rx="8" fill="#ded6c4" />
        <rect x="470" y="140" width="100" height="45" rx="8" fill="#ded6c4" />
        <circle cx="90" cy="340" r="36" fill="#d6ddc9" />
        <text x="440" y="80" fontFamily="Inter, sans-serif" fontSize="13" fill="#8c8676">100 Feet Rd</text>
        <text x="40" y="112" fontFamily="Inter, sans-serif" fontSize="13" fill="#8c8676">12th Main Rd</text>
        <g transform="translate(300 150)">
          <circle r="34" fill="#b04f2c" fillOpacity=".16" />
          <path d="M0 -30 C-14 -30 -22 -20 -22 -9 C-22 6 0 22 0 22 C0 22 22 6 22 -9 C22 -20 14 -30 0 -30 Z" fill="#b04f2c" />
          <circle cy="-10" r="7" fill="#fbf8f2" />
        </g>
      </svg>
      <p className="absolute bottom-4 left-4 rounded-xl bg-surface px-3.5 py-2.5 text-[0.85rem] shadow-sm">
        <strong>SAVORÉ</strong> · 2 min walk from Indiranagar Metro
      </p>
    </div>
  );
}
