import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../utils';
import {
  CircleAlertIcon,
  CircleCheckIcon,
  CircleXIcon,
  InfoIcon,
  LockIcon,
  SearchXIcon,
  ServerCrashIcon,
} from 'lucide-react';

export type ResultStatus =
  | 'success'
  | 'error'
  | 'info'
  | 'warning'
  | '404'
  | '403'
  | '500';

const STATUS_ICON = {
  success: CircleCheckIcon,
  error: CircleXIcon,
  info: InfoIcon,
  warning: CircleAlertIcon,
  '404': SearchXIcon,
  '403': LockIcon,
  '500': ServerCrashIcon,
} as const;

const STATUS_CLASS: Record<ResultStatus, string> = {
  success: 'bg-green-100 text-green-600',
  error: 'bg-red-100 text-red-600',
  info: 'bg-blue-100 text-blue-600',
  warning: 'bg-orange-100 text-orange-600',
  '404': 'bg-muted text-muted-foreground',
  '403': 'bg-orange-100 text-orange-600',
  '500': 'bg-red-100 text-red-600',
};

export type ResultProps = Omit<ComponentProps<'div'>, 'title'> & {
  status?: ResultStatus;
  title?: ReactNode;
  subTitle?: ReactNode;
  /** Override the status icon. */
  icon?: ReactNode;
  /** Buttons under the text. */
  extra?: ReactNode;
  /** Detail panel below everything — a stack trace, a list of what failed. */
  children?: ReactNode;
};

/**
 * A whole-page outcome: submitted, denied, not found, blew up. `Empty` is for a
 * container with nothing in it; `Alert` is for a message beside other content.
 *
 * ```tsx
 * <Result
 *   status="success"
 *   title="Đã tạo chiến dịch"
 *   subTitle="Email sẽ gửi lúc 09:00 ngày mai."
 *   extra={<Button>Về danh sách</Button>}
 * />
 * ```
 */
export const Result = ({
  status = 'info',
  title,
  subTitle,
  icon,
  extra,
  className,
  children,
  ...props
}: ResultProps) => {
  const Icon = STATUS_ICON[status];

  return (
    <div
      data-slot="result"
      data-status={status}
      className={cn(
        'flex w-full flex-col items-center gap-4 px-6 py-12 text-center',
        className,
      )}
      {...props}
    >
      {icon ?? (
        <div
          data-slot="result-icon"
          className={cn(
            'flex size-16 items-center justify-center rounded-full',
            STATUS_CLASS[status],
          )}
        >
          <Icon className="size-8" />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        {!!title && (
          <p data-slot="result-title" className="text-lg font-medium">
            {title}
          </p>
        )}
        {!!subTitle && (
          <p
            data-slot="result-subtitle"
            className="max-w-md text-sm text-muted-foreground"
          >
            {subTitle}
          </p>
        )}
      </div>

      {!!extra && (
        <div
          data-slot="result-extra"
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {extra}
        </div>
      )}

      {!!children && (
        <div
          data-slot="result-content"
          className="w-full max-w-2xl rounded-lg bg-muted p-4 text-left text-sm"
        >
          {children}
        </div>
      )}
    </div>
  );
};
