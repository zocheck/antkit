import { useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../utils';
import {
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  XIcon,
} from 'lucide-react';

import { useLocale } from '../../lib/config';

export type AlertType = 'success' | 'info' | 'warning' | 'error';

const TYPE_ICON = {
  success: CircleCheckIcon,
  info: InfoIcon,
  warning: TriangleAlertIcon,
  error: CircleAlertIcon,
} as const;

/**
 * Tinted surfaces rather than the theme's semantic tokens: an alert has to read
 * as one of four states side by side, and `--primary` follows the brand accent,
 * which would make "info" collide with every other blue thing on the page.
 */
const TYPE_CLASS: Record<AlertType, string> = {
  success:
    'border-green-200 bg-green-50 text-green-900 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-100',
  info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-100',
  warning:
    'border-orange-200 bg-orange-50 text-orange-900 dark:border-orange-900/50 dark:bg-orange-950/40 dark:text-orange-100',
  error:
    'border-red-200 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100',
};

const ICON_CLASS: Record<AlertType, string> = {
  success: 'text-green-600 dark:text-green-400',
  info: 'text-blue-600 dark:text-blue-400',
  warning: 'text-orange-600 dark:text-orange-400',
  error: 'text-red-600 dark:text-red-400',
};

export type AlertProps = Omit<ComponentProps<'div'>, 'title'> & {
  /** The headline. Named `message`; the body underneath is `description`. */
  message: ReactNode;
  /** Second line. Its presence switches the alert to the taller layout. */
  description?: ReactNode;
  type?: AlertType;
  showIcon?: boolean;
  /** Replaces the icon for `type`. */
  icon?: ReactNode;
  closable?: boolean;
  onClose?: () => void;
  /** Called once the alert has left the tree. */
  afterClose?: () => void;
  /** Full-width strip with no rounding — for a page-level notice. */
  banner?: boolean;
  /** Buttons on the trailing edge. */
  action?: ReactNode;
};

/**
 * An inline alert.
 *
 * ```tsx
 * <Alert
 *   type="warning"
 *   showIcon
 *   closable
 *   message="Contracts expiring soon"
 *   description="Three contracts expire this week."
 *   action={<Button size="sm" variant="ghost">Xem</Button>}
 * />
 * ```
 *
 * Closing is handled internally — the alert removes itself and calls back. Drive
 * it yourself by leaving `closable` off and unmounting the component.
 */
export const Alert = ({
  message,
  description,
  type = 'info',
  showIcon = false,
  icon,
  closable = false,
  onClose,
  afterClose,
  banner = false,
  action,
  className,
  ...props
}: AlertProps) => {
  const locale = useLocale();
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  // A banner is a notice, not a decoration: it defaults to showing its icon.
  const withIcon = showIcon || (banner && showIcon !== false);
  const Icon = TYPE_ICON[type];

  const handleClose = () => {
    onClose?.();
    setClosed(true);
    afterClose?.();
  };

  return (
    <div
      data-slot="alert"
      data-type={type}
      // `alert` interrupts a screen reader; a warning or error earns that, a
      // success or info note does not.
      role={type === 'error' || type === 'warning' ? 'alert' : 'status'}
      className={cn(
        'flex w-full gap-3 border text-sm',
        banner ? 'rounded-none px-4 py-2' : 'rounded-md px-4 py-3',
        description ? 'items-start' : 'items-center',
        TYPE_CLASS[type],
        className,
      )}
      {...props}
    >
      {withIcon && (
        <span
          className={cn(
            'flex shrink-0 items-center [&>svg]:size-4',
            description ? 'mt-0.5 [&>svg]:size-5' : '',
            ICON_CLASS[type],
          )}
        >
          {icon ?? <Icon />}
        </span>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className={cn(description && 'font-medium')}>{message}</div>
        {!!description && (
          <div className="text-sm opacity-90">{description}</div>
        )}
      </div>

      {!!action && <div className="flex shrink-0 items-center">{action}</div>}

      {closable && (
        <button
          type="button"
          onClick={handleClose}
          aria-label={locale.common?.close ?? 'Close'}
          className={cn(
            'shrink-0 cursor-pointer rounded-sm opacity-60 transition-opacity hover:opacity-100',
            'outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
            description && 'mt-0.5',
          )}
        >
          <XIcon className="size-4" />
        </button>
      )}
    </div>
  );
};
