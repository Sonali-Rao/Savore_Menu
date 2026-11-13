export type CategoryId = 'breakfast' | 'salads' | 'mains' | 'small' | 'coffee' | 'kombucha' | 'desserts';

export interface Category {
  id: CategoryId;
  name: string;
  blurb: string;
}

export type Diet = 'veg' | 'nonveg';

export type Allergen = 'Gluten' | 'Dairy' | 'Nuts' | 'Egg' | 'Soy' | 'Sesame' | 'Fish' | 'Shellfish';

/** 0 = not spicy, 1 = mild, 2 = medium, 3 = hot */
export type SpiceLevel = 0 | 1 | 2 | 3;

export interface OptionChoice {
  label: string;
  /** Extra cost in whole rupees (0 = included). */
  price: number;
}

export interface OptionGroup {
  id: string;
  label: string;
  /** single = choose one, multi = choose any, spice = choose one spice level */
  kind: 'single' | 'multi' | 'spice';
  choices: OptionChoice[];
  /** Index pre-selected for single/spice groups. Defaults to 0. */
  defaultIndex?: number;
}

export interface Dish {
  id: string;
  category: CategoryId;
  name: string;
  description: string;
  /** Base price in whole rupees. */
  price: number;
  diet: Diet;
  vegan?: boolean;
  kcal: number;
  /** Protein in grams. */
  protein: number;
  spice: SpiceLevel;
  allergens: Allergen[];
  badge?: 'chef' | 'bestseller';
  /** Unsplash photo id, e.g. "photo-1546069901-ba9599a7e63c". */
  image: string;
  options: OptionGroup[];
}

/** Selected choice indexes, keyed by option group id. */
export type Selection = Record<string, number[]>;

export interface CartLine {
  /** Unique per dish + selection + note, so identical customisations merge. */
  key: string;
  dishId: string;
  selection: Selection;
  note: string;
  qty: number;
}

export type OrderType = 'dine-in' | 'takeaway';
