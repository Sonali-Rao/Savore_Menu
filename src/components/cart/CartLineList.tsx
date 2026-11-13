'use client';

import Image from 'next/image';
import { Pencil, Trash2 } from 'lucide-react';
import { useRef } from 'react';
import type { CartLine } from '@/types/menu';
import { dishById } from '@/data/menu';
import { formatRupees } from '@/lib/format';
import { unsplash } from '@/lib/images';
import { selectionSummary, unitPrice } from '@/lib/pricing';
import { MAX_QTY, useCart } from '@/store/cart';
import { useUI } from '@/store/ui';
import { DietMarker } from '@/components/ui/DietMarker';
import { QuantityStepper } from '@/components/ui/QuantityStepper';

interface Props {
  lines: CartLine[];
  /** "drawer" lines are compact; editing from the drawer reopens it afterwards. */
  variant: 'drawer' | 'page';
  /** Element to focus when the last line is removed. */
  emptyFocusId?: string;
}

export function CartLineList({ lines, variant, emptyFocusId }: Props) {
  const listRef = useRef<HTMLUListElement>(null);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const openCustomiser = useUI((s) => s.openCustomiser);
  const showToast = useUI((s) => s.showToast);
  const big = variant === 'page';

  const handleRemove = (index: number, key: string, name: string) => {
    remove(key);
    showToast(`Removed ${name}`);
    // Keep keyboard focus in the list instead of losing it to <body>.
    requestAnimationFrame(() => {
      const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>('[data-remove]');
      const next = buttons?.[Math.min(index, (buttons?.length ?? 1) - 1)];
      if (next) next.focus();
      else if (emptyFocusId) document.getElementById(emptyFocusId)?.focus();
    });
  };

  return (
    <ul ref={listRef} className={big ? 'px-5' : 'px-5 py-1'}>
      {lines.map((line, index) => {
        const dish = dishById(line.dishId);
        if (!dish) return null;
        const unit = unitPrice(dish, line.selection);
        const summary = selectionSummary(dish, line.selection).join(' · ');
        return (
          <li
            key={line.key}
            className={`grid gap-3.5 border-b border-line py-4 last:border-b-0 ${big ? 'grid-cols-[88px_1fr]' : 'grid-cols-[64px_1fr]'}`}
          >
            <div className={`relative overflow-hidden rounded-xl bg-surface-2 ${big ? 'size-[88px]' : 'size-16'}`}>
              <Image src={unsplash(dish.image)} alt="" fill sizes={big ? '88px' : '64px'} className="object-cover" />
            </div>
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-3">
                <h3 className="flex items-start gap-2 font-sans text-[0.98rem] leading-snug font-semibold tracking-normal">
                  <DietMarker diet={dish.diet} className="mt-[3px] size-3.5" />
                  {dish.name}
                </h3>
                <p className="font-semibold whitespace-nowrap tabular-nums">
                  <span className="sr-only">Line total: </span>
                  {formatRupees(unit * line.qty)}
                </p>
              </div>
              {summary && <p className="mt-0.5 text-[0.8rem] leading-snug text-muted">{summary}</p>}
              {line.note && <p className="mt-0.5 text-[0.8rem] text-muted">Note: “{line.note}”</p>}
              <p className="mt-0.5 text-[0.78rem] text-muted">{formatRupees(unit)} each</p>
              <div className="mt-2.5 flex flex-wrap items-center gap-1">
                <QuantityStepper
                  size="sm"
                  value={line.qty}
                  max={MAX_QTY}
                  onChange={(q) => setQty(line.key, q)}
                  label={`Quantity of ${dish.name}`}
                  decreaseLabel={`Decrease quantity of ${dish.name}`}
                  increaseLabel={`Increase quantity of ${dish.name}`}
                />
                {dish.options.length > 0 && (
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    aria-label={`Edit ${dish.name}`}
                    onClick={() => openCustomiser({ dishId: dish.id, editKey: line.key, fromDrawer: variant === 'drawer' })}
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-2 text-[0.82rem] font-semibold text-ink-2 hover:bg-surface-2 hover:text-ink"
                  >
                    <Pencil aria-hidden className="size-4" /> Edit
                  </button>
                )}
                <button
                  type="button"
                  data-remove
                  aria-label={`Remove ${dish.name}`}
                  onClick={() => handleRemove(index, line.key, dish.name)}
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-2 text-[0.82rem] font-semibold text-ink-2 hover:bg-surface-2 hover:text-danger"
                >
                  <Trash2 aria-hidden className="size-4" /> Remove
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
