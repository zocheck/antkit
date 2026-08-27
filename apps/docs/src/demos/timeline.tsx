import {
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from '@antkit/react';
import { CheckIcon, TruckIcon, XIcon } from 'lucide-react';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: [
    'Timeline',
    'TimelineItem',
    'TimelineIndicator',
    'TimelineContent',
    'TimelineHeader',
    'TimelineTitle',
    'TimelineTime',
    'TimelineDescription',
  ],
  api: [
    {
      title: 'Timeline / TimelineItem',
      description:
        'A vertical timeline — a run history, an audit log, the steps of a process. Use `Gantt` for bars placed by date on a horizontal axis.',
      props: [
        {
          name: 'status',
          type: "'complete' | 'current' | 'pending' | 'error'",
          default: "'pending'",
          description:
            'Set on `TimelineItem`. The status flows down to the indicator and the rail below it, so it is only declared once.',
        },
      ],
    },
    {
      title: 'TimelineIndicator',
      description:
        'Takes every prop a <div> does except `color`, which is redefined.',
      props: [
        {
          name: 'size',
          type: "'dot' | 'icon'",
          description:
            '`dot` is a bare 10px node. `icon` is a 24px badge that can hold a glyph. With children it defaults to `icon`.',
        },
        {
          name: 'variant',
          type: "'filled' | 'outlined'",
          description:
            '`outlined` is a hollow ring, `filled` is solid. It defaults to solid for states that have already happened.',
        },
        {
          name: 'color',
          type: 'string',
          description:
            'Any CSS colour, for a state the component does not ship.',
        },
        {
          name: 'loading',
          type: 'boolean',
          default: 'false',
          description:
            'Replaces the node with a spinner, for a step still running.',
        },
        {
          name: 'status',
          type: 'TimelineStatus',
          description:
            'Overrides the status inherited from the item — only needed when the indicator sits outside a `TimelineItem`.',
        },
      ],
    },
    {
      title: 'TimelineContent / Header / Title / Time / Description',
      props: [
        {
          name: 'TimelineContent',
          type: "ComponentProps<'div'>",
          description: 'The content column to the right of the rail.',
        },
        {
          name: 'TimelineHeader',
          type: "ComponentProps<'div'>",
          description: 'The row holding the title and the time.',
        },
        {
          name: 'TimelineTitle',
          type: "ComponentProps<'p'>",
          description: 'The name of the event.',
        },
        {
          name: 'TimelineTime',
          type: "ComponentProps<'time'>",
          description:
            'The timestamp — remember `dateTime` so machines can read it.',
        },
        {
          name: 'TimelineDescription',
          type: "ComponentProps<'p'>",
          description: 'The line under it.',
        },
      ],
    },
  ],
};

/**
 * Basic
 *
 * The status goes on the item, and it colours both the dot and the rail below.
 */
export const Basic = () => (
  <Timeline className="w-full max-w-md">
    <TimelineItem status="complete">
      <TimelineIndicator />
      <TimelineContent>
        <TimelineHeader>
          <TimelineTitle>Order created</TimelineTitle>
          <TimelineTime dateTime="2026-08-27T08:30">08:30</TimelineTime>
        </TimelineHeader>
        <TimelineDescription>Order ORD-000002 was created.</TimelineDescription>
      </TimelineContent>
    </TimelineItem>

    <TimelineItem status="complete">
      <TimelineIndicator />
      <TimelineContent>
        <TimelineHeader>
          <TimelineTitle>Payment confirmed</TimelineTitle>
          <TimelineTime dateTime="2026-08-27T09:15">09:15</TimelineTime>
        </TimelineHeader>
      </TimelineContent>
    </TimelineItem>

    <TimelineItem status="current">
      <TimelineIndicator />
      <TimelineContent>
        <TimelineHeader>
          <TimelineTitle>Preparing dispatch</TimelineTitle>
          <TimelineTime>Today</TimelineTime>
        </TimelineHeader>
        <TimelineDescription>Checking the paperwork.</TimelineDescription>
      </TimelineContent>
    </TimelineItem>

    <TimelineItem status="pending">
      <TimelineIndicator />
      <TimelineContent>
        <TimelineHeader>
          <TimelineTitle>Handover</TimelineTitle>
        </TimelineHeader>
      </TimelineContent>
    </TimelineItem>
  </Timeline>
);

/**
 * An error in the middle
 */
export const Error = () => (
  <Timeline className="w-full max-w-md">
    <TimelineItem status="complete">
      <TimelineIndicator />
      <TimelineContent>
        <TimelineTitle>File uploaded</TimelineTitle>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem status="error">
      <TimelineIndicator />
      <TimelineContent>
        <TimelineTitle>Issue the VAT invoice</TimelineTitle>
        <TimelineDescription>Tax number missing.</TimelineDescription>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem status="pending">
      <TimelineIndicator />
      <TimelineContent>
        <TimelineTitle>Send to the customer</TimelineTitle>
      </TimelineContent>
    </TimelineItem>
  </Timeline>
);

/**
 * A badge holding a glyph
 *
 * With children the dot grows into a 24px badge. `loading` swaps the node for
 * a spinner.
 */
export const WithIcons = () => (
  <Timeline className="w-full max-w-md">
    <TimelineItem status="complete">
      <TimelineIndicator>
        <CheckIcon />
      </TimelineIndicator>
      <TimelineContent className="pb-4">
        <TimelineTitle>Paid</TimelineTitle>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem status="current">
      <TimelineIndicator loading />
      <TimelineContent className="pb-4">
        <TimelineTitle>Processing</TimelineTitle>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem status="pending">
      <TimelineIndicator>
        <TruckIcon />
      </TimelineIndicator>
      <TimelineContent className="pb-4">
        <TimelineTitle>Awaiting dispatch</TimelineTitle>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem status="error">
      <TimelineIndicator>
        <XIcon />
      </TimelineIndicator>
      <TimelineContent>
        <TimelineTitle>Invoicing failed</TimelineTitle>
      </TimelineContent>
    </TimelineItem>
  </Timeline>
);

/**
 * Node style and custom colour
 *
 * `variant` forces one node style down the whole rail; `color` is for a state
 * the four built-in statuses do not describe.
 */
export const Variants = () => (
  <Timeline className="w-full max-w-md">
    <TimelineItem status="complete">
      <TimelineIndicator variant="outlined" />
      <TimelineContent className="pb-4">
        <TimelineTitle>outlined — a hollow ring</TimelineTitle>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem status="current">
      <TimelineIndicator variant="filled" />
      <TimelineContent className="pb-4">
        <TimelineTitle>filled</TimelineTitle>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineIndicator color="#16a34a" />
      <TimelineContent>
        <TimelineTitle>a colour of your own</TimelineTitle>
      </TimelineContent>
    </TimelineItem>
  </Timeline>
);
