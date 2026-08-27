import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../../utils';
import { XIcon } from 'lucide-react';

import { useLocale } from '../../lib/config';

/**
 * The named colours. Anything else in `color` is treated as a CSS colour and
 * painted solid.
 */
export type TagPresetColor =
  | 'default'
  | 'primary'
  | 'success'
  | 'processing'
  | 'warning'
  | 'error'
  | 'red'
  | 'orange'
  | 'amber'
  | 'green'
  | 'teal'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'pink';

const PRESET: Record<TagPresetColor, string> = {
  default: 'border-border bg-muted text-muted-foreground',
  primary: 'border-primary/25 bg-primary/10 text-primary',
  success:
    'border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-300',
  processing:
    'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300',
  warning:
    'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/50 dark:bg-orange-950/40 dark:text-orange-300',
  error:
    'border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300',
  red: 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300',
  orange:
    'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/50 dark:bg-orange-950/40 dark:text-orange-300',
  amber:
    'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300',
  green:
    'border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-300',
  teal: 'border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-300',
  blue: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300',
  indigo:
    'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300',
  purple:
    'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300',
  pink: 'border-pink-200 bg-pink-50 text-pink-700 dark:border-pink-900/50 dark:bg-pink-950/40 dark:text-pink-300',
};

const isPreset = (color: string): color is TagPresetColor => color in PRESET;

export type TagProps = {
  children?: ReactNode;
  /** A preset name, or any CSS colour for a solid custom tag. */
  color?: TagPresetColor | string;
  /** Leading icon, sized to the text. */
  icon?: ReactNode;
  /** Adds the ✕ button. `onClose` fires before the tag leaves the tree. */
  closable?: boolean;
  closeIcon?: ReactNode;
  onClose?: () => void;
  /** Off gives a flat chip with no outline. */
  bordered?: boolean;
  /** Turns the whole tag into a button. Ignored when `closable` is the only action. */
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
};

/**
 * A tag: a small label for a record's state, a filter chip, or
 * a keyword.
 *
 * ```tsx
 * <Tag color="success">Active</Tag>
 * <Tag color="#7c3aed" icon={<StarIcon />}>VIP</Tag>
 * <Tag closable onClose={() => removeFilter('ielts')}>IELTS 6.5+</Tag>
 * ```
 *
 * `Badge` covers the same visual ground with fixed shadcn variants; reach for
 * `Tag` when you need `closable`, a colour from the database, or an icon.
 *
 * Closing is handled internally — the tag removes itself and calls back. To
 * drive it yourself, leave `closable` off and unmount the tag.
 */
export const Tag = ({
  children,
  color = 'default',
  icon,
  closable = false,
  closeIcon,
  onClose,
  bordered = true,
  onClick,
  className,
  style,
}: TagProps) => {
  const locale = useLocale();

  const preset = isPreset(color);
  // A custom colour is painted solid with white text, so any hue stays legible
  // in both themes without needing a light/dark pair per value.
  const custom = preset
    ? undefined
    : { backgroundColor: color, borderColor: color, color: '#fff' };

  const interactive = !!onClick;
  const Root = interactive ? 'button' : 'span';

  return (
    <Root
      data-slot="tag"
      data-color={color}
      type={interactive ? 'button' : undefined}
      onClick={onClick}
      style={{ ...custom, ...style }}
      className={cn(
        'inline-flex w-fit max-w-full shrink-0 items-center gap-1 rounded-md px-2 py-0.5',
        'text-xs font-medium whitespace-nowrap transition-colors',
        "[&>svg]:pointer-events-none [&>svg]:size-3 [&_svg:not([class*='size-'])]:size-3",
        bordered ? 'border' : 'border border-transparent',
        preset && PRESET[color],
        interactive &&
          'cursor-pointer outline-hidden hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
    >
      {icon}
      <span className="truncate">{children}</span>

      {closable && (
        <span
          // A nested <button> is invalid inside the interactive variant, so the
          // close affordance is a role-button span in both cases for symmetry.
          role="button"
          tabIndex={0}
          aria-label={locale.common?.close ?? 'Close'}
          onClick={(event) => {
            // Otherwise a closable tag inside a clickable one fires both.
            event.stopPropagation();
            onClose?.();
          }}
          onKeyDown={(event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            event.stopPropagation();
            onClose?.();
          }}
          className={cn(
            'ml-0.5 shrink-0 cursor-pointer rounded-xs opacity-60 transition-opacity hover:opacity-100',
            'outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
          )}
        >
          {closeIcon ?? <XIcon className="size-3" />}
        </span>
      )}
    </Root>
  );
};

export type CheckableTagProps = {
  children?: ReactNode;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
};

/**
 * A tag that behaves like a checkbox — the usual shape for a filter bar where
 * several keywords can be on at once.
 *
 * ```tsx
 * {courses.map((course) => (
 *   <CheckableTag
 *     key={course}
 *     checked={picked.includes(course)}
 *     onChange={(on) =>
 *       setPicked(on ? [...picked, course] : picked.filter((c) => c !== course))
 *     }
 *   >
 *     {course}
 *   </CheckableTag>
 * ))}
 * ```
 */
export const CheckableTag = ({
  children,
  checked,
  onChange,
  disabled = false,
  className,
}: CheckableTagProps) => (
  <button
    type="button"
    data-slot="checkable-tag"
    role="checkbox"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onChange?.(!checked)}
    className={cn(
      'inline-flex w-fit shrink-0 cursor-pointer items-center gap-1 rounded-md border px-2 py-0.5',
      'text-xs font-medium whitespace-nowrap transition-colors',
      'outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
      'disabled:cursor-not-allowed disabled:opacity-50',
      checked
        ? 'border-primary bg-primary text-primary-foreground'
        : 'border-border bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground',
      className,
    )}
  >
    {children}
  </button>
);
