'use client';

import { create } from 'zustand';

interface Customising {
  dishId: string;
  /** Present when editing an existing cart line. */
  editKey?: string;
  /** Reopen the cart drawer when the customiser closes (editing from the drawer). */
  fromDrawer?: boolean;
}

interface UIState {
  cartOpen: boolean;
  customising: Customising | null;
  toast: { id: number; message: string } | null;
  openCart: () => void;
  closeCart: () => void;
  openCustomiser: (c: Customising) => void;
  closeCustomiser: () => void;
  showToast: (message: string) => void;
}

export const useUI = create<UIState>()((set) => ({
  cartOpen: false,
  customising: null,
  toast: null,
  openCart: () => set({ cartOpen: true, customising: null }),
  closeCart: () => set({ cartOpen: false }),
  openCustomiser: (customising) => set({ customising, cartOpen: false }),
  // Idempotent: the native dialog also fires "close" after we close it ourselves.
  closeCustomiser: () => set((s) => (s.customising ? { customising: null, cartOpen: !!s.customising.fromDrawer } : s)),
  showToast: (message) => set({ toast: { id: Date.now(), message } }),
}));
