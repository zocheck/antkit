import { useState } from 'react';

import { Button, Gantt } from '@antkit/react';
import type { GanttRow } from '@antkit/react';
import { toast } from 'sonner';

import type { DemoMeta } from '../lib/types';

const day = (offset: number) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date;
};

const ROWS: GanttRow[] = [
  {
    id: 'r1',
    label: 'Chloe Barnes',
    items: [
      {
        id: 'g1',
        name: 'Draft the contract',
        startAt: day(-6),
        endAt: day(-1),
      },
      {
        id: 'g2',
        name: 'Customer follow-up',
        startAt: day(1),
        endAt: day(6),
        color: '#17a2b8',
      },
    ],
  },
  {
    id: 'r2',
    label: 'Noah Hart',
    items: [
      {
        id: 'g3',
        name: 'Finance plan consultation',
        startAt: day(-3),
        endAt: day(4),
        color: '#f49000',
      },
      {
        id: 'g4',
        name: 'Close the contract',
        startAt: day(5),
        endAt: day(9),
        color: '#28a745',
      },
    ],
  },
  {
    id: 'r3',
    label: 'Harriet Tran',
    items: [
      {
        id: 'g5',
        name: 'VAT invoice paperwork',
        startAt: day(-8),
        endAt: day(2),
        color: '#7c3aed',
      },
    ],
  },
];

export const meta: DemoMeta = {
  imports: ['Gantt'],
  extraImports: ["import type { GanttRow } from '@antkit/react';"],
  api: [
    {
      title: 'Gantt',
      description:
        'Bars placed by date along a horizontal axis. Use `Timeline` for a vertical run of events.',
      props: [
        {
          name: 'rows',
          type: 'GanttRow[]',
          description:
            'One lane per row, each holding several items. Required.',
        },
        {
          name: 'markers',
          type: 'GanttMarker[]',
          description: 'Labelled vertical rules — a handover date, a deadline.',
        },
        {
          name: 'from / to',
          type: 'Date',
          description:
            'The two ends of the time axis. Left out, they are inferred from the data.',
        },
        {
          name: 'unit',
          type: "'day' | 'week' | 'month'",
          default: "'day'",
          description: 'What one column on the ruler means.',
        },
        {
          name: 'zoom',
          type: 'number',
          default: '100',
          description:
            'A percentage applied to the natural column width of that unit.',
        },
        {
          name: 'labelWidth',
          type: 'number',
          description: 'The width of the label column on the left.',
        },
        {
          name: 'rowHeight',
          type: 'number',
          description:
            'The height of a lane holding exactly one bar. A lane with overlapping items grows taller, because bars stack rather than overlap.',
        },
        {
          name: 'maxHeight',
          type: 'number | string',
          description:
            'Without it the chart grows to fit its content and the page is what scrolls — and then the ruler gets left behind, because sticky only works inside a scroll box.',
        },
        {
          name: 'sidebarTitle',
          type: 'ReactNode',
          description: 'The heading of the label column.',
        },
        {
          name: 'scrollToToday',
          type: 'boolean',
          default: 'true',
          description: 'Scrolls so that today is in view as soon as it opens.',
        },
        {
          name: 'onItemClick / onRowClick',
          type: '(item, row) => void | (row) => void',
          description: 'A click on one bar, or on the whole row.',
        },
        {
          name: 'locale',
          type: 'string',
          description: 'The locale for the date ruler.',
        },
      ],
    },
    {
      title: 'GanttRow / GanttItem / GanttMarker',
      props: [
        {
          name: 'label',
          type: 'ReactNode',
          description: 'The lane label, shown in the left column.',
        },
        {
          name: 'items',
          type: 'GanttItem[]',
          description: 'The items in the lane.',
        },
        {
          name: 'startAt / endAt',
          type: 'Date',
          description: 'The two ends of one bar.',
        },
        {
          name: 'color',
          type: 'string',
          description:
            'Any CSS colour. Without one it takes the theme primary.',
        },
        {
          name: 'content',
          type: 'ReactNode',
          description: 'Replaces the label inside the bar.',
        },
        {
          name: 'date',
          type: 'Date',
          description: 'On `GanttMarker`: where the vertical rule sits.',
        },
      ],
    },
  ],
};

/**
 * Basic
 *
 * Scroll sideways and the label column holds still; scroll down and the date
 * ruler holds still.
 */
export const Basic = () => (
  <div className="w-full min-w-0">
    <Gantt rows={ROWS} locale="en-US" sidebarTitle="Owner" maxHeight={260} />
  </div>
);

/**
 * Unit and zoom
 *
 * `unit` changes what a column means, `zoom` changes how wide it is — two
 * different dials for the same question of breadth versus detail.
 */
export const UnitAndZoom = () => {
  const [unit, setUnit] = useState<'day' | 'week' | 'month'>('day');
  const [zoom, setZoom] = useState(100);

  return (
    <div className="w-full min-w-0">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {(['day', 'week', 'month'] as const).map((value) => (
          <Button
            key={value}
            size="sm"
            variant={unit === value ? 'default' : 'secondary'}
            onClick={() => setUnit(value)}
          >
            {value}
          </Button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">zoom</span>
        {[70, 100, 140].map((value) => (
          <Button
            key={value}
            size="sm"
            variant={zoom === value ? 'default' : 'secondary'}
            onClick={() => setZoom(value)}
          >
            {value}%
          </Button>
        ))}
      </div>

      <Gantt
        rows={ROWS}
        unit={unit}
        zoom={zoom}
        locale="en-US"
        maxHeight={260}
      />
    </div>
  );
};

/**
 * Markers
 *
 * `markers` are labelled vertical rules, for a handover date or a deadline.
 */
export const Markers = () => (
  <div className="w-full min-w-0">
    <Gantt
      rows={ROWS}
      locale="en-US"
      maxHeight={260}
      markers={[
        { id: 'ship', date: day(7), label: 'Handover', color: '#7c3aed' },
        { id: 'audit', date: day(-2), label: 'Reconciliation' },
      ]}
    />
  </div>
);

/**
 * Catching clicks
 */
export const Clickable = () => (
  <div className="w-full min-w-0">
    <Gantt
      rows={ROWS}
      locale="en-US"
      maxHeight={260}
      onItemClick={(item) => toast(item.name)}
      onRowClick={(row) => toast(String(row.label))}
    />
  </div>
);

/**
 * A fixed range
 *
 * `from` and `to` pin the ends of the axis, even where no item reaches them.
 */
export const FixedRange = () => (
  <div className="w-full min-w-0">
    <Gantt
      rows={ROWS}
      from={day(-15)}
      to={day(20)}
      unit="week"
      locale="en-US"
      maxHeight={260}
    />
  </div>
);
