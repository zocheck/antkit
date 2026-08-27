import { useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

import { cn } from '../../utils';
import { StarIcon } from 'lucide-react';

export type RateProps = {
  /** How many symbols to draw. */
  count?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  onBlur?: () => void;
  /** Lets a click land on half a symbol, giving 0.5 steps. */
  allowHalf?: boolean;
  /** Clicking the current value again resets it to 0. */
  allowClear?: boolean;
  disabled?: boolean;
  /** Read-only display — no hover, no click, no focus. */
  readOnly?: boolean;
  /** Replaces the star. */
  character?: ReactNode;
  size?: 'sm' | 'default' | 'lg';
  /** One label per symbol, read out and shown on hover. */
  tooltips?: string[];

  id?: string;
  name?: string;
  className?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
};

const SIZE = {
  sm: 'size-4',
  default: 'size-5',
  lg: 'size-7',
} as const;

/**
 * A star rating.
 *
 * ```tsx
 * <Rate value={score} onChange={setScore} allowHalf />
 * <Rate value={4} readOnly size="sm" />
 * ```
 *
 * It takes `value`/`onChange`/`onBlur` and the aria props, so it drops straight
 * into a `Form.Item` with no adapter.
 *
 * The whole control is one radiogroup with arrow-key support rather than N
 * focusable stars — tabbing through five stars to set one number is tedious.
 */
export const Rate = ({
  count = 5,
  value,
  defaultValue = 0,
  onChange,
  onBlur,
  allowHalf = false,
  allowClear = true,
  disabled = false,
  readOnly = false,
  character,
  size = 'default',
  tooltips,
  id,
  name,
  className,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}: RateProps) => {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const [hover, setHover] = useState<number | null>(null);

  const current = value ?? uncontrolled;
  // Hovering previews the value it would set; leaving restores the real one.
  const shown = hover ?? current;

  const inert = disabled || readOnly;
  const step = allowHalf ? 0.5 : 1;

  const commit = (next: number) => {
    if (inert) return;

    const settled = allowClear && next === current ? 0 : next;

    setUncontrolled(settled);
    onChange?.(settled);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (inert) return;

    const delta =
      event.key === 'ArrowRight' || event.key === 'ArrowUp'
        ? step
        : event.key === 'ArrowLeft' || event.key === 'ArrowDown'
          ? -step
          : 0;

    if (!delta) return;

    event.preventDefault();
    // Clamped rather than wrapped: arrowing off the end should stop, not jump
    // back to one star.
    const next = Math.min(Math.max(current + delta, 0), count);

    setUncontrolled(next);
    onChange?.(next);
  };

  return (
    <span
      data-slot="rate"
      id={id}
      role="radiogroup"
      aria-label={name}
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled || undefined}
      aria-readonly={readOnly || undefined}
      tabIndex={inert ? -1 : 0}
      onKeyDown={onKeyDown}
      onBlur={() => {
        setHover(null);
        onBlur?.();
      }}
      onMouseLeave={() => setHover(null)}
      className={cn(
        'inline-flex w-fit items-center gap-1 rounded-md',
        'outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      {Array.from({ length: count }, (_, index) => {
        const position = index + 1;
        const filled = shown >= position;
        const half = allowHalf && !filled && shown >= position - 0.5;
        const label = tooltips?.[index];

        const symbol = (
          <span className={cn('block', SIZE[size])}>
            {character ?? (
              <StarIcon className="size-full" fill="currentColor" />
            )}
          </span>
        );

        return (
          <span
            key={position}
            role="radio"
            aria-checked={current === position}
            aria-label={label ?? String(position)}
            title={label}
            data-filled={filled || half || undefined}
            className={cn(
              'relative block text-muted-foreground/30 transition-colors',
              !inert && 'cursor-pointer',
              filled && 'text-amber-400 dark:text-amber-300',
            )}
          >
            {symbol}

            {/*
              A half star is the empty symbol underneath with a filled copy
              clipped to its left half on top — so it needs its own colour
              rather than inheriting the muted parent.
            */}
            {half && (
              <span
                aria-hidden="true"
                className="absolute inset-0 overflow-hidden text-amber-400 [clip-path:inset(0_50%_0_0)] dark:text-amber-300"
              >
                {symbol}
              </span>
            )}

            {!inert && (
              <>
                {allowHalf && (
                  <span
                    aria-hidden="true"
                    onMouseEnter={() => setHover(position - 0.5)}
                    onClick={() => commit(position - 0.5)}
                    className="absolute inset-y-0 left-0 z-10 w-1/2"
                  />
                )}
                <span
                  aria-hidden="true"
                  onMouseEnter={() => setHover(position)}
                  onClick={() => commit(position)}
                  className={cn(
                    'absolute inset-y-0 right-0 z-10',
                    allowHalf ? 'w-1/2' : 'w-full',
                  )}
                />
              </>
            )}
          </span>
        );
      })}
    </span>
  );
};
