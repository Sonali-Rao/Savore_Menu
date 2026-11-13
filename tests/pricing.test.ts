import { describe, expect, it } from 'vitest';
import { calculateBill, defaultSelection, lineKey, selectionSummary, unitPrice } from '@/lib/pricing';
import { DISHES, dishById } from '@/data/menu';
import { formatPaise, formatRupees } from '@/lib/format';
import type { CartLine } from '@/types/menu';

const miso = dishById('millet-miso')!;

describe('unitPrice', () => {
  it('is the base price with default options', () => {
    expect(unitPrice(miso, defaultSelection(miso))).toBe(460);
  });

  it('adds every chosen option', () => {
    // quinoa +40, paneer +60, avocado +90, seeds +30
    expect(unitPrice(miso, { base: [1], protein: [1], addons: [0, 1], spice: [0] })).toBe(680);
  });
});

describe('defaultSelection', () => {
  it('pre-selects required groups and leaves add-ons empty', () => {
    expect(defaultSelection(miso)).toEqual({ base: [0], protein: [0], addons: [], spice: [0] });
  });

  it('uses the dish spice level as the default', () => {
    const paneer = dishById('paneer-quinoa')!;
    expect(defaultSelection(paneer).spice).toEqual([1]); // Medium
  });

  it('gives every dish a valid starting price', () => {
    for (const d of DISHES) expect(unitPrice(d, defaultSelection(d))).toBe(d.price);
  });
});

describe('selectionSummary', () => {
  it('describes choices in reading order', () => {
    expect(selectionSummary(miso, { base: [1], protein: [0], addons: [0], spice: [1] })).toEqual([
      'Quinoa', 'Miso-glazed tofu', '+ Avocado', 'Medium spice',
    ]);
  });
});

describe('lineKey', () => {
  it('ignores the order add-ons were picked in', () => {
    expect(lineKey('x', { addons: [2, 0] }, '')).toBe(lineKey('x', { addons: [0, 2] }, ''));
  });

  it('separates lines with different notes', () => {
    expect(lineKey('x', {}, 'no onions')).not.toBe(lineKey('x', {}, ''));
  });
});

describe('calculateBill', () => {
  const line = (dishId: string, qty: number, selection = defaultSelection(dishById(dishId)!)): CartLine => ({
    key: lineKey(dishId, selection, ''), dishId, selection, note: '', qty,
  });

  it('totals items, adds 5% GST and works in paise', () => {
    const bill = calculateBill([line('millet-miso', 2), line('pour-over', 1)], dishById);
    expect(bill.itemCount).toBe(3);
    expect(bill.subtotal).toBe(1140_00);
    expect(bill.gst).toBe(57_00);
    expect(bill.total).toBe(1197_00);
  });

  it('rounds GST to the nearest paisa', () => {
    // ₹210 × 5% = ₹10.50 exactly; ₹1 extra would be 5 paise
    const bill = calculateBill([line('flat-white', 1)], dishById);
    expect(bill.gst).toBe(10_50);
  });

  it('returns zero for an empty cart and skips unknown dishes', () => {
    const ghost: CartLine = { key: 'ghost', dishId: 'gone', selection: {}, note: '', qty: 3 };
    expect(calculateBill([ghost], dishById)).toEqual({ itemCount: 0, subtotal: 0, gst: 0, total: 0 });
  });
});

describe('format', () => {
  it('formats rupees and paise with Indian grouping', () => {
    expect(formatRupees(125000)).toBe('₹1,25,000');
    expect(formatPaise(159600)).toBe('₹1,596.00');
  });
});
