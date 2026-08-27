import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '../../utils';
import { useLocale } from '../../lib/config';
import {
  CircleAlertIcon,
  CircleCheckIcon,
  CircleXIcon,
  InfoIcon,
  XIcon,
} from 'lucide-react';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export type NotificationPlacement =
  | 'top'
  | 'topLeft'
  | 'topRight'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight';

export type NotificationConfig = {
  /** The headline, named `message`. The body text is `description`. */
  message: ReactNode;
  description?: ReactNode;
  type?: NotificationType;
  /** Seconds before it leaves. `0` keeps it until closed by hand. */
  duration?: number;
  /** Reusing a key replaces that card instead of stacking a second one. */
  key?: string;
  /** Your own glyph, or `null` for a card with no icon. */
  icon?: ReactNode | null;
  placement?: NotificationPlacement;
  /** Action row under the description — usually a `Button` or two. */
  btn?: ReactNode;
  closable?: boolean;
  /** Draws the remaining time as a bar along the bottom edge. */
  showProgress?: boolean;
  /** Holds the countdown while the pointer is over the card. */
  pauseOnHover?: boolean;
  closeLabel?: string;
  className?: string;
  onClick?: () => void;
  onClose?: () => void;
};

type NotificationItem = NotificationConfig & {
  id: string;
  placement: NotificationPlacement;
  /** Set while the leave animation runs, before the item is dropped. */
  closing?: boolean;
};

/** Defaults: top right, four and a half seconds. */
type NotificationDefaults = Required<
  Pick<
    NotificationConfig,
    'placement' | 'duration' | 'closable' | 'showProgress' | 'pauseOnHover'
  >
>;

let defaults: NotificationDefaults = {
  placement: 'topRight',
  duration: 4.5,
  closable: true,
  showProgress: false,
  pauseOnHover: true,
};

const TYPE_ICON = {
  success: CircleCheckIcon,
  info: InfoIcon,
  warning: CircleAlertIcon,
  error: CircleXIcon,
} as const;

/**
 * A fixed status palette rather than the app's own tokens, so a
 * `notification` and a `message` read as the same family. Override on the
 * provider:
 *
 * ```tsx
 * <NotificationProvider className="[--notification-info:var(--primary)]" />
 * ```
 */
const NOTIFICATION_PALETTE = cn(
  '[--notification-success:#52c41a] [--notification-info:#1677ff] [--notification-warning:#faad14] [--notification-error:#ff4d4f]',
  'dark:[--notification-success:#49aa19] dark:[--notification-info:#1668dc] dark:[--notification-warning:#d89614] dark:[--notification-error:#dc4446]',
);

const ICON_CLASS: Record<NotificationType, string> = {
  success: 'text-(--notification-success)',
  info: 'text-(--notification-info)',
  warning: 'text-(--notification-warning)',
  error: 'text-(--notification-error)',
};

const BAR_CLASS: Record<NotificationType, string> = {
  success: 'bg-(--notification-success)',
  info: 'bg-(--notification-info)',
  warning: 'bg-(--notification-warning)',
  error: 'bg-(--notification-error)',
};

/** How long the leave animation runs, in ms. Kept in step with the keyframes. */
const LEAVE_MS = 200;

/**
 * A module-level store, so `notification.success()` works from anywhere — an
 * axios interceptor, a mutation callback — without threading a hook through.
 * The mounted `NotificationProvider` is the only subscriber.
 */
let items: NotificationItem[] = [];
const listeners = new Set<(next: NotificationItem[]) => void>();
let counter = 0;

const publish = () => {
  const snapshot = [...items];
  listeners.forEach((listener) => listener(snapshot));
};

const drop = (id: string) => {
  const item = items.find((entry) => entry.id === id);
  if (!item) return;

  items = items.filter((entry) => entry.id !== id);
  publish();
  item.onClose?.();
};

/** Marks the card as leaving, then drops it once the animation has played. */
const close = (id: string) => {
  const item = items.find((entry) => entry.id === id);
  if (!item || item.closing) return;

  items = items.map((entry) =>
    entry.id === id ? { ...entry, closing: true } : entry,
  );
  publish();

  setTimeout(() => drop(id), LEAVE_MS);
};

const open = (config: NotificationConfig): (() => void) => {
  const existing = config.key
    ? items.find((entry) => entry.key === config.key && !entry.closing)
    : undefined;

  // A replacement takes a fresh id even though it keeps its slot. React then
  // remounts the card, which both restarts the countdown and replays the enter
  // animation — the new content should announce itself.
  const item: NotificationItem = {
    placement: defaults.placement,
    ...config,
    id: `notification-${(counter += 1)}`,
  };

  items = existing
    ? items.map((entry) => (entry.id === existing.id ? item : entry))
    : [...items, item];

  publish();

  return () => close(item.id);
};

