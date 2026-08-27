import { useState } from 'react';

import { Label, TimeField, TimePicker, TimeRangePicker } from '@antkit/react';
import type { TimeRange } from '@antkit/react';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: ['TimeField', 'TimePicker', 'TimeRangePicker'],
  extraImports: ["import type { TimeRange } from '@antkit/react';"],
  api: [
    {
      title: 'TimeField',
      description: 'A time typed segment by segment, with no picker panel.',
      props: [
        {
          name: 'value',
          type: 'Date | null',
          description: 'The controlled value.',
        },
        {
          name: 'onChange',
          type: '(time: Date | null) => void',
          description: 'Reports `null` while the time is still half-typed.',
        },
        {
          name: 'format',
          type: 'string',
          default: "'HH:mm'",
          description:
            'A format string: `HH:mm:ss`, `HH:mm`, `hh:mm A`. A lowercase `h` or an `A` puts the field into 12-hour mode.',
        },
        {
          name: 'hourStep / minuteStep / secondStep',
          type: 'number',
          default: '1',
          description:
            'The step the arrow keys take, matching the columns in the `TimePicker` popover.',
        },
        {
          name: 'min / max',
          type: 'Date',
          description:
            'Only the time of day matters — the date part of `min`/`max` is ignored.',
        },
        {
          name: 'reference',
          type: 'Date | null',
          description:
            'The date the entered time is stamped onto. It defaults to the date of the value itself.',
        },
        {
          name: 'clearable',
          type: 'boolean',
          default: 'false',
          description:
            'The clear button. It occupies the same slot as the calendar or clock icon and only appears on hover — the icon steps aside, so the field never changes width and the row never has two buttons competing. The panel still opens by clicking the text.',
        },
        {
          name: 'name',
          type: 'string',
          description: 'Submits as `HH:mm:ss` through a hidden input.',
        },
        {
          name: 'disabled / readOnly / invalid',
          type: 'boolean',
          description: 'The field states.',
        },
      ],
    },
    {
      title: 'TimePicker',
      description: 'TimeField plus a column picker for the time.',
      props: [
        {
          name: 'onChange',
          type: '(time: Date | null, timeString: string) => void',
          description:
            'Receives both the `Date` and the string `format` printed — no need to format it again.',
        },
        {
          name: 'isTimeDisabled',
          type: "(value: number, segment: 'hour' | 'minute' | 'second') => boolean",
          description:
            'Dims individual cells in the panel, one segment at a time.',
        },
        {
          name: 'showNow',
          type: 'boolean',
          default: 'true',
          description: 'The "Now" button in the panel footer.',
        },
        {
          name: 'okText',
          type: 'ReactNode | false',
          description:
            'The button that closes the panel. Set `false` to drop the right half of the footer entirely.',
        },
        {
          name: 'open / defaultOpen / onOpenChange',
          type: 'boolean | (open: boolean) => void',
          description: 'Controls the open state.',
        },
        {
          name: 'align / side',
          type: "'start' | 'center' | 'end' | 'top' | 'bottom' | …",
          description: 'Where the popover sits.',
        },
      ],
    },
    {
      title: 'TimeRangePicker',
      props: [
        {
          name: 'value',
          type: 'TimeRange | null',
          description: '`{ from, to }`, where either end may be `null`.',
        },
        {
          name: 'onChange',
          type: '(range: TimeRange, timeStrings: [string, string]) => void',
          description:
            'Reports on every edit, so `to` stays `null` until both ends are set.',
        },
        {
          name: 'reference',
          type: 'Date | null',
          description: 'The date both ends are stamped onto.',
        },
      ],
    },
  ],
};

/**
 * TimePicker
 */
export const Basic = () => {
  const [time, setTime] = useState<Date | null>(null);

  return (
    <div className="grid w-full max-w-40 gap-2">
      <Label>Shift start</Label>
      <TimePicker value={time} onChange={setTime} clearable />
    </div>
  );
};

/**
 * TimeField — typing only
 */
export const Field = () => (
  <div className="grid w-full max-w-40 gap-2">
    <Label>Start time</Label>
    <TimeField clearable />
  </div>
);

/**
 * Formats
 *
 * The `format` string decides which segments appear. A lowercase `h` or an `A`
 * switches to 12-hour mode.
 */
export const Formats = () => (
  <div className="grid w-full max-w-40 gap-2">
    <TimePicker format="HH:mm" defaultValue={new Date(2026, 0, 1, 8, 30)} />
    <TimePicker format="HH:mm:ss" defaultValue={new Date(2026, 0, 1, 8, 30)} />
    <TimePicker format="hh:mm A" defaultValue={new Date(2026, 0, 1, 20, 15)} />
  </div>
);

/**
 * Steps
 *
 * `minuteStep` shortens the minutes column — quarter-hour steps are enough for
 * timetables and appointments, and cut the scrolling right down.
 */
export const Steps = () => (
  <TimePicker
    className="max-w-40"
    format="HH:mm"
    minuteStep={15}
    defaultValue={new Date(2026, 0, 1, 9, 0)}
  />
);

/**
 * Bounding the time
 *
 * `min` and `max` look only at the time of day; `isTimeDisabled` blocks
 * individual values on top.
 */
export const Limits = () => (
  <div className="grid w-full max-w-40 gap-2">
    <TimePicker
      format="HH:mm"
      minuteStep={30}
      min={new Date(2026, 0, 1, 7, 0)}
      max={new Date(2026, 0, 1, 21, 0)}
      isTimeDisabled={(value, segment) => segment === 'hour' && value === 12}
    />
    <p className="text-xs text-muted-foreground">
      07:00 – 21:00, excluding the lunch hour.
    </p>
  </div>
);

/**
 * A time range
 */
export const Range = () => {
  const [shift, setShift] = useState<TimeRange>({ from: null, to: null });

  return (
    <div className="grid w-full max-w-72 gap-2">
      <Label>Shift</Label>
      <TimeRangePicker
        value={shift}
        onChange={setShift}
        format="HH:mm"
        minuteStep={15}
        clearable
      />
    </div>
  );
};

/**
 * States
 */
export const States = () => (
  <div className="grid w-full max-w-40 gap-2">
    <TimePicker disabled defaultValue={new Date(2026, 0, 1, 8, 0)} />
    <TimePicker readOnly defaultValue={new Date(2026, 0, 1, 8, 0)} />
    <TimePicker invalid defaultValue={new Date(2026, 0, 1, 8, 0)} />
  </div>
);
