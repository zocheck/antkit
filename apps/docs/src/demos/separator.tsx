import { Separator } from '@antkit/react';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: ['Separator'],
  api: [
    {
      title: 'Separator',
      description: 'Wraps Radix Separator and takes every prop it does.',
      props: [
        {
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          default: "'horizontal'",
          description:
            'Horizontal fills the parent’s width, vertical fills its height — so the parent needs a height.',
        },
        {
          name: 'decorative',
          type: 'boolean',
          default: 'true',
          description:
            'true means it is there to be looked at and screen readers skip it. Set false when the rule genuinely divides two different groups of content.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Change the colour or the weight, e.g. bg-border/60.',
        },
      ],
    },
  ],
};

/**
 * Horizontal
 */
export const Horizontal = () => (
  <div className="w-full max-w-sm">
    <p className="text-sm font-medium">Contact details</p>
    <Separator className="my-3" />
    <p className="text-sm text-muted-foreground">
      sarah.chen@example.com · +1 415 555 0134
    </p>
  </div>
);

/**
 * Vertical
 *
 * A vertical rule takes its height from the parent, so the parent has to be a
 * flex row with a definite height — `h-5` here.
 */
export const Vertical = () => (
  <div className="flex h-5 items-center gap-3 text-sm">
    <span>Overview</span>
    <Separator orientation="vertical" />
    <span>Courses</span>
    <Separator orientation="vertical" />
    <span>Reports</span>
  </div>
);

/**
 * With a label
 *
 * There is no separate `Divider` component; this pairs two rules with a label
 * between them.
 */
export const WithLabel = () => (
  <div className="flex w-full max-w-sm items-center gap-3">
    <Separator className="flex-1" />
    <span className="text-xs text-muted-foreground">or</span>
    <Separator className="flex-1" />
  </div>
);
