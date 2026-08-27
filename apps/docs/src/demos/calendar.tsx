import { useState } from 'react';

import { Button, Calendar } from '@antkit/react';
import type { DateRange } from '@antkit/react';

import type { DemoMeta } from '../lib/types';

const today = new Date();

export const meta: DemoMeta = {
  imports: ['Calendar'],
  extraImports: ["import type { DateRange } from '@antkit/react';"],
  api: [
    {
      title: 'Calendar',
      description:
        'Arrows move through the grid, PageUp/PageDown change month (add Shift for the year), and focus follows the selection across a month boundary — only one day cell is ever in the tab order.',
      props: [
        {
          name: 'mode',
          type: "'single' | 'range'",
          default: "'single'",
          description: 'Whether it selects one date or a range.',
        },
        {
          name: 'selected',
          type: 'Date | DateRange | null',
          description: 'The selected date or range, according to `mode`.',
        },
        {
          name: 'onSelect',
          type: '(value: Date | DateRange) => void',
          description: 'Called when a day is clicked.',
        },
        {
          name: 'month / defaultMonth / onMonthChange',
          type: 'Date | (month: Date) => void',
          description: 'Controls which month is shown.',
        },
        {
          name: 'numberOfMonths',
          type: 'number',
          default: '1',
          description:
            'How many months sit side by side — 2 is the usual choice for a range.',
        },
        {
          name: 'min / max',
          type: 'Date',
          description: 'Bounds at either end.',
        },
        {
          name: 'isDateDisabled',
          type: '(date: Date) => boolean',
          description: 'A rule that disables days beyond `min`/`max`.',
        },
        {
          name: 'weekStartsOn',
          type: '0 | 1 | … | 6',
          default: '1',
          description: '0 is Sunday.',
        },
        {
          name: 'locale',
          type: 'string',
          description: 'The locale for weekday and month names.',
        },
        {
          name: 'showOutsideDays',
          type: 'boolean',
          default: 'true',
          description:
            'Shows days from the neighbouring months to fill the grid.',
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
          name: 'today',
          type: 'Date',
          description:
            'Overrides which date counts as today — handy for tests and screenshots.',
        },
        {
          name: 'autoFocus',
          type: 'boolean',
          default: 'false',
          description: 'Puts keyboard focus in the grid as soon as it mounts.',
        },
        {
          name: 'footer',
          type: 'ReactNode',
          description: 'Drawn beneath the day grid.',
        },
      ],
    },
  ],
};

/**
 * Basic
 */
export const Basic = () => {
  const [date, setDate] = useState<Date | null>(today);

  return (
    <div className="grid gap-2">
      <Calendar
        locale="en-US"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
      <p className="text-xs text-muted-foreground">
        {date?.toLocaleDateString('en-US') ?? '—'}
      </p>
    </div>
  );
};

/**
 * Selecting a range
 *
 * `mode="range"` with two months side by side is the familiar layout of every
 * report filter.
 */
export const Range = () => {
  const [range, setRange] = useState<DateRange>({ from: null, to: null });

  return (
    <div className="grid gap-2">
      <Calendar
        mode="range"
        locale="en-US"
        numberOfMonths={2}
        selected={range}
        onSelect={setRange}
        className="rounded-md border"
      />
      <p className="text-xs text-muted-foreground">
        {range.from?.toLocaleDateString('en-US') ?? '—'} →{' '}
        {range.to?.toLocaleDateString('en-US') ?? '—'}
      </p>
    </div>
  );
};

/**
 * Month and year pickers
 */
export const Dropdown = () => (
  <Calendar
    locale="en-US"
    captionLayout="dropdown"
    fromYear={2020}
    toYear={2030}
    className="rounded-md border"
  />
);

/**
 * Disabling days
 *
 * This blocks the past and blocks weekends.
 */
export const Disabled = () => (
  <Calendar
    locale="en-US"
    min={today}
    isDateDisabled={(date) => [0, 6].includes(date.getDay())}
    className="rounded-md border"
  />
);

/**
 * A footer
 *
 * `footer` takes any node — the natural home for a "Today" button or a line of
 * explanation.
 */
export const Footer = () => {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <Calendar
      locale="en-US"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
      footer={
        <Button size="sm" variant="ghost" onClick={() => setDate(new Date())}>
          Today
        </Button>
      }
    />
  );
};
