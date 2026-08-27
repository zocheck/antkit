import { useState } from 'react';

import { Label, Slider } from '@antkit/react';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: ['Slider'],
  extraImports: ["import type { SliderMark } from '@antkit/react';"],
  api: [
    {
      title: 'Slider',
      description:
        'Wraps Radix Slider and takes every prop it does except value/defaultValue/onValueChange/onValueCommit/orientation — those are restated in a declarative shape.',
      props: [
        {
          name: 'value',
          type: 'number | number[]',
          description: 'A number for one handle, an array for a range.',
        },
        {
          name: 'defaultValue',
          type: 'number | number[]',
          description: 'The starting value when uncontrolled.',
        },
        {
          name: 'onChange',
          type: '(value: number | number[]) => void',
          description: 'Fires on every step while dragging.',
        },
        {
          name: 'onChangeComplete',
          type: '(value: number | number[]) => void',
          description:
            'Fires exactly once on release — this is where the API call goes, not `onChange`.',
        },
        {
          name: 'range',
          type: 'boolean',
          default: 'false',
          description:
            'Forces two handles. Inferred when `value` or `defaultValue` is an array, so it is only needed when neither is given.',
        },
        {
          name: 'min / max',
          type: 'number',
          default: '0 / 100',
          description: 'The ends of the scale.',
        },
        {
          name: 'step',
          type: 'number',
          default: '1',
          description: 'The step size.',
        },
        {
          name: 'marks',
          type: 'SliderMark[] | Record<number, ReactNode>',
          description:
            'Marks along the scale. Also takes the object form `{ 0: "Low", 100: "High" }`.',
        },
        {
          name: 'tooltip',
          type: "boolean | 'always'",
          default: 'true',
          description:
            '`true` shows on hover or focus, `"always"` keeps it up.',
        },
        {
          name: 'formatTooltip',
          type: '(value: number) => ReactNode',
          description: 'Formats the number in the tooltip.',
        },
        {
          name: 'vertical',
          type: 'boolean',
          default: 'false',
          description: 'Vertical. The parent needs a height.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Locks it.',
        },
      ],
    },
    {
      title: 'SliderMark',
      props: [
        {
          name: 'value',
          type: 'number',
          description: 'Where it sits on the scale.',
        },
        {
          name: 'label',
          type: 'ReactNode',
          description: 'The text under the mark.',
        },
      ],
    },
  ],
};

/**
 * One handle
 */
export const Basic = () => {
  const [volume, setVolume] = useState(40);

  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label>Volume: {volume}%</Label>
      <Slider value={volume} onChange={(value) => setVolume(value as number)} />
    </div>
  );
};

/**
 * A range
 *
 * Pass an array and you get two handles; `range` is unnecessary.
 */
export const Range = () => {
  const [budget, setBudget] = useState<number[]>([20, 70]);

  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label>
        Budget: {budget[0]}% – {budget[1]}%
      </Label>
      <Slider
        value={budget}
        onChange={(value) => setBudget(value as number[])}
      />
    </div>
  );
};

/**
 * Marks and steps
 *
 * `marks` also takes the object form. `tooltip="always"` keeps the number up,
 * useful when the value has to be readable without hovering.
 */
export const Marks = () => (
  <div className="w-full max-w-sm">
    <Slider
      defaultValue={50}
      step={25}
      marks={{ 0: '0', 25: '25', 50: '50', 75: '75', 100: '100' }}
      tooltip="always"
    />
  </div>
);

/**
 * Formatting the tooltip
 */
export const FormatTooltip = () => (
  <div className="w-full max-w-sm">
    <Slider
      defaultValue={12_000}
      min={0}
      max={30_000}
      step={500}
      tooltip="always"
      formatTooltip={(value) => `$${value.toLocaleString('en-US')}`}
    />
  </div>
);

/**
 * Calling the API only on release
 *
 * `onChange` fires on every step, `onChangeComplete` fires once — use the
 * second for anything expensive.
 */
export const ChangeComplete = () => {
  const [committed, setCommitted] = useState(30);

  return (
    <div className="grid w-full max-w-sm gap-2">
      <Slider
        defaultValue={30}
        onChangeComplete={(value) => setCommitted(value as number)}
      />
      <p className="text-xs text-muted-foreground">
        Committed value: {committed}
      </p>
    </div>
  );
};

/**
 * Vertical
 */
export const Vertical = () => (
  <div className="flex h-48 gap-8">
    <Slider vertical defaultValue={40} />
    <Slider vertical defaultValue={[20, 70]} />
  </div>
);

/**
 * Disabled
 */
export const Disabled = () => (
  <div className="w-full max-w-sm">
    <Slider defaultValue={30} disabled />
  </div>
);
