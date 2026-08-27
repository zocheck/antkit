import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '../../utils';
import {
  CircleAlertIcon,
  CircleCheckIcon,
  CircleXIcon,
  InfoIcon,
  Loader2Icon,
} from 'lucide-react';

export type MessageType = 'success' | 'info' | 'warning' | 'error' | 'loading';

export type MessageConfig = {
  content: ReactNode;
  type?: MessageType;
  /** Seconds before it disappears. `0` keeps it until closed by hand. */
  duration?: number;
  /** Reusing a key replaces that message instead of stacking a second one. */
  key?: string;
  icon?: ReactNode;
  onClose?: () => void;
};

type MessageItem = MessageConfig & { id: string; type: MessageType };

/**
 * One glyph per type, a circle for all four, so the row of icons keeps a
 * single silhouette. Note that a warning is the `!` and an error is
 * the `✕` — swapping them is the usual mistake.
 */
const TYPE_ICON = {
  success: CircleCheckIcon,
  info: InfoIcon,
  warning: CircleAlertIcon,
  error: CircleXIcon,
  loading: Loader2Icon,
} as const;

/**
 * A fixed status palette, in light and dark values.
 *
 * Deliberately not the app's own tokens: `info` is its own blue rather than
 * `--primary`, so a run of pills reads as one system whatever the brand colour
 * happens to be. Restyle by overriding these on `MessageProvider`:
 *
 * ```tsx
 * <MessageProvider className="[--message-info:var(--primary)]" />
 * ```
 */
const MESSAGE_PALETTE = cn(
  '[--message-success:#52c41a] [--message-info:#1677ff] [--message-warning:#faad14] [--message-error:#ff4d4f]',
  'dark:[--message-success:#49aa19] dark:[--message-info:#1668dc] dark:[--message-warning:#d89614] dark:[--message-error:#dc4446]',
);

const ICON_CLASS: Record<MessageType, string> = {
  success: 'text-(--message-success)',
  info: 'text-(--message-info)',
  warning: 'text-(--message-warning)',
  error: 'text-(--message-error)',
  loading: 'animate-spin text-(--message-info)',
};

const DEFAULT_DURATION = 3;

/**
 * A module-level store, so `message.success()` works from anywhere — a
 * repository, an axios interceptor — without threading a hook through. The
 * mounted `MessageProvider` is the only subscriber.
 *
 * That is the trade for the ergonomics: messages render outside the React tree
 * that called them, so they cannot read context. Anything needing the app's
 * theme or i18n should be translated by the caller before it gets here.
 */
let items: MessageItem[] = [];
const listeners = new Set<(next: MessageItem[]) => void>();
let counter = 0;

const publish = () => {
  const snapshot = [...items];
  listeners.forEach((listener) => listener(snapshot));
};

const remove = (id: string) => {
  const item = items.find((entry) => entry.id === id);
  if (!item) return;

  items = items.filter((entry) => entry.id !== id);
  publish();
  item.onClose?.();
};

const open = (config: MessageConfig): (() => void) => {
  const existing = config.key
    ? items.find((entry) => entry.key === config.key)
    : undefined;

  // A replacement takes a fresh id even though it keeps its slot. React then
  // remounts the card, which both restarts the auto-dismiss countdown and
  // replays the enter animation — the new content should announce itself.
  const item: MessageItem = {
    type: 'info',
    ...config,
    id: `message-${(counter += 1)}`,
  };

  items = existing
    ? items.map((entry) => (entry.id === existing.id ? item : entry))
    : [...items, item];

  publish();

  return () => remove(item.id);
};

const shortcut =
  (type: MessageType) =>
  (content: ReactNode, duration?: number, onClose?: () => void) =>
    open({ content, type, duration, onClose });

