import { Checkbox, Input, Label, Switch } from '@antkit/react';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: ['Label'],
  api: [
    {
      title: 'Label',
      description:
        'Wraps Radix Label. It is a horizontal flex row with an 8px gap, so dropping a Checkbox straight inside lines them up.',
      props: [
        {
          name: 'htmlFor',
          type: 'string',
          description:
            'Id of the control it belongs to. Clicking the label focuses or toggles that control.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Merged with tailwind-merge.',
        },
      ],
    },
  ],
};

/**
 * Bound to a field
 *
 * Clicking the word "Email" puts the caret in the box — that is the reason to
 * use `Label` rather than a `<span>`.
 */
export const Basic = () => (
  <div className="grid w-full max-w-xs gap-2">
    <Label htmlFor="label-email">Email</Label>
    <Input id="label-email" type="email" placeholder="you@company.com" />
  </div>
);

/**
 * Wrapping a control
 *
 * Put the control inside the label and `htmlFor` becomes unnecessary — the
 * whole row turns into the hit area.
 */
export const Wrapping = () => (
  <div className="grid gap-3">
    <Label>
      <Checkbox defaultChecked />
      Email me about updates
    </Label>
    <Label>
      <Switch />
      Enable two-factor authentication
    </Label>
  </div>
);

/**
 * Marking a field required
 *
 * The asterisk goes before the label; add it yourself, and keep it out of the
 * screen reader's path.
 */
export const Required = () => (
  <div className="grid w-full max-w-xs gap-2">
    <Label htmlFor="label-name">
      <span aria-hidden="true" className="text-destructive">
        *
      </span>
      Full name
    </Label>
    <Input id="label-name" required placeholder="Sarah Chen" />
  </div>
);

/**
 * Following the control's state
 *
 * The label dims itself when the control right before it is disabled, through
 * the `peer-disabled` variant.
 */
export const Disabled = () => (
  <div className="grid w-full max-w-xs gap-2">
    <Input id="label-locked" disabled className="peer" placeholder="Locked" />
    <Label htmlFor="label-locked">Contract number (read-only)</Label>
  </div>
);
