import { useState } from 'react';

import { Button, Popconfirm } from '@antkit/react';
import { TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: ['Popconfirm'],
  api: [
    {
      title: 'Popconfirm',
      description:
        'Asks for confirmation right beside the button just pressed. Use `Modal.useModal().confirm()` for something weighty or that needs more input, and `message` or `toast` to report an outcome.',
      props: [
        {
          name: 'title',
          type: 'ReactNode',
          description:
            'The question. Keep it short — this is a bubble, not a dialog. Required.',
        },
        {
          name: 'description',
          type: 'ReactNode',
          description: 'A second line for a consequence worth spelling out.',
        },
        {
          name: 'children',
          type: 'ReactElement',
          description:
            'The element the bubble attaches to. It has to forward its ref and props. Required.',
        },
        {
          name: 'onConfirm',
          type: '() => unknown',
          description:
            'Return a promise and the OK button spins until it settles. The type is `unknown` so a one-liner like `() => toast.success("…")` needs no braces just to discard the return value.',
        },
        {
          name: 'onCancel',
          type: '() => void',
          description: 'Called when Cancel is pressed.',
        },
        {
          name: 'okText / cancelText',
          type: 'ReactNode',
          description:
            'The text on the two buttons. Defaults come from `ConfigProvider`.',
        },
        {
          name: 'okVariant',
          type: "'default' | 'destructive'",
          default: "'default'",
          description: '`destructive` for a delete, which is most of the time.',
        },
        {
          name: 'icon',
          type: 'ReactNode | null',
          description: '`null` drops the icon.',
        },
        {
          name: 'placement',
          type: 'TooltipPlacement',
          default: "'top'",
          description: 'Twelve placements.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Renders the child untouched, with no bubble at all.',
        },
        {
          name: 'open / onOpenChange',
          type: 'boolean | (open: boolean) => void',
          description: 'Controls the open state.',
        },
      ],
    },
  ],
};

/**
 * Basic
 */
export const Basic = () => (
  <Popconfirm
    title="Delete this student?"
    okVariant="destructive"
    onConfirm={() => toast.success('Deleted')}
  >
    <Button variant="destructive" size="sm" prefix={<TrashIcon />}>
      Delete
    </Button>
  </Popconfirm>
);

/**
 * With a description
 *
 * One more line for the consequence — only when it genuinely warrants one.
 */
export const WithDescription = () => (
  <Popconfirm
    title="Cancel this class?"
    description="All 12 students are emailed immediately."
    okText="Cancel class"
    okVariant="destructive"
    onConfirm={() => toast.success('Class cancelled')}
  >
    <Button variant="secondary" size="sm">
      Cancel class
    </Button>
  </Popconfirm>
);

/**
 * Waiting on the server
 *
 * Return a promise from `onConfirm` and the OK button spins until it settles.
 */
export const Async = () => (
  <Popconfirm
    title="Resend the confirmation email?"
    onConfirm={() =>
      new Promise((resolve) => setTimeout(resolve, 1500)).then(() =>
        toast.success('Sent'),
      )
    }
  >
    <Button variant="secondary" size="sm">
      Resend email
    </Button>
  </Popconfirm>
);

/**
 * Placement
 */
export const Placement = () => (
  <>
    {(['top', 'right', 'bottom', 'left'] as const).map((placement) => (
      <Popconfirm
        key={placement}
        title={`placement="${placement}"`}
        placement={placement}
        onConfirm={() => toast(placement)}
      >
        <Button variant="secondary" size="sm">
          {placement}
        </Button>
      </Popconfirm>
    ))}
  </>
);

/**
 * Without the icon
 */
export const NoIcon = () => (
  <Popconfirm
    title="Mark this as complete?"
    icon={null}
    onConfirm={() => toast.success('Updated')}
  >
    <Button variant="secondary" size="sm">
      Complete
    </Button>
  </Popconfirm>
);

/**
 * Asking only when it matters
 *
 * `disabled` hands the child back untouched — for when only certain records
 * need confirming.
 */
export const Conditional = () => {
  const [risky, setRisky] = useState(true);

  return (
    <div className="flex items-center gap-3">
      <Popconfirm
        title="This record is in use. Delete it anyway?"
        okVariant="destructive"
        disabled={!risky}
        onConfirm={() => toast.success('Deleted')}
      >
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            if (!risky) toast.success('Deleted straight away, no question');
          }}
        >
          Delete
        </Button>
      </Popconfirm>

      <Button size="sm" variant="ghost" onClick={() => setRisky(!risky)}>
        {risky ? 'Confirmation on' : 'Confirmation off'}
      </Button>
    </div>
  );
};
