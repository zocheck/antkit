import { createContext, useContext } from 'react';
import type { ComponentProps, CSSProperties } from 'react';

import { cn } from '../../utils';
import { Loader2Icon } from 'lucide-react';

export type TimelineStatus = 'complete' | 'current' | 'pending' | 'error';

/** The dot's own colour, and the colour of whatever sits inside it. */
const DOT_COLOR: Record<TimelineStatus, string> = {
  complete: 'var(--primary)',
  current: 'var(--primary)',
  pending: 'var(--border)',
  error: 'var(--destructive)',
};

/** What a glyph reads as on a solid node. */
const ON_DOT_COLOR: Record<TimelineStatus, string> = {
  complete: 'var(--primary-foreground)',
  current: 'var(--primary-foreground)',
  pending: 'var(--muted-foreground)',
  error: 'var(--destructive-foreground)',
};

/**
 * And on a hollow one. Mostly the dot's own colour, except `pending`, whose
 * dot is the border grey — legible as a ring, invisible as a glyph.
 */
const INK_COLOR: Record<TimelineStatus, string> = {
  complete: 'var(--primary)',
  current: 'var(--primary)',
  pending: 'var(--muted-foreground)',
  error: 'var(--destructive)',
};

/**
 * The line below the dot describes what has *not* happened yet, so only a
 * finished step paints it — `current` still has an unwalked road ahead of it.
 */
const LINE_COLOR: Record<TimelineStatus, string> = {
  complete: 'var(--primary)',
  current: 'var(--border)',
  pending: 'var(--border)',
  error: 'var(--border)',
};

const TimelineItemContext = createContext<TimelineStatus>('pending');

export type TimelineProps = ComponentProps<'ol'>;

/**
 * A vertical rail of events — run history, an audit trail, the steps of a
 * workflow. For date-positioned bars across a horizontal axis, use `Gantt`.
 *
 * ```tsx
 * <Timeline>
 *   <TimelineItem status="complete">
 *     <TimelineIndicator />
 *     <TimelineContent>
 *       <TimelineHeader>
 *         <TimelineTitle>Email sent</TimelineTitle>
 *         <TimelineTime dateTime="2026-08-27T09:00:00Z">09:00</TimelineTime>
 *       </TimelineHeader>
 *       <TimelineDescription>12 recipients</TimelineDescription>
 *     </TimelineContent>
 *   </TimelineItem>
 * </Timeline>
 * ```
 */
export const Timeline = ({ className, ...props }: TimelineProps) => (
  <ol
    data-slot="timeline"
    className={cn('flex flex-col', className)}
    {...props}
  />
);

export type TimelineItemProps = ComponentProps<'li'> & {
  status?: TimelineStatus;
};

/**
 * One event. The status set here cascades to the indicator and the connector
 * below it, so callers only state it once.
 */
export const TimelineItem = ({
  status = 'pending',
  className,
  ...props
}: TimelineItemProps) => (
  <TimelineItemContext value={status}>
    <li
      data-slot="timeline-item"
      data-status={status}
      className={cn(
        'group/timeline-item grid grid-cols-[auto_1fr] gap-x-3',
        className,
      )}
      {...props}
    />
  </TimelineItemContext>
);

export type TimelineIndicatorProps = Omit<ComponentProps<'div'>, 'color'> & {
  /**
   * Overrides the status inherited from the item — only needed when an
   * indicator sits outside a `TimelineItem`.
   */
  status?: TimelineStatus;
  /**
   * `dot` is the bare 10px node. `icon` is the 24px
   * badge that can hold a glyph. Defaults to `icon` when there are children.
   */
  size?: 'dot' | 'icon';
  /**
   * `outlined` is a ring, `filled` is solid. Defaults
   * to solid for the statuses that have already happened.
   */
  variant?: 'filled' | 'outlined';
  /** Any CSS colour, for a state this component has no status for. */
  color?: string;
  /** Replaces the node with a spinner, for a step still running. */
  loading?: boolean;
  /** Hide the line running down to the next item. */
  connector?: boolean;
};

