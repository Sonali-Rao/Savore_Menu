'use client';

import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { CATEGORIES } from '@/data/categories';
import { DISHES, dishById } from '@/data/menu';
import { DIETARY_FILTERS, EMPTY_FILTERS, filterDishes, hasActiveFilters, type DietaryTag, type MenuFilters } from '@/lib/filters';
import { plural } from '@/lib/format';
import { useUI } from '@/store/ui';
import { DietMarker } from '@/components/ui/DietMarker';
import { DishCard } from './DishCard';
import { MiniCart, MobileCartBar } from './MiniCart';

export function MenuExplorer() {
  const [filters, setFilters] = useState<MenuFilters>(EMPTY_FILTERS);
  const openCustomiser = useUI((s) => s.openCustomiser);

  // Deep link: /menu?dish=millet-miso opens that dish's customiser.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('dish');
    if (id && dishById(id)) {
      openCustomiser({ dishId: id });
      window.history.replaceState(null, '', '/menu');
    }
  }, [openCustomiser]);

  const results = useMemo(() => filterDishes(DISHES, filters), [filters]);
  const active = hasActiveFilters(filters);
  const update = (patch: Partial<MenuFilters>) => setFilters((f) => ({ ...f, ...patch }));
  const toggleTag = (t: DietaryTag) =>
    setFilters((f) => ({ ...f, tags: f.tags.includes(t) ? f.tags.filter((x) => x !== t) : [...f.tags, t] }));

  const visibleCategories = filters.category === 'all' ? CATEGORIES : CATEGORIES.filter((c) => c.id === filters.category);
  const categoryName = CATEGORIES.find((c) => c.id === filters.category)?.name;
  const summary = `${plural(results.length, 'dish', 'dishes')}${filters.query.trim() ? ` matching “${filters.query.trim()}”` : ''}${categoryName ? ` in ${categoryName}` : ''}`;

  return (
    <>
      <div className="sticky top-[72px] z-30 border-b border-line bg-bg pt-2.5 pb-3">
        <div className="page-container">
          <div role="group" aria-label="Menu categories" className="no-scrollbar -mx-0.5 flex gap-1.5 overflow-x-auto p-0.5">
            {[{ id: 'all' as const, name: 'All' }, ...CATEGORIES].map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={filters.category === c.id}
                onClick={() => update({ category: c.id })}
                className="shrink-0 rounded-full px-4 py-2 text-[0.9rem] font-medium text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink aria-pressed:bg-ink aria-pressed:text-bg"
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
            <div role="search" className="relative w-full lg:w-[300px]">
              <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
              <label htmlFor="menu-search" className="sr-only">Search the menu</label>
              <input
                id="menu-search"
                type="search"
                value={filters.query}
                onChange={(e) => update({ query: e.target.value })}
                placeholder="Search dishes or ingredients"
                autoComplete="off"
                className="input h-11 rounded-full py-0 pr-10 pl-10 [&::-webkit-search-cancel-button]:hidden"
              />
              {filters.query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => update({ query: '' })}
                  className="absolute top-1/2 right-1.5 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-ink"
                >
                  <X aria-hidden className="size-4" />
                </button>
              )}
            </div>

            <div className="no-scrollbar -m-0.5 flex min-w-0 flex-1 gap-2 overflow-x-auto p-0.5">
              <div role="group" aria-label="Diet" className="inline-flex shrink-0 rounded-full bg-surface-2 p-[3px]">
                {(['all', 'veg', 'nonveg'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    aria-pressed={filters.diet === d}
                    onClick={() => update({ diet: d })}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.85rem] font-medium text-ink-2 aria-pressed:bg-surface aria-pressed:text-ink aria-pressed:shadow-sm"
                  >
                    {d !== 'all' && <DietMarker diet={d} decorative className="size-3.5" />}
                    {d === 'all' ? 'All' : d === 'veg' ? 'Veg' : 'Non-veg'}
                  </button>
                ))}
              </div>
              <div role="group" aria-label="Dietary filters" className="flex gap-2">
                {DIETARY_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className="toggle-chip"
                    aria-pressed={filters.tags.includes(f.id)}
                    onClick={() => toggleTag(f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container">
        <div className="flex min-h-[52px] items-center justify-between gap-3 pt-4.5 pb-1 text-[0.9rem] text-muted">
          <p aria-live="polite">{summary}</p>
          {active && (
            <button type="button" onClick={() => setFilters(EMPTY_FILTERS)} className="font-semibold text-terra-700 underline underline-offset-3">
              Clear filters
            </button>
          )}
        </div>

        <div className="grid gap-10 pb-24 min-[1100px]:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            {results.length === 0 ? (
              <div className="rounded-[22px] border-[1.5px] border-dashed border-line-strong px-4 py-16 text-center">
                <Search aria-hidden className="mx-auto mb-3 size-6 text-sage-400" />
                <h2 className="mb-2 text-2xl">Nothing matches — yet.</h2>
                <p className="mb-5 text-muted">Try removing a filter or searching for an ingredient like “millet” or “paneer”.</p>
                <button type="button" className="btn btn-outline" onClick={() => setFilters(EMPTY_FILTERS)}>
                  Clear all filters
                </button>
              </div>
            ) : (
              visibleCategories.map((c) => {
                const items = results.filter((d) => d.category === c.id);
                if (!items.length) return null;
                return (
                  <section key={c.id} aria-labelledby={`cat-${c.id}`} className="mb-12 last:mb-0">
                    <h2 id={`cat-${c.id}`} className="flex items-baseline gap-3 text-[1.9rem]">
                      {c.name}
                      <span className="font-sans text-[0.82rem] font-medium tracking-normal text-muted">
                        <span className="sr-only">(</span>{plural(items.length, 'dish', 'dishes')}<span className="sr-only">)</span>
                      </span>
                    </h2>
                    <p className="mt-1 mb-5 text-[0.92rem] text-muted">{c.blurb}</p>
                    <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5 min-[1300px]:grid-cols-3">
                      {items.map((d) => (
                        <li key={d.id} className="flex">
                          <DishCard dish={d} />
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })
            )}
          </div>
          <MiniCart />
        </div>
      </div>
      <MobileCartBar />
    </>
  );
}
