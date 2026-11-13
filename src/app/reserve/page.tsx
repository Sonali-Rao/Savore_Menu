import type { Metadata } from 'next';
import Image from 'next/image';
import { CalendarDays, Clock, MapPin, Users } from 'lucide-react';
import { RESTAURANT } from '@/data/restaurant';
import { SITE_IMAGES } from '@/data/menu';
import { unsplash } from '@/lib/images';
import { ReservationForm } from '@/components/reserve/ReservationForm';

export const metadata: Metadata = {
  title: 'Book a table',
  description: 'Reserve a table at SAVORÉ in Indiranagar, Bengaluru — up to 10 days ahead. (Portfolio demo.)',
};

export default function ReservePage() {
  const info = [
    { Icon: Clock, text: `Open every day, ${RESTAURANT.hoursLabel}. Last seating at 10:00 PM.` },
    { Icon: CalendarDays, text: `Book today or up to ${RESTAURANT.booking.windowDays} days ahead.` },
    { Icon: Users, text: `Groups of ${RESTAURANT.booking.maxGuests + 1} or more — please call us on ${RESTAURANT.phone}.` },
    { Icon: MapPin, text: RESTAURANT.address.short },
  ];

  return (
    <div className="page-container grid grid-cols-[minmax(0,1fr)] items-start gap-10 pt-6 pb-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
      <div className="lg:sticky lg:top-[96px]">
        <p className="eyebrow">Reservations</p>
        <h1 className="mt-3 mb-3.5 text-[clamp(2.6rem,6vw,4rem)] font-normal">Book a table</h1>
        <p className="text-[1.125rem] text-ink-2">
          Join us for a slow breakfast, a long lunch or an easy dinner. We’ll hold your table for{' '}
          {RESTAURANT.booking.holdMinutes} minutes.
        </p>
        <ul className="mt-6 grid gap-3.5">
          {info.map(({ Icon, text }) => (
            <li key={text} className="flex gap-3 text-[0.95rem] text-ink-2">
              <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-sage-600" strokeWidth={1.75} />
              {text}
            </li>
          ))}
        </ul>
        <div className="relative mt-8 hidden aspect-[5/5.5] max-w-[420px] overflow-hidden rounded-[999px_999px_24px_24px] bg-surface-2 lg:block">
          <Image
            src={unsplash(SITE_IMAGES.reserve)}
            alt="A bright café dining room with wicker chairs and leafy plants"
            fill
            sizes="420px"
            className="object-cover"
          />
        </div>
      </div>
      <ReservationForm />
    </div>
  );
}
