'use client';

import Image from 'next/image';
import { Info, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import type { Dish, OptionGroup, Selection } from '@/types/menu';
import { dishById } from '@/data/menu';
import { dietaryTags } from '@/lib/filters';
import { formatRupees } from '@/lib/format';
import { unsplash } from '@/lib/images';
import { defaultSelection, unitPrice } from '@/lib/pricing';
import { MAX_QTY, useCart } from '@/store/cart';
import { useUI } from '@/store/ui';
import { Dialog } from '@/components/ui/Dialog';
import { DietMarker } from '@/components/ui/DietMarker';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { SPICE_LABELS, SpiceLevel } from '@/components/ui/SpiceLevel';

/** Global customisation dialog, opened from dish cards, the cart drawer and the cart page. */
export function DishCustomiser() {
  const customising = useUI((s) => s.customising);
  const close = useUI((s) => s.closeCustomiser);
  const dish = customising ? dishById(customising.dishId) : undefined;

  return (
    <Dialog open={!!dish} onClose={close} labelledBy="customiser-title" variant="sheet">
      {dish && customising && (
        <CustomiserForm key={`${dish.id}-${customising.editKey ?? 'new'}`} dish={dish} editKey={customising.editKey} />
      )}
    </Dialog>
  );
}

function CustomiserForm({ dish, editKey }: { dish: Dish; editKey?: string }) {
  const editing = useCart((s) => (editKey ? s.lines.find((l) => l.key === editKey) : undefined));
  const add = useCart((s) => s.add);
  const replace = useCart((s) => s.replace);
  const close = useUI((s) => s.closeCustomiser);
  const showToast = useUI((s) => s.showToast);

  const [selection, setSelection] = useState<Selection>(() => editing?.selection ?? defaultSelection(dish));
  const [qty, setQty] = useState(editing?.qty ?? 1);
  const [note, setNote] = useState(editing?.note ?? '');

  const total = unitPrice(dish, selection) * qty;
  const tags = dietaryTags(dish);

  const choose = (group: OptionGroup, index: number, checked: boolean) =>
    setSelection((s) => {
      if (group.kind !== 'multi') return { ...s, [group.id]: [index] };
      const current = s[group.id] ?? [];
      return { ...s, [group.id]: checked ? [...current, index].sort((a, b) => a - b) : current.filter((i) => i !== index) };
    });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (editing) {
      replace(editing.key, selection, note, qty);
      showToast(`Updated ${dish.name}`);
    } else {
      add(dish.id, selection, note, qty);
      showToast(`Added ${qty} × ${dish.name} to your order`);
    }
    close();
  };

  return (
    <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="relative aspect-[16/8] bg-surface-2 sm:aspect-video">
          <Image src={unsplash(dish.image)} alt={dish.name} fill sizes="480px" className="object-cover" priority />
          <button type="button" data-autofocus onClick={close} aria-label="Close" className="icon-btn absolute top-3.5 right-3.5 shadow-soft">
            <X aria-hidden className="size-5" />
          </button>
        </div>

        <div className="px-5 pt-5 pb-1">
          <div className="flex items-start gap-2.5">
            <DietMarker diet={dish.diet} className="mt-2.5 size-4" />
            <h2 id="customiser-title" className="text-[1.85rem]">{dish.name}</h2>
          </div>
          <p className="mt-2.5 text-[0.95rem] text-ink-2">{dish.description}</p>
          <ul aria-label="Nutrition and dietary information" className="mt-4 flex flex-wrap gap-2">
            {[
              <><strong className="text-ink">{dish.kcal}</strong> kcal</>,
              <><strong className="text-ink">{dish.protein} g</strong> protein</>,
              tags.has('vegan') ? 'Vegan' : null,
              tags.has('gluten-free') ? 'Gluten-free' : null,
              dish.spice ? <><SpiceLevel level={dish.spice} decorative /> {SPICE_LABELS[dish.spice]} spice</> : null,
            ]
              .filter(Boolean)
              .map((content, i) => (
                <li key={i} className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-[0.8rem] text-ink-2">
                  {content}
                </li>
              ))}
          </ul>
        </div>

        <div className="mx-5 mt-4 flex gap-2.5 rounded-xl border border-line bg-surface px-3.5 py-3 text-[0.85rem] text-ink-2">
          <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-sage-600" />
          <p>
            {dish.allergens.length ? <><strong>Contains:</strong> {dish.allergens.join(', ')}.</> : 'No major allergens.'}{' '}
            Nutrition shown is for the standard recipe.
          </p>
        </div>

        {dish.options.map((group) => (
          <OptionFieldset key={group.id} dish={dish} group={group} selected={selection[group.id] ?? []} onChoose={choose} />
        ))}

        <div className="px-5 pt-5.5 pb-6">
          <label htmlFor="kitchen-note" className="mb-2.5 block font-serif text-[1.2rem]">
            Note for the kitchen{' '}
            <span className="ml-1.5 font-sans text-[0.72rem] font-semibold tracking-[0.06em] text-muted uppercase">Optional</span>
          </label>
          <textarea
            id="kitchen-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={140}
            rows={2}
            placeholder="e.g. no onions, dressing on the side"
            className="input min-h-[76px] resize-y"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-line bg-surface px-5 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
        <QuantityStepper value={qty} max={MAX_QTY} onChange={setQty} label="Quantity" />
        <button type="submit" className="btn btn-primary flex-1 justify-between px-5">
          <span>{editing ? 'Update item' : 'Add to order'}</span>
          <span className="tabular-nums">{formatRupees(total)}</span>
        </button>
        <p className="sr-only" aria-live="polite">Total {formatRupees(total)}</p>
      </div>
    </form>
  );
}

function OptionFieldset({
  dish, group, selected, onChoose,
}: {
  dish: Dish;
  group: OptionGroup;
  selected: number[];
  onChoose: (group: OptionGroup, index: number, checked: boolean) => void;
}) {
  const multi = group.kind === 'multi';
  const name = `${dish.id}-${group.id}`;

  return (
    <fieldset className="min-w-0 px-5 pt-5.5">
      <legend className="float-left mb-3 flex w-full items-baseline justify-between gap-2">
        <span className="font-serif text-[1.2rem] font-medium">{group.label}</span>
        <span className={`text-[0.72rem] font-semibold tracking-[0.06em] uppercase ${multi ? 'text-muted' : 'text-terra-700'}`}>
          {multi ? 'Optional' : 'Required'}
        </span>
      </legend>

      {group.kind === 'spice' ? (
        <div className="clear-both grid grid-cols-3 gap-2">
          {group.choices.map((c, i) => (
            <label key={c.label} className="pill-choice soft flex-col gap-1 p-2.5 text-[0.95rem]">
              <input type="radio" name={name} checked={selected.includes(i)} onChange={() => onChoose(group, i, true)} />
              <SpiceLevel level={i + 1} decorative />
              {c.label}
            </label>
          ))}
        </div>
      ) : (
        <div className="clear-both grid gap-2">
          {group.choices.map((c, i) => (
            <label key={c.label} className="choice">
              <input
                type={multi ? 'checkbox' : 'radio'}
                name={name}
                checked={selected.includes(i)}
                onChange={(e) => onChoose(group, i, e.target.checked)}
              />
              <span className="flex-1 text-[0.95rem]">{c.label}</span>
              <span className="text-[0.88rem] text-muted tabular-nums">
                {c.price ? `+ ${formatRupees(c.price)}` : multi ? '' : 'Included'}
              </span>
            </label>
          ))}
        </div>
      )}
    </fieldset>
  );
}
