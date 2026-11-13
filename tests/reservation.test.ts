import { describe, expect, it } from 'vitest';
import {
  bookableDates, formatSlot, isSlotAvailable, normaliseIndianMobile, timeSlots, validateReservation,
  type ReservationValues,
} from '@/lib/reservation';

// Friday 13 November 2026, 6:10 PM local time
const now = new Date(2026, 10, 13, 18, 10);

const valid: ReservationValues = {
  dateIndex: 2, time: 19 * 60 + 30, guests: 4, name: 'Asha Menon', phone: '98765 43210',
  email: '', seating: 'none', occasion: '', notes: '',
};

describe('bookableDates', () => {
  it('offers today plus 10 days', () => {
    const d = bookableDates(now);
    expect(d).toHaveLength(11);
    expect(d[0].getDate()).toBe(13);
    expect(d[10].getDate()).toBe(23);
  });
});

describe('timeSlots', () => {
  it('runs from 8:00 AM to the 10:00 PM last seating every 30 minutes', () => {
    const s = timeSlots();
    expect(s).toHaveLength(29);
    expect(formatSlot(s[0])).toBe('8:00 AM');
    expect(formatSlot(s[s.length - 1])).toBe('10:00 PM');
    expect(formatSlot(12 * 60)).toBe('12:00 PM');
  });
});

describe('isSlotAvailable', () => {
  it('blocks slots within 30 minutes today but not on later days', () => {
    const today = bookableDates(now)[0];
    expect(isSlotAvailable(today, 18 * 60 + 30, now)).toBe(false); // 6:30 PM < 6:40 PM
    expect(isSlotAvailable(today, 19 * 60, now)).toBe(true);
    expect(isSlotAvailable(bookableDates(now)[1], 8 * 60, now)).toBe(true);
  });
});

describe('normaliseIndianMobile', () => {
  it.each([
    ['98765 43210', '9876543210'],
    ['+91 98765-43210', '9876543210'],
    ['09876543210', '9876543210'],
    ['12345 67890', null],
    ['98765', null],
  ])('%s → %s', (input, expected) => {
    expect(normaliseIndianMobile(input)).toBe(expected);
  });
});

describe('validateReservation', () => {
  it('accepts a complete booking', () => {
    expect(validateReservation(valid, now)).toEqual({});
  });

  it('reports every missing required field', () => {
    const errors = validateReservation({ ...valid, dateIndex: null, time: null, name: ' ', phone: '' }, now);
    expect(Object.keys(errors).sort()).toEqual(['date', 'name', 'phone', 'time']);
  });

  it('rejects a time that has already passed today', () => {
    expect(validateReservation({ ...valid, dateIndex: 0, time: 9 * 60 }, now).time).toMatch(/passed/);
  });

  it('allows a blank email but not an invalid one', () => {
    expect(validateReservation({ ...valid, email: 'asha@' }, now).email).toBeDefined();
    expect(validateReservation({ ...valid, email: 'asha@example.com' }, now).email).toBeUndefined();
  });

  it('caps online bookings at 10 guests', () => {
    expect(validateReservation({ ...valid, guests: 11 }, now).guests).toBeDefined();
  });
});
