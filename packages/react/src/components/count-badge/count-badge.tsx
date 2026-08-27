import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../../utils';

export type CountBadgeProps = {
  /** What the badge sits on — a bell icon, an avatar, a tab label. */
  children?: ReactNode;
  count?: number;
  /** Anything above this shows as `99+`. */
  overflowCount?: number;
  /** Render a bare dot instead of a number. */
  dot?: boolean;
  /** By default a zero count hides the badge entirely. */
  showZero?: boolean;
  /** Any CSS colour; falls back to the destructive token. */
  color?: string;
  /** Nudges the badge, in pixels: `[x, y]`. Positive x moves right. */
  offset?: [number, number];
  size?: 'default' | 'sm';
  /** Read out instead of the raw number. */
  title?: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * The small count or dot that rides on the corner of something else.
 *
 * ```tsx
 * <CountBadge count={unread}>
 *   <Button variant="ghost" size="icon"><BellIcon /></Button>
 * </CountBadge>
 *
 * <CountBadge dot color="#22c55e">
 *   <Avatar>…</Avatar>
 * </CountBadge>
 *
 * // Standalone, with nothing to ride on, it just sits inline:
 * <CountBadge count={12} />
 * ```
 *
 * Not to be confused with this kit's `Badge`, which is a text chip — see `Tag`
 * for the removable version of that.
 */
export const CountBadge = ({
  children,
  count = 0,
  overflowCount = 99,
  dot = false,
  showZero = false,
  color,
  offset,
  size = 'default',
  title,
  className,
  style,
}: CountBadgeProps) => {
  const hidden = !dot && count === 0 && !showZero;

  const label = count > overflowCount ? `${overflowCount}+` : String(count);

  const bubble = hidden ? null : (
    <span
      data-slot="count-badge"
      // Screen readers get the spelled-out title where one is given; the raw
      // number is meaningless out of context ("3" on its own tells you nothing).
      role="status"
      aria-label={title ?? (dot ? undefined : label)}
      style={{
        backgroundColor: color,
        ...(offset
          ? { transform: `translate(${offset[0]}px, ${offset[1]}px)` }
          : undefined),
        ...style,
      }}
      className={cn(
        'pointer-events-none z-10 inline-flex shrink-0 items-center justify-center',
        'rounded-full bg-destructive font-medium text-white tabular-nums',
        // A ring in the page background colour punches the badge away from
        // whatever it overlaps, so it stays legible on a busy icon.
        !!children && 'absolute top-0 right-0 ring-2 ring-background',
        dot
          ? cn('size-2 p-0', !!children && '-translate-y-1/2 translate-x-1/2')
          : cn(
              'px-1 text-[10px] leading-none',
              size === 'sm' ? 'h-4 min-w-4' : 'h-5 min-w-5',
              !!children && '-translate-y-1/3 translate-x-1/3',
            ),
        !children && 'relative',
        className,
      )}
    >
      {dot ? null : label}
    </span>
  );

  if (!children) return bubble;

  return (
    <span
      data-slot="count-badge-wrapper"
      className="relative inline-flex w-fit shrink-0 align-middle"
    >
      {children}
      {bubble}
    </span>
  );
};
