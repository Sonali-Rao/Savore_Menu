import { Hero, OrderModes, ReserveCta, Story, ValuesStrip, VisitUs } from '@/components/home/HomeSections';
import { FeaturedDishes } from '@/components/home/FeaturedDishes';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValuesStrip />
      <Story />
      <FeaturedDishes />
      <OrderModes />
      <ReserveCta />
      <VisitUs />
    </>
  );
}
