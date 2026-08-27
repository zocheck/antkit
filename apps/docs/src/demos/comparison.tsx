import { useState } from 'react';

import { Comparison, ComparisonHandle, ComparisonItem } from '@antkit/react';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: ['Comparison', 'ComparisonItem', 'ComparisonHandle'],
  api: [
    {
      title: 'Comparison',
      description:
        'Two layers stacked, split by a divider the viewer can drag. Takes every prop a <div> does except `onChange` and `defaultValue`.',
      props: [
        {
          name: 'mode',
          type: "'drag' | 'hover'",
          default: "'drag'",
          description:
            '`drag` follows the pointer only while the button is held; `hover` follows as soon as the pointer enters.',
        },
        {
          name: 'position',
          type: 'number',
          description:
            'The divider’s position, 0–100, when you hold the state.',
        },
        {
          name: 'defaultPosition',
          type: 'number',
          default: '50',
          description: 'The starting position when uncontrolled.',
        },
        {
          name: 'onPositionChange',
          type: '(position: number) => void',
          description: 'Called when the divider moves.',
        },
        {
          name: 'step',
          type: 'number',
          default: '5',
          description: 'How many percent an arrow key moves it.',
        },
        {
          name: 'onDragStart / onDragEnd',
          type: '() => void',
          description: 'The start and end of a drag.',
        },
      ],
    },
    {
      title: 'ComparisonItem / ComparisonHandle',
      props: [
        {
          name: 'position',
          type: "'left' | 'right'",
          description:
            'Which side of the divider this layer is on. Required on `ComparisonItem`.',
        },
        {
          name: 'ComparisonHandle',
          type: "ComponentProps<'div'>",
          description:
            'The divider and its handle. Without it nothing can be dragged.',
        },
      ],
    },
  ],
};

/**
 * Basic
 *
 * Drag the handle, or use the arrow keys while it has focus.
 */
export const Basic = () => (
  <Comparison className="aspect-video w-full max-w-lg overflow-hidden rounded-lg border">
    <ComparisonItem position="left">
      <img
        src="/demo/before.svg"
        alt="Before editing"
        className="size-full object-cover"
      />
    </ComparisonItem>
    <ComparisonItem position="right">
      <img
        src="/demo/after.svg"
        alt="After editing"
        className="size-full object-cover"
      />
    </ComparisonItem>
    <ComparisonHandle />
  </Comparison>
);

/**
 * Following the pointer
 *
 * `mode="hover"` drops the hold — quicker to sweep across, but harder to stop
 * at an exact position.
 */
export const Hover = () => (
  <Comparison
    mode="hover"
    className="aspect-video w-full max-w-lg overflow-hidden rounded-lg border"
  >
    <ComparisonItem position="left">
      <img
        src="/demo/before.svg"
        alt="Before"
        className="size-full object-cover"
      />
    </ComparisonItem>
    <ComparisonItem position="right">
      <img
        src="/demo/after.svg"
        alt="After"
        className="size-full object-cover"
      />
    </ComparisonItem>
    <ComparisonHandle />
  </Comparison>
);

/**
 * Controlled
 */
export const Controlled = () => {
  const [position, setPosition] = useState(30);

  return (
    <div className="grid w-full max-w-lg gap-2">
      <Comparison
        position={position}
        onPositionChange={setPosition}
        className="aspect-video overflow-hidden rounded-lg border"
      >
        <ComparisonItem position="left">
          <img
            src="/demo/before.svg"
            alt="Before"
            className="size-full object-cover"
          />
        </ComparisonItem>
        <ComparisonItem position="right">
          <img
            src="/demo/after.svg"
            alt="After"
            className="size-full object-cover"
          />
        </ComparisonItem>
        <ComparisonHandle />
      </Comparison>

      <p className="text-xs text-muted-foreground">
        At {Math.round(position)}%
      </p>
    </div>
  );
};

/**
 * Comparing any content
 *
 * The two layers need not be images — text, a chart, or a whole block of UI
 * all work.
 */
export const AnyContent = () => (
  <Comparison className="h-40 w-full max-w-lg overflow-hidden rounded-lg border">
    <ComparisonItem position="left">
      <div className="flex size-full items-center justify-center bg-muted text-sm text-muted-foreground">
        Draft
      </div>
    </ComparisonItem>
    <ComparisonItem position="right">
      <div className="flex size-full items-center justify-center bg-primary text-sm text-primary-foreground">
        Approved
      </div>
    </ComparisonItem>
    <ComparisonHandle />
  </Comparison>
);
