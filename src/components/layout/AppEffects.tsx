'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useCart } from '@/store/cart';

/**
 * - Restores the saved cart after the first render (avoids hydration mismatches).
 * - After client-side navigation, moves focus to the new page's <h1> so keyboard and
 *   screen-reader users start at the top of the new content.
 */
export function AppEffects() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    Promise.resolve(useCart.persist.rehydrate()).finally(() => useCart.setState({ hydrated: true }));
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.location.hash) return; // in-page anchors (e.g. /#visit) handle their own scroll
    const h1 = document.querySelector<HTMLElement>('main h1');
    if (h1) {
      h1.setAttribute('tabindex', '-1');
      h1.focus({ preventScroll: true });
    }
  }, [pathname]);

  return null;
}
