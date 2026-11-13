import { RESTAURANT } from '@/data/restaurant';

const { hours, booking } = RESTAURANT;

/** Today plus the next `windowDays` days, each at local midnight. */
export function bookableDates(now: Date): Date[] {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  return Array.from({ length: booking.windowDays + 1 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

/** Seating times in minutes after midnight: 8:00 → 22:00 every 30 minutes. */
export function timeSlots(): number[] {
  const slots: number[] = [];
  for (let m = hours.open; m <= hours.lastSeating; m += booking.slotMinutes) slots.push(m);
  return slots;
}

export const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** A slot today must be at least `leadMinutes` away. Future days are always open. */
export function isSlotAvailable(date: Date, minutes: number, now: Date): boolean {
  if (!sameDay(date, now)) return true;
  return minutes >= now.getHours() * 60 + now.getMinutes() + booking.leadMinutes;
}

export function formatSlot(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}

/** Accepts "98765 43210", "+91 98765 43210" or "09876543210"; returns 10 digits or null. */
export function normaliseIndianMobile(input: string): string | null {
  let digits = input.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

export interface ReservationValues {
  dateIndex: number | null;
  time: number | null;
  guests: number;
  name: string;
  phone: string;
  email: string;
  seating: 'indoor' | 'outdoor' | 'none';
  occasion: string;
  notes: string;
}

export type ReservationField = 'date' | 'time' | 'guests' | 'name' | 'phone' | 'email';
export type ReservationErrors = Partial<Record<ReservationField, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateReservation(v: ReservationValues, now: Date): ReservationErrors {
  const errors: ReservationErrors = {};
  const dates = bookableDates(now);
  if (v.dateIndex === null || !dates[v.dateIndex]) errors.date = 'Choose a day for your visit';
  if (v.time === null) errors.time = 'Choose a time slot';
  else if (v.dateIndex !== null && dates[v.dateIndex] && !isSlotAvailable(dates[v.dateIndex], v.time, now)) {
    errors.time = 'That time has passed — please choose a later slot';
  }
  if (v.guests < 1 || v.guests > booking.maxGuests) errors.guests = `Choose between 1 and ${booking.maxGuests} guests`;
  if (v.name.trim().length < 2) errors.name = 'Enter your name';
  if (!v.phone.trim()) errors.phone = 'Enter your mobile number';
  else if (!normaliseIndianMobile(v.phone)) errors.phone = 'Enter a valid 10-digit Indian mobile number';
  if (v.email.trim() && !EMAIL.test(v.email.trim())) errors.email = 'Enter a valid email address, or leave it blank';
  return errors;
}

/** Demo-only reference code. Not a real booking. */
export const demoReference = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase().padEnd(6, '0')}`;
