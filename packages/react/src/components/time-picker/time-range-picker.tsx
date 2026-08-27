import { useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../utils';
import { ClockIcon } from 'lucide-react';

import { useLocale } from '../../lib/config';
import { useFieldDisclosure } from '../../lib/use-field-disclosure';
import { Button } from '../button';
import { DateInputBox, FieldClear, FieldSuffix } from '../date-picker/parts';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from '../popover';
import { TimePanel, type TimePanelProps } from './time-panel';
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
  isTimeAfter,
  resolveTimeFormat,
  toISOTime,
  toTimeString,
} from './utils';

/** A half-open selection: `to` is null while the user is mid-range. */
export type TimeRange = {
  from: Date | null;
  to: Date | null;
};

export type TimeRangePickerProps = Pick<
  TimePanelProps,
  'hourStep' | 'minuteStep' | 'secondStep' | 'min' | 'max' | 'isTimeDisabled'
> & {
  /** Controlled value. Pair with `onChange`. */
  value?: TimeRange | null;
  defaultValue?: TimeRange | null;
  /** Fires on every edit, so `to` is null until the second half is filled. */
  onChange?: (range: TimeRange, timeStrings: [string, string]) => void;
  /** Which segments to show — see `TimeField`. */
  format?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The day both ends are stamped onto. Defaults to each end's own. */
  reference?: Date | null;
  disabled?: boolean;
  readOnly?: boolean;
  clearable?: boolean;
  clearLabel?: string;
  openLabel?: string;
  okText?: ReactNode | false;
  separator?: ReactNode;
  /** Hidden inputs holding `HH:mm:ss`, for a plain form post. */
  fromName?: string;
  toName?: string;
  form?: string;
  id?: string;
  placeholders?: Partial<TimeSegmentLabels>;
  labels?: Partial<TimeSegmentLabels>;
  dayPeriodLabels?: { am?: string; pm?: string };
  invalid?: boolean;
  align?: ComponentProps<typeof PopoverContent>['align'];
  side?: ComponentProps<typeof PopoverContent>['side'];
  className?: string;
  panelClassName?: string;
};

const EMPTY_RANGE: TimeRange = { from: null, to: null };

/**
 * Two time fields and two panels over one `{ from, to }` value.
 *
 * ```tsx
 * <TimeRangePicker value={shift} onChange={setShift} format="HH:mm" />
 * ```
 *
 * Both ends are on screen at once — a panel each, headed by its own label —
 * rather than one panel that swaps between them, so setting a shift takes two
 * clicks with nothing hidden in between. A reversed range — `to` before
 * `from` — is flagged rather than silently swapped, since which end the user
 * meant to change is not knowable here.
 */
export const TimeRangePicker = ({
  value,
  defaultValue,
  onChange,
  format = DEFAULT_TIME_FORMAT,
  open,
  defaultOpen = false,
  onOpenChange,
  reference,
  disabled,
  readOnly,
  clearable = false,
  clearLabel,
  openLabel,
  okText,
  separator = '–',
  fromName,
  toName,
  form,
  id,
  placeholders,
  labels,
  dayPeriodLabels,
  invalid,
  align = 'start',
  side,
  className,
  panelClassName,
  hourStep,
  minuteStep,
  secondStep,
  min,
  max,
  isTimeDisabled,
}: TimeRangePickerProps) => {
  const locale = useLocale();
  const resolved = resolveTimeFormat(format);

  const [internalValue, setInternalValue] = useState<TimeRange>(
    defaultValue ?? EMPTY_RANGE,
  );
  const isControlled = value !== undefined;
  const current = (isControlled ? value : internalValue) ?? EMPTY_RANGE;

  const commit = (range: TimeRange) => {
    if (!isControlled) setInternalValue(range);
    onChange?.(range, [
      range.from ? toTimeString(range.from, resolved) : '',
      range.to ? toTimeString(range.to, resolved) : '',
    ]);
  };

  const partsOptions = {
    reference,
    requireSecond: resolved.showSecond,
  };

  const from = useTimeParts(
    current.from,
    (time) => commit({ from: time, to: current.to }),
    partsOptions,
  );
  const to = useTimeParts(
    current.to,
    (time) => commit({ from: current.from, to: time }),
    partsOptions,
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
    !!current.from && !!current.to && isTimeAfter(current.from, current.to);
  const outOfBounds =
    isTimeOutOfBounds(current.from, min, max) ||
    isTimeOutOfBounds(current.to, min, max);
  const filled = hasAnyTimePart(from.parts) || hasAnyTimePart(to.parts);
  const showClear = clearable && !disabled && !readOnly && filled;

  const clear = () => {
    from.setParts(EMPTY_TIME_PARTS);
    to.setParts(EMPTY_TIME_PARTS);
    commit(EMPTY_RANGE);
  };

  const segmentProps = {
    format: resolved,
    hourStep,
    minuteStep,
    secondStep,
    disabled,
    readOnly,
    placeholders,
    labels,
    dayPeriodLabels,
  };

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
          data-slot="time-range-picker"
          className={cn('w-full', className)}
          {...disclosure.fieldProps}
        >
          <DateInputBox
            disabled={disabled}
            invalid={invalid || reversed || outOfBounds}
            suffix={
              <FieldSuffix
                clear={
                  showClear && (
                    <FieldClear
                      label={
                        clearLabel ??
                        locale.timePicker?.clearRange ??
                        'Clear range'
                      }
                      onClear={clear}
                    />
                  )
                }
              >
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={
                      openLabel ??
                      locale.timePicker?.openPanel ??
                      'Open time panel'
                    }
                    {...disclosure.toggleProps}
                    disabled={disabled}
                    className="text-muted-foreground"
                  >
                    <ClockIcon />
                  </Button>
                </PopoverTrigger>
              </FieldSuffix>
            }
          >
            <TimeSegments
              {...segmentProps}
              id={id}
              parts={from.parts}
              onPartsChange={from.update}
            />

            <span aria-hidden="true" className="px-2 text-muted-foreground">
              {separator}
            </span>

            <TimeSegments
              {...segmentProps}
              parts={to.parts}
              onPartsChange={to.update}
            />

            {fromName && (
              <input
                type="hidden"
                name={fromName}
                form={form}
                value={
                  current.from
                    ? toISOTime(current.from, resolved.showSecond)
                    : ''
                }
              />
            )}
            {toName && (
              <input
                type="hidden"
                name={toName}
                form={form}
                value={
                  current.to ? toISOTime(current.to, resolved.showSecond) : ''
                }
              />
            )}
          </DateInputBox>
        </div>
      </PopoverAnchor>

      <PopoverContent
        align={align}
        side={side}
        className={cn('w-auto p-0', panelClassName)}
        {...disclosure.contentProps}
      >
        <div className="flex divide-x divide-border">
          {(['from', 'to'] as const).map((end) => (
            <div key={end} className="flex flex-col">
              <span className="border-b border-border px-3 py-1.5 text-xs font-medium text-muted-foreground">
                {end === 'from'
                  ? (locale.timePicker?.startTime ?? 'Start')
                  : (locale.timePicker?.endTime ?? 'End')}
              </span>

              <TimePanel
                {...panelProps}
                value={current[end]}
                onChange={(time) => commit({ ...current, [end]: time })}
              />
            </div>
          ))}
        </div>

        {okText !== false && (
          <div className="flex justify-end border-t border-border px-2 py-1.5">
            <Button type="button" size="sm" onClick={() => setOpen(false)}>
              {okText ?? locale.common?.ok ?? 'OK'}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
