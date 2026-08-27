import { useState } from 'react';

import {
  addDays,
  DateField,
  DatePicker,
  DateRangePicker,
  Label,
} from '@antkit/react';
import type { DateRange } from '@antkit/react';

import type { DemoMeta } from '../lib/types';

const today = new Date();

export const meta: DemoMeta = {
  imports: ['DateField', 'DatePicker', 'DateRangePicker', 'addDays'],
  extraImports: ["import type { DateRange } from '@antkit/react';"],
  api: [
    {
      title: 'DateField',
      description:
        'A field typed segment by segment, with no calendar. Up and down arrows adjust whichever segment has focus.',
      props: [
        {
          name: 'value',
          type: 'Date | null',
          description: 'The controlled value. Goes with `onChange`.',
        },
        {
          name: 'defaultValue',
          type: 'Date | null',
          description: 'The starting value when uncontrolled.',
        },
        {
          name: 'onChange',
          type: '(date: Date | null) => void',
          description:
            'Reports `null` while the date is half-typed or does not exist — 31 February, say.',
        },
        {
          name: 'locale',
          type: 'string',
          description:
            'Decides the order of the segments, e.g. `"en-US"` gives mm/dd/yyyy.',
        },
        {
          name: 'min / max',
          type: 'Date',
          description: 'Outside this range the field is marked invalid.',
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
          description: 'Submits as `YYYY-MM-DD` through a hidden input.',
        },
        {
          name: 'placeholders / labels',
          type: 'Partial<DateSegmentLabels>',
          description:
            'The placeholder and accessible name of each date segment.',
        },
        {
          name: 'disabled / readOnly / invalid',
          type: 'boolean',
          description: 'The field states.',
        },
      ],
    },
    {
      title: 'DatePicker',
      description:
        'DateField plus a calendar. The two halves edit one value: type into the field, or open the calendar and click.',
      props: [
        {
          name: 'open / defaultOpen / onOpenChange',
          type: 'boolean | (open: boolean) => void',
          description: 'Controls whether the calendar is open.',
        },
        {
          name: 'closeOnSelect',
          type: 'boolean',
          default: 'true',
          description: 'Closes the calendar as soon as a date is picked.',
        },
        {
          name: 'numberOfMonths',
          type: 'number',
          default: '1',
          description: 'How many months sit side by side.',
        },
        {
          name: 'isDateDisabled',
          type: '(date: Date) => boolean',
          description:
            'A rule that disables days beyond `min`/`max` — blocking weekends, say.',
        },
        {
          name: 'captionLayout',
          type: "'label' | 'dropdown'",
          default: "'label'",
          description:
            '`dropdown` turns the caption into month and year pickers.',
        },
        {
          name: 'fromYear / toYear',
          type: 'number',
          description: 'Bounds the list of years in the dropdown.',
        },
        {
          name: 'weekStartsOn',
          type: '0 | 1 | 2 | 3 | 4 | 5 | 6',
          default: '1',
          description:
            '0 is Sunday. It defaults to Monday, which is the ISO convention.',
        },
        {
          name: 'footer',
          type: 'ReactNode',
          description:
            'Drawn beneath the day grid — a "Today" button, a legend, a note.',
        },
        {
          name: 'align / side',
          type: "'start' | 'center' | 'end' | 'top' | 'bottom' | …",
          description: 'Where the popover sits relative to the field.',
        },
      ],
    },
    {
      title: 'DateRangePicker',
      props: [
        {
          name: 'value',
          type: 'DateRange | null',
          description: '`{ from, to }`, where either end may be `null`.',
        },
        {
          name: 'onChange',
          type: '(range: DateRange) => void',
          description:
            'Reports on every click, so between the two ends `to` is `null`.',
        },
        {
          name: 'presets',
          type: 'DateRangePreset[]',
          description:
            'Preset ranges listed beside the calendar — "last 7 days", "this month".',
        },
        {
          name: 'closeOnSelect',
          type: 'boolean',
          default: 'true',
          description: 'Closes once both ends are set.',
        },
        {
          name: 'separator',
          type: 'ReactNode',
          description: 'The divider between the two fields.',
        },
        {
          name: 'fromName / toName',
          type: 'string',
          description:
            'The names of the two hidden inputs holding `YYYY-MM-DD` for an HTML form.',
        },
      ],
    },
  ],
};

