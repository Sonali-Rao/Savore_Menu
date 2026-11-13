import type { Metadata } from 'next';
import { MenuExplorer } from '@/components/menu/MenuExplorer';

export const metadata: Metadata = {
  title: 'Menu',
  description: 'Healthy bowls, salads, mains, coffee and house-brewed kombucha — with calories, protein, spice and allergens on every dish.',
};

export default function MenuPage() {
  return (
    <>
      <div className="page-container pt-10 pb-5">
        <p className="eyebrow">Served all day</p>
        <h1 className="mt-3 mb-2.5 text-[clamp(2.6rem,6vw,4rem)] font-normal">The Menu</h1>
        <p className="max-w-[40rem] text-ink-2">
          A short menu, cooked properly. Tap any dish to make it yours — every option shows its price before you add it.
        </p>
      </div>
      <MenuExplorer />
    </>
  );
}
