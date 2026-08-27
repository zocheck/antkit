import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

import { cn } from '../../utils';

import {
  DEFAULT_DAY_PERIOD_LABELS,
  DEFAULT_TIME_SEGMENT_LABELS,
  type TimeSegmentLabels,
} from './parts';
import {
  buildTimeOptions,
  from12Hour,
  isPm,
  pad2,
  to12Hour,
  withTime,
  type TimeFormat,
  type TimeSegmentType,
} from './utils';

type ColumnOption = {
  value: number;
  label: string;
  disabled?: boolean;
};

type TimeColumnProps = {
  label: string;
  options: ColumnOption[];
  selected: number | null;
  onSelect: (value: number) => void;
};

const TimeColumn = ({
  label,
  options,
  selected,
  onSelect,
}: TimeColumnProps) => {
  const activeRef = useRef<HTMLButtonElement | null>(null);

  // The panel unmounts with its popover, so this also runs on every re-open.
  // `block: 'nearest'` keeps the popover itself still — `center` would scroll
  // the whole page on a picker near the bottom of the viewport.
  useEffect(() => {
    if (selected === null) return;

    activeRef.current?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  return (
    <div
      role="listbox"
      aria-label={label}
      data-slot="time-column"
      className="flex h-56 w-14 flex-col overflow-y-auto scroll-py-1 border-r border-border p-1 last:border-r-0"
    >
      {options.map((option) => {
        const active = option.value === selected;

        return (
          <button
            key={option.value}
            ref={active ? activeRef : undefined}
            type="button"
            role="option"
            aria-selected={active}
            disabled={option.disabled}
            className={cn(
              'flex h-8 shrink-0 items-center justify-center rounded-md text-sm tabular-nums transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden',
              'disabled:pointer-events-none disabled:opacity-40',
              active && 'bg-primary font-medium text-primary-foreground',
            )}
            onClick={() => onSelect(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export type TimePanelProps = {
  value: Date | null;
  onChange: (time: Date) => void;
  format: TimeFormat;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  /** Time-of-day bounds; the date halves are ignored. */
  min?: Date;
  max?: Date;
  /** Greys out individual cells, one segment at a time. */
  isTimeDisabled?: (value: number, segment: TimeSegmentType) => boolean;
  /** The day a picked time is stamped onto when there is no value yet. */
  reference?: Date | null;
  labels?: Partial<TimeSegmentLabels>;
  dayPeriodLabels?: { am?: string; pm?: string };
  footer?: ReactNode;
  className?: string;
};

/**
 * The scrolling hour / minute / second columns, without a field attached.
 *
 * Useful inline — inside a `Popover` of your own, or under a `Calendar` to
 * build a date-and-time picker. `TimePicker` is this plus a `TimeField`.
 */
export const TimePanel = ({
  value,
  onChange,
  format,
  hourStep = 1,
  minuteStep = 1,
  secondStep = 1,
  min,
  max,
  isTimeDisabled,
  reference,
  labels,
  dayPeriodLabels,
  footer,
  className,
}: TimePanelProps) => {
  const label = { ...DEFAULT_TIME_SEGMENT_LABELS, ...labels };
  const period = { ...DEFAULT_DAY_PERIOD_LABELS, ...dayPeriodLabels };
  const { showHour, showMinute, showSecond, use12Hours } = format;

  const hour = value?.getHours() ?? null;
  const minute = value?.getMinutes() ?? null;
  const second = value?.getSeconds() ?? null;

  /**
   * Applies one segment to the value. An empty picker starts from midnight
   * rather than from "now", so clicking `30` twice always gives the same time.
   */
  const commit = (patch: { hour?: number; minute?: number; second?: number }) =>
    onChange(
      withTime(value ?? reference, {
        hour: patch.hour ?? hour ?? 0,
        minute: patch.minute ?? minute ?? 0,
        second: patch.second ?? second ?? 0,
      }),
    );

  /**
   * Whether a cell falls outside `min`/`max`, judged one segment at a time.
   *
   * A whole hour is only out of bounds when no minute inside it would work, so
   * with `min` at 09:30 the 9 stays pickable and only its minutes below 30 go
   * grey — the same coarse-to-fine narrowing, one segment at a time.
   */
  const outOfBounds = (segment: TimeSegmentType, next: number) => {
    if (segment === 'dayPeriod') return false;

    const currentHour = segment === 'hour' ? next : (hour ?? 0);
    const currentMinute = segment === 'minute' ? next : (minute ?? 0);

    const below = (edge: Date) => {
      if (segment === 'hour') return next < edge.getHours();
      if (currentHour !== edge.getHours()) return false;
      if (segment === 'minute') return next < edge.getMinutes();

      return currentMinute === edge.getMinutes() && next < edge.getSeconds();
    };

    const above = (edge: Date) => {
      if (segment === 'hour') return next > edge.getHours();
      if (currentHour !== edge.getHours()) return false;
      if (segment === 'minute') return next > edge.getMinutes();

      return currentMinute === edge.getMinutes() && next > edge.getSeconds();
    };

    return (!!min && below(min)) || (!!max && above(max));
  };

  const toOptions = (
    segment: Exclude<TimeSegmentType, 'dayPeriod'>,
    step: number,
  ): ColumnOption[] =>
    buildTimeOptions(segment, step, segment === 'hour' && use12Hours).map(
      (option) => {
        // Hour cells read 1–12 on a 12-hour panel but still select a 0–23 hour.
        const real =
          segment === 'hour' && use12Hours
            ? from12Hour(option, hour !== null && isPm(hour))
            : option;

        return {
          value: real,
          label: pad2(option),
          disabled:
            outOfBounds(segment, real) || isTimeDisabled?.(real, segment),
        };
      },
    );

  return (
    <div data-slot="time-panel" className={cn('flex flex-col', className)}>
      <div className="flex">
        {showHour && (
          <TimeColumn
            label={label.hour}
            options={toOptions('hour', hourStep)}
            selected={hour}
            onSelect={(next) => commit({ hour: next })}
          />
        )}

        {showMinute && (
          <TimeColumn
            label={label.minute}
            options={toOptions('minute', minuteStep)}
            selected={minute}
            onSelect={(next) => commit({ minute: next })}
          />
        )}

        {showSecond && (
          <TimeColumn
            label={label.second}
            options={toOptions('second', secondStep)}
            selected={second}
            onSelect={(next) => commit({ second: next })}
          />
        )}

        {use12Hours && (
          <TimeColumn
            label={label.dayPeriod}
            options={[
              { value: 0, label: period.am },
              { value: 1, label: period.pm },
            ]}
            selected={hour === null ? null : isPm(hour) ? 1 : 0}
            onSelect={(next) =>
              commit({ hour: from12Hour(to12Hour(hour ?? 0), next === 1) })
            }
          />
        )}
      </div>

      {footer}
    </div>
  );
};
