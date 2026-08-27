import { useRef, useState } from 'react';
import type { ComponentProps, PointerEvent } from 'react';

import { cn } from '../../utils';
import { XIcon } from 'lucide-react';

import { useLocale } from '../../lib/config';
import { Dialog as DialogPrimitive } from 'radix-ui';

/**
 * Radix Dialog wrappers. `Modal` composes these; they stay exported for a
 * dialog that needs a shape `Modal` doesn't cover.
 */

export const Dialog = (props: ComponentProps<typeof DialogPrimitive.Root>) => (
  <DialogPrimitive.Root data-slot="dialog" {...props} />
);

export const DialogTrigger = (
  props: ComponentProps<typeof DialogPrimitive.Trigger>,
) => <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;

export const DialogClose = (
  props: ComponentProps<typeof DialogPrimitive.Close>,
) => <DialogPrimitive.Close data-slot="dialog-close" {...props} />;

export const DialogPortal = (
  props: ComponentProps<typeof DialogPrimitive.Portal>,
) => <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;

export const DialogOverlay = ({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Overlay>) => (
  <DialogPrimitive.Overlay
    data-slot="dialog-overlay"
    className={cn(
      'fixed inset-0 z-50 bg-black/50',
      'data-[state=open]:animate-in data-[state=open]:fade-in-0',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
      className,
    )}
    {...props}
  />
);

/** How far the sheet has to be pulled down before letting go dismisses it. */
const SHEET_DISMISS_PX = 88;

export type DialogContentProps = ComponentProps<
  typeof DialogPrimitive.Content
> & {
  centered?: boolean;
  showCloseButton?: boolean;
  closeLabel?: string;
  /**
   * Pin to the bottom edge and slide up, with a grab handle that can be pulled
   * back down to dismiss. Purely presentational — `Modal`'s `mobileSheet` is
   * what decides when a phone gets this; compose it with `useIsMobile()` here.
   */
  asSheet?: boolean;
  grabLabel?: string;
};

export const DialogContent = ({
  className,
  children,
  centered = false,
  showCloseButton = true,
  closeLabel,
  asSheet = false,
  grabLabel,
  style,
  ...props
}: DialogContentProps) => {
  const locale = useLocale();
  // How far the sheet is currently pulled down, and whether a finger is still
  // on it — released, the same offset animates rather than tracking.
  const [pull, setPull] = useState({ y: 0, held: false });
  const grabbedAt = useRef<number | null>(null);
  // Dismissing through the real close button keeps Radix in charge, so a
  // `Modal` that refuses to close right now still gets the final say.
  const close = useRef<HTMLButtonElement>(null);

  const grab = (event: PointerEvent<HTMLDivElement>) => {
    grabbedAt.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
    setPull({ y: 0, held: true });
  };

  const pullDown = (event: PointerEvent<HTMLDivElement>) => {
    if (grabbedAt.current === null) return;

    // Downwards only: dragging up would tear the sheet off its edge.
    setPull({ y: Math.max(0, event.clientY - grabbedAt.current), held: true });
  };

  const release = (event: PointerEvent<HTMLDivElement>) => {
    if (grabbedAt.current === null) return;

    const travelled = Math.max(0, event.clientY - grabbedAt.current);
    grabbedAt.current = null;

    // Springing back is the same state either way: on a dismissal the exit
    // animation overrides the inline transform, so it carries on downwards.
    setPull({ y: 0, held: false });
    if (travelled > SHEET_DISMISS_PX) close.current?.click();
  };

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        style={
          asSheet
            ? {
                ...style,
                transform: `translateY(${pull.y}px)`,
                transition: pull.held ? 'none' : 'transform 200ms ease-out',
              }
            : style
        }
        className={cn(
          'fixed z-50 grid gap-4 border bg-card text-card-foreground shadow-lg duration-200',
          asSheet
            ? [
                'inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-2xl border-b-0 px-5 pt-3',
                // Clear the home indicator on a phone without leaving a gap on
                // anything that doesn't have one.
                'pb-[max(1.25rem,env(safe-area-inset-bottom))]',
                'data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom',
                'data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom',
              ]
            : [
                'left-1/2 w-full max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-xl p-6',
                // Vertically centred, or pinned near the top — the default,
                // because top alignment keeps a tall dialog from jumping as
                // its content grows.
                centered
                  ? 'top-1/2 -translate-y-1/2'
                  : 'top-[8vh] max-h-[84vh] overflow-y-auto',
                'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
                'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
              ],
          className,
        )}
        {...props}
      >
        {asSheet && (
          <>
            <div
              aria-label={
                grabLabel ?? locale.modal?.grabToClose ?? 'Drag down to close'
              }
              // `touch-none` so the gesture is ours, not the page's scroll.
              className="-mt-1 -mb-2 flex touch-none cursor-grab justify-center py-2 active:cursor-grabbing"
              onPointerDown={grab}
              onPointerMove={pullDown}
              onPointerUp={release}
              onPointerCancel={release}
            >
              <span className="h-1.5 w-10 rounded-full bg-muted-foreground/30" />
            </div>
            {/*
              What the handle dismisses through. Kept out of the accessibility
              tree — a sheet is closed by the mask, Escape or its own footer,
              and this exists only so the gesture goes through Radix rather
              than around it.
            */}
            <DialogPrimitive.Close
              ref={close}
              className="hidden"
              tabIndex={-1}
            />
          </>
        )}

        {children}

        {showCloseButton && !asSheet && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            aria-label={closeLabel ?? locale.common?.close ?? 'Close'}
            className={cn(
              'absolute right-4 top-4 flex size-7 cursor-pointer items-center justify-center rounded-md',
              'text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
              'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
            )}
          >
            <XIcon className="size-4" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
};

export const DialogTitle = ({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) => (
  <DialogPrimitive.Title
    data-slot="dialog-title"
    className={cn('pr-8 text-base font-medium', className)}
    {...props}
  />
);

export const DialogDescription = ({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) => (
  <DialogPrimitive.Description
    data-slot="dialog-description"
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
);
