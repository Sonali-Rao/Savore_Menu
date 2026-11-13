'use client';

import Link from 'next/link';
import { AlertCircle, Info } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { RESTAURANT } from '@/data/restaurant';
import {
  bookableDates, demoReference, formatSlot, isSlotAvailable, normaliseIndianMobile, timeSlots, validateReservation,
  type ReservationErrors, type ReservationField, type ReservationValues,
} from '@/lib/reservation';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { Confirmation } from '@/components/ui/Confirmation';

const INITIAL: ReservationValues = {
  dateIndex: null, time: null, guests: 2, name: '', phone: '', email: '', seating: 'none', occasion: '', notes: '',
};

const SEATING = [
  { value: 'indoor', label: 'Indoor' },
  { value: 'outdoor', label: 'Garden patio' },
  { value: 'none', label: 'No preference' },
] as const;

const OCCASIONS = ['Birthday', 'Anniversary', 'Date night', 'Business meal', 'Family get-together'];

const SLOT_GROUPS = [
  { label: 'Morning', from: 8 * 60, to: 11 * 60 + 30 },
  { label: 'Afternoon', from: 12 * 60, to: 16 * 60 + 30 },
  { label: 'Evening', from: 17 * 60, to: 22 * 60 },
];

const ERROR_ORDER: ReservationField[] = ['date', 'time', 'guests', 'name', 'phone', 'email'];

interface Booked {
  ref: string;
  firstName: string;
  date: string;
  time: string;
  guests: number;
  seating: string;
  occasion: string;
  phone: string;
}

