import { useState } from 'react';

import { Label, Rate } from '@antkit/react';
import { HeartIcon } from 'lucide-react';

import type { DemoMeta } from '../lib/types';

const LABELS = ['Terrible', 'Poor', 'Fair', 'Good', 'Excellent'];

export const meta: DemoMeta = {
  imports: ['Rate'],
  api: [
    {
      title: 'Rate',
      description:
        'The whole control is one arrow-key radiogroup rather than N separately focusable stars — tabbing through five stars just to set one number is exhausting.',
      props: [
        {
          name: 'count',
          type: 'number',
          default: '5',
          description: 'How many symbols are drawn.',
        },
        {
          name: 'value',
          type: 'number',
          description: 'The current score, when you hold the state.',
        },
        {
          name: 'defaultValue',
          type: 'number',
          description: 'The starting score when uncontrolled.',
        },
        {
          name: 'onChange',
          type: '(value: number) => void',
          description: 'Called when the score changes.',
        },
        {
          name: 'allowHalf',
          type: 'boolean',
          default: 'false',
          description: 'Allows clicking half a symbol, so steps of 0.5.',
        },
        {
          name: 'allowClear',
          type: 'boolean',
          default: 'false',
          description: 'Clicking the current score again clears it to 0.',
        },
        {
          name: 'character',
          type: 'ReactNode',
          description: 'Replaces the star with another symbol.',
        },
        {
          name: 'size',
          type: "'sm' | 'default' | 'lg'",
          default: "'default'",
          description: 'Symbol size: 16 / 20 / 28px.',
        },
        {
          name: 'tooltips',
          type: 'string[]',
          description:
            'One label per score, shown on hover and read out by screen readers.',
        },
        {
          name: 'readOnly',
          type: 'boolean',
          default: 'false',
          description: 'Display only: no hover, no click, no focus.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Locks it.',
        },
        {
          name: 'onBlur',
          type: '() => void',
          description:
            'Needed by `Form.Item` to know the field has been touched.',
        },
      ],
    },
  ],
};

/**
 * Basic
 */
export const Basic = () => {
  const [score, setScore] = useState(0);

  return (
    <div className="grid gap-2">
      <Rate value={score} onChange={setScore} />
      <p className="text-xs text-muted-foreground">Score: {score}</p>
    </div>
  );
};

/**
 * Half stars
 *
 * `allowHalf` allows clicking the left half of a star, so steps of 0.5.
 */
export const Half = () => <Rate defaultValue={3.5} allowHalf />;

/**
 * Click again to clear
 */
export const Clearable = () => <Rate defaultValue={4} allowClear />;

/**
 * Sizes
 */
export const Sizes = () => (
  <div className="grid gap-3">
    <Rate size="sm" defaultValue={4} readOnly />
    <Rate defaultValue={4} readOnly />
    <Rate size="lg" defaultValue={4} readOnly />
  </div>
);

/**
 * A label per score
 *
 * `tooltips` both shows on hover and becomes the name a screen reader reads,
 * so do not skip it when the scale means something specific.
 */
export const Tooltips = () => {
  const [score, setScore] = useState(4);

  return (
    <div className="grid gap-2">
      <Label>Satisfaction</Label>
      <div className="flex items-center gap-3">
        <Rate value={score} onChange={setScore} tooltips={LABELS} />
        <span className="text-sm text-muted-foreground">
          {LABELS[score - 1] ?? '—'}
        </span>
      </div>
    </div>
  );
};

/**
 * A different symbol
 *
 * `character` takes any node, letters included.
 */
export const Character = () => (
  <div className="grid gap-3">
    <Rate defaultValue={3} character={<HeartIcon />} />
    <Rate defaultValue={2} count={3} character="A" />
  </div>
);

/**
 * Read-only and disabled
 *
 * `readOnly` shows an average score in a list; `disabled` is for a field that
 * cannot be edited right now.
 */
export const States = () => (
  <div className="grid gap-3">
    <Rate value={4.5} allowHalf readOnly size="sm" />
    <Rate defaultValue={2} disabled />
  </div>
);
