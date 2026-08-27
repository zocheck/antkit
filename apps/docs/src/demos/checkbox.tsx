import { useState } from 'react';

import { Checkbox, Label } from '@antkit/react';
import type { CheckedState } from '@antkit/react';

import type { DemoMeta } from '../lib/types';

const ROWS = ['Sarah', 'Marcus', 'Priya'];

export const meta: DemoMeta = {
  imports: ['Checkbox'],
  extraImports: ["import type { CheckedState } from '@antkit/react';"],
  api: [
    {
      title: 'Checkbox',
      description:
        'Wraps Radix Checkbox and takes every prop it does. Use `CheckboxOption` inside a `CheckboxGroup` when each box needs a label and a line of help.',
      props: [
        {
          name: 'checked',
          type: "boolean | 'indeterminate'",
          description:
            'The controlled state. `indeterminate` means "some" — the select-all box when only a few rows are ticked.',
        },
        {
          name: 'defaultChecked',
          type: 'boolean',
          description: 'The starting state when uncontrolled.',
        },
        {
          name: 'onCheckedChange',
          type: '(checked: CheckedState) => void',
          description: 'Called when the state changes.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Locks the box.',
        },
        {
          name: 'required',
          type: 'boolean',
          description: 'Required, when it sits in a real HTML form.',
        },
        {
          name: 'name / value',
          type: 'string',
          description: 'For submitting through a plain HTML form.',
        },
        {
          name: 'aria-invalid',
          type: 'boolean',
          description: 'Red border when the value is not valid.',
        },
      ],
    },
  ],
};

/**
 * Basic
 */
export const Basic = () => (
  <div className="grid gap-3">
    <Label>
      <Checkbox defaultChecked />
      Email me about updates
    </Label>
    <Label>
      <Checkbox />
      Text me about updates
    </Label>
  </div>
);

/**
 * Three states
 *
 * `indeterminate` is not "slightly ticked" — it is a state of its own, and it
 * lives in props rather than being assigned onto the DOM as with a plain input.
 */
export const Indeterminate = () => {
  const [checked, setChecked] = useState<CheckedState>('indeterminate');

  return (
    <div className="grid gap-2">
      <Label>
        <Checkbox checked={checked} onCheckedChange={setChecked} />
        Current state: {String(checked)}
      </Label>
      <p className="text-xs text-muted-foreground">
        Click to flip between true and false.
      </p>
    </div>
  );
};

/**
 * Select all
 *
 * The box at the head of a table is the textbook case for `indeterminate`: it
 * is derived from how many rows are ticked rather than holding its own state.
 */
export const SelectAll = () => {
  const [picked, setPicked] = useState<string[]>(['Marcus']);

  const all = picked.length === ROWS.length;
  const some = picked.length > 0 && !all;

  return (
    <div className="grid w-full max-w-xs gap-2">
      <Label className="border-b border-border pb-2">
        <Checkbox
          checked={all ? true : some ? 'indeterminate' : false}
          onCheckedChange={(checked) => setPicked(checked ? ROWS : [])}
        />
        Select all ({picked.length}/{ROWS.length})
      </Label>

      {ROWS.map((row) => (
        <Label key={row} className="pl-6">
          <Checkbox
            checked={picked.includes(row)}
            onCheckedChange={(checked) =>
              setPicked((current) =>
                checked
                  ? [...current, row]
                  : current.filter((entry) => entry !== row),
              )
            }
          />
          {row}
        </Label>
      ))}
    </div>
  );
};

/**
 * States
 */
export const States = () => (
  <div className="grid gap-3">
    <Label>
      <Checkbox disabled />
      Locked, unticked
    </Label>
    <Label>
      <Checkbox disabled checked />
      Locked, ticked
    </Label>
    <Label>
      <Checkbox aria-invalid />
      Required but not ticked
    </Label>
  </div>
);
