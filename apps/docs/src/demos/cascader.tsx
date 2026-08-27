import { useState } from 'react';

import { Cascader, Label } from '@antkit/react';
import type { CascaderOption } from '@antkit/react';

import type { DemoMeta } from '../lib/types';

const REGIONS: CascaderOption[] = [
  {
    value: 'ca',
    label: 'California',
    children: [
      {
        value: 'sf',
        label: 'San Francisco',
        children: [
          { value: 'mission', label: 'Mission' },
          { value: 'soma', label: 'SoMa' },
        ],
      },
      {
        value: 'la',
        label: 'Los Angeles',
        children: [
          { value: 'silver-lake', label: 'Silver Lake' },
          { value: 'venice', label: 'Venice' },
        ],
      },
    ],
  },
  {
    value: 'ny',
    label: 'New York',
    children: [
      {
        value: 'manhattan',
        label: 'Manhattan',
        children: [
          { value: 'chelsea', label: 'Chelsea' },
          { value: 'harlem', label: 'Harlem' },
        ],
      },
      {
        value: 'brooklyn',
        label: 'Brooklyn',
        children: [{ value: 'williamsburg', label: 'Williamsburg' }],
      },
    ],
  },
  { value: 'tx', label: 'Texas', disabled: true },
];

export const meta: DemoMeta = {
  imports: ['Cascader'],
  extraImports: ["import type { CascaderOption } from '@antkit/react';"],
  api: [
    {
      title: 'Cascader',
      props: [
        {
          name: 'options',
          type: 'CascaderOption[]',
          description: 'The tree of choices. Required.',
        },
        {
          name: 'value',
          type: 'string[]',
          description:
            'The path from the root, e.g. `["ca", "sf", "mission"]` — not a single value.',
        },
        {
          name: 'onChange',
          type: '(value: string[], options: CascaderOption[]) => void',
          description:
            'Receives both the values and the matching options, so there is no need to walk the tree again for the labels.',
        },
        {
          name: 'changeOnSelect',
          type: 'boolean',
          default: 'false',
          description:
            'Commits a value at any level rather than only at a leaf — for when "the whole state" is a valid choice too.',
        },
        {
          name: 'expandTrigger',
          type: "'click' | 'hover'",
          default: "'click'",
          description: 'Whether the next column opens on click or on hover.',
        },
        {
          name: 'displayRender',
          type: '(labels: string[], options: CascaderOption[]) => ReactNode',
          description:
            'Draws the text in the closed field. By default the labels are joined with "/".',
        },
        {
          name: 'allowClear',
          type: 'boolean',
          default: 'false',
          description: 'The button that clears the selection.',
        },
        {
          name: 'placeholder',
          type: 'string',
          description: 'The greyed text before anything is chosen.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Locks the whole field.',
        },
      ],
    },
    {
      title: 'CascaderOption',
      props: [
        {
          name: 'value',
          type: 'string',
          description: 'The value at this level.',
        },
        { name: 'label', type: 'string', description: 'The text shown.' },
        {
          name: 'children',
          type: 'CascaderOption[]',
          description: 'The level below. No children means a leaf.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          description: 'Locks one branch.',
        },
      ],
    },
  ],
};

/**
 * Basic
 *
 * The value only commits once you reach a leaf.
 */
export const Basic = () => {
  const [area, setArea] = useState<string[]>([]);

  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label>Area</Label>
      <Cascader
        options={REGIONS}
        value={area}
        onChange={setArea}
        allowClear
        placeholder="State / city / neighbourhood"
      />
      <p className="text-xs text-muted-foreground">
        Value: {area.length ? JSON.stringify(area) : '—'}
      </p>
    </div>
  );
};

/**
 * Committing at any level
 *
 * `changeOnSelect` lets you stop at "California" without going all the way
 * down to a neighbourhood.
 */
export const ChangeOnSelect = () => (
  <Cascader
    className="max-w-sm"
    options={REGIONS}
    changeOnSelect
    allowClear
    placeholder="Stop at any level"
  />
);

/**
 * Opening on hover
 */
export const HoverExpand = () => (
  <Cascader
    className="max-w-sm"
    options={REGIONS}
    expandTrigger="hover"
    placeholder="Hover to open the next column"
  />
);

/**
 * Changing what is displayed
 *
 * `displayRender` is handed the labels — here it keeps only the last level.
 */
export const DisplayRender = () => {
  const [value, setValue] = useState(['ca', 'sf', 'mission']);

  return (
    <Cascader
      className="max-w-sm"
      options={REGIONS}
      value={value}
      onChange={setValue}
      displayRender={(labels) => labels.at(-1) ?? ''}
    />
  );
};

/**
 * States
 */
export const States = () => (
  <div className="grid w-full max-w-sm gap-2">
    <Cascader options={REGIONS} disabled placeholder="Locked" />
    <Cascader options={REGIONS} aria-invalid placeholder="No area chosen" />
  </div>
);
