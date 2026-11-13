import type { CategoryId, Diet, Dish } from '@/types/menu';
import { categoryById } from '@/data/categories';

export type DietaryTag = 'vegan' | 'gluten-free' | 'high-protein' | 'dairy-free' | 'nut-free';

export const DIETARY_FILTERS: { id: DietaryTag; label: string }[] = [
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten-free', label: 'Gluten-free' },
  { id: 'high-protein', label: 'High-protein' },
  { id: 'dairy-free', label: 'Dairy-free' },
  { id: 'nut-free', label: 'Nut-free' },
];

export const HIGH_PROTEIN_GRAMS = 20;

/** Tags are derived from allergen data, so a filter can never contradict the label on a dish. */
export function dietaryTags(dish: Dish): Set<DietaryTag> {
  const tags = new Set<DietaryTag>();
  if (dish.vegan) tags.add('vegan');
  if (!dish.allergens.includes('Gluten')) tags.add('gluten-free');
  if (dish.protein >= HIGH_PROTEIN_GRAMS) tags.add('high-protein');
  if (!dish.allergens.includes('Dairy')) tags.add('dairy-free');
  if (!dish.allergens.includes('Nuts')) tags.add('nut-free');
  return tags;
}

/** Lower-case and strip accents so "acai" finds "Açaí". */
export const normalise = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

export interface MenuFilters {
  category: CategoryId | 'all';
  diet: Diet | 'all';
  tags: DietaryTag[];
  query: string;
}

export const EMPTY_FILTERS: MenuFilters = { category: 'all', diet: 'all', tags: [], query: '' };

export function filterDishes(dishes: Dish[], f: MenuFilters): Dish[] {
  const q = normalise(f.query);
  return dishes.filter((d) => {
    if (f.category !== 'all' && d.category !== f.category) return false;
    if (f.diet !== 'all' && d.diet !== f.diet) return false;
    if (f.tags.length) {
      const tags = dietaryTags(d);
      if (!f.tags.every((t) => tags.has(t))) return false;
    }
    if (q) {
      const haystack = normalise(`${d.name} ${d.description} ${categoryById(d.category)?.name ?? ''}`);
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export const hasActiveFilters = (f: MenuFilters) =>
  f.category !== 'all' || f.diet !== 'all' || f.tags.length > 0 || f.query.trim() !== '';
