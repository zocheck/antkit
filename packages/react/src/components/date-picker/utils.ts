/** A half-open selection: `to` is null while the user is mid-range. */
export type DateRange = {
  from: Date | null;
  to: Date | null;
};

/** 0 = Sunday … 6 = Saturday, matching `Date#getDay`. */
export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** The three editable parts of a date, in the order the locale prints them. */
export type DateSegmentType = 'day' | 'month' | 'year';

export type DateParts = {
  day: number | null;
  month: number | null;
  year: number | null;
};

export const EMPTY_PARTS: DateParts = { day: null, month: null, year: null };

export const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const startOfMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

export const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

/**
 * Clamps the day when the target month is shorter — 31 Jan + 1 month is 28 or
 * 29 Feb, not 2 or 3 Mar the way `setMonth` would give it to you.
 */
export const addMonths = (date: Date, months: number) => {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = daysInMonth(target.getFullYear(), target.getMonth());

  target.setDate(Math.min(date.getDate(), lastDay));

  return target;
};

export const daysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

export const isSameDay = (a: Date | null, b: Date | null) =>
  !!a &&
  !!b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const isSameMonth = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

/** Day-granular comparison: two times on the same day count as equal. */
export const compareDays = (a: Date, b: Date) =>
  startOfDay(a).getTime() - startOfDay(b).getTime();

export const isBeforeDay = (a: Date, b: Date) => compareDays(a, b) < 0;
export const isAfterDay = (a: Date, b: Date) => compareDays(a, b) > 0;

export const isWithin = (date: Date, min?: Date, max?: Date) =>
  (!min || !isBeforeDay(date, min)) && (!max || !isAfterDay(date, max));

export const clampDate = (date: Date, min?: Date, max?: Date) => {
  if (min && isBeforeDay(date, min)) return startOfDay(min);
  if (max && isAfterDay(date, max)) return startOfDay(max);

  return date;
};

export const isInRange = (date: Date, range: DateRange) => {
  if (!range.from || !range.to) return false;

  return !isBeforeDay(date, range.from) && !isAfterDay(date, range.to);
};

/**
 * Six weeks of days covering `month`, leading and trailing days included.
 *
 * Always six rows, even when five would do: a grid that changes height as you
 * page through months makes the buttons move under the pointer.
 */
export const buildMonthGrid = (month: Date, weekStartsOn: WeekDay) => {
  const first = startOfMonth(month);
  const lead = (first.getDay() - weekStartsOn + 7) % 7;
  const start = addDays(first, -lead);

  return Array.from({ length: 42 }, (_, index) => addDays(start, index));
};

export const getWeekdayLabels = (
  locale: string | undefined,
  weekStartsOn: WeekDay,
  format: 'narrow' | 'short' = 'short',
) => {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: format });
  // 2024-01-07 was a Sunday, so `weekStartsOn` indexes straight off it.
  const sunday = new Date(2024, 0, 7);

  return Array.from({ length: 7 }, (_, index) =>
    formatter.format(addDays(sunday, weekStartsOn + index)),
  );
};

export const formatMonthCaption = (month: Date, locale?: string) =>
  month.toLocaleDateString(locale, { month: 'long', year: 'numeric' });

export const formatMonthName = (month: number, locale?: string) =>
  new Date(2024, month, 1).toLocaleDateString(locale, { month: 'long' });

export const formatFullDate = (date: Date, locale?: string) =>
  date.toLocaleDateString(locale, { dateStyle: 'long' });

/**
 * `YYYY-MM-DD` in local time. `toISOString` would shift the day for anyone
 * east or west of UTC, which is the whole user base here.
 */
export const toISODate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`;

export const toParts = (date: Date | null): DateParts =>
  date
    ? {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      }
    : EMPTY_PARTS;

/**
 * A date only once every part is filled and the combination exists — 31/02
 * parses to 3 March through the `Date` constructor, so it is rejected here
 * rather than silently becoming a different day.
 */
export const fromParts = ({ day, month, year }: DateParts): Date | null => {
  if (day === null || month === null || year === null) return null;
  if (month < 1 || month > 12 || day < 1) return null;
  if (day > daysInMonth(year, month - 1)) return null;

  return new Date(year, month - 1, day);
};

export type DateFieldPart =
  | { type: DateSegmentType }
  | { type: 'literal'; value: string };

/**
 * The segment order and separators the locale uses, read off `Intl` rather
 * than hard-coded — `dd/mm/yyyy` in Vietnamese, `mm/dd/yyyy` in en-US.
 */
export const getDateFieldParts = (locale?: string): DateFieldPart[] => {
  const parts = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    numberingSystem: 'latn',
  }).formatToParts(new Date(2024, 0, 15));

  return parts.flatMap<DateFieldPart>((part) => {
    if (part.type === 'day' || part.type === 'month' || part.type === 'year') {
      return [{ type: part.type }];
    }

    // Anything the locale prints between segments — a slash, a dot, the
    // Japanese 年 — is kept as-is, but era or weekday text is dropped.
    return part.type === 'literal'
      ? [{ type: 'literal', value: part.value }]
      : [];
  });
};

export const SEGMENT_LENGTH: Record<DateSegmentType, number> = {
  day: 2,
  month: 2,
  year: 4,
};

export const segmentBounds = (
  type: DateSegmentType,
  parts: DateParts,
): { min: number; max: number } => {
  if (type === 'year') return { min: 1, max: 9999 };
  if (type === 'month') return { min: 1, max: 12 };

  // Day caps at the length of the month being edited, so February never
  // offers a 30th to arrow onto.
  const year = parts.year ?? 2024;
  const month = parts.month ?? 1;

  return { min: 1, max: daysInMonth(year, month - 1) };
};

export const padSegment = (type: DateSegmentType, value: number) =>
  String(value).padStart(SEGMENT_LENGTH[type], '0');
