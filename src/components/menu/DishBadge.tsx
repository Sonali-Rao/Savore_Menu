import type { Dish } from '@/types/menu';

export function DishBadge({ badge, className = '' }: { badge: NonNullable<Dish['badge']>; className?: string }) {
  const chef = badge === 'chef';
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.72rem] font-semibold tracking-[0.04em] shadow-sm ${
        chef ? 'bg-sage-800 text-[#f2eee3]' : 'bg-terra-50 text-terra-700'
      } ${className}`}
    >
      {chef ? 'Chef’s pick' : 'Bestseller'}
    </span>
  );
}
