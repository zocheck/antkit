import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../utils';
import { CheckIcon, XIcon } from 'lucide-react';
import { Progress as ProgressPrimitive } from 'radix-ui';

export type ProgressStatus = 'normal' | 'active' | 'success' | 'exception';

const BAR_CLASS: Record<ProgressStatus, string> = {
  normal: 'bg-primary',
  active: 'bg-primary',
  success: 'bg-green-500',
  exception: 'bg-destructive',
};

const STROKE_CLASS: Record<ProgressStatus, string> = {
  normal: 'stroke-primary',
  active: 'stroke-primary',
  success: 'stroke-green-500',
  exception: 'stroke-destructive',
};

const TRACK_HEIGHT = {
  sm: 'h-1',
  default: 'h-2',
  lg: 'h-3',
} as const;

type ProgressBase = {
  /** 0–100. Values outside the range are clamped. */
  percent?: number;
  /** `success` and `exception` also swap the trailing info for an icon. */
  status?: ProgressStatus;
  /** Hide the percentage next to the bar. */
  showInfo?: boolean;
  /** Replace the trailing info with your own node. */
  format?: (percent: number) => ReactNode;
};

export type ProgressProps = Omit<ComponentProps<'div'>, 'children'> &
  ProgressBase & {
    type?: 'line' | 'circle';
    /** Line only. */
    size?: 'sm' | 'default' | 'lg';
    /** Circle only — diameter in px. */
    diameter?: number;
    /** Circle only — ring thickness in px. */
    strokeWidth?: number;
  };

const clamp = (percent: number) => Math.min(100, Math.max(0, percent));

/**
 * How far along something is.
 *
 * ```tsx
 * <Progress percent={64} />
 * <Progress type="circle" percent={100} status="success" />
 * ```
 */
export const Progress = ({
  percent = 0,
  status = 'normal',
  showInfo = true,
  format,
  type = 'line',
  size = 'default',
  diameter = 96,
  strokeWidth = 8,
  className,
  ...props
}: ProgressProps) => {
  const value = clamp(percent);
  const info = renderInfo({ value, status, format });

  if (type === 'circle') {
    const radius = (diameter - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    return (
      <div
        data-slot="progress"
        data-status={status}
        className={cn('relative inline-flex shrink-0', className)}
        {...props}
      >
        <svg
          width={diameter}
          height={diameter}
          viewBox={`0 0 ${diameter} ${diameter}`}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          className="-rotate-90"
        >
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className="stroke-muted"
          />
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            // One dash exactly as long as the filled arc, then a gap big enough
            // to swallow the rest — the ring runs clockwise from 12 o'clock
            // (the `-rotate-90` above) with no offset arithmetic to get wrong.
            strokeDasharray={`${(circumference * value) / 100} ${circumference}`}
            style={{ transition: 'stroke-dasharray 300ms ease' }}
            className={STROKE_CLASS[status]}
          />
        </svg>

        {showInfo && (
          <span className="absolute inset-0 flex items-center justify-center text-sm font-medium tabular-nums">
            {info}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      data-slot="progress"
      data-status={status}
      className={cn('flex w-full items-center gap-2', className)}
      {...props}
    >
      <ProgressPrimitive.Root
        value={value}
        className={cn(
          'relative w-full flex-auto overflow-hidden rounded-full bg-muted',
          TRACK_HEIGHT[size],
        )}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            'size-full rounded-full transition-transform duration-300 ease-out',
            BAR_CLASS[status],
            // A striped shimmer marks work that is still moving.
            status === 'active' &&
              'animate-pulse bg-linear-to-r from-primary to-primary/60',
          )}
          // Radix leaves the fill to the consumer; a translate keeps it on the
          // compositor instead of relayouting on every tick.
          style={{ transform: `translateX(-${100 - value}%)` }}
        />
      </ProgressPrimitive.Root>

      {showInfo && (
        <span className="w-10 shrink-0 text-right text-xs text-muted-foreground tabular-nums">
          {info}
        </span>
      )}
    </div>
  );
};

const renderInfo = ({
  value,
  status,
  format,
}: Required<Pick<ProgressBase, 'status'>> &
  Pick<ProgressBase, 'format'> & { value: number }) => {
  if (format) return format(value);
  if (status === 'success')
    return <CheckIcon className="size-4 text-green-500" />;
  if (status === 'exception')
    return <XIcon className="size-4 text-destructive" />;

  return `${Math.round(value)}%`;
};