/**
 * Transient feedback: a compact pill at the top of the
 * screen. Mount `<MessageProvider />` once near the app root, then call it from
 * anywhere.
 *
 * ```tsx
 * message.success('Saved');
 * message.error('Could not reach the server', 5);
 *
 * const hide = message.loading('Loading…', 0);   // 0 = stays until hidden
 * await save();
 * hide();
 *
 * message.open({ key: 'sync', type: 'loading', content: 'Syncing…', duration: 0 });
 * message.open({ key: 'sync', type: 'success', content: 'Xong' });  // replaces it
 * ```
 *
 * Use this for "it worked" acknowledgements. For something the user may want to
 * act on or undo, reach for the `Toaster` instead — it stays put, stacks, and
 * carries buttons.
 */
export const message = {
  open,
  success: shortcut('success'),
  info: shortcut('info'),
  warning: shortcut('warning'),
  error: shortcut('error'),
  loading: shortcut('loading'),
  /** Closes one message by key, or all of them when called bare. */
  destroy: (key?: string) => {
    const targets = key
      ? items.filter((entry) => entry.key === key)
      : [...items];
    targets.forEach((entry) => remove(entry.id));
  },
};

/**
 * The enter motion, as real keyframes.
 *
 * `animate-in slide-in-from-top-2` reads like it works, but this package ships
 * no stylesheet and the app does not include `tailwindcss-animate`, so those
 * class names resolve to nothing and messages used to pop in. React hoists and
 * dedupes this by `href`.
 */
const MessageStyles = () => (
  <style href="luma-message" precedence="default">
    {`@keyframes luma-message-in{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion: reduce){[data-slot="message"]{animation-duration:1ms!important}}`}
  </style>
);

const MessageCard = ({ item }: { item: MessageItem }) => {
  const Icon = TYPE_ICON[item.type];
  const duration = item.duration ?? DEFAULT_DURATION;

  useEffect(() => {
    if (duration <= 0) return;

    const timer = setTimeout(() => remove(item.id), duration * 1000);
    return () => clearTimeout(timer);
  }, [item.id, duration]);

  return (
    <div
      data-slot="message"
      data-type={item.type}
      role={item.type === 'error' ? 'alert' : 'status'}
      style={{
        animation: 'luma-message-in 200ms cubic-bezier(0.2, 0, 0.2, 1) both',
      }}
      className={cn(
        // 8px radius (`--radius-md`), padding 9px/12px, a 16px icon 8px from
        // 14px text.
        'pointer-events-auto flex items-center gap-2 rounded-md bg-popover px-3 py-[9px] text-sm text-popover-foreground',
        // No border on purpose: the three-layer shadow is what lifts the pill
        // off the page, and a border on top of it read as a flat card.
        'shadow-[0_6px_16px_0_rgb(0_0_0/0.08),0_3px_6px_-4px_rgb(0_0_0/0.12),0_9px_28px_8px_rgb(0_0_0/0.05)]',
        // On a dark canvas a black shadow disappears, so the elevated surface
        // needs a hairline to keep its edge.
        'dark:shadow-[0_6px_16px_0_rgb(0_0_0/0.35)] dark:ring-1 dark:ring-white/10',
      )}
    >
      <span
        className={cn('flex shrink-0 [&>svg]:size-4', ICON_CLASS[item.type])}
      >
        {item.icon ?? <Icon />}
      </span>
      <span className="min-w-0">{item.content}</span>
    </div>
  );
};

export type MessageProviderProps = {
  className?: string;
};

/**
 * Renders the message stack. Mount it once; without it `message.*` calls are
 * recorded but nothing appears.
 */
export const MessageProvider = ({ className }: MessageProviderProps) => {
  const [current, setCurrent] = useState<MessageItem[]>(items);

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
    <div
      data-slot="message-provider"
      className={cn(
        // The stack sits 8px from the top, not 16 — closer reads as chrome.
        'pointer-events-none fixed inset-x-0 top-2 z-100 flex flex-col items-center gap-2',
        MESSAGE_PALETTE,
        className,
      )}
    >
      <MessageStyles />
      {current.map((item) => (
        <MessageCard key={item.id} item={item} />
      ))}
    </div>,
    document.body,
  );
};
