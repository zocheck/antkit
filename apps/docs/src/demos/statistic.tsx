import { Card, CardContent, Statistic } from '@antkit/react';
import { UsersIcon } from 'lucide-react';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: ['Statistic'],
  api: [
    {
      title: 'Statistic',
      description: 'Takes every prop a <div> does except `title` and `prefix`.',
      props: [
        {
          name: 'value',
          type: 'number | string',
          description: 'The number. Required.',
        },
        {
          name: 'title',
          type: 'ReactNode',
          description: 'The label above it.',
        },
        {
          name: 'precision',
          type: 'number',
          description: 'Decimal places. Numbers only.',
        },
        {
          name: 'locale',
          type: 'string',
          description:
            'The locale used for thousands grouping and the decimal mark. Numbers only.',
        },
        {
          name: 'formatter',
          type: '(value: number | string) => ReactNode',
          description: 'Take over the formatting entirely.',
        },
        {
          name: 'prefix',
          type: 'ReactNode',
          description: 'Before the value — a currency mark, an icon.',
        },
        {
          name: 'suffix',
          type: 'ReactNode',
          description: 'After the value — a unit, a percent sign.',
        },
        {
          name: 'trend',
          type: "'up' | 'down'",
          description: 'Colours the delta green or red and picks its arrow.',
        },
        {
          name: 'delta',
          type: 'ReactNode',
          description:
            'The change itself, e.g. `+12.4%`. It needs `trend` to be coloured.',
        },
        {
          name: 'loading',
          type: 'boolean',
          default: 'false',
          description: 'Replaces the number with a skeleton.',
        },
        {
          name: 'valueClassName',
          type: 'string',
          description: 'Styling for the value line alone.',
        },
      ],
    },
  ],
};

/**
 * Basic
 */
export const Basic = () => (
  <div className="grid w-full gap-4 sm:grid-cols-3">
    <Statistic title="Active students" value={248} />
    <Statistic title="Open classes" value={17} />
    <Statistic title="Attendance rate" value={92.4} precision={1} suffix="%" />
  </div>
);

/**
 * Currency
 *
 * `locale` handles the thousands grouping; `prefix` or `suffix` handles the
 * symbol.
 */
export const Currency = () => (
  <div className="grid w-full gap-4 sm:grid-cols-2">
    <Statistic
      title="Revenue this month"
      value={412_500}
      locale="en-US"
      prefix="$"
    />
    <Statistic
      title="Outstanding"
      value={38_200}
      locale="en-US"
      prefix="$"
      valueClassName="text-destructive"
    />
  </div>
);

/**
 * Trend
 *
 * `delta` is the change, `trend` decides the colour and the arrow.
 */
export const Trend = () => (
  <div className="grid w-full gap-4 sm:grid-cols-2">
    <Statistic
      title="New students"
      value={64}
      trend="up"
      delta="+12.4% on last month"
    />
    <Statistic
      title="Cancellation rate"
      value={3.1}
      precision={1}
      suffix="%"
      trend="down"
      delta="-0.8 points"
    />
  </div>
);

/**
 * With an icon
 */
export const WithPrefix = () => (
  <Statistic
    title="Members"
    value={1284}
    locale="en-US"
    prefix={<UsersIcon className="size-5 text-muted-foreground" />}
  />
);

/**
 * Your own formatting
 *
 * `formatter` beats both `precision` and `locale` — for numbers that need to
 * be read a particular way.
 */
export const Formatter = () => (
  <Statistic
    title="Average duration"
    value={5_460}
    formatter={(value) => {
      const seconds = Number(value);
      return `${Math.floor(seconds / 60)} min ${seconds % 60} sec`;
    }}
  />
);

/**
 * In cards
 *
 * The familiar layout of an overview page.
 */
export const InCards = () => (
  <div className="grid w-full gap-4 sm:grid-cols-3">
    {[
      { title: 'Revenue', value: 412_500, delta: '+8.1%' },
      { title: 'New contracts', value: 37, delta: '+4' },
      { title: 'Cancellations', value: 3, delta: '-1' },
    ].map((item) => (
      <Card key={item.title}>
        <CardContent>
          <Statistic
            title={item.title}
            value={item.value}
            locale="en-US"
            trend="up"
            delta={item.delta}
          />
        </CardContent>
      </Card>
    ))}
  </div>
);

/**
 * Loading
 */
export const Loading = () => (
  <div className="grid w-full gap-4 sm:grid-cols-2">
    <Statistic title="Revenue this month" value={0} loading />
    <Statistic title="New students" value={0} loading />
  </div>
);
