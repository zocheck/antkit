import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

import { cn } from '../../utils';

import {
  EMPTY_TIME_PARTS,
  TIME_SEGMENT_LENGTH,
  from12Hour,
  fromTimeParts,
  isPm,
  pad2,
  timeSegmentBounds,
  to12Hour,
  toSecondsOfDay,
  toTimeParts,
  type TimeFormat,
  type TimeParts,
  type TimeSegmentType,
} from './utils';

export type TimeSegmentLabels = Record<TimeSegmentType, string>;

export const DEFAULT_TIME_PLACEHOLDERS: TimeSegmentLabels = {
  hour: 'hh',
  minute: 'mm',
  second: 'ss',
  dayPeriod: '--',
};

export const DEFAULT_TIME_SEGMENT_LABELS: TimeSegmentLabels = {
  hour: 'Hour',
  minute: 'Minute',
  second: 'Second',
  dayPeriod: 'AM/PM',
};

export const DEFAULT_DAY_PERIOD_LABELS = { am: 'AM', pm: 'PM' };

export type UseTimePartsOptions = {
  /** The day a completed time is stamped onto. Defaults to the value's own. */
  reference?: Date | null;
  /** A visible second segment has to be filled before a time exists. */
  requireSecond?: boolean;
};

/**
 * Keeps the editable parts in step with a `Date` from outside.
 *
 * The parts are the source of truth while typing — a half-typed `09:__` has no
 * `Date` to represent it, and re-deriving the parts from the value on every
 * render would erase the keystroke.
 */
