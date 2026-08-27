import { useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../../utils';

import { useIsMobile } from '../../hooks/use-mobile';
import { useLocale } from '../../lib/config';
import { Button } from '../button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from './dialog';

export type ModalProps = {
  open: boolean;
  /**
   * `'alert'` makes the choice unavoidable: `role="alertdialog"`, no close
   * button, and neither Escape nor the mask dismisses it. It also stays
   * centred on a phone rather than becoming a sheet, and focus opens on
   * cancel instead of the confirming button.
   */
  variant?: 'default' | 'alert';
  title?: ReactNode;
  /** Screen-reader description. Also rendered above the body when given. */
  description?: ReactNode;
  children?: ReactNode;

  onOk?: () => void;
  onCancel?: () => void;
  okText?: ReactNode;
  cancelText?: ReactNode;
  okVariant?: 'default' | 'destructive';
  /** Spins the OK button and blocks both buttons. */
  confirmLoading?: boolean;
  /** Hides the cancel button — for an acknowledge-only dialog. */
  hideCancel?: boolean;
  /** Replaces the whole footer. `null` removes it. */
  footer?: ReactNode | null;

  /** Any CSS width. Ignored once the dialog becomes a sheet. */
  width?: number | string;
  centered?: boolean;
  /**
   * Below 768px, open from the bottom edge as a sheet instead of a centred box:
   * full width, rounded top corners, a grab handle that can be pulled down to
   * dismiss, and footer buttons sharing one row within thumb reach. On by
   * default — pass `false` for a dialog that has to stay centred on a phone.
   */
  mobileSheet?: boolean;
  /** Clicking the mask or pressing Escape closes. Off during `confirmLoading`. */
  maskClosable?: boolean;
  className?: string;
};

/**
 * A dialog controlled by `open`, with `onOk` / `onCancel` and a
 * footer built for you.
 *
 * ```tsx
 * <Modal
 *   open={open}
 *   title="Delete task"
 *   okVariant="destructive"
 *   confirmLoading={remove.isPending}
 *   onOk={() => remove.mutate(id)}
 *   onCancel={() => setOpen(false)}
 * >
 *   This cannot be undone.
 * </Modal>
 * ```
 *
 * `variant="alert"` is the forced choice — `role="alertdialog"`, no close
 * button, no dismissing by Escape or by the mask, and focus landing on cancel:
 *
 * ```tsx
 * <Modal
 *   variant="alert"
 *   open={open}
 *   title="Delete this project?"
 *   okText="Delete"
 *   okVariant="destructive"
 *   onOk={() => remove(id)}
 *   onCancel={() => setOpen(false)}
 * >
 *   Every board and every task inside it goes with it.
 * </Modal>
 * ```
 *
 * `Modal.useModal().confirm` when the confirmation is imperative — awaiting a
 * boolean inside a handler rather than rendering an `open`. `Popconfirm` when
 * the question is small enough to answer next to the button that asked it.
 *
 * Under 768px it opens from the bottom edge as a sheet — same dialog, same
 * props, reshaped for a thumb. Turn that off per dialog with
 * `mobileSheet={false}`; `variant="alert"` turns it off for you, because a
 * sheet invites the swipe-down that would dismiss it.
 *
 * For a dialog that doesn't fit this shape, compose `Dialog*` directly —
 * `DialogContent` takes `asSheet` for the same layout, and `useIsMobile()` is
 * what decides when to pass it.
 */
export const Modal = ({
  open,
  variant = 'default',
  title,
  description,
  children,
  onOk,
  onCancel,
  okText,
  cancelText,
  okVariant = 'default',
  confirmLoading = false,
  hideCancel = false,
  footer,
  width = 520,
  centered = false,
  mobileSheet = true,
  maskClosable = true,
  className,
}: ModalProps) => {
  const locale = useLocale();
  const isMobile = useIsMobile();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const isAlert = variant === 'alert';
  // A sheet can be swiped away, which is the one thing an alert must not
  // allow, so it stays a centred box at every width.
  const asSheet = mobileSheet && isMobile && !isAlert;
  const dismissable = maskClosable && !isAlert;
  // Two full-width targets side by side beat one above the other whenever the
  // dialog is only as wide as a thumb.
  const stretchButtons = asSheet || (isAlert && isMobile);

  const handleOpenChange = (next: boolean) => {
    // A dismissal while the confirm request is in flight would leave the caller
    // unsure whether it ran, so it is ignored.
    if (next || confirmLoading) return;
    if (!dismissable) return;
    onCancel?.();
  };

  const blockDismiss = (event: Event) => {
    if (!dismissable || confirmLoading) event.preventDefault();
  };

  // Radix opens focus on the first tabbable node, which in a destructive alert
  // is the button that does the damage. Cancel is the safe default.
  const focusCancel = (event: Event) => {
    if (!isAlert || hideCancel || !cancelRef.current) return;
    event.preventDefault();
    cancelRef.current.focus();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        role={isAlert ? 'alertdialog' : undefined}
        asSheet={asSheet}
        centered={centered}
        closeLabel={locale.common?.close ?? 'Close'}
        showCloseButton={!isAlert && !confirmLoading}
        onOpenAutoFocus={focusCancel}
        // A sheet spans the viewport, so an inline width would only fight it.
        style={
          asSheet
            ? undefined
            : ({ width, maxWidth: 'calc(100vw - 2rem)' } as CSSProperties)
        }
        className={className}
        onEscapeKeyDown={blockDismiss}
        onPointerDownOutside={blockDismiss}
        onInteractOutside={blockDismiss}
      >
        {/*
          Radix warns when a dialog has no title or description, and screen
          readers announce an unlabelled dialog as just "dialog". Always emit
          both; hide them visually when the caller didn't ask for them.
        */}
        <DialogTitle className={cn(!title && 'sr-only')}>
          {title ?? locale.common?.dialog ?? 'Dialog'}
        </DialogTitle>
        <DialogDescription className={cn(!description && 'sr-only')}>
          {description ?? locale.common?.dialogDescription ?? 'Dialog content'}
        </DialogDescription>

        {!!children && <div className="text-sm">{children}</div>}

        {footer === undefined ? (
          <div className={cn('flex gap-3', !asSheet && 'justify-end')}>
            {!hideCancel && (
              <Button
                ref={cancelRef}
                type="button"
                // A ghost button reads as a label rather than a target once it
                // is the size of half a phone, so give it an edge to sit in.
                variant={stretchButtons ? 'outline' : 'ghost'}
                onClick={onCancel}
                disabled={confirmLoading}
                className={cn(stretchButtons && 'flex-1')}
              >
                {cancelText ?? locale.common?.cancel ?? 'Cancel'}
              </Button>
            )}
            <Button
              type="button"
              variant={okVariant}
              onClick={onOk}
              disabled={confirmLoading}
              className={cn(stretchButtons && 'flex-1')}
            >
              {confirmLoading
                ? (locale.common?.processing ?? 'Working…')
                : (okText ?? locale.common?.ok ?? 'OK')}
            </Button>
          </div>
        ) : (
          footer
        )}
      </DialogContent>
    </Dialog>
  );
};
