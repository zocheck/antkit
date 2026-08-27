import { useState } from 'react';
import type { ReactNode } from 'react';

import { cn } from '../../utils';
import { XIcon } from 'lucide-react';

import { Button } from '../button';
import {
  DateInputBox,
  DateSegments,
  EMPTY_PARTS,
  hasAnyPart,
  isOutOfBounds,
  useDateParts,
  type DateSegmentLabels,
} from './parts';
import { fromParts, toISODate } from './utils';

export type DateFieldProps = {
  /** Controlled value. Pair with `onChange`. */
  value?: Date | null;
  defaultValue?: Date | null;
  /** Fires with `null` while the typed date is incomplete or impossible. */
  onChange?: (date: Date | null) => void;
  locale?: string;
  /** Flags the field invalid when the typed date falls outside. */
  min?: Date;
  max?: Date;
  disabled?: boolean;
  readOnly?: boolean;
  /** Adds a clear button once something is typed. */
  clearable?: boolean;
  clearLabel?: string;
  /** Submitted as `YYYY-MM-DD` by a hidden input. */
  name?: string;
  form?: string;
  required?: boolean;
  id?: string;
  placeholders?: Partial<DateSegmentLabels>;
  labels?: Partial<DateSegmentLabels>;
  invalid?: boolean;
  'aria-describedby'?: string;
  /** Rendered inside the box, after the clear button. */
  suffix?: ReactNode;
  className?: string;
};

/**
 * A typed date, one segment at a time — no calendar, no free-text parsing.
 *
 * ```tsx
 * <DateField value={date} onChange={setDate} min={new Date()} clearable />
 * ```
 *
 * Segments come from the locale, so `dd/mm/yyyy` in Vietnamese and
 * `mm/dd/yyyy` in `en-US` without the caller formatting anything. Arrow keys
 * step a segment, digits fill it and move on, Backspace empties it.
 *
 * Use `DatePicker` when it should also open a calendar.
 */
export const DateField = ({
  value,
  defaultValue,
  onChange,
  locale,
  min,
  max,
  disabled,
  readOnly,
  clearable = false,
  clearLabel = 'Clear date',
  name,
  form,
  required,
  id,
  placeholders,
  labels,
  invalid,
  suffix,
  className,
  ...props
}: DateFieldProps) => {
  const [internal, setInternal] = useState<Date | null>(defaultValue ?? null);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const emit = (date: Date | null) => {
    if (!isControlled) setInternal(date);
    onChange?.(date);
  };

  const { parts, update } = useDateParts(current, emit);
  const typed = fromParts(parts);
  const outOfBounds = isOutOfBounds(typed, min, max);
  // An incomplete entry is only wrong once the user has started: an untouched
  // field is empty, not invalid.
  const incomplete = !typed && hasAnyPart(parts);
  const showClear = clearable && !disabled && !readOnly && hasAnyPart(parts);

  return (
    <DateInputBox
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
                onClick={() => update(EMPTY_PARTS)}
              >
                <XIcon />
              </Button>
            )}
            {suffix}
          </>
        )
      }
    >
      <DateSegments
        id={id}
        parts={parts}
        onPartsChange={update}
        locale={locale}
        disabled={disabled}
        readOnly={readOnly}
        placeholders={placeholders}
        labels={labels}
        className={cn(disabled && 'pointer-events-none')}
      />
      {name && (
        <input
          type="hidden"
          name={name}
          form={form}
          required={required}
          value={typed ? toISODate(typed) : ''}
        />
      )}
    </DateInputBox>
  );
};