const shortcut = (type: NotificationType) => (config: NotificationConfig) =>
  open({ ...config, type });

/**
 * Notifications: a card in a screen corner, with a
 * headline, a body and somewhere to put an action.
 *
 * Mount `<NotificationProvider />` once near the app root, then call it from
 * anywhere.
 *
 * ```tsx
 * notification.success({
 *   message: 'Campaign saved',
 *   description: 'Sending starts at 9:00 tomorrow morning.',
 * });
 *
 * notification.open({
 *   key: 'import',
 *   type: 'warning',
 *   message: 'Import finished with gaps',
 *   description: '3 rows were skipped for a missing email.',
 *   duration: 0,
 *   btn: <Button size="sm" onClick={review}>Review</Button>,
 * });
 * ```
 *
 * `message` is the one-line "it worked" pill at the top of the screen; this is
 * for anything with a title, a body, or a button — something the user may want
 * to read rather than glance at.
 */
export const notification = {
  open,
  success: shortcut('success'),
  info: shortcut('info'),
  warning: shortcut('warning'),
  error: shortcut('error'),
  /** Closes one card by key, or all of them when called bare. */
  destroy: (key?: string) => {
    const targets = key
      ? items.filter((entry) => entry.key === key)
      : [...items];
    targets.forEach((entry) => close(entry.id));
  },
  /** Changes the defaults for every later call — placement, duration, … */
  config: (next: Partial<NotificationDefaults>) => {
    defaults = { ...defaults, ...next };
  },
};

/**
 * Enter and leave motion, plus the progress bar.
 *
 * These are real keyframes rather than `animate-in` utilities: this package
 * ships no stylesheet and the app does not include `tailwindcss-animate`, so
 * those class names resolve to nothing. React hoists and dedupes this by
 * `href`, so it lands in `<head>` once.
 */
const NotificationStyles = () => (
  <style href="luma-notification" precedence="default">
    {`@keyframes luma-notification-in-right{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:none}}
@keyframes luma-notification-in-left{from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:none}}
@keyframes luma-notification-in-top{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:none}}
@keyframes luma-notification-in-bottom{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes luma-notification-out{from{opacity:1}to{opacity:0;transform:scale(0.96)}}
@keyframes luma-notification-progress{from{transform:scaleX(1)}to{transform:scaleX(0)}}
@media (prefers-reduced-motion: reduce){[data-slot="notification"]{animation-duration:1ms!important}}`}
  </style>
);

const ENTER_ANIMATION: Record<NotificationPlacement, string> = {
  top: 'luma-notification-in-top',
  topLeft: 'luma-notification-in-left',
  topRight: 'luma-notification-in-right',
  bottom: 'luma-notification-in-bottom',
  bottomLeft: 'luma-notification-in-left',
  bottomRight: 'luma-notification-in-right',
};

const PLACEMENT_CLASS: Record<NotificationPlacement, string> = {
  top: 'inset-x-0 top-5 items-center',
  topLeft: 'top-5 left-5 items-start',
  topRight: 'top-5 right-5 items-end',
  // Reversed so the oldest card stays pinned to the edge and new ones stack
  // upward, which is what the bottom placements need.
  bottom: 'inset-x-0 bottom-5 flex-col-reverse items-center',
  bottomLeft: 'bottom-5 left-5 flex-col-reverse items-start',
  bottomRight: 'bottom-5 right-5 flex-col-reverse items-end',
};

const PLACEMENTS = Object.keys(PLACEMENT_CLASS) as NotificationPlacement[];