export const TimelineIndicator = ({
  status,
  size,
  variant,
  color,
  loading = false,
  connector = true,
  className,
  children,
  style,
  ...props
}: TimelineIndicatorProps) => {
  const inherited = useContext(TimelineItemContext);
  const resolved = status ?? inherited;
  const shape = size ?? (children || loading ? 'icon' : 'dot');
  // A step that has already happened reads as solid; one still ahead reads as
  // an outline. `variant` overrides that when a caller wants one uniform look.
  const fill =
    variant ??
    (resolved === 'complete' || resolved === 'error' ? 'filled' : 'outlined');

  return (
    <div
      data-slot="timeline-indicator-wrapper"
      className={cn(
        'flex flex-col items-center gap-1.5 self-stretch',
        // Lines the node up with the middle of the first line of the title,
        // which `TimelineContent` starts 2px down at a 24px line height.
        shape === 'dot' ? 'mt-[9px]' : 'mt-0.5',
      )}
    >
      <div
        data-slot="timeline-indicator"
        data-status={resolved}
        data-variant={fill}
        style={
          {
            '--timeline-dot': color ?? DOT_COLOR[resolved],
            '--timeline-on-dot': color
              ? 'var(--background)'
              : ON_DOT_COLOR[resolved],
            '--timeline-ink': color ?? INK_COLOR[resolved],
            ...style,
          } as CSSProperties
        }
        className={cn(
          'flex shrink-0 items-center justify-center rounded-full border-2 border-(--timeline-dot) text-xs font-medium',
          shape === 'dot'
            ? 'size-2.5'
            : 'size-6 [&>svg]:size-3.5 [&>svg]:shrink-0',
          fill === 'filled'
            ? 'bg-(--timeline-dot) text-(--timeline-on-dot)'
            : 'bg-background text-(--timeline-ink)',
          // The step in progress gets a halo, so the eye lands on it first.
          resolved === 'current' && 'ring-4 ring-(--timeline-dot)/15',
          loading && 'border-transparent bg-transparent text-(--timeline-ink)',
          className,
        )}
        {...props}
      >
        {loading ? <Loader2Icon className="animate-spin" /> : children}
      </div>
      {connector && <TimelineConnector status={status} />}
    </div>
  );
};

export type TimelineConnectorProps = ComponentProps<'div'> & {
  status?: TimelineStatus;
};

export const TimelineConnector = ({
  status,
  className,
  style,
  ...props
}: TimelineConnectorProps) => {
  const inherited = useContext(TimelineItemContext);
  const resolved = status ?? inherited;

  return (
    <div
      data-slot="timeline-connector"
      aria-hidden
      style={
        { '--timeline-line': LINE_COLOR[resolved], ...style } as CSSProperties
      }
      className={cn(
        'w-px flex-1 rounded-full bg-(--timeline-line)',
        // The last event has nothing to connect to.
        'group-last/timeline-item:hidden',
        className,
      )}
      {...props}
    />
  );
};

export type TimelineContentProps = ComponentProps<'div'>;

export const TimelineContent = ({
  className,
  ...props
}: TimelineContentProps) => (
  <div
    data-slot="timeline-content"
    className={cn(
      'flex flex-col gap-1 pt-0.5',
      // The gap to the next event lives here, not on the item: a grid item
      // stretches to the row's content box, so padding on the <li> is out of
      // the indicator column's reach and the connector stops short.
      'pb-6 group-last/timeline-item:pb-0',
      className,
    )}
    {...props}
  />
);

export type TimelineHeaderProps = ComponentProps<'div'>;

export const TimelineHeader = ({
  className,
  ...props
}: TimelineHeaderProps) => (
  <div
    data-slot="timeline-header"
    className={cn(
      'flex flex-wrap items-center justify-between gap-x-3 gap-y-1',
      className,
    )}
    {...props}
  />
);

export type TimelineTitleProps = ComponentProps<'p'>;

export const TimelineTitle = ({ className, ...props }: TimelineTitleProps) => (
  <p
    data-slot="timeline-title"
    className={cn('text-sm leading-6 font-medium text-foreground', className)}
    {...props}
  />
);

export type TimelineDescriptionProps = ComponentProps<'p'>;

export const TimelineDescription = ({
  className,
  ...props
}: TimelineDescriptionProps) => (
  <p
    data-slot="timeline-description"
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
);

export type TimelineTimeProps = ComponentProps<'time'>;

export const TimelineTime = ({ className, ...props }: TimelineTimeProps) => (
  <time
    data-slot="timeline-time"
    className={cn(
      'shrink-0 text-xs text-muted-foreground tabular-nums',
      className,
    )}
    {...props}
  />
);
