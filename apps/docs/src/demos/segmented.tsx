import { useState } from 'react';

import { Segmented } from '@antkit/react';
import { LayoutGridIcon, ListIcon, MapIcon } from 'lucide-react';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: ['Segmented'],
  extraImports: [
    "import type { SegmentedOption, SegmentedValue } from '@antkit/react';",
  ],
  api: [
    {
      title: 'Segmented',
      description:
        'Reach for Segmented over `Select` when there are two to four choices, and over `Tabs` when it filters the content rather than swapping the panel.',
      props: [
        {
          name: 'options',
          type: '(SegmentedOption | string | number)[]',
          description:
            'A bare value is shorthand for `{ label: value, value }`. Required.',
        },
        {
          name: 'value',
          type: 'string | number',
          description: 'The current choice, when you hold the state.',
        },
        {
          name: 'defaultValue',
          type: 'string | number',
          description: 'The starting choice when uncontrolled.',
        },
        {
          name: 'onChange',
          type: '(value: SegmentedValue) => void',
          description: 'Called when the choice changes.',
        },
        {
          name: 'size',
          type: "'sm' | 'default' | 'lg'",
          default: "'default'",
          description: '28 / 32 / 40px tall.',
        },
        {
          name: 'block',
          type: 'boolean',
          default: 'false',
          description: 'Fills the parent and splits the width evenly.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Locks the whole group.',
        },
      ],
    },
    {
      title: 'SegmentedOption',
      props: [
        { name: 'label', type: 'ReactNode', description: 'The text shown.' },
        {
          name: 'value',
          type: 'string | number',
          description: 'The value behind it.',
        },
        {
          name: 'icon',
          type: 'ReactNode',
          description: 'An icon before the label.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          description: 'Locks one option on its own.',
        },
      ],
    },
  ],
};

/**
 * Basic
 *
 * An array of strings is enough — the label and the value are the same.
 */
export const Basic = () => {
  const [range, setRange] = useState<string | number>('Week');

  return (
    <div className="grid gap-2">
      <Segmented
        options={['Day', 'Week', 'Month']}
        value={range}
        onChange={setRange}
      />
      <p className="text-xs text-muted-foreground">Viewing: {range}</p>
    </div>
  );
};

/**
 * Labels apart from values
 */
export const Options = () => (
  <Segmented
    defaultValue="active"
    options={[
      { label: 'All', value: 'all' },
      { label: 'Active', value: 'active' },
      { label: 'Paused', value: 'paused' },
      { label: 'Deleted', value: 'deleted', disabled: true },
    ]}
  />
);

/**
 * With icons
 */
export const WithIcons = () => (
  <Segmented
    defaultValue="list"
    options={[
      { label: 'List', value: 'list', icon: <ListIcon /> },
      { label: 'Grid', value: 'grid', icon: <LayoutGridIcon /> },
      { label: 'Map', value: 'map', icon: <MapIcon /> },
    ]}
  />
);

/**
 * Sizes
 */
export const Sizes = () => (
  <div className="grid gap-3">
    <Segmented
      size="sm"
      options={['Day', 'Week', 'Month']}
      defaultValue="Day"
    />
    <Segmented options={['Day', 'Week', 'Month']} defaultValue="Day" />
    <Segmented
      size="lg"
      options={['Day', 'Week', 'Month']}
      defaultValue="Day"
    />
  </div>
);

/**
 * Full width
 */
export const Block = () => (
  <div className="w-full max-w-md">
    <Segmented
      block
      options={['This month', 'This quarter', 'This year']}
      defaultValue="This quarter"
    />
  </div>
);

/**
 * Disabled
 */
export const Disabled = () => (
  <Segmented disabled options={['Day', 'Week', 'Month']} defaultValue="Week" />
);
