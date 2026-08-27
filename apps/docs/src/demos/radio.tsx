import { useState } from 'react';

import { Label, Radio, RadioGroup, RadioGroupItem } from '@antkit/react';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: ['RadioGroup', 'Radio', 'RadioGroupItem'],
  api: [
    {
      title: 'RadioGroup',
      description:
        'Wraps Radix RadioGroup and takes every prop the primitive does.',
      props: [
        {
          name: 'value',
          type: 'string',
          description: 'The current choice, when you hold the state.',
        },
        {
          name: 'defaultValue',
          type: 'string',
          description: 'The starting choice when uncontrolled.',
        },
        {
          name: 'onValueChange',
          type: '(value: string) => void',
          description: 'Called when the choice changes.',
        },
        {
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          default: "'vertical'",
          description:
            'Not only layout: it also changes which pair of arrow keys Radix listens for.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Locks the whole group.',
        },
        {
          name: 'name',
          type: 'string',
          description: 'The field name when submitting through an HTML form.',
        },
      ],
    },
    {
      title: 'Radio',
      description:
        'One labelled option: the dot, the label, and a line of help.',
      props: [
        {
          name: 'value',
          type: 'string',
          description: 'The option’s value. Required.',
        },
        {
          name: 'description',
          type: 'ReactNode',
          description:
            'The line under the label. It sits inside the `<label>`, so clicking it selects — in exchange, a screen reader reads it as part of the option’s name.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          description: 'Locks one option on its own.',
        },
      ],
    },
    {
      title: 'RadioGroupItem',
      description:
        'The bare dot, for layouts `Radio` does not cover — one sitting alone in a table cell, say.',
      props: [
        { name: 'value', type: 'string', description: 'The value. Required.' },
        {
          name: 'id',
          type: 'string',
          description: 'For a `Label` to point at.',
        },
        { name: 'disabled', type: 'boolean', description: 'Locks it.' },
      ],
    },
  ],
};

/**
 * Basic
 */
export const Basic = () => {
  const [plan, setPlan] = useState('pro');

  return (
    <RadioGroup
      value={plan}
      onValueChange={setPlan}
      className="w-full max-w-md"
    >
      <Radio value="basic" description="1 user, 5 projects">
        Basic
      </Radio>
      <Radio value="pro" description="10 users, unlimited projects">
        Pro
      </Radio>
      <Radio value="enterprise" disabled description="Talk to sales">
        Enterprise
      </Radio>
    </RadioGroup>
  );
};

/**
 * Without descriptions
 */
export const Plain = () => (
  <RadioGroup defaultValue="now">
    <Radio value="now">Run now</Radio>
    <Radio value="cron">On a schedule</Radio>
    <Radio value="manual">Run by hand</Radio>
  </RadioGroup>
);

/**
 * Horizontal
 *
 * `orientation="horizontal"` also moves navigation onto the left/right keys,
 * so this is more than a layout change.
 */
export const Horizontal = () => (
  <RadioGroup orientation="horizontal" defaultValue="all">
    <Radio value="all">All</Radio>
    <Radio value="active">Active</Radio>
    <Radio value="done">Completed</Radio>
  </RadioGroup>
);

/**
 * The bare dot
 *
 * `RadioGroupItem` carries no label — use it when the label lives elsewhere,
 * such as on each row of a table.
 */
export const Bare = () => (
  <RadioGroup defaultValue="row-1" className="w-full max-w-sm">
    {[
      { id: 'row-1', name: 'Sarah Chen', course: 'IELTS 6.5+' },
      { id: 'row-2', name: 'Marcus Alvarez', course: 'TOEIC 750' },
    ].map((row) => (
      <div
        key={row.id}
        className="flex items-center gap-3 rounded-lg border border-border p-3"
      >
        <RadioGroupItem value={row.id} id={row.id} />
        <Label htmlFor={row.id} className="grid gap-0.5 font-normal">
          <span>{row.name}</span>
          <span className="text-xs text-muted-foreground">{row.course}</span>
        </Label>
      </div>
    ))}
  </RadioGroup>
);

/**
 * Locking the whole group
 */
export const Disabled = () => (
  <RadioGroup disabled defaultValue="pro">
    <Radio value="basic">Basic</Radio>
    <Radio value="pro" description="Your current plan, fixed for this term">
      Pro
    </Radio>
  </RadioGroup>
);