/**
 * DatePicker
 *
 * Type into the segments, or open the calendar. The popover is anchored to the
 * whole field rather than to the button, so it lines up with the text below.
 */
export const Basic = () => {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <div className="grid w-full max-w-56 gap-2">
      <Label>Start date</Label>
      <DatePicker value={date} onChange={setDate} locale="en-US" clearable />
      <p className="text-xs text-muted-foreground">
        {date?.toLocaleDateString('en-US') ?? '—'}
      </p>
    </div>
  );
};

/**
 * DateField — typing only
 *
 * No calendar, so it is lighter and suits fields where the date is already
 * known, a date of birth for instance.
 */
export const Field = () => (
  <div className="grid w-full max-w-56 gap-2">
    <Label>Date of birth</Label>
    <DateField locale="en-US" clearable />
  </div>
);

/**
 * Bounding the dates
 *
 * `min` and `max` bound either end; `isDateDisabled` adds a rule of your own —
 * weekends, here.
 */
export const Limits = () => (
  <div className="grid w-full max-w-56 gap-2">
    <DatePicker
      locale="en-US"
      min={today}
      max={addDays(today, 60)}
      isDateDisabled={(date) => [0, 6].includes(date.getDay())}
    />
    <p className="text-xs text-muted-foreground">
      Within the next 60 days only, excluding Saturdays and Sundays.
    </p>
  </div>
);

/**
 * Jumping by month and year
 *
 * `captionLayout="dropdown"` swaps the month caption for two pickers —
 * essential when the user has to travel years, as with a date of birth.
 */
export const Dropdown = () => (
  <DatePicker
    className="max-w-56"
    locale="en-US"
    captionLayout="dropdown"
    fromYear={1950}
    toYear={today.getFullYear()}
  />
);

/**
 * Selecting a range
 *
 * `presets` are the ready-made ranges beside the calendar — the thing every
 * report page needs.
 */
export const Range = () => {
  const [range, setRange] = useState<DateRange>({ from: null, to: null });

  return (
    <div className="grid w-full max-w-96 gap-2">
      <Label>Date range</Label>
      <DateRangePicker
        locale="en-US"
        value={range}
        onChange={setRange}
        clearable
        presets={[
          {
            label: 'Last 7 days',
            value: { from: addDays(today, -6), to: today },
          },
          {
            label: 'Last 30 days',
            value: { from: addDays(today, -29), to: today },
          },
        ]}
      />
      <p className="text-xs text-muted-foreground">
        {range.from?.toLocaleDateString('en-US') ?? '—'} →{' '}
        {range.to?.toLocaleDateString('en-US') ?? '—'}
      </p>
    </div>
  );
};

/**
 * Two months side by side
 */
export const TwoMonths = () => (
  <DateRangePicker
    className="max-w-96"
    locale="en-US"
    numberOfMonths={2}
    clearable
  />
);

/**
 * States
 */
export const States = () => (
  <div className="grid w-full max-w-56 gap-2">
    <DatePicker locale="en-US" disabled defaultValue={today} />
    <DatePicker locale="en-US" readOnly defaultValue={today} />
    <DatePicker locale="en-US" invalid defaultValue={today} />
  </div>
);

/**
 * Another locale
 *
 * `locale` drives the segment order, the weekday names and the month names.
 * The same field reads dd/mm/yyyy here rather than mm/dd/yyyy, and the week
 * starts where that locale expects.
 */
export const Locale = () => (
  <div className="grid w-full max-w-56 gap-2">
    <Label>vi-VN</Label>
    <DatePicker locale="vi-VN" defaultValue={today} clearable />
  </div>
);
