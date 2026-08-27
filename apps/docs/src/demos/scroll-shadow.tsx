import { useState } from 'react';

import { Badge, ScrollShadow, Separator } from '@antkit/react';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: ['ScrollShadow'],
  api: [
    {
      title: 'ScrollShadow',
      description: 'Takes every prop a <div> does, plus the ones below.',
      props: [
        {
          name: 'orientation',
          type: "'vertical' | 'horizontal'",
          default: "'vertical'",
          description:
            'The scrolling axis. Overflow is locked on the other one.',
        },
        {
          name: 'size',
          type: 'number',
          default: '40',
          description: 'How long the fade is, in pixels.',
        },
        {
          name: 'offset',
          type: 'number',
          default: '0',
          description:
            'How many pixels short of the edge still counts as having reached it. Raise it when the content has padding at either end.',
        },
        {
          name: 'hideScrollBar',
          type: 'boolean',
          default: 'false',
          description: 'Hides the browser’s own scrollbar.',
        },
        {
          name: 'enabled',
          type: 'boolean',
          default: 'true',
          description:
            'Off makes it a plain scroll container: nothing measured, no edge faded.',
        },
        {
          name: 'visibility',
          type: "'both' | 'top' | 'bottom' | 'left' | 'right' | 'none'",
          description:
            'Pins which edges fade instead of deriving it from the scroll position. Left out, it is automatic.',
        },
        {
          name: 'onVisibilityChange',
          type: '(visibility: ScrollShadowVisibility) => void',
          description: 'Runs whenever the set of faded edges changes.',
        },
      ],
    },
  ],
};

const TASKS = [
  'Sign off enterprise pricing',
  'Rebuild the checkout page',
  'Drop the unused column on orders',
  'Document the webhook API',
  'Re-measure homepage load time',
  'Merge the two duplicate customer tables',
  'Alert when the queue passes 500',
  'Clean up unreferenced images',
];

/**
 * Vertical
 *
 * The frame needs a definite height before anything can overflow — `h-56`
 * here.
 */
export const Vertical = () => (
  <ScrollShadow className="h-56 w-full max-w-sm rounded-lg border">
    <div className="divide-y">
      {TASKS.map((task) => (
        <div key={task} className="px-4 py-3 text-sm">
          {task}
        </div>
      ))}
    </div>
  </ScrollShadow>
);

/**
 * Horizontal, with the scrollbar hidden
 *
 * `hideScrollBar` takes the native bar away, leaving the fade as the only sign
 * that there is more to the right.
 */
export const Horizontal = () => (
  <ScrollShadow
    orientation="horizontal"
    hideScrollBar
    className="w-full max-w-sm"
  >
    <div className="flex w-max gap-2 py-1">
      {['All', 'Open', 'Pending', 'Closed', 'Archived', 'Draft'].map(
        (label) => (
          <Badge key={label} variant="outline" className="whitespace-nowrap">
            {label}
          </Badge>
        ),
      )}
    </div>
  </ScrollShadow>
);

/**
 * Fade length
 *
 * `size` is in pixels. A short fade reads as decisive, a long one as softer.
 */
export const Size = () => (
  <div className="flex w-full max-w-md gap-4">
    {[16, 72].map((size) => (
      <ScrollShadow
        key={size}
        size={size}
        className="h-40 flex-1 rounded-lg border"
      >
        <div className="space-y-2 p-3 text-sm">
          <p className="font-medium">size={size}</p>
          {TASKS.map((task) => (
            <p key={task} className="text-muted-foreground">
              {task}
            </p>
          ))}
        </div>
      </ScrollShadow>
    ))}
  </div>
);

/**
 * Watching the faded edges
 *
 * `onVisibilityChange` runs when the set of faded edges changes — enough to
 * know whether the reader has hit the bottom, without attaching a listener.
 */
export const VisibilityChange = () => {
  const [visibility, setVisibility] = useState('none');

  return (
    <div className="w-full max-w-sm space-y-3">
      <ScrollShadow
        onVisibilityChange={setVisibility}
        className="h-40 rounded-lg border"
      >
        <div className="divide-y">
          {TASKS.map((task) => (
            <div key={task} className="px-4 py-3 text-sm">
              {task}
            </div>
          ))}
        </div>
      </ScrollShadow>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Faded edges:</span>
        <Separator orientation="vertical" className="h-4" />
        <code className="font-mono text-foreground">{visibility}</code>
      </div>
    </div>
  );
};
