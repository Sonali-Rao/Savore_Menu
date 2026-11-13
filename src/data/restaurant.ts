/** Fictional restaurant details. Every value here is a placeholder for a portfolio project. */
export const RESTAURANT = {
  name: 'SAVORÉ',
  tagline: 'Good food, honestly made.',
  address: {
    line1: '14, 12th Main Road, HAL 2nd Stage',
    line2: 'Indiranagar, Bengaluru 560038',
    short: '14, 12th Main Road, Indiranagar, Bengaluru',
  },
  phone: '+91 80 0000 0000',
  phoneHref: 'tel:+918000000000',
  email: 'hello@savore.example',
  /** Minutes after midnight. */
  hours: { open: 8 * 60, close: 22 * 60 + 30, lastSeating: 22 * 60 },
  hoursLabel: '8:00 AM – 10:30 PM',
  booking: {
    slotMinutes: 30,
    /** Bookable days after today (today + 10 days = 11 options). */
    windowDays: 10,
    maxGuests: 10,
    /** Earliest a same-day slot can be booked, in minutes from now. */
    leadMinutes: 30,
    holdMinutes: 15,
  },
  gstPercent: 5,
} as const;
