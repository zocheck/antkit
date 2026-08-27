import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

import { cn } from '../../utils';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { useLocale } from '../../lib/config';
import { Button } from '../button';
import {
  addDays,
  addMonths,
  buildMonthGrid,
  clampDate,
  compareDays,
  formatFullDate,
  formatMonthCaption,
  formatMonthName,
  getWeekdayLabels,
  isAfterDay,
  isBeforeDay,
  isInRange,
  isSameDay,
  isSameMonth,
  isWithin,
  startOfDay,
  startOfMonth,
  type DateRange,
  type WeekDay,
} from './utils';

const CALENDAR_LABELS = {
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  monthSelect: 'Month',
  yearSelect: 'Year',
};

export type CalendarLabels = {
  previousMonth: string;
  nextMonth: string;
  monthSelect: string;
  yearSelect: string;
};

export type CalendarBaseProps = {
  /** Controlled displayed month. Pair with `onMonthChange`. */
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  /** Months shown side by side — 2 is the usual choice for a range. */
  numberOfMonths?: number;
  min?: Date;
  max?: Date;
  /** Extra rule on top of `min`/`max` — blocking weekends, say. */
  isDateDisabled?: (date: Date) => boolean;
  /** 0 = Sunday. Defaults to Monday, which is what vi-VN expects. */
  weekStartsOn?: WeekDay;
  locale?: string;
  showOutsideDays?: boolean;
  /** `dropdown` swaps the caption for month/year selects. */
  captionLayout?: 'label' | 'dropdown';
  fromYear?: number;
  toYear?: number;
  /** Overrides what counts as today — useful in tests and screenshots. */
  today?: Date;
  /** Moves keyboard focus into the grid on mount. */
  autoFocus?: boolean;
  /** Rendered under the grid — a "Today" shortcut, a hint, a legend. */
  footer?: ReactNode;
  labels?: Partial<CalendarLabels>;
  className?: string;
};

export type CalendarSingleProps = CalendarBaseProps & {
  mode?: 'single';
  selected?: Date | null;
  onSelect?: (date: Date) => void;
};

export type CalendarRangeProps = CalendarBaseProps & {
  mode: 'range';
  selected?: DateRange | null;
  onSelect?: (range: DateRange) => void;
};

export type CalendarProps = CalendarSingleProps | CalendarRangeProps;

const EMPTY_RANGE: DateRange = { from: null, to: null };

/** The day the grid starts focused on, and the month it opens to. */
const anchorOf = (props: CalendarProps) =>
  props.mode === 'range'
    ? (props.selected?.from ?? null)
    : (props.selected ?? null);

/**
 * A month grid with single or range selection.
 *
 * ```tsx
 * <Calendar selected={date} onSelect={setDate} min={new Date()} />
 *
 * <Calendar mode="range" numberOfMonths={2} selected={range} onSelect={setRange} />
 * ```
 *
 * Arrow keys walk the grid, PageUp/PageDown change month (add Shift for a
 * year), and focus follows the selection across month boundaries — only the
 * focused day is tabbable, so tabbing past the calendar takes one press.
 *
 * `DatePicker` and `DateRangePicker` wrap this with a text field; use the
 * calendar on its own when it should stay open on the page.
 */
