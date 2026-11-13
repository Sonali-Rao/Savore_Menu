import type { Dish, OptionGroup } from '@/types/menu';

/* ---------- Reusable option groups ---------- */
const spice = (defaultLevel: 1 | 2 | 3): OptionGroup => ({
  id: 'spice',
  label: 'Spice level',
  kind: 'spice',
  defaultIndex: defaultLevel - 1,
  choices: [{ label: 'Mild', price: 0 }, { label: 'Medium', price: 0 }, { label: 'Hot', price: 0 }],
});

const base: OptionGroup = {
  id: 'base',
  label: 'Choose your base',
  kind: 'single',
  choices: [
    { label: 'Foxtail millet', price: 0 },
    { label: 'Quinoa', price: 40 },
    { label: 'Brown rice', price: 0 },
    { label: 'Just greens', price: 0 },
  ],
};

const vegAddons: OptionGroup = {
  id: 'addons',
  label: 'Add-ons',
  kind: 'multi',
  choices: [
    { label: 'Avocado', price: 90 },
    { label: 'Toasted seeds', price: 30 },
    { label: 'Pickled onions', price: 20 },
    { label: 'Extra dressing', price: 20 },
  ],
};

const nonVegAddons: OptionGroup = {
  id: 'addons',
  label: 'Add-ons',
  kind: 'multi',
  choices: [
    { label: 'Avocado', price: 90 },
    { label: 'Soft-boiled egg', price: 40 },
    { label: 'Toasted seeds', price: 30 },
    { label: 'Extra sauce', price: 20 },
  ],
};

const bottle = (largeExtra = 80): OptionGroup => ({
  id: 'size',
  label: 'Size',
  kind: 'single',
  choices: [{ label: '330 ml', price: 0 }, { label: '500 ml', price: largeExtra }],
});

const addons = (...choices: [string, number][]): OptionGroup => ({
  id: 'addons',
  label: 'Add-ons',
  kind: 'multi',
  choices: choices.map(([label, price]) => ({ label, price })),
});

