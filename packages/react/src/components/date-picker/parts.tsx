import { useEffect, useMemo, useRef, useState } from 'react';
import type { ComponentProps, KeyboardEvent, ReactNode } from 'react';

import { cn } from '../../utils';

import {
  EMPTY_PARTS,
  SEGMENT_LENGTH,
  fromParts,
  getDateFieldParts,
  isWithin,
  padSegment,
  segmentBounds,
  startOfDay,
  toParts,
  type DateParts,
  type DateSegmentType,
} from './utils';

export type DateSegmentLabels = Record<DateSegmentType, string>;

export const DEFAULT_PLACEHOLDERS: DateSegmentLabels = {
  day: 'dd',
  month: 'mm',
  year: 'yyyy',
};

export const DEFAULT_SEGMENT_LABELS: DateSegmentLabels = {
  day: 'Day',
  month: 'Month',
  year: 'Year',
};

/**
 * Keeps the editable parts in step with a `Date` from outside.
 *
 * The parts are the source of truth while typing — a half-typed `1_/03/2026`
 * has no `Date` to represent it, and re-deriving the parts from the value on
 * every render would erase the keystroke.
 */
export const useDateParts = (
  value: Date | null | undefined,
  onChange: ((date: Date | null) => void) | undefined,
) => {
  const [parts, setParts] = useState<DateParts>(() => toParts(value ?? null));
  const valueTime = value ? startOfDay(value).getTime() : null;
  // What the field last saw — either pushed in or emitted out. Comparing
  // against it keeps our own echo from resetting the parts mid-edit.
  const syncedRef = useRef(valueTime);

  useEffect(() => {
    if (valueTime === syncedRef.current) return;

    syncedRef.current = valueTime;
    setParts(toParts(valueTime === null ? null : new Date(valueTime)));
  }, [valueTime]);

  const update = (next: DateParts) => {
    setParts(next);

    const date = fromParts(next);
    const nextTime = date ? date.getTime() : null;

    if (nextTime === syncedRef.current) return;

    syncedRef.current = nextTime;
    onChange?.(date);
  };

  return { parts, setParts, update };
};

export type DateSegmentsProps = {
  parts: DateParts;
  onPartsChange: (parts: DateParts) => void;
  locale?: string;
  disabled?: boolean;
  readOnly?: boolean;
  placeholders?: Partial<DateSegmentLabels>;
  labels?: Partial<DateSegmentLabels>;
  /** Applied to the first segment, so a `<Label htmlFor>` focuses the field. */
  id?: string;
  className?: string;
};

/**
 * The day / month / year spinners, in whatever order and with whatever
 * separators the locale uses. One tab stop: arrows move between segments,
 * the way a native date input behaves.
 */
