import { useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../utils';
import { CalendarIcon } from 'lucide-react';

import { useLocale } from '../../lib/config';

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
import { DateField, type DateFieldProps } from './date-field';

export type DatePickerProps = Omit<DateFieldProps, 'suffix' | 'className'> &
  Pick<
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
  > & {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** Closes the calendar once a day is picked. */
    closeOnSelect?: boolean;
    calendarLabels?: Partial<CalendarLabels>;
    openLabel?: string;
    align?: ComponentProps<typeof PopoverContent>['align'];
    side?: ComponentProps<typeof PopoverContent>['side'];
    /** Rendered between the field and the calendar button. */
    prefix?: ReactNode;
    className?: string;
    calendarClassName?: string;
  };

/**
 * A date field with a calendar attached.
 *
 * ```tsx
 * <DatePicker value={date} onChange={setDate} min={new Date()} clearable />
 * ```
 *
 * Both halves edit the same value: type into the segments, or open the
 * calendar and click. The popover anchors to the whole field rather than to
 * the button, so it lines up with the text under it.
 */
export const DatePicker = ({
  value,
  defaultValue,
  onChange,
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnSelect = true,
  numberOfMonths,
  isDateDisabled,
  weekStartsOn,
  showOutsideDays,
  captionLayout,
  fromYear,
  toYear,
  today,
  footer,
  calendarLabels,
  openLabel,
  align = 'start',
  side,
  prefix,
  className,
  calendarClassName,
  min,
  max,
  locale,
  disabled,
  readOnly,
  ...fieldProps
}: DatePickerProps) => {
  const strings = useLocale();
  const [internalValue, setInternalValue] = useState<Date | null>(
    defaultValue ?? null,
  );
  const isControlled = value !== undefined;
  const current = isControlled ? value : internalValue;

  const commit = (date: Date | null) => {
    if (!isControlled) setInternalValue(date);
    onChange?.(date);
  };

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

  return (
    <Popover open={isOpen} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div
          data-slot="date-picker"
          className={cn('w-full', className)}
          {...disclosure.fieldProps}
        >
          <DateField
            {...fieldProps}
            value={current}
            onChange={commit}
            locale={locale}
            min={min}
            max={max}
            disabled={disabled}
            readOnly={readOnly}
            suffix={
              <>
                {prefix}
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={
                      openLabel ??
                      strings.datePicker?.openCalendar ??
                      'Open calendar'
                    }
                    {...disclosure.toggleProps}
                    disabled={disabled}
                    className="text-muted-foreground"
                  >
                    <CalendarIcon />
                  </Button>
                </PopoverTrigger>
              </>
            }
          />
        </div>
      </PopoverAnchor>

      <PopoverContent
        align={align}
        side={side}
        className={cn('w-auto p-0', calendarClassName)}
        {...disclosure.contentProps}
      >
        <Calendar
          autoFocus={disclosure.autoFocusPanel}
          selected={current}
          defaultMonth={current ?? undefined}
          onSelect={(date) => {
            commit(date);
            if (closeOnSelect) setOpen(false);
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