/* ---------- Menu ---------- */
export const DISHES: Dish[] = [
  // Breakfast & Bowls
  {
    id: 'acai-ragi', category: 'breakfast', name: 'Açaí & Ragi Smoothie Bowl',
    description: 'Blended açaí and banana over toasted ragi granola, seasonal fruit and a drizzle of almond butter.',
    price: 340, diet: 'veg', vegan: true, kcal: 410, protein: 9, spice: 0, allergens: ['Nuts'],
    image: 'photo-1590301157284-ab2f8707bdc1',
    options: [{ id: 'toppings', label: 'Extra toppings', kind: 'multi', choices: [
      { label: 'Extra fruit', price: 50 }, { label: 'Chia & flax seeds', price: 30 }, { label: 'Extra almond butter', price: 40 },
    ] }],
  },
  {
    id: 'egg-avo-toast', category: 'breakfast', name: 'Masala Egg & Avocado Toast',
    description: 'Smashed avocado, soft masala scramble and a little chilli oil on house sourdough.',
    price: 320, diet: 'nonveg', kcal: 480, protein: 22, spice: 1, allergens: ['Gluten', 'Egg'], badge: 'bestseller',
    image: 'photo-1525351484163-7529414344d8',
    options: [
      { id: 'bread', label: 'Choose your bread', kind: 'single', choices: [
        { label: 'Sourdough', price: 0 }, { label: 'Multigrain', price: 0 }, { label: 'Gluten-free loaf', price: 40 },
      ] },
      addons(['Extra egg', 40], ['Grilled mushrooms', 60], ['Crumbled feta', 50]),
      spice(1),
    ],
  },
  {
    id: 'overnight-oats', category: 'breakfast', name: 'Overnight Oats, Jaggery & Berries',
    description: 'Rolled oats soaked in almond milk and Greek yogurt, sweetened with jaggery and topped with berries and seeds.',
    price: 280, diet: 'veg', kcal: 390, protein: 14, spice: 0, allergens: ['Gluten', 'Dairy', 'Nuts'],
    image: 'photo-1488477181946-6428a0291777',
    options: [addons(['Extra berries', 50], ['Peanut butter', 40])],
  },

  // Salads
  {
    id: 'sprout-chaat', category: 'salads', name: 'Charred Corn & Sprout Chaat Salad',
    description: 'Moong sprouts, charred corn, pomegranate and raw mango with a tamarind–mint dressing.',
    price: 300, diet: 'veg', vegan: true, kcal: 320, protein: 13, spice: 2, allergens: [],
    image: 'photo-1540420773420-3366772f4999',
    options: [addons(['Avocado', 90], ['Toasted seeds', 30], ['Extra pomegranate', 30]), spice(2)],
  },
  {
    id: 'chicken-caesar', category: 'salads', name: 'Grilled Chicken Caesar',
    description: 'Little gem, herb-grilled chicken, parmesan crisps and a light hung-curd Caesar dressing.',
    price: 420, diet: 'nonveg', kcal: 460, protein: 38, spice: 0, allergens: ['Gluten', 'Dairy', 'Egg', 'Fish'],
    image: 'photo-1550304943-4f24f54ddde9',
    options: [addons(['Extra chicken', 120], ['Soft-boiled egg', 40], ['Avocado', 90])],
  },
  {
    id: 'beet-feta', category: 'salads', name: 'Roasted Beet, Orange & Feta',
    description: 'Slow-roasted beets, orange segments, whipped feta, rocket and candied walnuts.',
    price: 360, diet: 'veg', kcal: 350, protein: 11, spice: 0, allergens: ['Dairy', 'Nuts'],
    image: 'photo-1540189549336-e6e99c3679fe',
    options: [addons(['Grilled paneer', 80], ['Avocado', 90])],
  },

  // Mains
  {
    id: 'millet-miso', category: 'mains', name: 'Millet & Miso Bowl',
    description: 'Foxtail millet, miso-glazed tofu, charred broccoli, pickled cucumber and a sesame–ginger dressing.',
    price: 460, diet: 'veg', vegan: true, kcal: 520, protein: 24, spice: 1, allergens: ['Soy', 'Sesame'], badge: 'chef',
    image: 'photo-1623428187969-5da2dcea5ebf',
    options: [
      base,
      { id: 'protein', label: 'Protein', kind: 'single', choices: [
        { label: 'Miso-glazed tofu', price: 0 }, { label: 'Grilled paneer', price: 60 },
      ] },
      vegAddons,
      spice(1),
    ],
  },
  {
    id: 'paneer-quinoa', category: 'mains', name: 'Tandoori Paneer Quinoa Bowl',
    description: 'Tandoori-spiced paneer, herbed quinoa, roasted peppers, kachumber and mint yogurt.',
    price: 480, diet: 'veg', kcal: 590, protein: 32, spice: 2, allergens: ['Dairy'],
    image: 'photo-1511690656952-34342bb7c2f2',
    options: [base, vegAddons, spice(2)],
  },
  {
    id: 'lemongrass-chicken', category: 'mains', name: 'Lemongrass Chicken Grain Bowl',
    description: 'Lemongrass–lime grilled chicken, brown rice, crunchy slaw, edamame and a peanut–lime sauce.',
    price: 520, diet: 'nonveg', kcal: 610, protein: 42, spice: 1, allergens: ['Soy', 'Nuts'], badge: 'bestseller',
    image: 'photo-1547496502-affa22d38842',
    options: [
      base,
      { id: 'protein', label: 'Protein', kind: 'single', choices: [
        { label: 'Grilled chicken', price: 0 }, { label: 'Double chicken', price: 140 },
      ] },
      nonVegAddons,
      spice(1),
    ],
  },
  {
    id: 'basa-moilee', category: 'mains', name: 'Herb-Crusted Basa, Coconut Moilee',
    description: 'Pan-seared basa in a light coconut and curry-leaf moilee, with greens on the side.',
    price: 590, diet: 'nonveg', kcal: 540, protein: 36, spice: 1, allergens: ['Fish'],
    image: 'photo-1574484284002-952d92456975',
    options: [
      { id: 'side', label: 'Served with', kind: 'single', choices: [
        { label: 'Kerala red rice', price: 0 }, { label: 'Foxtail millet', price: 0 }, { label: 'Extra greens', price: 0 },
      ] },
      spice(1),
    ],
  },
  {
    id: 'pumpkin-risotto', category: 'mains', name: 'Pumpkin & Sage Millet Risotto',
    description: 'Barnyard millet cooked slowly with roasted pumpkin, sage, parmesan and toasted pumpkin seeds.',
    price: 450, diet: 'veg', kcal: 480, protein: 14, spice: 0, allergens: ['Dairy'],
    image: 'photo-1476124369491-e7addf5db371',
    options: [addons(['Grilled mushrooms', 60], ['Extra parmesan', 40])],
  },

  // Small plates
  {
    id: 'charred-brinjal', category: 'small', name: 'Charred Brinjal, Tomato & Basil',
    description: 'Smoky charred brinjal tossed with blistered tomatoes, garlic, a pinch of chilli and fresh basil.',
    price: 260, diet: 'veg', vegan: true, kcal: 220, protein: 5, spice: 2, allergens: [],
    image: 'photo-1604908177453-7462950a6a3b', options: [],
  },
  {
    id: 'edamame-hummus', category: 'small', name: 'Edamame Hummus & Seed Crackers',
    description: 'Bright edamame–tahini hummus with house seed crackers and crunchy crudités.',
    price: 290, diet: 'veg', vegan: true, kcal: 340, protein: 15, spice: 0, allergens: ['Soy', 'Sesame'],
    image: 'photo-1637949385162-e416fb15b2ce', options: [],
  },
  {
    id: 'chilli-prawns', category: 'small', name: 'Chilli-Garlic Prawns',
    description: 'Tiger prawns tossed in cold-pressed coconut oil with garlic, Kashmiri chilli and curry leaf.',
    price: 480, diet: 'nonveg', kcal: 260, protein: 28, spice: 3, allergens: ['Shellfish'], badge: 'chef',
    image: 'photo-1565680018434-b513d5e5fd47', options: [],
  },

  // Coffee
  {
    id: 'pour-over', category: 'coffee', name: 'Chikmagalur Pour Over',
    description: 'Single-estate Arabica, brewed by hand. Notes of jaggery, orange and cocoa.',
    price: 220, diet: 'veg', vegan: true, kcal: 5, protein: 0, spice: 0, allergens: [],
    image: 'photo-1495474472287-4d71bcdd2085', options: [],
  },
  {
    id: 'flat-white', category: 'coffee', name: 'Flat White',
    description: 'A double ristretto with silky, textured milk.',
    price: 210, diet: 'veg', kcal: 120, protein: 6, spice: 0, allergens: ['Dairy'], badge: 'bestseller',
    image: 'photo-1509042239860-f550ce710b93',
    options: [
      { id: 'milk', label: 'Milk', kind: 'single', choices: [
        { label: 'Whole milk', price: 0 }, { label: 'Oat milk', price: 40 }, { label: 'Almond milk', price: 50 },
      ] },
      { id: 'size', label: 'Size', kind: 'single', choices: [
        { label: 'Regular · 180 ml', price: 0 }, { label: 'Large · 300 ml', price: 60 },
      ] },
      { id: 'extras', label: 'Extras', kind: 'multi', choices: [
        { label: 'Extra shot', price: 50 }, { label: 'Sugar-free hazelnut', price: 30 },
      ] },
    ],
  },
  {
    id: 'cold-brew-tonic', category: 'coffee', name: 'Cold Brew Tonic',
    description: 'Eighteen-hour cold brew poured over tonic, with a twist of orange.',
    price: 240, diet: 'veg', vegan: true, kcal: 60, protein: 0, spice: 0, allergens: [],
    image: 'photo-1461023058943-07fcbe16d735', options: [],
  },

  // Kombucha & cold-pressed
  {
    id: 'kombucha-hibiscus', category: 'kombucha', name: 'Hibiscus & Ginger Kombucha',
    description: 'Brewed and fermented in-house. Tart, floral and lightly sparkling.',
    price: 220, diet: 'veg', vegan: true, kcal: 45, protein: 0, spice: 0, allergens: [], badge: 'chef',
    image: 'photo-1556679343-c7306c1976bc', options: [bottle()],
  },
  {
    id: 'kombucha-kokum', category: 'kombucha', name: 'Kokum & Mint Kombucha',
    description: 'Our summer brew — tangy kokum, fresh mint and a gentle fizz.',
    price: 220, diet: 'veg', vegan: true, kcal: 50, protein: 0, spice: 0, allergens: [],
    image: 'photo-1513558161293-cdaf765ed2fd', options: [bottle()],
  },
  {
    id: 'green-glow', category: 'kombucha', name: 'Green Glow Cold-Pressed',
    description: 'Cucumber, green apple, celery, amla and a squeeze of lime. Nothing added.',
    price: 240, diet: 'veg', vegan: true, kcal: 120, protein: 2, spice: 0, allergens: [],
    image: 'photo-1610970881699-44a5587cabec', options: [bottle(90)],
  },

  // Desserts
  {
    id: 'date-brownie', category: 'desserts', name: 'Date & Dark Chocolate Brownie',
    description: 'A fudgy almond-flour brownie sweetened only with dates, finished with sea salt and cacao nibs.',
    price: 280, diet: 'veg', vegan: true, kcal: 340, protein: 6, spice: 0, allergens: ['Nuts'], badge: 'chef',
    image: 'photo-1606313564200-e75d5e30476c', options: [],
  },
  {
    id: 'banana-bread', category: 'desserts', name: 'Ragi Banana Bread',
    description: 'A warm slice of ragi and banana loaf with honey labneh and toasted walnuts.',
    price: 240, diet: 'veg', kcal: 330, protein: 8, spice: 0, allergens: ['Gluten', 'Dairy', 'Nuts'],
    image: 'photo-1606101273945-e9eba91c0dc4',
    options: [addons(['Extra labneh', 40])],
  },
];

export const dishById = (id: string) => DISHES.find((d) => d.id === id);

export const FEATURED_DISH_IDS = ['millet-miso', 'lemongrass-chicken', 'kombucha-hibiscus', 'date-brownie'];
export const CHEFS_PICK_ID = 'millet-miso';

/** Site photography (Unsplash ids). */
export const SITE_IMAGES = {
  hero: 'photo-1512621776951-a57141f2eefd',
  story: 'photo-1551218808-94e220e084d2',
  reserve: 'photo-1554118811-1e0d58224f24',
};