export function ReservationForm() {
  // Dates depend on the visitor's clock, so they're computed after mount (no server/client mismatch).
  const [now, setNow] = useState<Date | null>(null);
  const [values, setValues] = useState<ReservationValues>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [booked, setBooked] = useState<Booked | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => setNow(new Date()), []);

  const dates = useMemo(() => (now ? bookableDates(now) : []), [now]);
  const errors: ReservationErrors = submitted && now ? validateReservation(values, now) : {};
  const errorList = ERROR_ORDER.filter((f) => errors[f]);

  const set = <K extends keyof ReservationValues>(key: K, value: ReservationValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const chooseDate = (index: number) =>
    setValues((v) => {
      const keepTime = v.time !== null && now && isSlotAvailable(dates[index], v.time, now);
      return { ...v, dateIndex: index, time: keepTime ? v.time : null };
    });

  const focusTarget = (field: ReservationField): string => {
    if (field === 'date') return 'date-0';
    if (field === 'time') {
      if (values.dateIndex === null || !now) return 'date-0';
      const first = timeSlots().find((m) => isSlotAvailable(dates[values.dateIndex!], m, now));
      return first !== undefined ? `time-${first}` : 'date-0';
    }
    if (field === 'guests') return 'guest-stepper';
    return `res-${field}`;
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!now) return;
    setSubmitted(true);
    const current = new Date();
    const result = validateReservation(values, current);
    if (Object.keys(result).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    const date = dates[values.dateIndex!];
    setBooked({
      ref: demoReference('SVR'),
      firstName: values.name.trim().split(/\s+/)[0],
      date: date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      time: formatSlot(values.time!),
      guests: values.guests,
      seating: SEATING.find((s) => s.value === values.seating)!.label,
      occasion: values.occasion,
      phone: `+91 ${normaliseIndianMobile(values.phone)}`,
    });
    window.scrollTo(0, 0);
  };

  if (booked) {
    return (
      <div className="card">
        <Confirmation
          compact
          title={`See you soon, ${booked.firstName}.`}
          lead="Here’s your table request. If SAVORÉ were a real restaurant, we’d text you a confirmation now."
          rows={[
            { label: 'Reference', value: booked.ref, mono: true },
            { label: 'Date', value: booked.date },
            { label: 'Time', value: booked.time },
            { label: 'Guests', value: String(booked.guests) },
            { label: 'Seating', value: booked.seating },
            ...(booked.occasion ? [{ label: 'Occasion', value: booked.occasion }] : []),
            { label: 'Mobile', value: booked.phone },
          ]}
          disclaimer="No real reservation has been made and no message will be sent."
          actions={
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => { setValues(INITIAL); setSubmitted(false); setBooked(null); setNow(new Date()); }}
              >
                Make another booking
              </button>
              <Link href="/menu" className="btn btn-outline">Browse the menu</Link>
            </>
          }
        />
      </div>
    );
  }

  const errorId = (f: ReservationField) => (errors[f] ? `err-${f}` : undefined);

  return (
    <form noValidate onSubmit={submit} aria-labelledby="res-form-title" className="card px-5 py-6 sm:p-9">
      <h2 id="res-form-title" className="sr-only">Reservation details</h2>

      {errorList.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="mb-6 rounded-[14px] border-[1.5px] border-danger bg-danger-50 px-4.5 py-4 outline-none">
          <h3 className="mb-1.5 font-sans text-base font-bold tracking-normal text-danger">
            Please check {errorList.length === 1 ? 'one thing' : `${errorList.length} things`}
          </h3>
          <ul className="list-disc pl-5 text-[0.9rem]">
            {errorList.map((f) => (
              <li key={f}>
                <a
                  href={`#${focusTarget(f)}`}
                  className="text-danger underline"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(focusTarget(f));
                    el?.focus();
                    el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
                  }}
                >
                  {errors[f]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Step n={1} title="Pick a day" hint={`Today or up to ${RESTAURANT.booking.windowDays} days ahead.`} first>
        {!now ? (
          <p className="text-[0.9rem] text-muted">Loading dates…</p>
        ) : (
          <div className="-m-[3px] grid snap-x auto-cols-[74px] grid-flow-col gap-2 overflow-x-auto p-[3px]" aria-describedby={errorId('date')}>
            {dates.map((d, i) => (
              <label key={i} className="pill-choice solid group snap-start flex-col px-1 py-2.5">
                <input
                  id={`date-${i}`}
                  type="radio"
                  name="date"
                  checked={values.dateIndex === i}
                  onChange={() => chooseDate(i)}
                  aria-label={d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                />
                <span aria-hidden className="text-[0.72rem] font-semibold tracking-[0.08em] text-muted uppercase group-has-checked:text-[#c9d3b8]">
                  {i === 0 ? 'Today' : i === 1 ? 'Tmrw' : d.toLocaleDateString('en-IN', { weekday: 'short' })}
                </span>
                <span aria-hidden className="font-serif text-2xl leading-tight">{d.getDate()}</span>
                <span aria-hidden className="text-[0.72rem] text-muted group-has-checked:text-[#c9d3b8]">
                  {d.toLocaleDateString('en-IN', { month: 'short' })}
                </span>
              </label>
            ))}
          </div>
        )}
        <FieldError id="err-date" message={errors.date} />
      </Step>

      <Step n={2} title="Choose a time" hint="30-minute slots. Times that have passed are unavailable.">
        {values.dateIndex === null || !now ? (
          <p className="text-[0.9rem] text-muted">Pick a day first to see available times.</p>
        ) : (
          <TimeSlots
            date={dates[values.dateIndex]}
            now={now}
            value={values.time}
            onChange={(m) => set('time', m)}
            describedBy={errorId('time')}
          />
        )}
        <FieldError id="err-time" message={errors.time} />
      </Step>

      <Step n={3} title="Guests" hint={`Up to ${RESTAURANT.booking.maxGuests} guests can book online.`}>
        <div className="flex flex-wrap items-center gap-4">
          <div id="guest-stepper" tabIndex={-1} className="rounded-full outline-none">
            <QuantityStepper
              size="lg"
              value={values.guests}
              max={RESTAURANT.booking.maxGuests}
              onChange={(g) => set('guests', g)}
              label="Number of guests"
              decreaseLabel="Fewer guests"
              increaseLabel="More guests"
            />
          </div>
          <span aria-hidden>{values.guests === 1 ? 'guest' : 'guests'}</span>
          {values.guests >= RESTAURANT.booking.maxGuests && (
            <p className="rounded-[10px] bg-terra-50 px-3 py-2 text-[0.85rem] text-ink-2">
              Bigger group? For {RESTAURANT.booking.maxGuests + 1} or more, please call us on{' '}
              <a className="font-semibold underline" href={RESTAURANT.phoneHref}>{RESTAURANT.phone}</a>.
            </p>
          )}
        </div>
        <FieldError id="err-guests" message={errors.guests} />
      </Step>

      <Step n={4} title="Your details" hint="So we know who to expect.">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField id="res-name" label="Full name" autoComplete="name" value={values.name}
            onChange={(v) => set('name', v)} error={errors.name} />
          <div>
            <label htmlFor="res-phone" className="field-label">Mobile number</label>
            <div className="relative">
              <span aria-hidden className="absolute top-1/2 left-3.5 -translate-y-1/2 text-[0.95rem] text-muted">+91</span>
              <input
                id="res-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                maxLength={16}
                value={values.phone}
                onChange={(e) => set('phone', e.target.value)}
                aria-invalid={!!errors.phone}
                aria-describedby={['phone-hint', errorId('phone')].filter(Boolean).join(' ')}
                className="input pl-[50px]"
              />
            </div>
            <p id="phone-hint" className="sr-only">Indian mobile number, 10 digits</p>
            <FieldError id="err-phone" message={errors.phone} />
          </div>
        </div>
        <div className="mt-4">
          <TextField id="res-email" label="Email" optional type="email" autoComplete="email" value={values.email}
            onChange={(v) => set('email', v)} error={errors.email} />
        </div>
      </Step>

      <Step n={5} title="Preferences" hint="All optional.">
        <fieldset>
          <legend className="field-label">Seating</legend>
          <div className="grid grid-cols-3 gap-2">
            {SEATING.map((s) => (
              <label key={s.value} className="pill-choice soft px-1.5 py-3 text-[0.9rem] font-medium">
                <input type="radio" name="seating" checked={values.seating === s.value} onChange={() => set('seating', s.value)} />
                {s.label}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="res-occasion" className="field-label">Occasion</label>
            <select id="res-occasion" value={values.occasion} onChange={(e) => set('occasion', e.target.value)} className="input">
              <option value="">None</option>
              {OCCASIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <TextField id="res-notes" label="Notes" optional maxLength={140} placeholder="High chair, allergies…"
            value={values.notes} onChange={(v) => set('notes', v)} />
        </div>
      </Step>

      <div className="mt-8 grid gap-3">
        <button type="submit" className="btn btn-primary w-full" disabled={!now}>Request table</button>
        <p className="flex items-center justify-center gap-2 text-[0.8rem] text-muted">
          <Info aria-hidden className="size-4 text-sage-600" />
          Demo only — no real reservation is made.
        </p>
      </div>
    </form>
  );
}

/* ---------- Pieces ---------- */

function Step({ n, title, hint, first, children }: { n: number; title: string; hint: string; first?: boolean; children: ReactNode }) {
  const id = `step-${n}`;
  return (
    <section aria-labelledby={id} className={first ? '' : 'mt-8 border-t border-line pt-7'}>
      <h3 id={id} className="mb-1 flex items-center gap-2.5 text-[1.35rem]">
        <span aria-hidden className="inline-grid size-[26px] place-items-center rounded-full bg-sage-100 font-sans text-[0.78rem] font-bold text-sage-800">
          {n}
        </span>
        {title}
      </h3>
      <p className="mb-3.5 text-[0.85rem] text-muted">{hint}</p>
      {children}
    </section>
  );
}

function TimeSlots({
  date, now, value, onChange, describedBy,
}: { date: Date; now: Date; value: number | null; onChange: (m: number) => void; describedBy?: string }) {
  const slots = timeSlots();
  if (!slots.some((m) => isSlotAvailable(date, m, now))) {
    return <p className="text-[0.9rem] text-muted">We’re past the last seating for today — please choose another day.</p>;
  }
  return (
    <fieldset aria-describedby={describedBy}>
      <legend className="sr-only">Available times</legend>
      {SLOT_GROUPS.map((g) => (
        <div key={g.label} className="mt-3.5 first:mt-0">
          <p aria-hidden className="mb-2 text-[0.75rem] font-semibold tracking-[0.12em] text-muted uppercase">{g.label}</p>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(84px,1fr))] gap-2">
            {slots.filter((m) => m >= g.from && m <= g.to).map((m) => {
              const available = isSlotAvailable(date, m, now);
              return (
                <label key={m} className="pill-choice solid px-1 py-2.5 text-[0.88rem] font-medium tabular-nums">
                  <input
                    id={`time-${m}`}
                    type="radio"
                    name="time"
                    disabled={!available}
                    checked={value === m}
                    onChange={() => onChange(m)}
                  />
                  {formatSlot(m)}
                  {!available && <span className="sr-only"> (unavailable)</span>}
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </fieldset>
  );
}

function TextField({
  id, label, value, onChange, error, optional, type = 'text', autoComplete, maxLength, placeholder,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void; error?: string; optional?: boolean;
  type?: string; autoComplete?: string; maxLength?: number; placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label} {optional && <span className="font-normal text-muted">(optional)</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `err-${id.replace('res-', '')}` : undefined}
        className="input"
      />
      <FieldError id={`err-${id.replace('res-', '')}`} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-[0.82rem] text-danger">
      <AlertCircle aria-hidden className="size-3.5 shrink-0" />
      {message}
    </p>
  );
}
