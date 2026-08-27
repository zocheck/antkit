import { useEffect, useRef, useState } from 'react';
import type {
  ComponentProps,
  KeyboardEvent,
  ReactNode,
  WheelEvent,
} from 'react';

import { cn } from '../../utils';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

import { useLocale } from '../../lib/config';

export type InputNumberProps = Omit<
  ComponentProps<'input'>,
  'value' | 'defaultValue' | 'onChange' | 'size' | 'prefix' | 'type'
> & {
  /** Controlled value. `null` is empty — pair with `onChange`. */
  value?: number | null;
  defaultValue?: number | null;
  /** Fires on every keystroke, with `null` while the field is empty. */
  onChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  /** Also the granularity: `step={0.5}` implies one decimal place. */
  step?: number;
  /** Decimal places to round to on blur. Inferred from `step` otherwise. */
  precision?: number;
  size?: 'sm' | 'default' | 'lg';
  /** The up/down buttons. */
  controls?: boolean;
  /** Arrow keys step the value. */
  keyboard?: boolean;
  /** Scrolling over a focused field steps it. Off by default — it hijacks
   * the page scroll otherwise. */
  changeOnWheel?: boolean;
  /** Prints the number, e.g. with a thousands separator. Applied when the
   * field is not being typed into. */
  formatter?: (value: string) => string;
  /** Reads a number back out of what the user typed or pasted. Defaults to
   * dropping every character a number cannot contain. */
  parser?: (text: string) => string;
  /** Sits inside the border, before the number. */
  prefix?: ReactNode;
  suffix?: ReactNode;
  /** Sits outside the border, sharing its edge — a unit or a currency. */
  addonBefore?: ReactNode;
  addonAfter?: ReactNode;
  onPressEnter?: (value: number | null) => void;
  invalid?: boolean;
  stepUpLabel?: string;
  stepDownLabel?: string;
  className?: string;
  /** Applied to the `<input>` itself rather than to the bordered box. */
  inputClassName?: string;
};

const SIZE_CLASS = {
  sm: 'h-8 text-sm',
  default: 'h-9',
  lg: 'h-10 text-base',
} as const;

/**
 * The stepper column. Wide enough to aim at — each button only gets half the
 * field's height, so the width is what has to carry the hit area.
 */
const STEPPER_CLASS = {
  sm: 'w-7 [&_svg]:size-3.5',
  default: 'w-8 [&_svg]:size-4',
  lg: 'w-9 [&_svg]:size-4',
} as const;

/** How many decimals `step` implies — `0.05` is two, `1` is none. */
const decimalsOf = (value: number) => {
  const text = String(value);
  const dot = text.indexOf('.');

  return dot === -1 ? 0 : text.length - dot - 1;
};

/** Everything a number cannot contain, dropped: `1.234 ₫` reads as `1.234`. */
const defaultParser = (text: string) => text.replace(/[^\d.\-eE+]/g, '');

const clamp = (value: number, min?: number, max?: number) => {
  if (min !== undefined && value < min) return min;
  if (max !== undefined && value > max) return max;

  return value;
};

/**
 * A number field with steppers, bounds and a unit.
 *
 * ```tsx
 * <InputNumber value={fee} onChange={setFee} min={0} step={50_000} addonAfter="₫" />
 * ```
 *
 * `onChange` fires with the raw typed number, out of range included, so the
 * field never fights someone typing `5` on the way to `50`. Rounding to
 * `precision` and clamping into `min`/`max` happen on blur and on Enter.
 *
 * It takes `value`/`onChange`/`onBlur` and the aria props, which is exactly
 * what `Form.Item` injects — so it drops into a form with no adapter.
 */
