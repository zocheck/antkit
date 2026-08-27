import { useState } from 'react';

import { InputNumber, Label } from '@antkit/react';

import type { DemoMeta } from '../lib/types';

const grouped = (value: string) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const meta: DemoMeta = {
  imports: ['InputNumber'],
  api: [
    {
      title: 'InputNumber',
      description:
        'Takes every <input> prop except value/defaultValue/onChange/size/prefix/type, all of which are redefined in numeric terms.',
      props: [
        {
          name: 'value',
          type: 'number | null',
          description: '`null` means empty. Goes with `onChange`.',
        },
        {
          name: 'defaultValue',
          type: 'number | null',
          description: 'The starting value when uncontrolled.',
        },
        {
          name: 'onChange',
          type: '(value: number | null) => void',
          description:
            'Fires on every keystroke, even while the number is still outside min/max — so typing `5` on the way to `50` is not blocked.',
        },
        {
          name: 'min',
          type: 'number',
          description: 'The floor, clamped on blur.',
        },
        {
          name: 'max',
          type: 'number',
          description: 'The ceiling, clamped on blur.',
        },
        {
          name: 'step',
          type: 'number',
          default: '1',
          description:
            'The step, and also a hint at the decimal places: `step={0.5}` means one.',
        },
        {
          name: 'precision',
          type: 'number',
          description:
            'Decimal places to round to on blur. Inferred from `step` by default.',
        },
        {
          name: 'size',
          type: "'sm' | 'default' | 'lg'",
          default: "'default'",
          description: '32 / 36 / 40px tall.',
        },
        {
          name: 'controls',
          type: 'boolean',
          default: 'true',
          description: 'The stepper buttons down the right side.',
        },
        {
          name: 'keyboard',
          type: 'boolean',
          default: 'true',
          description: 'Up and down arrows change the value.',
        },
        {
          name: 'changeOnWheel',
          type: 'boolean',
          default: 'false',
          description:
            'Scrolling over a focused field changes the value. Off by default, because it steals the page scroll.',
        },
        {
          name: 'formatter',
          type: '(value: string) => string',
          description:
            'Prints the number for display, thousands separators say. Applied only while the field is not being typed into.',
        },
        {
          name: 'parser',
          type: '(text: string) => string',
          description:
            'Reads the number back out of what was typed or pasted. By default it drops everything that is not part of a number.',
        },
        {
          name: 'prefix / suffix',
          type: 'ReactNode',
          description: 'Inside the border, before or after the number.',
        },
        {
          name: 'addonBefore / addonAfter',
          type: 'ReactNode',
          description:
            'Outside the border, sharing its edge — right for a unit or a currency mark.',
        },
        {
          name: 'onPressEnter',
          type: '(value: number | null) => void',
          description: 'Called on Enter, after clamping and rounding.',
        },
        {
          name: 'invalid',
          type: 'boolean',
          description: 'Red border, the equivalent of aria-invalid.',
        },
        {
          name: 'inputClassName',
          type: 'string',
          description:
            'Lands on the <input> itself rather than the bordered block.',
        },
      ],
    },
  ],
};

/**
 * Basic
 */
export const Basic = () => {
  const [seats, setSeats] = useState<number | null>(12);

  return (
    <div className="grid w-full max-w-3xs gap-2">
      <Label>Class size</Label>
      <InputNumber value={seats} onChange={setSeats} min={1} max={30} />
      <p className="text-xs text-muted-foreground">Value: {seats ?? 'null'}</p>
    </div>
  );
};

/**
 * Sizes
 */
export const Sizes = () => (
  <div className="grid w-full max-w-3xs gap-2">
    <InputNumber size="sm" defaultValue={1} />
    <InputNumber defaultValue={1} />
    <InputNumber size="lg" defaultValue={1} />
  </div>
);

/**
 * Step and precision
 *
 * `step` is both the stepper's increment and a hint at the decimal places;
 * `precision` overrides it when they need to differ.
 */
export const Step = () => (
  <div className="grid w-full max-w-3xs gap-2">
    <InputNumber defaultValue={7} step={0.5} />
    <InputNumber defaultValue={7} step={0.5} precision={2} />
    <InputNumber defaultValue={1_000} step={500} />
  </div>
);

/**
 * Units and currency
 *
 * `addonAfter` sits outside the border, `suffix` inside. Pick by whether the
 * unit labels the field or belongs to the number.
 */
export const Units = () => (
  <div className="grid w-full max-w-56 gap-2">
    <InputNumber defaultValue={12} addonAfter="students" />
    <InputNumber defaultValue={90} suffix="%" min={0} max={100} />
    <InputNumber defaultValue={5} addonBefore="Sessions" addonAfter="/ week" />
  </div>
);

/**
 * Formatting currency
 *
 * `formatter` prints, `parser` reads back. The pair has to be symmetrical, or
 * the value drifts on every blur.
 */
export const Currency = () => {
  const [fee, setFee] = useState<number | null>(12_500);

  return (
    <div className="grid w-full max-w-64 gap-2">
      <Label>Tuition</Label>
      <InputNumber
        value={fee}
        onChange={setFee}
        min={0}
        step={500}
        addonBefore="$"
        formatter={grouped}
        parser={(text) => text.replace(/,/g, '')}
      />
    </div>
  );
};

/**
 * Without the steppers
 *
 * `controls={false}` gives a field as plain as an Input — right inside a table.
 */
export const NoControls = () => (
  <div className="grid w-full max-w-3xs gap-2">
    <InputNumber controls={false} defaultValue={2026} />
    <InputNumber controls={false} keyboard={false} defaultValue={2026} />
  </div>
);

/**
 * States
 */
export const States = () => (
  <div className="grid w-full max-w-3xs gap-2">
    <InputNumber disabled defaultValue={10} />
    <InputNumber readOnly defaultValue={10} />
    <InputNumber invalid defaultValue={999} max={100} />
  </div>
);

/**
 * Enter to commit
 *
 * `onPressEnter` receives the value already clamped to min/max and rounded —
 * unlike `onChange`, which fires on every keystroke.
 */
export const PressEnter = () => {
  const [saved, setSaved] = useState<number | null>(null);

  return (
    <div className="grid w-full max-w-3xs gap-2">
      <InputNumber
        min={0}
        max={100}
        defaultValue={50}
        onPressEnter={setSaved}
      />
      <p className="text-xs text-muted-foreground">
        Press Enter to commit: {saved ?? '—'}
      </p>
    </div>
  );
};
