'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { CartLine, OrderType, Selection } from '@/types/menu';
import { dishById } from '@/data/menu';
import { lineKey } from '@/lib/pricing';

export const MAX_QTY = 20;

interface CartState {
  lines: CartLine[];
  orderType: OrderType;
  /** False until the saved cart has been read from localStorage. */
  hydrated: boolean;
  add: (dishId: string, selection: Selection, note: string, qty: number) => void;
  /** Replace an existing line after editing; merges into an identical line if one exists. */
  replace: (oldKey: string, selection: Selection, note: string, qty: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  setOrderType: (t: OrderType) => void;
}

const clampQty = (n: number) => Math.min(MAX_QTY, Math.max(1, Math.round(n)));

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      orderType: 'dine-in',
      hydrated: false,

      add: (dishId, selection, note, qty) =>
        set((s) => {
          const key = lineKey(dishId, selection, note);
          const existing = s.lines.find((l) => l.key === key);
          if (existing) {
            return { lines: s.lines.map((l) => (l.key === key ? { ...l, qty: clampQty(l.qty + qty) } : l)) };
          }
          return { lines: [...s.lines, { key, dishId, selection, note: note.trim(), qty: clampQty(qty) }] };
        }),

      replace: (oldKey, selection, note, qty) =>
        set((s) => {
          const old = s.lines.find((l) => l.key === oldKey);
          if (!old) return s;
          const key = lineKey(old.dishId, selection, note);
          const twin = s.lines.find((l) => l.key === key && l.key !== oldKey);
          if (twin) {
            return {
              lines: s.lines
                .filter((l) => l.key !== oldKey)
                .map((l) => (l.key === key ? { ...l, qty: clampQty(l.qty + qty) } : l)),
            };
          }
          return {
            lines: s.lines.map((l) => (l.key === oldKey ? { ...l, key, selection, note: note.trim(), qty: clampQty(qty) } : l)),
          };
        }),

      setQty: (key, qty) => set((s) => ({ lines: s.lines.map((l) => (l.key === key ? { ...l, qty: clampQty(qty) } : l)) })),
      remove: (key) => set((s) => ({ lines: s.lines.filter((l) => l.key !== key) })),
      clear: () => set({ lines: [] }),
      setOrderType: (orderType) => set({ orderType }),
    }),
    {
      name: 'savore-cart',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Rehydrated manually after mount to avoid server/client mismatches.
      skipHydration: true,
      partialize: (s) => ({ lines: s.lines, orderType: s.orderType }),
      // Drop anything that no longer matches the menu (e.g. a removed dish).
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<CartState>;
        const lines = Array.isArray(p.lines)
          ? p.lines.filter((l) => l && dishById(l.dishId) && Number.isFinite(l.qty) && l.qty > 0)
          : [];
        return { ...current, lines, orderType: p.orderType === 'takeaway' ? 'takeaway' : 'dine-in' };
      },
    },
  ),
);

/** Number of items (sum of quantities) for a single dish, across all customisations. */
export const useDishQty = (dishId: string) =>
  useCart((s) => s.lines.reduce((n, l) => (l.dishId === dishId ? n + l.qty : n), 0));

export const useItemCount = () => useCart((s) => s.lines.reduce((n, l) => n + l.qty, 0));
