import { useState } from 'react';

import { CheckboxGroup, CheckboxOption } from '@antkit/react';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: ['CheckboxGroup', 'CheckboxOption', 'useCheckboxGroup'],
  api: [
    {
      title: 'CheckboxGroup',
      description:
        'Radix has no primitive for a checkbox group — a checkbox group is not roving tabindex, and each box still takes focus on its own. This component only handles the shared value.',
      props: [
        {
          name: 'value',
          type: 'string[]',
          description: 'Which values are ticked, when you hold the state.',
        },
        {
          name: 'defaultValue',
          type: 'string[]',
          description: 'Which values start ticked when uncontrolled.',
        },
        {
          name: 'onValueChange',
          type: '(value: string[]) => void',
          description: 'Called with the new array on every tick and untick.',
        },
        {
          name: 'name',
          type: 'string',
          description:
            'Each box submits as `name[]`, for an HTML form posting straight to the server.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Locks the whole group, dimming the labels with it.',
        },
        {
          name: 'orientation',
          type: "'vertical' | 'horizontal'",
          default: "'vertical'",
          description: 'Which way the options are laid out.',
        },
      ],
    },
    {
      title: 'CheckboxOption',
      description:
        'One labelled option: the box, the label, and a line of help.',
      props: [
        {
          name: 'value',
          type: 'string',
          description:
            'The value it contributes to the group’s array. Required.',
        },
        {
          name: 'description',
          type: 'ReactNode',
          description:
            'The line under the label. It sits inside the `<label>`, so clicking it ticks the box too.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          description: 'Locks one option on its own.',
        },
      ],
    },
    {
      title: 'useCheckboxGroup()',
      description:
        'Reads the group’s state from inside — for a select-all box, a counter, or a clear button.',
      props: [
        {
          name: 'value',
          type: 'string[]',
          description: 'What is currently ticked.',
        },
        {
          name: 'toggle',
          type: '(value: string, checked: boolean) => void',
          description: 'Toggles one value.',
        },
        {
          name: 'disabled',
          type: 'boolean | undefined',
          description: 'Whether the group is locked.',
        },
      ],
    },
  ],
};

/**
 * Basic
 */
export const Basic = () => {
  const [channels, setChannels] = useState<string[]>(['email']);

  return (
    <div className="grid w-full max-w-md gap-3">
      <CheckboxGroup value={channels} onValueChange={setChannels}>
        <CheckboxOption value="email">Email</CheckboxOption>
        <CheckboxOption value="sms" description="Charged per message">
          SMS
        </CheckboxOption>
        <CheckboxOption value="zalo" disabled>
          WhatsApp (not connected)
        </CheckboxOption>
      </CheckboxGroup>

      <p className="text-xs text-muted-foreground">
        Selected: {channels.join(', ') || '—'}
      </p>
    </div>
  );
};

/**
 * Horizontal
 */
export const Horizontal = () => (
  <CheckboxGroup orientation="horizontal" defaultValue={['mon', 'wed']}>
    <CheckboxOption value="mon">Monday</CheckboxOption>
    <CheckboxOption value="wed">Wednesday</CheckboxOption>
    <CheckboxOption value="fri">Friday</CheckboxOption>
  </CheckboxGroup>
);

/**
 * Locking the whole group
 *
 * `disabled` on the group dims the labels too, because `Label` is the box’s
 * sibling and so catches the `peer-disabled` variant.
 */
export const Disabled = () => (
  <CheckboxGroup disabled defaultValue={['email']}>
    <CheckboxOption value="email">Email</CheckboxOption>
    <CheckboxOption value="sms" description="Requires a plan upgrade">
      SMS
    </CheckboxOption>
  </CheckboxGroup>
);

/**
 * Submitting through an HTML form
 *
 * With `name`, each box posts as `channels[]` — no JavaScript needed to
 * collect the values.
 */
export const NativeForm = () => (
  <form
    className="grid w-full max-w-md gap-3"
    onSubmit={(event) => event.preventDefault()}
  >
    <CheckboxGroup name="channels" defaultValue={['email']}>
      <CheckboxOption value="email">Email</CheckboxOption>
      <CheckboxOption value="sms">SMS</CheckboxOption>
    </CheckboxGroup>
    <p className="text-xs text-muted-foreground">
      Posted to the server as channels[]=email&channels[]=sms
    </p>
  </form>
);