export const InputNumber = ({
  value,
  defaultValue,
  onChange,
  min,
  max,
  step = 1,
  precision,
  size = 'default',
  controls = true,
  keyboard = true,
  changeOnWheel = false,
  formatter,
  parser = defaultParser,
  prefix,
  suffix,
  addonBefore,
  addonAfter,
  onPressEnter,
  invalid,
  stepUpLabel,
  stepDownLabel,
  disabled,
  readOnly,
  className,
  inputClassName,
  onBlur,
  onFocus,
  onKeyDown,
  ...props
}: InputNumberProps) => {
  const locale = useLocale();
  const [internal, setInternal] = useState<number | null>(defaultValue ?? null);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const digits = precision ?? decimalsOf(step);

  /** The number as digits — what the field is edited as. */
  const raw = (next: number | null) => {
    if (next === null) return '';

    return precision !== undefined ? next.toFixed(precision) : String(next);
  };

  /**
   * The number as it rests in the box. `formatter` only ever runs here, so a
   * thousands separator never has to survive a round trip through `parser`
   * mid-keystroke — focusing the field swaps back to the plain digits.
   */
  const print = (next: number | null) => {
    const text = raw(next);

    return formatter ? formatter(text) : text;
  };

  const [text, setText] = useState(() => raw(current));
  const [focused, setFocused] = useState(false);
  // What the field last emitted, so an echo of our own value does not
  // reformat the half-typed `1.` sitting in the box.
  const syncedRef = useRef(current);

  useEffect(() => {
    if (current === syncedRef.current) return;

    syncedRef.current = current;
    setText(raw(current));
    // `raw` closes over the precision props, which do not change per keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const emit = (next: number | null) => {
    syncedRef.current = next;
    if (!isControlled) setInternal(next);
    if (next !== current) onChange?.(next);
  };

  const read = (input: string) => {
    const cleaned = parser(input).trim();

    if (cleaned === '') return null;

    const parsed = Number(cleaned);

    // `-`, `1.` and `1e` are all mid-entry rather than wrong, so they leave the
    // committed value alone until another character finishes them.
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  /** Rounds and clamps, then rewrites the box — blur, Enter and the steppers. */
  const normalize = () => {
    const parsed = read(text);

    if (parsed === undefined) {
      setText(raw(current));

      return current;
    }

    if (parsed === null) {
      emit(null);
      setText('');

      return null;
    }

    const settled = Number(clamp(parsed, min, max).toFixed(digits));

    emit(settled);
    setText(raw(settled));

    return settled;
  };

  const stepBy = (delta: number) => {
    if (disabled || readOnly) return;

    const base = read(text);
    const from = base === undefined || base === null ? (current ?? 0) : base;
    // Rounded through `digits` so 0.1 + 0.2 lands on 0.3 rather than on
    // 0.30000000000000004.
    const next = Number(clamp(from + step * delta, min, max).toFixed(digits));

    emit(next);
    setText(raw(next));
  };

  const atMax = max !== undefined && current !== null && current >= max;
  const atMin = min !== undefined && current !== null && current <= min;
  const outOfRange =
    current !== null &&
    ((min !== undefined && current < min) ||
      (max !== undefined && current > max));

  const stepper = (
    label: string,
    icon: ReactNode,
    delta: number,
    limited: boolean,
  ) => (
    <button
      type="button"
      tabIndex={-1}
      aria-label={label}
      disabled={disabled || readOnly || limited}
      className={cn(
        'flex flex-1 items-center justify-center text-muted-foreground transition-colors',
        'hover:bg-accent hover:text-accent-foreground active:bg-accent/70',
        'disabled:pointer-events-none disabled:opacity-40',
      )}
      onClick={() => stepBy(delta)}
    >
      {icon}
    </button>
  );

  const box = (
    <div
      data-slot="input-number"
      data-size={size}
      data-disabled={disabled || undefined}
      aria-invalid={invalid || outOfRange || undefined}
      className={cn(
        // `overflow-hidden` keeps the steppers' hover fill inside the rounded
        // corner; the focus ring is the box's own, so it still draws outside.
        'flex w-full min-w-0 items-center gap-1 overflow-hidden rounded-md border border-input bg-transparent pl-3 text-base shadow-xs transition-[color,box-shadow] md:text-sm dark:bg-input/30',
        'focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20',
        'data-disabled:cursor-not-allowed data-disabled:opacity-50',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
        SIZE_CLASS[size],
        // The addons sit flush against the box, so it drops the outer corners.
        addonBefore && 'rounded-l-none',
        addonAfter && 'rounded-r-none',
        !controls && 'pr-3',
        className,
      )}
    >
      {!!prefix && (
        <span className="shrink-0 text-muted-foreground">{prefix}</span>
      )}

      <input
        {...props}
        type="text"
        inputMode={digits > 0 ? 'decimal' : 'numeric'}
        role="spinbutton"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={current ?? undefined}
        disabled={disabled}
        readOnly={readOnly}
        value={focused ? text : print(current)}
        className={cn(
          'w-full min-w-0 bg-transparent py-1 tabular-nums outline-none',
          'selection:bg-primary selection:text-primary-foreground',
          'placeholder:text-muted-foreground',
          'disabled:pointer-events-none disabled:cursor-not-allowed',
          inputClassName,
        )}
        onChange={(event) => {
          const next = event.target.value;

          setText(next);

          const parsed = read(next);

          if (parsed !== undefined) emit(parsed);
        }}
        onFocus={(event) => {
          setFocused(true);
          setText(raw(current));
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          normalize();
          onBlur?.(event);
        }}
        onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;

          if (event.key === 'Enter') {
            onPressEnter?.(normalize());

            return;
          }

          if (!keyboard) return;

          if (event.key === 'ArrowUp') {
            event.preventDefault();
            stepBy(1);
          } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            stepBy(-1);
          }
        }}
        onWheel={(event: WheelEvent<HTMLInputElement>) => {
          if (!changeOnWheel || !focused) return;

          event.preventDefault();
          stepBy(event.deltaY < 0 ? 1 : -1);
        }}
      />

      {!!suffix && (
        <span className="shrink-0 text-muted-foreground">{suffix}</span>
      )}

      {controls && (
        <span
          data-slot="input-number-controls"
          className={cn(
            'flex shrink-0 flex-col self-stretch border-l border-input',
            STEPPER_CLASS[size],
          )}
        >
          {stepper(
            stepUpLabel ?? locale.inputNumber?.increase ?? 'Increase',
            <ChevronUpIcon />,
            1,
            atMax,
          )}
          {stepper(
            stepDownLabel ?? locale.inputNumber?.decrease ?? 'Decrease',
            <ChevronDownIcon />,
            -1,
            atMin,
          )}
        </span>
      )}
    </div>
  );

  if (!addonBefore && !addonAfter) return box;

  const addon = (content: ReactNode, side: 'before' | 'after') => (
    <span
      className={cn(
        'flex shrink-0 items-center border border-input bg-muted px-3 text-sm text-muted-foreground',
        SIZE_CLASS[size],
        side === 'before'
          ? 'rounded-l-md border-r-0'
          : 'rounded-r-md border-l-0',
      )}
    >
      {content}
    </span>
  );

  return (
    <div
      data-slot="input-number-group"
      className="flex w-full min-w-0 items-stretch"
    >
      {!!addonBefore && addon(addonBefore, 'before')}
      {box}
      {!!addonAfter && addon(addonAfter, 'after')}
    </div>
  );
};
