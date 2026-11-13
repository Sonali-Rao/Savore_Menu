import { describe, expect, it } from 'vitest';
import { DISHES, dishById } from '@/data/menu';
import { EMPTY_FILTERS, dietaryTags, filterDishes, hasActiveFilters } from '@/lib/filters';

describe('dietaryTags', () => {
  it('derives tags from allergens and protein', () => {
    const tags = dietaryTags(dishById('millet-miso')!);
    expect([...tags].sort()).toEqual(['dairy-free', 'gluten-free', 'high-protein', 'nut-free', 'vegan']);
  });

  it('never marks a dish nut-free when it lists nuts', () => {
    for (const d of DISHES) {
      if (d.allergens.includes('Nuts')) expect(dietaryTags(d).has('nut-free')).toBe(false);
    }
  });
});

describe('filterDishes', () => {
  it('returns everything with no filters', () => {
    expect(filterDishes(DISHES, EMPTY_FILTERS)).toHaveLength(DISHES.length);
  });

  it('filters by category and diet together', () => {
    const r = filterDishes(DISHES, { ...EMPTY_FILTERS, category: 'mains', diet: 'nonveg' });
    expect(r.map((d) => d.id)).toEqual(['lemongrass-chicken', 'basa-moilee']);
  });

  it('requires every selected tag', () => {
    const r = filterDishes(DISHES, { ...EMPTY_FILTERS, tags: ['vegan', 'high-protein'] });
    expect(r.map((d) => d.id)).toEqual(['millet-miso']);
  });

  it('searches names, descriptions and categories, ignoring accents and case', () => {
    expect(filterDishes(DISHES, { ...EMPTY_FILTERS, query: 'ACAI' }).map((d) => d.id)).toEqual(['acai-ragi']);
    expect(filterDishes(DISHES, { ...EMPTY_FILTERS, query: 'millet' }).length).toBeGreaterThan(1);
    expect(filterDishes(DISHES, { ...EMPTY_FILTERS, query: 'kombucha' }).length).toBe(3);
  });

  it('can return no results', () => {
    expect(filterDishes(DISHES, { ...EMPTY_FILTERS, query: 'pizza' })).toEqual([]);
  });
});

describe('hasActiveFilters', () => {
  it('ignores whitespace-only search', () => {
    expect(hasActiveFilters({ ...EMPTY_FILTERS, query: '   ' })).toBe(false);
    expect(hasActiveFilters({ ...EMPTY_FILTERS, diet: 'veg' })).toBe(true);
  });
});
