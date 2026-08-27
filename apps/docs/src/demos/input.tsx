import { useState } from 'react';

import { Button, Input, Label } from '@antkit/react';
import { MailIcon, SearchIcon } from 'lucide-react';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: ['Input'],
  api: [
    {
      title: 'Input',
      description:
        'A styled <input> and nothing more — it takes every DOM prop and adds none of its own. For a prefix, an addon or a button inside, build it with a relative wrapper as the examples below do.',
      props: [
        {
          name: 'type',
          type: 'string',
          default: "'text'",
          description:
            'Any HTML input type: text, password, email, number, search, date…',
        },
        {
          name: 'value / defaultValue',
          type: 'string | number',
          description: 'Controlled or not, exactly as on a plain <input>.',
        },
        {
          name: 'onChange',
          type: '(event: ChangeEvent<HTMLInputElement>) => void',
          description: 'The native DOM event, not wrapped.',
        },
        {
          name: 'aria-invalid',
          type: 'boolean',
          description:
            'Turns the border and focus ring red. `Form.Item` sets it for you.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Locks the field and dims it to 50%.',
        },
        {
          name: 'className',
          type: 'string',
          description:
            'Merged with tailwind-merge, so your `h-10` or `pl-9` beats the default.',
        },
      ],
    },
  ],
};

/**
 * Basic
 */
export const Basic = () => (
  <div className="grid w-full max-w-xs gap-2">
    <Input placeholder="Type something…" />
    <Input defaultValue="Already filled in" />
    <Input disabled placeholder="Disabled" />
  </div>
);

/**
 * Input types
 */
export const Types = () => (
  <div className="grid w-full max-w-xs gap-2">
    <Input type="email" placeholder="you@company.com" />
    <Input type="password" defaultValue="secret123" />
    <Input type="number" placeholder="0" />
    <Input type="date" />
    <Input type="file" />
  </div>
);

/**
 * With a label
 *
 * `htmlFor` ties the label to the field, so clicking the text puts the caret
 * in the box.
 */
export const WithLabel = () => (
  <div className="grid w-full max-w-xs gap-2">
    <Label htmlFor="demo-email">Email</Label>
    <Input id="demo-email" type="email" placeholder="you@company.com" />
  </div>
);

/**
 * Error state
 *
 * `aria-invalid` changes the border colour and tells screen readers — do not
 * settle for painting it red with `className`.
 */
export const Invalid = () => (
  <div className="grid w-full max-w-xs gap-1.5">
    <Input aria-invalid defaultValue="not-an-email" />
    <p className="text-xs text-destructive">Enter a valid email address</p>
  </div>
);

/**
 * An icon inside
 *
 * There is no `prefix` prop: wrap it in a `relative` block and leave padding
 * for the icon.
 */
export const WithIcon = () => (
  <div className="grid w-full max-w-xs gap-2">
    <div className="relative">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input className="pl-9" placeholder="Search students…" />
    </div>

    <div className="relative">
      <MailIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input className="pl-9" type="email" placeholder="Email" />
    </div>
  </div>
);

/**
 * Joined to a button
 *
 * Drop the radius on the meeting edges so the two read as one block.
 */
export const WithButton = () => (
  <div className="flex w-full max-w-sm">
    <Input className="rounded-r-none" placeholder="Enter a promo code" />
    <Button className="rounded-l-none">Apply</Button>
  </div>
);

/**
 * Counting characters
 *
 * `maxLength` stops it at the browser level; the counter is yours to draw.
 */
export const WithCount = () => {
  const [value, setValue] = useState('');

  return (
    <div className="grid w-full max-w-xs gap-1.5">
      <Input
        maxLength={40}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Campaign title"
      />
      <span className="self-end text-xs text-muted-foreground tabular-nums">
        {value.length} / 40
      </span>
    </div>
  );
};