export const Calendar = (props: CalendarProps) => {
  const strings = useLocale();
  const {
    month,
    defaultMonth,
    onMonthChange,
    numberOfMonths = 1,
    min,
    max,
    isDateDisabled,
    weekStartsOn = 1,
    locale,
    showOutsideDays = true,
    captionLayout = 'label',
    fromYear,
    toYear,
    today: todayProp,
    autoFocus = false,
    footer,
    labels,
    className,
  } = props;

  const captionId = useId();
  const text = {
    ...CALENDAR_LABELS,
    ...strings.datePicker?.calendar,
    ...labels,
  };
  const today = useMemo(() => startOfDay(todayProp ?? new Date()), [todayProp]);
  const anchor = anchorOf(props);

  const [internalMonth, setInternalMonth] = useState(() =>
    startOfMonth(month ?? defaultMonth ?? anchor ?? today),
  );
  const displayedMonth = month ? startOfMonth(month) : internalMonth;

  const goToMonth = (next: Date) => {
    const target = startOfMonth(next);

    if (!month) setInternalMonth(target);
    onMonthChange?.(target);
  };

  const [focusedDate, setFocusedDate] = useState(() =>
    clampDate(anchor ?? today, min, max),
  );
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  // Focus only moves when the keyboard asked for it. Re-focusing on every
  // render would steal focus back from whatever the user tabbed to next.
  const shouldFocusRef = useRef(autoFocus);
  const dayRefs = useRef(new Map<number, HTMLButtonElement>());

  useEffect(() => {
    if (!shouldFocusRef.current) return;

    shouldFocusRef.current = false;
    dayRefs.current.get(startOfDay(focusedDate).getTime())?.focus();
  }, [focusedDate]);

  const months = Array.from({ length: numberOfMonths }, (_, index) =>
    addMonths(displayedMonth, index),
  );
  const lastMonth = months[months.length - 1];

  const canGoBack =
    !min || !isBeforeDay(addDays(startOfMonth(displayedMonth), -1), min);
  const canGoForward =
    !max ||
    isBeforeDay(
      new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 1),
      max,
    ) ||
    isSameMonth(lastMonth, max);

  const isDisabled = (date: Date) =>
    !isWithin(date, min, max) || !!isDateDisabled?.(date);

  const selectedRange: DateRange =
    props.mode === 'range' ? (props.selected ?? EMPTY_RANGE) : EMPTY_RANGE;

  /**
   * While only `from` is set, the day under the pointer stands in for `to` so
   * the range paints as you sweep across it.
   */
  const previewRange: DateRange = useMemo(() => {
    if (props.mode !== 'range') return EMPTY_RANGE;
    if (!selectedRange.from || selectedRange.to || !hoveredDate) {
      return selectedRange;
    }

    return isBeforeDay(hoveredDate, selectedRange.from)
      ? { from: hoveredDate, to: selectedRange.from }
      : { from: selectedRange.from, to: hoveredDate };
  }, [hoveredDate, props.mode, selectedRange]);

  const select = (date: Date) => {
    if (props.mode === 'range') {
      const { from, to } = selectedRange;

      if (!from || to) {
        props.onSelect?.({ from: date, to: null });
        return;
      }

      // A second click before the start reads as "the range runs the other
      // way", not "start over" — both clicks are kept.
      props.onSelect?.(
        isBeforeDay(date, from) ? { from: date, to: from } : { from, to: date },
      );
      return;
    }

    props.onSelect?.(date);
  };

  const moveFocus = (event: KeyboardEvent<HTMLButtonElement>, next: Date) => {
    event.preventDefault();

    const target = clampDate(next, min, max);

    shouldFocusRef.current = true;
    setFocusedDate(target);

    // Follow focus out of the displayed months, but leave the month alone
    // while focus is still inside them — paging a two-month view on every
    // arrow press would be disorienting.
    if (isBeforeDay(target, displayedMonth)) {
      goToMonth(target);
    } else if (isAfterDay(target, addMonths(lastMonth, 1))) {
      goToMonth(addMonths(target, -(numberOfMonths - 1)));
    } else if (!months.some((value) => isSameMonth(value, target))) {
      goToMonth(addMonths(target, -(numberOfMonths - 1)));
    }
  };

  const onDayKeyDown = (event: KeyboardEvent<HTMLButtonElement>, day: Date) => {
    switch (event.key) {
      case 'ArrowLeft':
        return moveFocus(event, addDays(day, -1));
      case 'ArrowRight':
        return moveFocus(event, addDays(day, 1));
      case 'ArrowUp':
        return moveFocus(event, addDays(day, -7));
      case 'ArrowDown':
        return moveFocus(event, addDays(day, 7));
      case 'Home':
        return moveFocus(
          event,
          addDays(day, -((day.getDay() - weekStartsOn + 7) % 7)),
        );
      case 'End':
        return moveFocus(
          event,
          addDays(day, 6 - ((day.getDay() - weekStartsOn + 7) % 7)),
        );
      case 'PageUp':
        return moveFocus(event, addMonths(day, event.shiftKey ? -12 : -1));
      case 'PageDown':
        return moveFocus(event, addMonths(day, event.shiftKey ? 12 : 1));
      default:
        return undefined;
    }
  };

  const weekdays = useMemo(
    () => getWeekdayLabels(locale, weekStartsOn),
    [locale, weekStartsOn],
  );

  const years = useMemo(() => {
    if (captionLayout !== 'dropdown') return [];

    const start = fromYear ?? min?.getFullYear() ?? today.getFullYear() - 10;
    const end = toYear ?? max?.getFullYear() ?? today.getFullYear() + 10;

    return Array.from(
      { length: Math.max(end - start + 1, 1) },
      (_, index) => start + index,
    );
  }, [captionLayout, fromYear, max, min, today, toYear]);

  return (
    <div
      data-slot="calendar"
      className={cn('w-fit p-3 text-sm', className)}
      onMouseLeave={() => setHoveredDate(null)}
    >
      {/* Fixed height so the absolutely positioned arrows keep their row even
          when the caption itself is hidden. */}
      <div className="relative mb-2 flex h-8 items-center justify-center">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={text.previousMonth}
          disabled={!canGoBack}
          className="absolute left-0"
          onClick={() => goToMonth(addMonths(displayedMonth, -1))}
        >
          <ChevronLeftIcon />
        </Button>

        {captionLayout === 'dropdown' ? (
          <div className="flex items-center gap-1.5">
            <CaptionSelect
              aria-label={text.monthSelect}
              value={String(displayedMonth.getMonth())}
              onChange={(value) =>
                goToMonth(
                  new Date(displayedMonth.getFullYear(), Number(value), 1),
                )
              }
              options={Array.from({ length: 12 }, (_, index) => ({
                value: String(index),
                label: formatMonthName(index, locale),
              }))}
            />
            <CaptionSelect
              aria-label={text.yearSelect}
              value={String(displayedMonth.getFullYear())}
              onChange={(value) =>
                goToMonth(new Date(Number(value), displayedMonth.getMonth(), 1))
              }
              options={years.map((year) => ({
                value: String(year),
                label: String(year),
              }))}
            />
          </div>
        ) : (
          // With several months on screen each grid captions itself, so the
          // header only announces the span rather than repeating it.
          <div
            id={captionId}
            aria-live="polite"
            className={cn(
              'text-sm font-medium capitalize',
              numberOfMonths > 1 && 'sr-only',
            )}
          >
            {months
              .map((value) => formatMonthCaption(value, locale))
              .join(' – ')}
          </div>
        )}

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={text.nextMonth}
          disabled={!canGoForward}
          className="absolute right-0"
          onClick={() => goToMonth(addMonths(displayedMonth, 1))}
        >
          <ChevronRightIcon />
        </Button>
      </div>

      <div className="flex gap-4">
        {months.map((value) => (
          <div key={value.getTime()} role="grid" aria-labelledby={captionId}>
            {numberOfMonths > 1 && (
              <div className="pb-2 text-center text-sm font-medium capitalize">
                {formatMonthCaption(value, locale)}
              </div>
            )}

            <div role="row" className="grid grid-cols-7">
              {weekdays.map((label) => (
                <div
                  key={label}
                  role="columnheader"
                  aria-label={label}
                  className="flex size-9 items-center justify-center text-xs font-normal text-muted-foreground"
                >
                  {label}
                </div>
              ))}
            </div>

            {chunkWeeks(buildMonthGrid(value, weekStartsOn)).map((week) => (
              <div
                key={week[0].getTime()}
                role="row"
                className="grid grid-cols-7"
              >
                {week.map((day) => {
                  const outside = !isSameMonth(day, value);
                  const disabled = isDisabled(day);
                  const selected =
                    props.mode === 'range'
                      ? isSameDay(day, selectedRange.from) ||
                        isSameDay(day, selectedRange.to)
                      : isSameDay(day, props.selected ?? null);
                  const inRange =
                    props.mode === 'range' && isInRange(day, previewRange);
                  const rangeStart = isSameDay(day, previewRange.from);
                  const rangeEnd = isSameDay(day, previewRange.to);
                  const focusable = compareDays(day, focusedDate) === 0;

                  if (outside && !showOutsideDays) {
                    return <div key={day.getTime()} role="gridcell" />;
                  }

                  return (
                    <div
                      key={day.getTime()}
                      role="gridcell"
                      aria-selected={selected || undefined}
                      className={cn(
                        // The tint lives on the cell so neighbouring days join
                        // into one bar; the button keeps its own rounding.
                        inRange && !selected && 'bg-accent',
                        inRange && rangeStart && 'rounded-l-md',
                        inRange && rangeEnd && 'rounded-r-md',
                        selected &&
                          props.mode === 'range' &&
                          previewRange.to &&
                          !isSameDay(previewRange.from, previewRange.to) &&
                          (rangeStart
                            ? 'rounded-l-md bg-accent'
                            : rangeEnd
                              ? 'rounded-r-md bg-accent'
                              : undefined),
                      )}
                    >
                      <button
                        type="button"
                        ref={(node) => {
                          const key = day.getTime();

                          if (node) dayRefs.current.set(key, node);
                          else dayRefs.current.delete(key);
                        }}
                        data-slot="calendar-day"
                        data-today={isSameDay(day, today) || undefined}
                        data-outside={outside || undefined}
                        data-selected={selected || undefined}
                        tabIndex={focusable ? 0 : -1}
                        disabled={disabled}
                        aria-label={formatFullDate(day, locale)}
                        aria-current={
                          isSameDay(day, today) ? 'date' : undefined
                        }
                        className={cn(
                          'flex size-9 items-center justify-center rounded-md text-sm font-normal tabular-nums transition-colors outline-none',
                          'hover:bg-accent hover:text-accent-foreground',
                          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
                          'disabled:pointer-events-none disabled:text-muted-foreground/40 disabled:line-through',
                          outside && 'text-muted-foreground/60',
                          isSameDay(day, today) &&
                            !selected &&
                            'font-semibold text-primary',
                          selected &&
                            'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                        )}
                        onClick={() => {
                          setFocusedDate(day);
                          select(day);
                        }}
                        onFocus={() => setFocusedDate(day)}
                        onMouseEnter={() => setHoveredDate(day)}
                        onKeyDown={(event) => onDayKeyDown(event, day)}
                      >
                        {day.getDate()}
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>

      {footer && <div className="pt-3">{footer}</div>}
    </div>
  );
};

const chunkWeeks = (days: Date[]) =>
  Array.from({ length: days.length / 7 }, (_, index) =>
    days.slice(index * 7, index * 7 + 7),
  );

type CaptionSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  'aria-label': string;
};

/**
 * A native select rather than the `Select` component: it sits inside a popover
 * that the calendar also renders into, and native options never clip.
 */
const CaptionSelect = ({
  value,
  onChange,
  options,
  ...props
}: CaptionSelectProps) => (
  <select
    data-slot="calendar-caption-select"
    value={value}
    onChange={(event) => onChange(event.target.value)}
    className={cn(
      'h-8 rounded-md border border-input bg-background px-2 text-sm font-medium capitalize shadow-xs outline-none',
      'hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring',
    )}
    {...props}
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);
