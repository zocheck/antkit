import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../utils';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';

import { Skeleton } from '../skeleton';

export type StatisticProps = Omit<ComponentProps<'div'>, 'title' | 'prefix'> & {
  title?: ReactNode;
  value: number | string;
  /** Decimal places. Numbers only. */
  precision?: number;
  /** Locale for grouping and decimals. Numbers only. */
  locale?: string;
  /** Take over formatting entirely. */
  formatter?: (value: number | string) => ReactNode;
  /** Rendered before the value — a currency mark, an icon. */
  prefix?: ReactNode;
  /** Rendered after the value — a unit, a percent sign. */
  suffix?: ReactNode;
  /** Colours the delta green or red and picks its arrow. */
  trend?: 'up' | 'down';
  /** The change itself, e.g. `+12,4%`. Needs `trend` to be coloured. */
  delta?: ReactNode;
  loading?: boolean;
  valueClassName?: string;
};

/**
 * One number, presented. Drop a few into a `Card` grid for a dashboard.
 *
 * ```tsx
 * <Statistic title="Doanh thu tháng" value={125_400_000} suffix="₫" trend="up" delta="+12,4%" />
 * ```
 */
export const Statistic = ({
  title,
  value,
  precision,
  locale,
  formatter,
  prefix,
  suffix,
  trend,
  delta,
  loading = false,
  valueClassName,
  className,
  ...props
}: StatisticProps) => {
  const TrendIcon = trend === 'down' ? TrendingDownIcon : TrendingUpIcon;

  const formatted = formatter
    ? formatter(value)
    : typeof value === 'number'
      ? value.toLocaleString(locale, {
          minimumFractionDigits: precision,
          maximumFractionDigits: precision,
        })
      : value;

  return (
    <div
      data-slot="statistic"
      className={cn('flex min-w-0 flex-col gap-1', className)}
      {...props}
    >
      {!!title && (
        <span
          data-slot="statistic-title"
          className="text-sm text-muted-foreground"
        >
          {title}
        </span>
      )}

      {loading ? (
        <Skeleton className="h-8 w-28" />
      ) : (
        <span
          data-slot="statistic-value"
          className={cn(
            'flex items-baseline gap-1 text-2xl font-medium tabular-nums',
            valueClassName,
          )}
        >
          {!!prefix && (
            <span className="text-base text-muted-foreground">{prefix}</span>
          )}
          {formatted}
          {!!suffix && (
            <span className="text-base text-muted-foreground">{suffix}</span>
          )}
        </span>
      )}

      {!!delta && !loading && (
        <span
          data-slot="statistic-delta"
          className={cn(
            'flex items-center gap-1 text-xs font-medium',
            trend === 'up' && 'text-green-600',
            trend === 'down' && 'text-destructive',
            !trend && 'text-muted-foreground',
          )}
        >
          {!!trend && <TrendIcon className="size-3.5" />}
          {delta}
        </span>
      )}
    </div>
  );
};