export const useTimeParts = (
  value: Date | null | undefined,
  onChange: ((date: Date | null) => void) | undefined,
  { reference, requireSecond = false }: UseTimePartsOptions = {},
) => {
  const [parts, setParts] = useState<TimeParts>(() =>
    toTimeParts(value ?? null),
  );
  const seconds = value ? toSecondsOfDay(value) : null;
  // What the field last saw — either pushed in or emitted out. Comparing
  // against it keeps our own echo from resetting the parts mid-edit.
  const syncedRef = useRef(seconds);
  // The day to stamp onto, so editing a time never moves the date under it.
  const dayRef = useRef<Date | null>(value ?? reference ?? null);

  if (value) dayRef.current = value;
  else if (reference) dayRef.current = reference;

  useEffect(() => {
    if (seconds === syncedRef.current) return;

    syncedRef.current = seconds;
    setParts(toTimeParts(seconds === null ? null : (value ?? null)));
    // `seconds` is the identity of the time; the `Date` object itself churns.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  const update = (next: TimeParts) => {
    setParts(next);

    const date = fromTimeParts(next, {
      reference: dayRef.current,
      requireSecond,
    });
    const nextSeconds = date ? toSecondsOfDay(date) : null;

    if (nextSeconds === syncedRef.current) return;

    syncedRef.current = nextSeconds;
    onChange?.(date);
  };

  return { parts, setParts, update };
};

export const hasAnyTimePart = (parts: TimeParts) =>
  parts.hour !== null || parts.minute !== null || parts.second !== null;

/** Whether a typed time falls outside the allowed window. */
export const isTimeOutOfBounds = (
  date: Date | null,
  min: Date | undefined,
  max: Date | undefined,
) => {
  if (!date) return false;

  const seconds = toSecondsOfDay(date);

  return (
    (!!min && seconds < toSecondsOfDay(min)) ||
    (!!max && seconds > toSecondsOfDay(max))
  );
};

export type TimeSegmentsProps = {
  parts: TimeParts;
  onPartsChange: (parts: TimeParts) => void;
  format: TimeFormat;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  disabled?: boolean;
  readOnly?: boolean;
  placeholders?: Partial<TimeSegmentLabels>;
  labels?: Partial<TimeSegmentLabels>;
  dayPeriodLabels?: Partial<typeof DEFAULT_DAY_PERIOD_LABELS>;
  /** Applied to the first segment, so a `<Label htmlFor>` focuses the field. */
  id?: string;
  className?: string;
};

/**
 * The hour / minute / second spinners, with an AM–PM segment on a 12-hour
 * field. One tab stop: arrows move between segments, the way a native time
 * input behaves.
 */
export const TimeSegments = ({
  parts,
  onPartsChange,
  format,
  hourStep = 1,
  minuteStep = 1,
  secondStep = 1,
  disabled,
  readOnly,
  placeholders,
  labels,
  dayPeriodLabels,
  id,
  className,
}: TimeSegmentsProps) => {
  const placeholder = { ...DEFAULT_TIME_PLACEHOLDERS, ...placeholders };
  const label = { ...DEFAULT_TIME_SEGMENT_LABELS, ...labels };
  const period = { ...DEFAULT_DAY_PERIOD_LABELS, ...dayPeriodLabels };

  const { showHour, showMinute, showSecond, use12Hours } = format;

  const order = useMemo(() => {
    const segments: TimeSegmentType[] = [];

    if (showHour) segments.push('hour');
    if (showMinute) segments.push('minute');
    if (showSecond) segments.push('second');
    if (use12Hours) segments.push('dayPeriod');

    return segments;
  }, [showHour, showMinute, showSecond, use12Hours]);

  const steps: Record<Exclude<TimeSegmentType, 'dayPeriod'>, number> = {
    hour: hourStep,
    minute: minuteStep,
    second: secondStep,
  };

  const [active, setActive] = useState<TimeSegmentType | null>(null);
  const refs = useRef(new Map<TimeSegmentType, HTMLSpanElement>());
  // Digits typed into the current segment, so `0` then `4` reads as the 4th
  // minute rather than as two separate entries.
  const buffer = useRef<{ type: TimeSegmentType; text: string } | null>(null);

  const focusSegment = (type: TimeSegmentType | undefined) => {
    if (!type) return;

    buffer.current = null;
    refs.current.get(type)?.focus();
  };

  /** What a segment shows: the hour is 1–12 on a 12-hour field. */
  const displayValue = (type: Exclude<TimeSegmentType, 'dayPeriod'>) => {
    const raw = parts[type];

    if (raw === null) return null;

    return type === 'hour' && use12Hours ? to12Hour(raw) : raw;
  };

  /** Writes a displayed value back as a 0–23 hour when the field is 12-hour. */
  const setSegment = (
    type: Exclude<TimeSegmentType, 'dayPeriod'>,
    value: number | null,
  ) => {
    if (type !== 'hour' || !use12Hours || value === null) {
      onPartsChange({ ...parts, [type]: value });

      return;
    }

    // An untouched 12-hour field starts in the morning, matching the AM the
    // day-period segment shows before anything is picked.
    onPartsChange({
      ...parts,
      hour: from12Hour(value, parts.hour !== null && isPm(parts.hour)),
    });
  };

  const step = (type: Exclude<TimeSegmentType, 'dayPeriod'>, delta: number) => {
    const { min, max } = timeSegmentBounds(type, use12Hours);
    const current = displayValue(type);
    const span = max - min + 1;
    const amount = Math.max(1, Math.floor(steps[type])) * delta;
    const next =
      current === null
        ? // Stepping into an empty segment lands on a value the popover also
          // offers, rather than on `min + step`.
          delta > 0
          ? min
          : max - ((max - min) % Math.max(1, Math.floor(steps[type])))
        : ((((current - min + amount) % span) + span) % span) + min;

    buffer.current = null;
    setSegment(type, next);
  };

  const toggleDayPeriod = (pm?: boolean) => {
    const hour = parts.hour ?? 0;
    const next = pm ?? !isPm(hour);

    buffer.current = null;
    onPartsChange({ ...parts, hour: from12Hour(to12Hour(hour), next) });
  };

  const typeDigit = (
    type: Exclude<TimeSegmentType, 'dayPeriod'>,
    digit: string,
  ) => {
    const { min, max } = timeSegmentBounds(type, use12Hours);
    const previous = buffer.current?.type === type ? buffer.current.text : '';

    let text = previous + digit;

    // Overflowing restarts the segment rather than rejecting the keystroke:
    // typing 5 then 9 in a 12-hour field means 9 o'clock, not "59 is invalid".
    if (Number(text) > max) text = digit;

    const parsed = Number(text);

    buffer.current = { type, text };
    // A 12-hour field has no 0 o'clock, so a lone `0` is the start of `09`
    // rather than a value. Minutes and 24-hour hours keep it.
    setSegment(type, parsed === 0 && min > 0 ? null : parsed);

    // Nothing more can be typed here — either the segment is full or another
    // digit would overflow it.
    if (text.length >= TIME_SEGMENT_LENGTH || parsed * 10 > max) {
      const next = order[order.indexOf(type) + 1];

      // Synchronously — the segments never unmount, and deferring the focus to
      // a timeout drops keystrokes from anyone typing quickly.
      if (next) focusSegment(next);
      else buffer.current = null;
    }
  };

  const onKeyDown = (
    event: KeyboardEvent<HTMLSpanElement>,
    type: TimeSegmentType,
  ) => {
    const index = order.indexOf(type);
    const numeric = type !== 'dayPeriod' ? type : null;

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        if (readOnly) return;
        if (numeric) step(numeric, 1);
        else toggleDayPeriod();
        return;
      case 'ArrowDown':
        event.preventDefault();
        if (readOnly) return;
        if (numeric) step(numeric, -1);
        else toggleDayPeriod();
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
        if (readOnly || !numeric) return;
        buffer.current = null;
        onPartsChange({ ...parts, [numeric]: null });
        return;
      default:
        if (readOnly) return;

        if (!numeric) {
          const key = event.key.toLowerCase();

          if (key !== 'a' && key !== 'p') return;
          event.preventDefault();
          toggleDayPeriod(key === 'p');

          return;
        }

        if (!/^\d$/.test(event.key)) return;
        event.preventDefault();
        typeDigit(numeric, event.key);
    }
  };

  const tabbable = active ?? order[0];

  return (
    <div
      data-slot="time-segments"
      className={cn(
        'flex items-center whitespace-nowrap tabular-nums',
        className,
      )}
    >
      {order.map((type, index) => {
        const isPeriod = type === 'dayPeriod';
        const value = isPeriod ? null : displayValue(type);
        const bounds = isPeriod ? null : timeSegmentBounds(type, use12Hours);

        const text = isPeriod
          ? parts.hour === null
            ? placeholder.dayPeriod
            : isPm(parts.hour)
              ? period.pm
              : period.am
          : value === null
            ? placeholder[type]
            : pad2(value);

        return (
          <span key={type} className="flex items-center">
            {index > 0 && (
              <span
                aria-hidden="true"
                className={cn(
                  'text-muted-foreground',
                  isPeriod ? 'px-1' : 'px-px',
                )}
              >
                {isPeriod ? '' : ':'}
              </span>
            )}

            <span
              ref={(node) => {
                if (node) refs.current.set(type, node);
                else refs.current.delete(type);
              }}
              id={index === 0 ? id : undefined}
              data-slot="time-segment"
              data-segment={type}
              data-placeholder={
                (isPeriod ? parts.hour === null : value === null) || undefined
              }
              role="spinbutton"
              aria-label={label[type]}
              aria-valuemin={bounds?.min}
              aria-valuemax={bounds?.max}
              aria-valuenow={value ?? undefined}
              aria-valuetext={text}
              aria-disabled={disabled || undefined}
              aria-readonly={readOnly || undefined}
              tabIndex={disabled ? -1 : tabbable === type ? 0 : -1}
              inputMode={isPeriod ? undefined : 'numeric'}
              className={cn(
                'rounded-sm px-0.5 text-sm outline-none',
                'focus:bg-primary focus:text-primary-foreground',
                (isPeriod ? parts.hour === null : value === null) &&
                  'text-muted-foreground',
              )}
              onFocus={() => setActive(type)}
              onBlur={() => {
                buffer.current = null;
                setActive(null);
              }}
              onKeyDown={(event) => onKeyDown(event, type)}
            >
              {text}
            </span>
          </span>
        );
      })}
    </div>
  );
};

export { EMPTY_TIME_PARTS };
