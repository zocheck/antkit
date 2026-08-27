import { useState } from 'react';
import type { ReactNode } from 'react';

import { cn } from '../../utils';
import { XIcon } from 'lucide-react';

import { Button } from '../button';
import { DateInputBox } from '../date-picker/parts';
import {
  EMPTY_TIME_PARTS,
  TimeSegments,
  hasAnyTimePart,
  isTimeOutOfBounds,
  useTimeParts,
  type TimeSegmentLabels,
} from './parts';
import {
  DEFAULT_TIME_FORMAT,
  fromTimeParts,
  resolveTimeFormat,
  toISOTime,
} from './utils';

export type TimeFieldProps = {
  /** Controlled value. Pair with `onChange`. */
  value?: Date | null;
  defaultValue?: Date | null;
  /** Fires with `null` while the typed time is still incomplete. */
  onChange?: (time: Date | null) => void;
  /**
   * Which segments to show, antd-style: `HH:mm:ss`, `HH:mm`, `hh:mm A`.
   * A lowercase `h` or an `A` switches the field to 12-hour.
   */
  format?: string;
  /** Arrow-key increments, matching the popover columns of `TimePicker`. */
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  /** Flags the field invalid when the typed time falls outside. Time-of-day
   * only — the date halves of `min`/`max` are ignored. */
  min?: Date;
  max?: Date;
  /** The day a completed time is stamped onto. Defaults to the value's own. */
  reference?: Date | null;
  disabled?: boolean;
  readOnly?: boolean;
  /** Adds a clear button once something is typed. */
  clearable?: boolean;
  clearLabel?: string;
  /** Submitted as `HH:mm:ss` by a hidden input. */
  name?: string;
  form?: string;
  required?: boolean;
  id?: string;
  placeholders?: Partial<TimeSegmentLabels>;
  labels?: Partial<TimeSegmentLabels>;
  dayPeriodLabels?: { am?: string; pm?: string };
  invalid?: boolean;
  'aria-describedby'?: string;
  /** Rendered inside the box, after the clear button. */
  suffix?: ReactNode;
  className?: string;
};

/**
 * A typed time, one segment at a time — no popover, no free-text parsing.
 *
 * ```tsx
 * <TimeField value={time} onChange={setTime} format="HH:mm" clearable />
 * ```
 *
 * Arrow keys step a segment by its `*Step`, digits fill it and move on,
 * Backspace empties it. On a 12-hour field `A` and `P` set the day period.
 *
 * Use `TimePicker` when it should also open a list of times.
 */
export const TimeField = ({
  value,
  defaultValue,
  onChange,
  format = DEFAULT_TIME_FORMAT,
  hourStep,
  minuteStep,
  secondStep,
  min,
  max,
  reference,
  disabled,
  readOnly,
  clearable = false,
  clearLabel = 'Clear time',
  name,
  form,
  required,
  id,
  placeholders,
  labels,
  dayPeriodLabels,
  invalid,
  suffix,
  className,
  ...props
}: TimeFieldProps) => {
  const resolved = resolveTimeFormat(format);

  const [internal, setInternal] = useState<Date | null>(defaultValue ?? null);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const emit = (time: Date | null) => {
    if (!isControlled) setInternal(time);
    onChange?.(time);
  };

  const { parts, update } = useTimeParts(current, emit, {
    reference,
    requireSecond: resolved.showSecond,
  });

  const typed = fromTimeParts(parts, {
    reference: current ?? reference,
    requireSecond: resolved.showSecond,
  });
  const outOfBounds = isTimeOutOfBounds(typed, min, max);
  // An incomplete entry is only wrong once the user has started: an untouched
  // field is empty, not invalid.
  const incomplete = !typed && hasAnyTimePart(parts);
  const showClear =
    clearable && !disabled && !readOnly && hasAnyTimePart(parts);

  return (
    <DateInputBox
      data-slot="time-field"
      disabled={disabled}
      invalid={invalid || outOfBounds || incomplete}
      className={className}
      aria-describedby={props['aria-describedby']}
      suffix={
        (showClear || suffix) && (
          <>
            {showClear && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={clearLabel}
                className="text-muted-foreground"
                onClick={() => update(EMPTY_TIME_PARTS)}
              >
                <XIcon />
              </Button>
            )}
            {suffix}
          </>
        )
      }
    >
      <TimeSegments
        id={id}
        parts={parts}
        onPartsChange={update}
        format={resolved}
        hourStep={hourStep}
        minuteStep={minuteStep}
        secondStep={secondStep}
        disabled={disabled}
        readOnly={readOnly}
        placeholders={placeholders}
        labels={labels}
        dayPeriodLabels={dayPeriodLabels}
        className={cn(disabled && 'pointer-events-none')}
      />
      {name && (
        <input
          type="hidden"
          name={name}
          form={form}
          required={required}
          value={typed ? toISOTime(typed, resolved.showSecond) : ''}
        />
      )}
    </DateInputBox>
  );
};
