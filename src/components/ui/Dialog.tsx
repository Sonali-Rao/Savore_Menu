'use client';

import { useEffect, useRef, type ReactNode } from 'react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  /** "sheet" slides up from the bottom on small screens; both slide in from the right on larger ones. */
  variant?: 'drawer' | 'sheet';
  children: ReactNode;
}

/**
 * Native <dialog> opened with showModal(): the browser traps focus, closes on Escape,
 * makes the rest of the page inert and returns focus to the trigger when it closes.
 */
export function Dialog({ open, onClose, labelledBy, variant = 'drawer', children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // Browsers may focus a scrollable area first; start on the element marked for it (usually "Close").
      dialog.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    // Clicking the backdrop targets the <dialog> itself (its content fills the box).
    // Keyboard users close it with Escape or the visible close button.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={ref}
      // Only reference the title while it exists; the content (and its heading) render only when open.
      aria-labelledby={open ? labelledBy : undefined}
      className={variant === 'sheet' ? 'drawer sheet' : 'drawer'}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {open ? children : null}
    </dialog>
  );
}
