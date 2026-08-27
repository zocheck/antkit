/** The four editable parts of a time, in the order they are typed. */
export type TimeSegmentType = 'hour' | 'minute' | 'second' | 'dayPeriod';

/** Hours are always stored 0–23, whatever the field displays. */
export type TimeParts = {
  hour: number | null;
  minute: number | null;
  second: number | null;
};

export const EMPTY_TIME_PARTS: TimeParts = {
  hour: null,
  minute: null,
  second: null,
};

/** Which segments a `format` string asks for. */
export type TimeFormat = {
  showHour: boolean;
  showMinute: boolean;
  showSecond: boolean;
  use12Hours: boolean;
};

export const DEFAULT_TIME_FORMAT = 'HH:mm:ss';

/**
 * Reads the shape of the field off an antd-style format string.
 *
 * Only which tokens are present matters — the segments are rendered as
 * spinbuttons with a fixed `:` between them, so `HH:mm` and `HH.mm` produce
 * the same field. A lowercase `h`, or an `A`/`a`, switches it to 12-hour.
 */
export const resolveTimeFormat = (
  format: string = DEFAULT_TIME_FORMAT,
): TimeFormat => ({
  showHour: /h/i.test(format),
  showMinute: /m/.test(format),
  showSecond: /s/.test(format),
  use12Hours: /h/.test(format) || /a/i.test(format),
});

export const toSecondsOfDay = (date: Date) =>
  date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();

/** Time-of-day comparison: two different days at 09:00 count as equal. */
export const compareTimes = (a: Date, b: Date) =>
  toSecondsOfDay(a) - toSecondsOfDay(b);

export const isTimeBefore = (a: Date, b: Date) => compareTimes(a, b) < 0;
export const isTimeAfter = (a: Date, b: Date) => compareTimes(a, b) > 0;

export const isTimeWithin = (date: Date, min?: Date, max?: Date) =>
  (!min || !isTimeBefore(date, min)) && (!max || !isTimeAfter(date, max));

export const toTimeParts = (date: Date | null): TimeParts =>
  date
    ? {
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
      }
    : EMPTY_TIME_PARTS;

/**
 * Stamps a time onto a day.
 *
 * The calendar half of a value is preserved so a `TimePicker` sitting next to
 * a `DatePicker` over the same `Date` does not silently move it to today.
 */
export const withTime = (
  reference: Date | null | undefined,
  { hour, minute, second }: { hour: number; minute: number; second: number },
) => {
  const base = reference ? new Date(reference) : new Date();

  base.setHours(hour, minute, second, 0);

  return base;
};

export type FromTimePartsOptions = {
  /** The day to stamp the time onto. Defaults to today. */
  reference?: Date | null;
  /** When the field shows seconds, a blank one means "not finished typing". */
  requireSecond?: boolean;
};

/**
 * A `Date` only once every visible segment is filled — a half-typed `09:__`
 * has no time to represent it, so it reads as `null` rather than as 09:00.
 */
export const fromTimeParts = (
  { hour, minute, second }: TimeParts,
  { reference, requireSecond = false }: FromTimePartsOptions = {},
): Date | null => {
  if (hour === null || minute === null) return null;
  if (requireSecond && second === null) return null;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  if (second !== null && (second < 0 || second > 59)) return null;

  return withTime(reference, { hour, minute, second: second ?? 0 });
};

const toClock = (date: Date) => ({
  hour: date.getHours(),
  minute: date.getMinutes(),
  second: date.getSeconds(),
});

/** Pulls a time back inside the window, keeping the day it sits on. */
export const clampTime = (date: Date, min?: Date, max?: Date) => {
  if (min && isTimeBefore(date, min)) return withTime(date, toClock(min));
  if (max && isTimeAfter(date, max)) return withTime(date, toClock(max));

  return date;
};

export const pad2 = (value: number) => String(value).padStart(2, '0');

/** 0 → 12, 13 → 1. The hour a 12-hour field puts on screen. */
export const to12Hour = (hour: number) => hour % 12 || 12;

export const isPm = (hour: number) => hour >= 12;

/** Back to 0–23 from what a 12-hour field shows. */
export const from12Hour = (hour12: number, pm: boolean) =>
  (hour12 % 12) + (pm ? 12 : 0);

/**
 * `HH:mm:ss` in local time — the shape a hidden input and an `<input
 * type="time">` both expect, whatever the field displays.
 */
export const toISOTime = (date: Date, showSecond = true) =>
  showSecond
    ? `${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`
    : `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;

/** What `onChange` hands back as its second argument, honouring the format. */
export const toTimeString = (date: Date, format: TimeFormat) => {
  const { showHour, showMinute, showSecond, use12Hours } = format;
  const hour = use12Hours ? to12Hour(date.getHours()) : date.getHours();

  const parts = [
    showHour && pad2(hour),
    showMinute && pad2(date.getMinutes()),
    showSecond && pad2(date.getSeconds()),
  ].filter((part): part is string => part !== false);

  const clock = parts.join(':');

  return use12Hours ? `${clock} ${isPm(date.getHours()) ? 'PM' : 'AM'}` : clock;
};

/** Parses `HH:mm`, `HH:mm:ss` — what a form or an API sends back. */
export const parseISOTime = (
  value: string,
  reference?: Date | null,
): Date | null => {
  const match = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(value.trim());

  if (!match) return null;

  return fromTimeParts(
    {
      hour: Number(match[1]),
      minute: Number(match[2]),
      second: match[3] === undefined ? 0 : Number(match[3]),
    },
    { reference },
  );
};

export const TIME_SEGMENT_LENGTH = 2;

export const timeSegmentBounds = (
  type: Exclude<TimeSegmentType, 'dayPeriod'>,
  use12Hours: boolean,
): { min: number; max: number } => {
  if (type !== 'hour') return { min: 0, max: 59 };

  return use12Hours ? { min: 1, max: 12 } : { min: 0, max: 23 };
};

/**
 * The values a popover column offers, e.g. `[0, 5, 10, …]` for `minuteStep=5`.
 */
export const buildTimeOptions = (
  type: Exclude<TimeSegmentType, 'dayPeriod'>,
  step: number,
  use12Hours: boolean,
) => {
  const { min, max } = timeSegmentBounds(type, use12Hours);
  const safeStep = Math.max(1, Math.floor(step));
  const values: number[] = [];

  for (let value = min; value <= max; value += safeStep) values.push(value);

  return values;
};
