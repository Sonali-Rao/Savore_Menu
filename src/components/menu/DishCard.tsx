'use client';

import Image from 'next/image';
import { Plus } from 'lucide-react';
import type { Dish } from '@/types/menu';
import { unsplash } from '@/lib/images';
import { formatRupees } from '@/lib/format';
import { defaultSelection } from '@/lib/pricing';
import { useCart, useDishQty } from '@/store/cart';
import { useUI } from '@/store/ui';
import { DietMarker } from '@/components/ui/DietMarker';
import { SpiceLevel } from '@/components/ui/SpiceLevel';
import { DishBadge } from './DishBadge';

export function DishCard({ dish }: { dish: Dish }) {
  const inCart = useDishQty(dish.id);
  const hydrated = useCart((s) => s.hydrated);
  const add = useCart((s) => s.add);
  const openCustomiser = useUI((s) => s.openCustomiser);
  const showToast = useUI((s) => s.showToast);
  const customisable = dish.options.length > 0;

  const handleAdd = () => {
    if (customisable) {
      openCustomiser({ dishId: dish.id });
    } else {
      add(dish.id, defaultSelection(dish), '', 1);
      showToast(`Added ${dish.name} to your order`);
    }
  };

  return (
    <article
      aria-labelledby={`dish-${dish.id}`}
      className="group flex w-full flex-col overflow-hidden rounded-[18px] border border-line bg-surface transition-[box-shadow,border-color] duration-300 hover:border-line-strong hover:shadow-soft"
    >
      <div className="relative aspect-[16/11] overflow-hidden bg-surface-2">
        <Image
          src={unsplash(dish.image)}
          alt=""
          fill
          sizes="(min-width: 1300px) 300px, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {dish.badge && <DishBadge badge={dish.badge} className="absolute top-3 left-3" />}
        {hydrated && inCart > 0 && (
          <span className="absolute right-3 bottom-3 rounded-full bg-ink/85 px-2.5 py-1 text-xs font-semibold text-white">
            {inCart} in your order
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 px-4.5 pt-4 pb-4.5">
        <div className="flex items-start gap-2.5">
          <DietMarker diet={dish.diet} className="mt-1 size-4" />
          <h3 id={`dish-${dish.id}`} className="text-[1.22rem] leading-[1.2]">
            {customisable ? (
              <button
                type="button"
                onClick={handleAdd}
                aria-haspopup="dialog"
                className="text-left decoration-1 underline-offset-3 hover:underline"
              >
                {dish.name}
              </button>
            ) : (
              dish.name
            )}
          </h3>
        </div>
        <p className="line-clamp-2 text-[0.9rem] text-ink-2">{dish.description}</p>
        <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8rem] text-muted">
          <li><strong className="font-semibold text-ink-2">{dish.kcal}</strong> kcal</li>
          <li><strong className="font-semibold text-ink-2">{dish.protein} g</strong> protein</li>
          {dish.spice > 0 && <li><SpiceLevel level={dish.spice} /></li>}
        </ul>
        <p className="text-[0.78rem] text-muted">
          {dish.allergens.length ? (
            <><strong className="font-semibold text-ink-2">Contains:</strong> {dish.allergens.join(', ')}</>
          ) : (
            'No major allergens'
          )}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-2.5">
          <p className="font-serif text-[1.2rem] font-medium">
            <span className="sr-only">Price: </span>
            {formatRupees(dish.price)}
            {customisable && <span className="sr-only"> before options</span>}
          </p>
          <button
            type="button"
            onClick={handleAdd}
            aria-haspopup={customisable ? 'dialog' : undefined}
            aria-label={customisable ? `Customise and add ${dish.name}` : `Add ${dish.name} to your order`}
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-terra-200 bg-terra-50 px-4 text-[0.88rem] font-semibold text-terra-700 transition-colors hover:border-terra hover:bg-terra hover:text-white"
          >
            <Plus aria-hidden className="size-4" />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
