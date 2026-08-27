import { useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../utils';
import { ClockIcon } from 'lucide-react';

import { useUiConfig } from '../../lib/ui-config';
import { useFieldDisclosure } from '../../lib/use-field-disclosure';
import { Button } from '../button';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from '../popover';
import { TimeField, type TimeFieldProps } from './time-field';
import { TimePanel, type TimePanelProps } from './time-panel';
import { DEFAULT_TIME_FORMAT, resolveTimeFormat, toTimeString } from './utils';

export type TimePickerProps = Omit<
  TimeFieldProps,
  'suffix' | 'className' | 'onChange'
> &
  Pick<TimePanelProps, 'isTimeDisabled'> & {
    /** Fires with the `Date` and the string the `format` prints. */
    onChange?: (time: Date | null, timeString: string) => void;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** Shortcut to the current time in the panel footer. */
    showNow?: boolean;
    nowText?: ReactNode;
    /** The button that closes the panel. `false` drops the footer's right half. */
    okText?: ReactNode | false;
    openLabel?: string;
    align?: ComponentProps<typeof PopoverContent>['align'];
    side?: ComponentProps<typeof PopoverContent>['side'];
    /** Rendered between the field and the clock button. */
    prefix?: ReactNode;
    className?: string;
    panelClassName?: string;
  };

/**
 * A time field with a list of times attached.
 *
 * ```tsx
 * <TimePicker value={time} onChange={setTime} format="HH:mm" minuteStep={15} />
 * ```
 *
 * Both halves edit the same value: type into the segments, or open the panel
 * and click down the columns. Each click commits — unlike antd, `OK` only
 * closes the panel, so a picked time is never lost by clicking away.
 *
 * The date half of the value is preserved, which is what lets this sit beside
 * a `DatePicker` over one `Date` without either of them fighting the other.
 */
export const TimePicker = ({
  value,
  defaultValue,
  onChange,
  format = DEFAULT_TIME_FORMAT,
  open,
  defaultOpen = false,
  onOpenChange,
  showNow = true,
  nowText,
  okText,
  openLabel = 'Open time panel',
  align = 'start',
  side,
  prefix,
  className,
  panelClassName,
  hourStep,
  minuteStep,
  secondStep,
  min,
  max,
  isTimeDisabled,
  reference,
  disabled,
  readOnly,
  labels,
  dayPeriodLabels,
  ...fieldProps
}: TimePickerProps) => {
  const { translate } = useUiConfig();
  const resolved = resolveTimeFormat(format);

  const [internalValue, setInternalValue] = useState<Date | null>(
    defaultValue ?? null,
  );
  const isControlled = value !== undefined;
  const current = isControlled ? value : internalValue;

  const commit = (time: Date | null) => {
    if (!isControlled) setInternalValue(time);
    onChange?.(time, time ? toTimeString(time, resolved) : '');
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

  const panelProps = {
    format: resolved,
    hourStep,
    minuteStep,
    secondStep,
    min,
    max,
    isTimeDisabled,
    reference,
    labels,
    dayPeriodLabels,
  };

  return (
    <Popover open={isOpen} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div
          data-slot="time-picker"
          className={cn('w-full', className)}
          {...disclosure.fieldProps}
        >
          <TimeField
            {...fieldProps}
            value={current}
            onChange={commit}
            format={format}
            hourStep={hourStep}
            minuteStep={minuteStep}
            secondStep={secondStep}
            min={min}
            max={max}
            reference={reference}
            disabled={disabled}
            readOnly={readOnly}
            labels={labels}
            dayPeriodLabels={dayPeriodLabels}
            suffix={
              <>
                {prefix}
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={openLabel}
                    disabled={disabled}
                    className="text-muted-foreground"
                    {...disclosure.toggleProps}
                  >
                    <ClockIcon />
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
        className={cn('w-auto p-0', panelClassName)}
        {...disclosure.contentProps}
      >
        <TimePanel
          {...panelProps}
          value={current ?? null}
          onChange={commit}
          footer={
            (showNow || okText !== false) && (
              <div className="flex items-center justify-between gap-2 border-t border-border px-2 py-1.5">
                {showNow ? (
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="px-0"
                    onClick={() => commit(new Date())}
                  >
                    {nowText ?? translate('now')}
                  </Button>
                ) : (
                  <span />
                )}

                {okText !== false && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setOpen(false)}
                  >
                    {okText ?? translate('ok')}
                  </Button>
                )}
              </div>
            )
          }
        />
      </PopoverContent>
    </Popover>
  );
};
