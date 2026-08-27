import { useState } from 'react';

import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from '@antkit/react';
import type { TooltipPlacement } from '@antkit/react';
import { InfoIcon, TrashIcon } from 'lucide-react';

import type { DemoMeta } from '../lib/types';

/**
 * A three-column compass, so each button sits roughly where its tooltip will
 * appear. `null` is an empty cell in the middle column.
 */
const PLACEMENTS: { key: string; placement: TooltipPlacement | null }[] = [
  'topLeft',
  'top',
  'topRight',
  'leftTop',
  null,
  'rightTop',
  'left',
  null,
  'right',
  'leftBottom',
  null,
  'rightBottom',
  'bottomLeft',
  'bottom',
  'bottomRight',
].map((placement, index) => ({
  key: placement ?? `empty-${index}`,
  placement: placement as TooltipPlacement | null,
}));

export const meta: DemoMeta = {
  imports: [
    'Tooltip',
    'TooltipProvider',
    'TooltipRoot',
    'TooltipTrigger',
    'TooltipContent',
  ],
  extraImports: ["import type { TooltipPlacement } from '@antkit/react';"],
  api: [
    {
      title: 'Tooltip',
      description:
        'Needs a `TooltipProvider` above it — `Sidebar` and `Gantt` mount one for their own subtree, otherwise put one near the app root. A tooltip’s child has to forward its ref and props; every control in the kit does.',
      props: [
        {
          name: 'title',
          type: 'ReactNode',
          description:
            'The hint itself. Empty renders nothing and returns the child untouched, so a label that may be empty needs no branch around it.',
        },
        {
          name: 'placement',
          type: 'TooltipPlacement',
          default: "'top'",
          description:
            'Twelve placements: top, bottom, left, right, and the Left/Right/Top/Bottom variants.',
        },
        {
          name: 'open / defaultOpen / onOpenChange',
          type: 'boolean | (open: boolean) => void',
          description: 'Controls the open state.',
        },
        {
          name: 'mouseEnterDelay',
          type: 'number',
          description: 'Milliseconds to wait before showing.',
        },
        {
          name: 'children',
          type: 'ReactElement',
          description: 'Exactly one element to act as the trigger. Required.',
        },
      ],
    },
    {
      title: 'TooltipProvider / TooltipRoot / TooltipTrigger / TooltipContent',
      description:
        'The four raw Radix wrappers, for when the tooltip needs a controlled open state or a trigger that is not a single element.',
      props: [
        {
          name: 'delayDuration',
          type: 'number',
          default: '0',
          description: 'The shared delay, set on `TooltipProvider`.',
        },
        {
          name: 'side / align',
          type: "'top' | 'bottom' | 'left' | 'right' | 'start' | 'center' | 'end'",
          description:
            'How Radix describes placement, set on `TooltipContent`. `Tooltip`’s `placement` is translated into exactly this pair.',
        },
      ],
    },
  ],
};

/**
 * Basic
 */
export const Basic = () => (
  <>
    <Tooltip title="Delete record">
      <Button variant="ghost" size="icon" aria-label="Delete">
        <TrashIcon />
      </Button>
    </Tooltip>

    <Tooltip title="Tuition includes course materials">
      <span className="inline-flex cursor-help items-center gap-1 text-sm text-muted-foreground">
        Tuition
        <InfoIcon className="size-3.5" />
      </span>
    </Tooltip>
  </>
);

/**
 * Twelve placements
 *
 * One `placement` names a side and an alignment in a single string; Radix wants
 * two values, and `Tooltip` does the translating between the two vocabularies.
 */
export const Placements = () => (
  <div className="grid w-full max-w-md grid-cols-3 gap-2">
    {PLACEMENTS.map(({ key, placement }) =>
      placement ? (
        <Tooltip key={key} title={placement} placement={placement}>
          <Button variant="secondary" size="sm" className="w-full">
            {placement}
          </Button>
        </Tooltip>
      ) : (
        <span key={key} />
      ),
    )}
  </div>
);

/**
 * Delay
 *
 * A beat of delay stops the tooltip firing when the pointer merely passes over.
 */
export const Delay = () => (
  <>
    <Tooltip title="Shows at once">
      <Button variant="secondary">0ms</Button>
    </Tooltip>
    <Tooltip title="Waits 500ms" mouseEnterDelay={500}>
      <Button variant="secondary">500ms</Button>
    </Tooltip>
  </>
);

/**
 * A label that may be empty
 *
 * An empty `title` renders no tooltip and leaves the button untouched — no
 * conditional branch needed around it.
 */
export const EmptyTitle = () => {
  const [hint, setHint] = useState('');

  return (
    <>
      <Tooltip title={hint}>
        <Button variant="secondary">
          {hint ? 'Has a tooltip' : 'No tooltip yet'}
        </Button>
      </Tooltip>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => setHint(hint ? '' : 'Now there is one')}
      >
        Toggle the label
      </Button>
    </>
  );
};

/**
 * Controlled
 *
 * Use the raw wrappers when the tooltip has to open from code — walking a
 * first-time user through the screen, say.
 */
export const Controlled = () => {
  const [open, setOpen] = useState(true);

  return (
    <TooltipProvider>
      <TooltipRoot open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <Button variant="secondary">Trigger</Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          This tooltip is decided by state, not by the pointer.
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
};
