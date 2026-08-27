import { useState } from 'react';

import { Label, Switch } from '@antkit/react';
import { toast } from 'sonner';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: ['Switch'],
  api: [
    {
      title: 'Switch',
      description:
        'Wraps Radix Switch and takes every prop it does except `children`. Use `Checkbox` when the value is only saved on submit.',
      props: [
        {
          name: 'checked',
          type: 'boolean',
          description: 'The controlled state.',
        },
        {
          name: 'defaultChecked',
          type: 'boolean',
          description: 'The starting state when uncontrolled.',
        },
        {
          name: 'onCheckedChange',
          type: '(checked: boolean) => void',
          description: 'Called when it is switched on or off.',
        },
        {
          name: 'size',
          type: "'sm' | 'default'",
          default: "'default'",
          description: '20px or 24px tall.',
        },
        {
          name: 'loading',
          type: 'boolean',
          default: 'false',
          description:
            'Locks it and spins the thumb — for when the flip has to go through an API before it counts.',
        },
        {
          name: 'checkedChildren',
          type: 'ReactNode',
          description: 'Text inside the track while on.',
        },
        {
          name: 'uncheckedChildren',
          type: 'ReactNode',
          description: 'Text inside the track while off.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Locks the switch.',
        },
      ],
    },
  ],
};

/**
 * Basic
 */
export const Basic = () => {
  const [on, setOn] = useState(true);

  return (
    <Label>
      <Switch checked={on} onCheckedChange={setOn} />
      Push notifications
    </Label>
  );
};

/**
 * Sizes
 */
export const Sizes = () => (
  <div className="flex items-center gap-4">
    <Switch size="sm" defaultChecked />
    <Switch defaultChecked />
  </div>
);

/**
 * Text in the track
 *
 * Give it labels and the track widens to fit them.
 */
export const WithLabels = () => (
  <div className="flex flex-wrap items-center gap-4">
    <Switch defaultChecked checkedChildren="On" uncheckedChildren="Off" />
    <Switch checkedChildren="1" uncheckedChildren="0" />
    <Switch
      size="sm"
      defaultChecked
      checkedChildren="ON"
      uncheckedChildren="OFF"
    />
  </div>
);

/**
 * Waiting on the server
 *
 * A switch like this commits the moment it is pressed, so it has to lock while
 * the API call runs — `loading` does both: locks it and says it is working.
 */
export const Loading = () => {
  const [on, setOn] = useState(false);
  const [saving, setSaving] = useState(false);

  const toggle = (next: boolean) => {
    setSaving(true);
    setTimeout(() => {
      setOn(next);
      setSaving(false);
      toast.success(
        next
          ? 'Two-factor authentication is on'
          : 'Two-factor authentication is off',
      );
    }, 1200);
  };

  return (
    <Label>
      <Switch checked={on} loading={saving} onCheckedChange={toggle} />
      Two-factor authentication
    </Label>
  );
};

/**
 * States
 */
export const States = () => (
  <div className="flex flex-wrap items-center gap-4">
    <Switch disabled />
    <Switch disabled defaultChecked />
    <Switch loading defaultChecked />
  </div>
);
