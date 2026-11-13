import type { Category } from '@/types/menu';

export const CATEGORIES: Category[] = [
  { id: 'breakfast', name: 'Breakfast & Bowls', blurb: 'Served all day, because breakfast shouldn’t have a curfew.' },
  { id: 'salads', name: 'Salads', blurb: 'Big, generous and properly dressed.' },
  { id: 'mains', name: 'Mains', blurb: 'Whole grains, good protein and plenty of veg.' },
  { id: 'small', name: 'Small Plates', blurb: 'For sharing — or not.' },
  { id: 'coffee', name: 'Coffee', blurb: 'Single-estate beans from Chikmagalur.' },
  { id: 'kombucha', name: 'Kombucha & Cold-Pressed', blurb: 'Fermented and pressed in-house, nothing added.' },
  { id: 'desserts', name: 'Desserts', blurb: 'Sweetened with fruit, dates and jaggery only.' },
];

export const categoryById = (id: string) => CATEGORIES.find((c) => c.id === id);
