'use client';

import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useUI } from '@/store/ui';

/** Always-mounted polite live region, so screen readers hear "Added …" confirmations. */
export function Toast() {
  const toast = useUI((s) => s.toast);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!toast) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div
      data-toast
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 z-[120] flex max-w-[calc(100%-32px)] -translate-x-1/2 items-center gap-2.5 rounded-[14px] bg-ink px-4.5 py-3 text-[0.92rem] text-white shadow-lift transition-[transform,opacity] duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-[160%] opacity-0'
      }`}
    >
      {toast && (
        <>
          <Check aria-hidden className="size-5 text-[#b9c9a5]" />
          <span key={toast.id}>{toast.message}</span>
        </>
      )}
    </div>
  );
}
