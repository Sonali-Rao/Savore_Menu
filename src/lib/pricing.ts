import type { CartLine, Dish, Selection } from '@/types/menu';
import { RESTAURANT } from '@/data/restaurant';

/** Required groups start on their default choice; add-ons start empty. */
export function defaultSelection(dish: Dish): Selection {
  const sel: Selection = {};
  for (const g of dish.options) sel[g.id] = g.kind === 'multi' ? [] : [g.defaultIndex ?? 0];
  return sel;
}

/** Price of one unit with its options, in whole rupees. */
export function unitPrice(dish: Dish, selection: Selection): number {
  return dish.options.reduce((total, group) => {
    const picked = selection[group.id] ?? [];
    return total + picked.reduce((sum, i) => sum + (group.choices[i]?.price ?? 0), 0);
  }, dish.price);
}

/** Human-readable option list, e.g. ["Quinoa", "+ Avocado", "Mild spice"]. */
export function selectionSummary(dish: Dish, selection: Selection): string[] {
  return dish.options.flatMap((group) =>
    (selection[group.id] ?? [])
      .filter((i) => group.choices[i])
      .map((i) => {
        const label = group.choices[i].label;
        if (group.kind === 'spice') return `${label} spice`;
        if (group.kind === 'multi') return `+ ${label}`;
        return label;
      }),
  );
}

/** Stable key so the same dish with the same choices and note merges into one line. */
export function lineKey(dishId: string, selection: Selection, note: string): string {
  const sorted = Object.keys(selection)
    .sort()
    .map((k) => `${k}:${[...selection[k]].sort((a, b) => a - b).join(',')}`)
    .join(';');
  return `${dishId}|${sorted}|${note.trim()}`;
}

export interface Bill {
  itemCount: number;
  /** All amounts in paise to avoid floating-point rounding errors. */
  subtotal: number;
  gst: number;
  total: number;
}

/** GST is applied to the item total and rounded to the nearest paisa. */
export function calculateBill(lines: CartLine[], findDish: (id: string) => Dish | undefined): Bill {
  let itemCount = 0;
  let subtotal = 0;
  for (const line of lines) {
    const dish = findDish(line.dishId);
    if (!dish) continue;
    itemCount += line.qty;
    subtotal += unitPrice(dish, line.selection) * 100 * line.qty;
  }
  const gst = Math.round((subtotal * RESTAURANT.gstPercent) / 100);
  return { itemCount, subtotal, gst, total: subtotal + gst };
}
