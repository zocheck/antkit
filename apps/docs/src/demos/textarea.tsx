import { useState } from 'react';

import { Label, Textarea } from '@antkit/react';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: ['Textarea'],
  api: [
    {
      title: 'Textarea',
      description: 'Takes every prop a <textarea> does, plus the three below.',
      props: [
        {
          name: 'autoSize',
          type: 'boolean | { minRows?: number; maxRows?: number }',
          default: 'false',
          description:
            'Grows with the content. With `maxRows` it switches to scrolling once it hits the ceiling.',
        },
        {
          name: 'showCount',
          type: 'boolean',
          default: 'false',
          description:
            'Shows the character count under the box. With `maxLength` it prints as `used / limit`.',
        },
        {
          name: 'wrapperClassName',
          type: 'string',
          description:
            'Only used with `showCount` — styles the wrapper, while `className` still lands on the field itself.',
        },
        {
          name: 'maxLength',
          type: 'number',
          description: 'Caps the length at the browser level.',
        },
        {
          name: 'rows',
          type: 'number',
          description:
            'The starting number of rows. Not for use with `autoSize`, which works the height out itself.',
        },
      ],
    },
  ],
};

/**
 * Basic
 *
 * Without `autoSize` the box can be dragged by its bottom edge.
 */
export const Basic = () => (
  <Textarea className="max-w-sm" placeholder="Notes about this student…" />
);

/**
 * Growing with the content
 *
 * `minRows` holds a floor, `maxRows` a ceiling before it starts scrolling.
 * Type a few lines to watch it grow.
 */
export const AutoSize = () => (
  <div className="grid w-full max-w-sm gap-3">
    <Textarea autoSize placeholder="Grows without limit" />
    <Textarea
      autoSize={{ minRows: 2, maxRows: 5 }}
      placeholder="Grows from 2 to 5 rows"
    />
  </div>
);

/**
 * Counting characters
 */
export const ShowCount = () => (
  <div className="grid w-full max-w-sm gap-3">
    <Textarea showCount maxLength={200} placeholder="200 characters maximum" />
    <Textarea showCount placeholder="Counts, but does not cap" />
  </div>
);

/**
 * With a label and a hint
 */
export const WithLabel = () => (
  <div className="grid w-full max-w-sm gap-2">
    <Label htmlFor="demo-note">Internal note</Label>
    <Textarea
      id="demo-note"
      autoSize={{ minRows: 3 }}
      placeholder="Only staff can see this"
    />
    <p className="text-xs text-muted-foreground">
      This is never shown to the student.
    </p>
  </div>
);

/**
 * States
 */
export const States = () => (
  <div className="grid w-full max-w-sm gap-3">
    <Textarea disabled defaultValue="Cannot be edited" />
    <Textarea aria-invalid defaultValue="This content is not valid" />
    <Textarea
      readOnly
      defaultValue="Read-only — still selectable and copyable"
    />
  </div>
);

/**
 * Controlled
 */
export const Controlled = () => {
  const [value, setValue] = useState('The course starts on 12 September.');

  return (
    <div className="grid w-full max-w-sm gap-2">
      <Textarea
        autoSize={{ minRows: 2, maxRows: 6 }}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <p className="text-xs text-muted-foreground">
        {value.trim().split(/\s+/).filter(Boolean).length} words
      </p>
    </div>
  );
};
