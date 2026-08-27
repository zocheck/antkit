import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../../utils';

import { useIsMobile } from '../../hooks/use-mobile';
import { useUiConfig } from '../../lib/ui-config';
import { Button } from '../button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from './dialog';

export type ModalProps = {
  open: boolean;
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

  /** Any CSS width. Defaults to antd's 520px. Ignored once it becomes a sheet. */
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
 * Ant Design-shaped dialog: controlled by `open`, with `onOk` / `onCancel` and a
 * footer built for you.
 *
 * ```tsx
 * <Modal
 *   open={open}
 *   title="Xoá công việc"
 *   okVariant="destructive"
 *   confirmLoading={remove.isPending}
 *   onOk={() => remove.mutate(id)}
 *   onCancel={() => setOpen(false)}
 * >
 *   Hành động này không thể hoàn tác.
 * </Modal>
 * ```
 *
 * Under 768px it opens from the bottom edge as a sheet — same dialog, same
 * props, reshaped for a thumb. Turn that off per dialog with
 * `mobileSheet={false}`.
 *
 * For a dialog that doesn't fit this shape, compose `Dialog*` directly —
 * `DialogContent` takes `asSheet` for the same layout, and `useIsMobile()` is
 * what decides when to pass it.
 */
export const Modal = ({
  open,
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
  const { translate } = useUiConfig();
  const isMobile = useIsMobile();
  const asSheet = mobileSheet && isMobile;

  const handleOpenChange = (next: boolean) => {
    // A dismissal while the confirm request is in flight would leave the caller
    // unsure whether it ran, so it is ignored.
    if (next || confirmLoading) return;
    if (!maskClosable) return;
    onCancel?.();
  };

  const blockDismiss = (event: Event) => {
    if (!maskClosable || confirmLoading) event.preventDefault();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        asSheet={asSheet}
        centered={centered}
        closeLabel={translate('close')}
        showCloseButton={!confirmLoading}
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
          {title ?? translate('dialog')}
        </DialogTitle>
        <DialogDescription className={cn(!description && 'sr-only')}>
          {description ?? translate('dialogDescription')}
        </DialogDescription>

        {!!children && <div className="text-sm">{children}</div>}

        {footer === undefined ? (
          <div className={cn('flex gap-3', !asSheet && 'justify-end')}>
            {!hideCancel && (
              <Button
                type="button"
                // A ghost button reads as a label rather than a target once it
                // is the size of half a phone, so give it an edge to sit in.
                variant={asSheet ? 'outline' : 'ghost'}
                onClick={onCancel}
                disabled={confirmLoading}
                // Sharing the row, not stacked: two thumb-sized targets side by
                // side beat one above the other on a sheet this short.
                className={cn(asSheet && 'flex-1')}
              >
                {cancelText ?? translate('cancel')}
              </Button>
            )}
            <Button
              type="button"
              variant={okVariant}
              onClick={onOk}
              disabled={confirmLoading}
              className={cn(asSheet && 'flex-1')}
            >
              {confirmLoading
                ? translate('processing')
                : (okText ?? translate('ok'))}
            </Button>
          </div>
        ) : (
          footer
        )}
      </DialogContent>
    </Dialog>
  );
};
