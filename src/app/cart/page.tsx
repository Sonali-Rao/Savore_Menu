import type { Metadata } from 'next';
import { CartView } from '@/components/cart/CartView';

export const metadata: Metadata = {
  title: 'Your order',
  description: 'Review your SAVORÉ order, choose dine-in or takeaway and see the full bill with GST.',
};

export default function CartPage() {
  return <CartView />;
}
