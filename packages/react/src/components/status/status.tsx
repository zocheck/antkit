import type { ComponentProps, CSSProperties } from 'react';

import { cn } from '../../utils';

import { Badge } from '../badge';

export type StatusTone =
  | 'online'
  | 'offline'
  | 'degraded'
  | 'maintenance'
  | 'neutral';

const TONE_CLASS: Record<StatusTone, string> = {
  online: 'bg-green-500',
  offline: 'bg-red-500',
  degraded: 'bg-orange-500',
  maintenance: 'bg-blue-500',
  neutral: 'bg-gray-400',
};

export type StatusProps = Omit<ComponentProps<typeof Badge>, 'variant'> & {
  tone?: StatusTone;
  /**
   * Any CSS colour, for statuses the tone list doesn't cover — a workflow state
   * whose colour comes from the database, say. Wins over `tone`.
   */
  color?: string;
  /** Pulsing halo. Off for a settled state, on for something live. */
  pulse?: boolean;
};

/**
 * A dot plus a label, for service or record state.
 *
 * ```tsx
 * <Status tone="online" pulse>Running</Status>
 * <Status color="#17a2b8">In progress</Status>
 * ```
 *
 * Compose `StatusIndicator` / `StatusLabel` directly when the dot and the text
 * need to sit in different places.
 */
export const Status = ({
  tone = 'neutral',
  color,
  pulse = false,
  className,
  children,
  ...props
}: StatusProps) => (
  <Badge
    data-slot="status"
    variant="secondary"
    className={cn('gap-2 font-normal', className)}
    {...props}
  >
    <StatusIndicator tone={tone} color={color} pulse={pulse} />
    <StatusLabel>{children}</StatusLabel>
  </Badge>
);

export type StatusIndicatorProps = ComponentProps<'span'> & {
  tone?: StatusTone;
  color?: string;
  pulse?: boolean;
};

export const StatusIndicator = ({
  tone = 'neutral',
  color,
  pulse = false,
  className,
  ...props
}: StatusIndicatorProps) => {
  // An explicit colour has to win over the tone class, so it goes through an
  // inline style rather than a class the tone could beat on specificity.
  const style = color
    ? ({ backgroundColor: color } as CSSProperties)
    : undefined;
  const toneClass = color ? undefined : TONE_CLASS[tone];

  return (
    <span
      data-slot="status-indicator"
      aria-hidden
      className={cn('relative flex size-2 shrink-0', className)}
      {...props}
    >
      {pulse && (
        <span
          className={cn(
            'absolute inline-flex size-full animate-ping rounded-full opacity-75',
            toneClass,
          )}
          style={style}
        />
      )}
      <span
        className={cn('relative inline-flex size-2 rounded-full', toneClass)}
        style={style}
      />
    </span>
  );
};

export type StatusLabelProps = ComponentProps<'span'>;

export const StatusLabel = ({ className, ...props }: StatusLabelProps) => (
  <span
    data-slot="status-label"
    className={cn('truncate', className)}
    {...props}
  />
);
