/* SAVORÉ — prototype menu data (fictional) */
const UNSPLASH = (id, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

const IMAGES = {
  hero: 'photo-1512621776951-a57141f2eefd',
  story: 'photo-1551218808-94e220e084d2',
  reserve: 'photo-1554118811-1e0d58224f24',
  'acai-ragi': 'photo-1590301157284-ab2f8707bdc1',
  'egg-avo-toast': 'photo-1525351484163-7529414344d8',
  'overnight-oats': 'photo-1488477181946-6428a0291777',
  'sprout-chaat': 'photo-1540420773420-3366772f4999',
  'chicken-caesar': 'photo-1550304943-4f24f54ddde9',
  'beet-feta': 'photo-1540189549336-e6e99c3679fe',
  'millet-miso': 'photo-1623428187969-5da2dcea5ebf',
  'paneer-quinoa': 'photo-1511690656952-34342bb7c2f2',
  'lemongrass-chicken': 'photo-1547496502-affa22d38842',
  'basa-moilee': 'photo-1574484284002-952d92456975',
  'pumpkin-risotto': 'photo-1476124369491-e7addf5db371',
  'charred-brinjal': 'photo-1604908177453-7462950a6a3b',
  'edamame-hummus': 'photo-1637949385162-e416fb15b2ce',
  'chilli-prawns': 'photo-1565680018434-b513d5e5fd47',
  'pour-over': 'photo-1495474472287-4d71bcdd2085',
  'flat-white': 'photo-1509042239860-f550ce710b93',
  'cold-brew-tonic': 'photo-1461023058943-07fcbe16d735',
  'kombucha-hibiscus': 'photo-1556679343-c7306c1976bc',
  'kombucha-kokum': 'photo-1513558161293-cdaf765ed2fd',
  'green-glow': 'photo-1610970881699-44a5587cabec',
  'date-mousse': 'photo-1606313564200-e75d5e30476c',
  'banana-bread': 'photo-1606101273945-e9eba91c0dc4',
};

const CATEGORIES = [
  { id: 'breakfast', name: 'Breakfast & Bowls', blurb: 'Served all day, because breakfast shouldn’t have a curfew.' },
  { id: 'salads', name: 'Salads', blurb: 'Big, generous and properly dressed.' },
  { id: 'mains', name: 'Mains', blurb: 'Whole grains, good protein and plenty of veg.' },
  { id: 'small', name: 'Small Plates', blurb: 'For sharing — or not.' },
  { id: 'coffee', name: 'Coffee', blurb: 'Single-estate beans from Chikmagalur.' },
  { id: 'kombucha', name: 'Kombucha & Cold-Pressed', blurb: 'Fermented and pressed in-house, nothing added.' },
  { id: 'desserts', name: 'Desserts', blurb: 'Sweetened with fruit, dates and jaggery only.' },
];

/* Reusable option groups — [label, extra price] */
const spice = (def) => ({ id: 'spice', label: 'Spice level', type: 'spice', required: true, def, choices: [['Mild', 0], ['Medium', 0], ['Hot', 0]] });
const base = { id: 'base', label: 'Choose your base', type: 'single', required: true, choices: [['Foxtail millet', 0], ['Quinoa', 40], ['Brown rice', 0], ['Just greens', 0]] };
const vegAddons = { id: 'addons', label: 'Add-ons', type: 'multi', choices: [['Avocado', 90], ['Toasted seeds', 30], ['Pickled onions', 20], ['Extra dressing', 20]] };
const nonVegAddons = { id: 'addons', label: 'Add-ons', type: 'multi', choices: [['Avocado', 90], ['Soft-boiled egg', 40], ['Toasted seeds', 30], ['Extra sauce', 20]] };
const bottle = (big = 80) => ({ id: 'size', label: 'Size', type: 'single', required: true, choices: [['330 ml', 0], ['500 ml', big]] });

const DISHES = [
  // Breakfast & Bowls
  { id: 'acai-ragi', cat: 'breakfast', name: 'Açaí & Ragi Smoothie Bowl', desc: 'Blended açaí and banana over toasted ragi granola, seasonal fruit and a drizzle of almond butter.', price: 340, diet: 'veg', vegan: true, kcal: 410, protein: 9, spice: 0, allergens: ['Nuts'],
    groups: [{ id: 'top', label: 'Extra toppings', type: 'multi', choices: [['Extra fruit', 50], ['Chia & flax seeds', 30], ['Extra almond butter', 40]] }] },
  { id: 'egg-avo-toast', cat: 'breakfast', name: 'Masala Egg & Avocado Toast', desc: 'Smashed avocado, soft masala scramble and a little chilli oil on house sourdough.', price: 320, diet: 'nonveg', kcal: 480, protein: 22, spice: 1, allergens: ['Gluten', 'Egg'], badge: 'best',
    groups: [{ id: 'bread', label: 'Choose your bread', type: 'single', required: true, choices: [['Sourdough', 0], ['Multigrain', 0], ['Gluten-free loaf', 40]] },
      { id: 'addons', label: 'Add-ons', type: 'multi', choices: [['Extra egg', 40], ['Grilled mushrooms', 60], ['Crumbled feta', 50]] }, spice(1)] },
  { id: 'overnight-oats', cat: 'breakfast', name: 'Overnight Oats, Jaggery & Berries', desc: 'Rolled oats soaked in almond milk and Greek yogurt, sweetened with jaggery and topped with berries and seeds.', price: 280, diet: 'veg', kcal: 390, protein: 14, spice: 0, allergens: ['Gluten', 'Dairy', 'Nuts'],
    groups: [{ id: 'addons', label: 'Add-ons', type: 'multi', choices: [['Extra berries', 50], ['Peanut butter', 40]] }] },

  // Salads
  { id: 'sprout-chaat', cat: 'salads', name: 'Charred Corn & Sprout Chaat Salad', desc: 'Moong sprouts, charred corn, pomegranate and raw mango with a tamarind–mint dressing.', price: 300, diet: 'veg', vegan: true, kcal: 320, protein: 13, spice: 2, allergens: [],
    groups: [{ id: 'addons', label: 'Add-ons', type: 'multi', choices: [['Avocado', 90], ['Toasted seeds', 30], ['Extra pomegranate', 30]] }, spice(2)] },
  { id: 'chicken-caesar', cat: 'salads', name: 'Grilled Chicken Caesar', desc: 'Little gem, herb-grilled chicken, parmesan crisps and a light hung-curd Caesar dressing.', price: 420, diet: 'nonveg', kcal: 460, protein: 38, spice: 0, allergens: ['Gluten', 'Dairy', 'Egg', 'Fish'],
    groups: [{ id: 'addons', label: 'Add-ons', type: 'multi', choices: [['Extra chicken', 120], ['Soft-boiled egg', 40], ['Avocado', 90]] }] },
  { id: 'beet-feta', cat: 'salads', name: 'Roasted Beet, Orange & Feta', desc: 'Slow-roasted beets, orange segments, whipped feta, rocket and candied walnuts.', price: 360, diet: 'veg', kcal: 350, protein: 11, spice: 0, allergens: ['Dairy', 'Nuts'],
    groups: [{ id: 'addons', label: 'Add-ons', type: 'multi', choices: [['Grilled paneer', 80], ['Avocado', 90]] }] },

  // Mains
  { id: 'millet-miso', cat: 'mains', name: 'Millet & Miso Bowl', desc: 'Foxtail millet, miso-glazed tofu, charred broccoli, pickled cucumber and a sesame–ginger dressing.', price: 460, diet: 'veg', vegan: true, kcal: 520, protein: 24, spice: 1, allergens: ['Soy', 'Sesame'], badge: 'chef',
    groups: [base, { id: 'protein', label: 'Protein', type: 'single', required: true, choices: [['Miso-glazed tofu', 0], ['Grilled paneer', 60]] }, vegAddons, spice(1)] },
  { id: 'paneer-quinoa', cat: 'mains', name: 'Tandoori Paneer Quinoa Bowl', desc: 'Tandoori-spiced paneer, herbed quinoa, roasted peppers, kachumber and mint yogurt.', price: 480, diet: 'veg', kcal: 590, protein: 32, spice: 2, allergens: ['Dairy'],
    groups: [base, vegAddons, spice(2)] },
  { id: 'lemongrass-chicken', cat: 'mains', name: 'Lemongrass Chicken Grain Bowl', desc: 'Lemongrass–lime grilled chicken, brown rice, crunchy slaw, edamame and peanut–lime sauce.', price: 520, diet: 'nonveg', kcal: 610, protein: 42, spice: 1, allergens: ['Soy', 'Nuts'], badge: 'best',
    groups: [base, { id: 'protein', label: 'Protein', type: 'single', required: true, choices: [['Grilled chicken', 0], ['Double chicken', 140]] }, nonVegAddons, spice(1)] },
  { id: 'basa-moilee', cat: 'mains', name: 'Herb-Crusted Basa, Coconut Moilee', desc: 'Pan-seared basa in a light coconut and curry-leaf moilee, with greens on the side.', price: 590, diet: 'nonveg', kcal: 540, protein: 36, spice: 1, allergens: ['Fish'],
    groups: [{ id: 'side', label: 'Served with', type: 'single', required: true, choices: [['Kerala red rice', 0], ['Foxtail millet', 0], ['Extra greens', 0]] }, spice(1)] },
  { id: 'pumpkin-risotto', cat: 'mains', name: 'Pumpkin & Sage Millet Risotto', desc: 'Barnyard millet cooked slowly with roasted pumpkin, sage, parmesan and toasted pumpkin seeds.', price: 450, diet: 'veg', kcal: 480, protein: 14, spice: 0, allergens: ['Dairy'],
    groups: [{ id: 'addons', label: 'Add-ons', type: 'multi', choices: [['Grilled mushrooms', 60], ['Extra parmesan', 40]] }] },

  // Small plates
  { id: 'charred-brinjal', cat: 'small', name: 'Charred Brinjal, Tomato & Basil', desc: 'Smoky charred brinjal tossed with blistered tomatoes, garlic, a pinch of chilli and fresh basil.', price: 260, diet: 'veg', vegan: true, kcal: 220, protein: 5, spice: 2, allergens: [] },
  { id: 'edamame-hummus', cat: 'small', name: 'Edamame Hummus & Seed Crackers', desc: 'Bright edamame–tahini hummus with house seed crackers and crunchy crudités.', price: 290, diet: 'veg', vegan: true, kcal: 340, protein: 15, spice: 0, allergens: ['Soy', 'Sesame'] },
  { id: 'chilli-prawns', cat: 'small', name: 'Chilli-Garlic Prawns', desc: 'Tiger prawns tossed in cold-pressed coconut oil with garlic, Kashmiri chilli and curry leaf.', price: 480, diet: 'nonveg', kcal: 260, protein: 28, spice: 3, allergens: ['Shellfish'], badge: 'chef' },

  // Coffee
  { id: 'pour-over', cat: 'coffee', name: 'Chikmagalur Pour Over', desc: 'Single-estate Arabica, brewed by hand. Notes of jaggery, orange and cocoa.', price: 220, diet: 'veg', vegan: true, kcal: 5, protein: 0, spice: 0, allergens: [] },
  { id: 'flat-white', cat: 'coffee', name: 'Flat White', desc: 'A double ristretto with silky, textured milk.', price: 210, diet: 'veg', kcal: 120, protein: 6, spice: 0, allergens: ['Dairy'], badge: 'best',
    groups: [{ id: 'milk', label: 'Milk', type: 'single', required: true, choices: [['Whole milk', 0], ['Oat milk', 40], ['Almond milk', 50]] },
      { id: 'size', label: 'Size', type: 'single', required: true, choices: [['Regular · 180 ml', 0], ['Large · 300 ml', 60]] },
      { id: 'extras', label: 'Extras', type: 'multi', choices: [['Extra shot', 50], ['Sugar-free hazelnut', 30]] }] },
  { id: 'cold-brew-tonic', cat: 'coffee', name: 'Cold Brew Tonic', desc: 'Eighteen-hour cold brew poured over tonic, with a twist of orange.', price: 240, diet: 'veg', vegan: true, kcal: 60, protein: 0, spice: 0, allergens: [] },

  // Kombucha & cold-pressed
  { id: 'kombucha-hibiscus', cat: 'kombucha', name: 'Hibiscus & Ginger Kombucha', desc: 'Brewed and fermented in-house. Tart, floral and lightly sparkling.', price: 220, diet: 'veg', vegan: true, kcal: 45, protein: 0, spice: 0, allergens: [], badge: 'chef', groups: [bottle()] },
  { id: 'kombucha-kokum', cat: 'kombucha', name: 'Kokum & Mint Kombucha', desc: 'Our summer brew — tangy kokum, fresh mint and a gentle fizz.', price: 220, diet: 'veg', vegan: true, kcal: 50, protein: 0, spice: 0, allergens: [], groups: [bottle()] },
  { id: 'green-glow', cat: 'kombucha', name: 'Green Glow Cold-Pressed', desc: 'Cucumber, green apple, celery, amla and a squeeze of lime. Nothing added.', price: 240, diet: 'veg', vegan: true, kcal: 120, protein: 2, spice: 0, allergens: [], groups: [bottle(90)] },

  // Desserts
  { id: 'date-mousse', cat: 'desserts', name: 'Date & Dark Chocolate Brownie', desc: 'A fudgy almond-flour brownie sweetened only with dates, finished with sea salt and cacao nibs.', price: 280, diet: 'veg', vegan: true, kcal: 340, protein: 6, spice: 0, allergens: ['Nuts'], badge: 'chef' },
  { id: 'banana-bread', cat: 'desserts', name: 'Ragi Banana Bread', desc: 'A warm slice of ragi and banana loaf with honey labneh and toasted walnuts.', price: 240, diet: 'veg', kcal: 330, protein: 8, spice: 0, allergens: ['Gluten', 'Dairy', 'Nuts'],
    groups: [{ id: 'addons', label: 'Add-ons', type: 'multi', choices: [['Extra labneh', 40]] }] },
];

/* Derived dietary tags so filters always match allergen data */
DISHES.forEach((d) => {
  d.groups = d.groups || [];
  d.tags = {
    veg: d.diet === 'veg',
    nonveg: d.diet === 'nonveg',
    vegan: !!d.vegan,
    gf: !d.allergens.includes('Gluten'),
    hp: d.protein >= 20,
    df: !d.allergens.includes('Dairy'),
    nf: !d.allergens.includes('Nuts'),
  };
});

const FILTERS = [
  { id: 'vegan', label: 'Vegan' },
  { id: 'gf', label: 'Gluten-free' },
  { id: 'hp', label: 'High-protein' },
  { id: 'df', label: 'Dairy-free' },
  { id: 'nf', label: 'Nut-free' },
];
