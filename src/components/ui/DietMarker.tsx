import type { Diet } from '@/types/menu';

/** Indian food-labelling style mark: green dot = vegetarian, brown triangle = non-vegetarian. */
export function DietMarker({ diet, decorative = false, className = 'size-4' }: { diet: Diet; decorative?: boolean; className?: string }) {
  const veg = diet === 'veg';
  const colour = veg ? 'var(--color-veg)' : 'var(--color-nonveg)';
  const a11y = decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': veg ? 'Vegetarian' : 'Non-vegetarian' };
  return (
    <svg viewBox="0 0 16 16" className={`shrink-0 ${className}`} {...a11y}>
      <rect x=".75" y=".75" width="14.5" height="14.5" rx="2.5" fill="#fff" stroke={colour} strokeWidth="1.5" />
      {veg ? <circle cx="8" cy="8" r="3.6" fill={colour} /> : <path d="M8 4.2 11.8 11.4H4.2Z" fill={colour} />}
    </svg>
  );
}
