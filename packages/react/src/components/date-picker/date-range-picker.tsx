import { useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../utils';
import { CalendarIcon, XIcon } from 'lucide-react';

import { useFieldDisclosure } from '../../lib/use-field-disclosure';
import { Button } from '../button';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from '../popover';
import {
  Calendar,
  type CalendarBaseProps,
  type CalendarLabels,
} from './calendar';
import {
  DateInputBox,
  DateSegments,
  EMPTY_PARTS,
  hasAnyPart,
  isOutOfBounds,
  useDateParts,
  type DateSegmentLabels,
} from './parts';
import { isAfterDay, toISODate, type DateRange } from './utils';

export type DateRangePreset = {
  label: ReactNode;
  value: DateRange;
};

export type DateRangePickerProps = Pick<
  CalendarBaseProps,
  | 'numberOfMonths'
  | 'isDateDisabled'
  | 'weekStartsOn'
  | 'showOutsideDays'
  | 'captionLayout'
  | 'fromYear'
  | 'toYear'
  | 'today'
  | 'footer'
  | 'min'
  | 'max'
  | 'locale'
> & {
  /** Controlled value. Pair with `onChange`. */
  value?: DateRange | null;
  defaultValue?: DateRange | null;
  /** Fires on every click, so `to` is null between the two ends of a range. */
  onChange?: (range: DateRange) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Closes the calendar once both ends are set. */
  closeOnSelect?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  clearable?: boolean;
  clearLabel?: string;
  openLabel?: string;
  /** Shortcut ranges listed beside the calendar. */
  presets?: DateRangePreset[];
  separator?: ReactNode;
  /** Hidden inputs holding `YYYY-MM-DD`, for a plain form post. */
  fromName?: string;
  toName?: string;
  form?: string;
  id?: string;
  placeholders?: Partial<DateSegmentLabels>;
  labels?: Partial<DateSegmentLabels>;
  calendarLabels?: Partial<CalendarLabels>;
  invalid?: boolean;
  align?: ComponentProps<typeof PopoverContent>['align'];
  side?: ComponentProps<typeof PopoverContent>['side'];
  className?: string;
  calendarClassName?: string;
};

const EMPTY_RANGE: DateRange = { from: null, to: null };

/**
 * Two date fields and a range calendar over one `{ from, to }` value.
 *
 * ```tsx
 * <DateRangePicker
 *   value={range}
 *   onChange={setRange}
 *   presets={[{ label: '7 ngày qua', value: last7Days }]}
 * />
 * ```
 *
 * `onChange` fires on the first click too, with `to` still null — that is what
 * lets the calendar paint the range as the user sweeps across it. Wait for
 * both ends before querying anything.
 */
export const DateRangePicker = ({
  value,
  defaultValue,
  onChange,
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnSelect = true,
  disabled,
  readOnly,
  clearable = false,
  clearLabel = 'Clear range',
  openLabel = 'Open calendar',
  presets,
  separator = '–',
  fromName,
  toName,
  form,
  id,
  placeholders,
  labels,
  calendarLabels,
  invalid,
  align = 'start',
  side,
  className,
  calendarClassName,
  numberOfMonths = 2,
  isDateDisabled,
  weekStartsOn,
  showOutsideDays,
  captionLayout,
  fromYear,
  toYear,
  today,
  footer,
  min,
  max,
  locale,
}: DateRangePickerProps) => {
  const [internalValue, setInternalValue] = useState<DateRange>(
    defaultValue ?? EMPTY_RANGE,
  );
  const isControlled = value !== undefined;
  const current = (isControlled ? value : internalValue) ?? EMPTY_RANGE;

  const commit = (range: DateRange) => {
    if (!isControlled) setInternalValue(range);
    onChange?.(range);
  };

  const from = useDateParts(current.from, (date) =>
    commit({ from: date, to: current.to }),
  );
  const to = useDateParts(current.to, (date) =>
    commit({ from: current.from, to: date }),
  );

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpenControlled = open !== undefined;
  const isOpen = isOpenControlled ? open : internalOpen;

  const setOpen = (next: boolean) => {
    if (!isOpenControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const disclosure = useFieldDisclosure({
    open: isOpen,
    setOpen,
    disabled,
    readOnly,
  });

  const reversed =
    !!current.from && !!current.to && isAfterDay(current.from, current.to);
  const outOfBounds =
    isOutOfBounds(current.from, min, max) ||
    isOutOfBounds(current.to, min, max);
  const filled = hasAnyPart(from.parts) || hasAnyPart(to.parts);
  const showClear = clearable && !disabled && !readOnly && filled;

  const clear = () => {
    from.setParts(EMPTY_PARTS);
    to.setParts(EMPTY_PARTS);
    commit(EMPTY_RANGE);
  };

  const segmentProps = {
    locale,
    disabled,
    readOnly,
    placeholders,
    labels,
  };

  return (
    <Popover open={isOpen} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div
          data-slot="date-range-picker"
          className={cn('w-full', className)}
          {...disclosure.fieldProps}
        >
          <DateInputBox
            disabled={disabled}
            invalid={invalid || reversed || outOfBounds}
            suffix={
              <>
                {showClear && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={clearLabel}
                    className="text-muted-foreground"
                    onClick={clear}
                  >
                    <XIcon />
                  </Button>
                )}
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={openLabel}
                    {...disclosure.toggleProps}
                    disabled={disabled}
                    className="text-muted-foreground"
                  >
                    <CalendarIcon />
                  </Button>
                </PopoverTrigger>
              </>
            }
          >
            <DateSegments
              {...segmentProps}
              id={id}
              parts={from.parts}
              onPartsChange={from.update}
            />
            <span aria-hidden="true" className="px-2 text-muted-foreground">
              {separator}
            </span>
            <DateSegments
              {...segmentProps}
              parts={to.parts}
              onPartsChange={to.update}
            />
            {fromName && (
              <input
                type="hidden"
                name={fromName}
                form={form}
                value={current.from ? toISODate(current.from) : ''}
              />
            )}
            {toName && (
              <input
                type="hidden"
                name={toName}
                form={form}
                value={current.to ? toISODate(current.to) : ''}
              />
            )}
          </DateInputBox>
        </div>
      </PopoverAnchor>

      <PopoverContent
        align={align}
        side={side}
        className={cn('flex w-auto p-0', calendarClassName)}
        {...disclosure.contentProps}
      >
        {presets && presets.length > 0 && (
          <div className="flex w-40 flex-col gap-1 border-r border-border p-2">
            {presets.map((preset, index) => (
              <Button
                key={index}
                type="button"
                variant="ghost"
                size="sm"
                className="justify-start font-normal"
                onClick={() => {
                  commit(preset.value);
                  if (closeOnSelect) setOpen(false);
                }}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        )}

        <Calendar
          autoFocus={disclosure.autoFocusPanel}
          mode="range"
          selected={current}
          defaultMonth={current.from ?? undefined}
          onSelect={(range) => {
            commit(range);
            if (closeOnSelect && range.from && range.to) setOpen(false);
          }}
          min={min}
          max={max}
          locale={locale}
          numberOfMonths={numberOfMonths}
          isDateDisabled={isDateDisabled}
          weekStartsOn={weekStartsOn}
          showOutsideDays={showOutsideDays}
          captionLayout={captionLayout}
          fromYear={fromYear}
          toYear={toYear}
          today={today}
          footer={footer}
          labels={calendarLabels}
        />
      </PopoverContent>
    </Popover>
  );
};