const NotificationCard = ({ item }: { item: NotificationItem }) => {
  const locale = useLocale();
  const {
    duration = defaults.duration,
    closable = defaults.closable,
    showProgress = defaults.showProgress,
    pauseOnHover = defaults.pauseOnHover,
    closeLabel = locale.common?.close ?? 'Close',
    type,
  } = item;

  const Icon = type ? TYPE_ICON[type] : null;
  const [paused, setPaused] = useState(false);

  // The countdown has to survive a hover, so what is tracked is the time left
  // rather than a single timer started at mount.
  const remaining = useRef(duration * 1000);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    if (duration <= 0 || paused || item.closing) return;

    startedAt.current = Date.now();

    const timer = setTimeout(() => close(item.id), remaining.current);

    return () => {
      clearTimeout(timer);
      remaining.current -= Date.now() - startedAt.current;
    };
  }, [duration, item.closing, item.id, paused]);

  const enter = ENTER_ANIMATION[item.placement];

  return (
    <div
      data-slot="notification"
      data-type={type}
      data-closing={item.closing || undefined}
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      onMouseEnter={pauseOnHover ? () => setPaused(true) : undefined}
      onMouseLeave={pauseOnHover ? () => setPaused(false) : undefined}
      onClick={item.onClick}
      style={{
        animationName: item.closing ? 'luma-notification-out' : enter,
        animationDuration: item.closing ? `${LEAVE_MS}ms` : '250ms',
        animationTimingFunction: 'cubic-bezier(0.2, 0, 0.2, 1)',
        animationFillMode: 'both',
      }}
      className={cn(
        // 352px wide, 14px/16px padding, 8px radius. Override the width with
        // `className="w-96"`.
        'pointer-events-auto relative w-88 max-w-[calc(100vw-2rem)] overflow-hidden rounded-md bg-popover px-4 py-3.5 text-popover-foreground',
        // The same shadow as `message`, and no border — the two are one
        // family, and shadow alone is what lifts them.
        'shadow-[0_6px_16px_0_rgb(0_0_0/0.08),0_3px_6px_-4px_rgb(0_0_0/0.12),0_9px_28px_8px_rgb(0_0_0/0.05)]',
        'dark:shadow-[0_6px_16px_0_rgb(0_0_0/0.35)] dark:ring-1 dark:ring-white/10',
        item.onClick && 'cursor-pointer',
        item.className,
      )}
    >
      <div className="flex gap-2.5">
        {item.icon !== null && (
          <span
            aria-hidden
            className={cn(
              'mt-px flex shrink-0 [&>svg]:size-5',
              type ? ICON_CLASS[type] : 'text-muted-foreground',
            )}
          >
            {item.icon ?? (Icon ? <Icon /> : null)}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <div
            data-slot="notification-title"
            // A step above the body rather than a full `text-base`: the two
            // still read as title and body, in less height.
            className="pr-5 text-[15px] leading-5 font-medium"
          >
            {item.message}
          </div>

          {!!item.description && (
            <div
              data-slot="notification-description"
              className="mt-1 text-[13px] leading-5 text-muted-foreground"
            >
              {item.description}
            </div>
          )}

          {!!item.btn && (
            <div
              data-slot="notification-actions"
              className="mt-3 flex justify-end gap-2"
            >
              {item.btn}
            </div>
          )}
        </div>
      </div>

      {closable && (
        <button
          type="button"
          aria-label={closeLabel}
          onClick={(event) => {
            // The whole card may be clickable; closing it is not that click.
            event.stopPropagation();
            close(item.id);
          }}
          className="absolute top-3 right-3 flex size-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <XIcon className="size-3.5" />
        </button>
      )}

      {showProgress && duration > 0 && (
        <span
          aria-hidden
          className={cn(
            'absolute inset-x-0 bottom-0 h-0.5 origin-left',
            type ? BAR_CLASS[type] : 'bg-muted-foreground/40',
          )}
          style={{
            animationName: 'luma-notification-progress',
            animationDuration: `${duration}s`,
            animationTimingFunction: 'linear',
            animationFillMode: 'forwards',
            animationPlayState: paused ? 'paused' : 'running',
          }}
        />
      )}
    </div>
  );
};

export type NotificationProviderProps = {
  className?: string;
};

/**
 * Renders the notification stacks. Mount it once; without it `notification.*`
 * calls are recorded but nothing appears.
 */
export const NotificationProvider = ({
  className,
}: NotificationProviderProps) => {
  const [current, setCurrent] = useState<NotificationItem[]>(items);

  useEffect(() => {
    listeners.add(setCurrent);
    // Pick up anything published between module load and mount.
    setCurrent([...items]);

    return () => {
      listeners.delete(setCurrent);
    };
  }, []);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <>
      <NotificationStyles />
      {PLACEMENTS.map((placement) => {
        const stack = current.filter((item) => item.placement === placement);

        if (!stack.length) return null;

        return (
          <div
            key={placement}
            data-slot="notification-provider"
            data-placement={placement}
            className={cn(
              'pointer-events-none fixed z-100 flex flex-col gap-3',
              PLACEMENT_CLASS[placement],
              NOTIFICATION_PALETTE,
              className,
            )}
          >
            {stack.map((item) => (
              <NotificationCard key={item.id} item={item} />
            ))}
          </div>
        );
      })}
    </>,
    document.body,
  );
};