export const DateSegments = ({
  parts,
  onPartsChange,
  locale,
  disabled,
  readOnly,
  placeholders,
  labels,
  id,
  className,
}: DateSegmentsProps) => {
  const placeholder = { ...DEFAULT_PLACEHOLDERS, ...placeholders };
  const label = { ...DEFAULT_SEGMENT_LABELS, ...labels };

  const fieldParts = useMemo(() => getDateFieldParts(locale), [locale]);
  const order = useMemo(
    () =>
      fieldParts
        .filter((part) => part.type !== 'literal')
        .map((part) => part.type as DateSegmentType),
    [fieldParts],
  );

  const [active, setActive] = useState<DateSegmentType | null>(null);
  const refs = useRef(new Map<DateSegmentType, HTMLSpanElement>());
  // Digits typed into the current segment, so `0` then `4` reads as the 4th
  // rather than as two separate entries.
  const buffer = useRef<{ type: DateSegmentType; text: string } | null>(null);

  const focusSegment = (type: DateSegmentType | undefined) => {
    if (!type) return;

    buffer.current = null;
    refs.current.get(type)?.focus();
  };

  const step = (type: DateSegmentType, delta: number) => {
    const { min, max } = segmentBounds(type, parts);
    const current = parts[type];
    const fallback = type === 'year' ? new Date().getFullYear() : min;
    const next =
      current === null
        ? fallback
        : ((current - min + delta + (max - min + 1)) % (max - min + 1)) + min;

    buffer.current = null;
    onPartsChange({ ...parts, [type]: next });
  };

  const typeDigit = (type: DateSegmentType, digit: string) => {
    const { max } = segmentBounds(type, parts);
    const previous = buffer.current?.type === type ? buffer.current.text : '';

    let text = previous + digit;

    // Overflowing restarts the segment rather than rejecting the keystroke:
    // typing 3 then 1 in a month field means the 1st, not "31 is invalid".
    if (Number(text) > max) text = digit;

    const parsed = Number(text);

    buffer.current = { type, text };
    onPartsChange({ ...parts, [type]: parsed === 0 ? null : parsed });

    // Nothing more can be typed here — either the segment is full or another
    // digit would overflow it.
    if (text.length >= SEGMENT_LENGTH[type] || parsed * 10 > max) {
      const next = order[order.indexOf(type) + 1];

      // Synchronously — the segments never unmount, and deferring the focus
      // to a timeout drops keystrokes from anyone typing quickly.
      if (next) focusSegment(next);
      else buffer.current = null;
    }
  };

  const onKeyDown = (
    event: KeyboardEvent<HTMLSpanElement>,
    type: DateSegmentType,
  ) => {
    const index = order.indexOf(type);

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        if (!readOnly) step(type, 1);
        return;
      case 'ArrowDown':
        event.preventDefault();
        if (!readOnly) step(type, -1);
        return;
      case 'ArrowLeft':
        event.preventDefault();
        focusSegment(order[index - 1]);
        return;
      case 'ArrowRight':
        event.preventDefault();
        focusSegment(order[index + 1]);
        return;
      case 'Backspace':
      case 'Delete':
        event.preventDefault();
        if (readOnly) return;
        buffer.current = null;
        onPartsChange({ ...parts, [type]: null });
        return;
      default:
        if (readOnly || !/^\d$/.test(event.key)) return;
        event.preventDefault();
        typeDigit(type, event.key);
    }
  };

  const tabbable = active ?? order[0];

  return (
    <div
      data-slot="date-segments"
      className={cn(
        'flex items-center whitespace-nowrap tabular-nums',
        className,
      )}
    >
      {fieldParts.map((part, index) => {
        if (part.type === 'literal') {
          return (
            <span
              key={`literal-${index}`}
              aria-hidden="true"
              className="px-px text-muted-foreground"
            >
              {part.value}
            </span>
          );
        }

        const type = part.type;
        const value = parts[type];
        const { min, max } = segmentBounds(type, parts);

        return (
          <span
            key={type}
            ref={(node) => {
              if (node) refs.current.set(type, node);
              else refs.current.delete(type);
            }}
            id={index === 0 ? id : undefined}
            data-slot="date-segment"
            data-segment={type}
            data-placeholder={value === null || undefined}
            role="spinbutton"
            aria-label={label[type]}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value ?? undefined}
            aria-valuetext={value === null ? placeholder[type] : String(value)}
            aria-disabled={disabled || undefined}
            aria-readonly={readOnly || undefined}
            tabIndex={disabled ? -1 : tabbable === type ? 0 : -1}
            inputMode="numeric"
            className={cn(
              'rounded-sm px-0.5 text-sm outline-none',
              'focus:bg-primary focus:text-primary-foreground',
              value === null && 'text-muted-foreground',
            )}
            onFocus={() => setActive(type)}
            onBlur={() => {
              buffer.current = null;
              setActive(null);
            }}
            onKeyDown={(event) => onKeyDown(event, type)}
          >
            {value === null ? placeholder[type] : padSegment(type, value)}
          </span>
        );
      })}
    </div>
  );
};

export type DateInputBoxProps = ComponentProps<'div'> & {
  disabled?: boolean;
  invalid?: boolean;
  /** Rendered flush against the right edge — a calendar or clear button. */
  suffix?: ReactNode;
};

/** The bordered shell shared by `DateField` and the two pickers. */
export const DateInputBox = ({
  disabled,
  invalid,
  suffix,
  className,
  children,
  ...props
}: DateInputBoxProps) => (
  <div
    data-slot="date-input"
    data-disabled={disabled || undefined}
    aria-invalid={invalid || undefined}
    className={cn(
      'flex h-9 w-full min-w-0 items-center gap-1 rounded-md border border-input bg-transparent py-1 pr-1 pl-3 shadow-xs transition-[color,box-shadow] dark:bg-input/30',
      'focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20',
      'data-disabled:cursor-not-allowed data-disabled:opacity-50',
      'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
      className,
    )}
    {...props}
  >
    <div className="flex min-w-0 flex-1 items-center">{children}</div>
    {suffix}
  </div>
);

/** Whether a typed date falls outside the allowed window. */
export const isOutOfBounds = (
  date: Date | null,
  min: Date | undefined,
  max: Date | undefined,
) => !!date && !isWithin(date, min, max);

export const hasAnyPart = (parts: DateParts) =>
  parts.day !== null || parts.month !== null || parts.year !== null;

export { EMPTY_PARTS };
