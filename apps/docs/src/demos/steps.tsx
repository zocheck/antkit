import { useState } from 'react';

import { Button, Steps } from '@antkit/react';
import type { StepItem } from '@antkit/react';
import { CreditCardIcon, FileTextIcon, TruckIcon } from 'lucide-react';

import type { DemoMeta } from '../lib/types';

const ITEMS: StepItem[] = [
  { title: 'Details', description: 'Name and contact' },
  { title: 'Course', description: 'Pick a class and a slot' },
  { title: 'Payment', description: 'Issue the invoice' },
];

export const meta: DemoMeta = {
  imports: ['Steps'],
  extraImports: ["import type { StepItem } from '@antkit/react';"],
  api: [
    {
      title: 'Steps',
      props: [
        {
          name: 'items',
          type: 'StepItem[]',
          description: 'The steps. Required.',
        },
        {
          name: 'current',
          type: 'number',
          default: '0',
          description:
            'The index of the current step, counting from 0. Everything before it is finish, everything after is wait.',
        },
        {
          name: 'status',
          type: "'wait' | 'process' | 'finish' | 'error'",
          default: "'process'",
          description:
            'The status of the current step alone — set error when that step has failed.',
        },
        {
          name: 'direction',
          type: "'horizontal' | 'vertical'",
          default: "'horizontal'",
          description: 'Which way the steps are laid out.',
        },
        {
          name: 'size',
          type: "'default' | 'sm'",
          default: "'default'",
          description: 'sm shrinks the markers and the text.',
        },
        {
          name: 'onChange',
          type: '(current: number) => void',
          description:
            'With this prop the steps become clickable, and still reachable by keyboard.',
        },
      ],
    },
    {
      title: 'StepItem',
      props: [
        { name: 'title', type: 'ReactNode', description: 'The step name.' },
        {
          name: 'description',
          type: 'ReactNode',
          description: 'The line under the name.',
        },
        {
          name: 'icon',
          type: 'ReactNode',
          description: 'Replaces the number or tick inside the marker.',
        },
        {
          name: 'status',
          type: "'wait' | 'process' | 'finish' | 'error'",
          description:
            'Pins the status for this step, ignoring what `current` would imply.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          description: 'Stops this step being clicked.',
        },
        {
          name: 'key',
          type: 'string',
          description:
            'Only needed when the list gets reordered; the position is the identity by default.',
        },
      ],
    },
  ],
};

/**
 * Basic
 */
export const Basic = () => (
  <Steps className="w-full" current={1} items={ITEMS} />
);

/**
 * Clicking between steps
 *
 * With `onChange` the steps become buttons — for a wizard that lets you go
 * back and edit.
 */
export const Clickable = () => {
  const [current, setCurrent] = useState(1);

  return (
    <div className="grid w-full gap-4">
      <Steps current={current} onChange={setCurrent} items={ITEMS} />
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          disabled={current === 0}
          onClick={() => setCurrent(current - 1)}
        >
          Back
        </Button>
        <Button
          size="sm"
          disabled={current === ITEMS.length - 1}
          onClick={() => setCurrent(current + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

/**
 * A failed step
 *
 * `status="error"` paints the current step red. The ones before it still count
 * as finished.
 */
export const Error = () => (
  <Steps
    className="w-full"
    current={2}
    status="error"
    items={[
      { title: 'Upload the file' },
      { title: 'Validate the data' },
      { title: 'Import', description: 'Missing email column on row 12' },
    ]}
  />
);

/**
 * Vertical
 *
 * Vertical suits an approval log, where each step carries a long description.
 */
export const Vertical = () => (
  <Steps
    className="w-full max-w-md"
    direction="vertical"
    current={1}
    items={[
      {
        title: 'Application submitted',
        description: 'Received at 08:30 on 15 August.',
      },
      {
        title: 'Under review',
        description: 'Dana Whitfield is working through it.',
      },
      { title: 'Approval', description: 'Waiting on the head of department.' },
    ]}
  />
);

/**
 * Custom icons
 *
 * `icon` replaces the number inside the marker entirely.
 */
export const WithIcons = () => (
  <Steps
    className="w-full"
    current={1}
    items={[
      { title: 'Contract', icon: <FileTextIcon className="size-4" /> },
      { title: 'Payment', icon: <CreditCardIcon className="size-4" /> },
      { title: 'Delivery', icon: <TruckIcon className="size-4" /> },
    ]}
  />
);

/**
 * Small
 */
export const Small = () => (
  <Steps className="w-full" size="sm" current={2} items={ITEMS} />
);

/**
 * Pinning a status per step
 *
 * When the process is not sequential, set `status` on each item instead.
 */
export const PerStepStatus = () => (
  <Steps
    className="w-full"
    items={[
      { title: 'Received', status: 'finish' },
      {
        title: 'Verification',
        status: 'error',
        description: 'ID number does not match',
      },
      { title: 'Class assignment', status: 'process' },
      { title: 'First session', status: 'wait' },
    ]}
  />
);
