import { useState } from 'react';
import type { ReactElement, ReactNode } from 'react';

import { cn } from '../../utils';
import { TriangleAlertIcon } from 'lucide-react';

import { useUiConfig } from '../../lib/ui-config';
import { Button } from '../button';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { PLACEMENT } from '../tooltip';
import type { TooltipPlacement } from '../tooltip';

export type PopconfirmProps = {
  /** The question. Keep it short — this is a bubble, not a dialog. */
  title: ReactNode;
  /** Optional second line for a consequence worth spelling out. */
  description?: ReactNode;
  /** The element the bubble hangs off. Must forward ref and props. */
  children: ReactElement;

  /**
   * Returning a promise puts the OK button in a spinner until it settles.
   * Typed as `unknown` so a one-liner like `() => toast.success('…')` doesn't
   * have to be wrapped in braces just to discard its return value.
   */
  onConfirm?: () => unknown;
  onCancel?: () => void;

  okText?: ReactNode;
  cancelText?: ReactNode;
  /** `destructive` for a delete, which is the common case. */
  okVariant?: 'default' | 'destructive';
  /** `null` drops the icon. */
  icon?: ReactNode | null;

  placement?: TooltipPlacement;
  /** Renders the child untouched, with no bubble. */
  disabled?: boolean;

  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

/**
 * Ant Design-shaped confirmation bubble: the light-touch alternative to a
 * modal, anchored to the control that triggered it.
 *
 * ```tsx
 * <Popconfirm
 *   title="Xoá học viên này?"
 *   description="Hành động không thể hoàn tác."
 *   okVariant="destructive"
 *   onConfirm={() => remove.mutateAsync(id)}
 * >
 *   <Button variant="ghost" size="icon"><Trash2Icon /></Button>
 * </Popconfirm>
 * ```
 *
 * Use it for a single reversible-ish row action. When the consequence needs
 * real explanation, or the user must read something before agreeing, use
 * `Modal.confirm` from `useModal` instead.
 *
 * An async `onConfirm` keeps the bubble open and the buttons busy until it
 * resolves, so a failed request can leave the bubble up rather than closing
 * over an error the user never sees.
 */
export const Popconfirm = ({
  title,
  description,
  children,
  onConfirm,
  onCancel,
  okText,
  cancelText,
  okVariant = 'default',
  icon,
  placement = 'top',
  disabled = false,
  open,
  onOpenChange,
  className,
}: PopconfirmProps) => {
  const { translate } = useUiConfig();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [pending, setPending] = useState(false);

  if (disabled) return children;

  const isOpen = open ?? uncontrolledOpen;

  const setOpen = (next: boolean) => {
    // A request in flight owns the bubble; closing now would strand it.
    if (pending && !next) return;

    setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const confirm = async () => {
    const result = onConfirm?.();

    if (!(result instanceof Promise)) {
      setOpen(false);
      return;
    }

    setPending(true);

    try {
      await result;
      setPending(false);
      setUncontrolledOpen(false);
      onOpenChange?.(false);
    } catch {
      // Leave the bubble open so the caller's error message has somewhere to
      // land; rethrowing here would surface as an unhandled rejection.
      setPending(false);
    }
  };

  const { side, align } = PLACEMENT[placement];

  return (
    <Popover open={isOpen} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent
        side={side}
        align={align}
        onEscapeKeyDown={(event) => {
          if (pending) event.preventDefault();
        }}
        className={cn('w-auto max-w-xs min-w-56 p-3', className)}
      >
        <div className="flex gap-2">
          {icon !== null && (
            <span className="mt-0.5 shrink-0 text-orange-500 dark:text-orange-400 [&>svg]:size-4">
              {icon ?? <TriangleAlertIcon />}
            </span>
          )}

          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-sm font-medium">{title}</p>
            {!!description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>

        <div className="mt-3 flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => {
              onCancel?.();
              setOpen(false);
            }}
          >
            {cancelText ?? translate('cancel')}
          </Button>
          <Button
            size="sm"
            variant={okVariant}
            loading={pending}
            onClick={confirm}
          >
            {okText ?? translate('ok')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
