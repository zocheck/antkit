import { Badge, Button, Descriptions } from '@antkit/react';
import type { DescriptionsItem } from '@antkit/react';
import { PencilIcon } from 'lucide-react';

import type { DemoMeta } from '../lib/types';

const ITEMS: DescriptionsItem[] = [
  { label: 'Full name', children: 'Sarah Chen' },
  { label: 'Course', children: 'IELTS 6.5+' },
  { label: 'Email', children: 'sarah.chen@example.com' },
  { label: 'Phone', children: '+1 415 555 0134' },
  { label: 'Account manager', children: 'Dana Whitfield' },
  { label: 'Enrolled', children: '15 Aug 2026' },
  {
    label: 'Notes',
    span: 2,
    children: 'Prefers evening calls, after 19:00.',
  },
];

export const meta: DemoMeta = {
  imports: ['Descriptions'],
  extraImports: ["import type { DescriptionsItem } from '@antkit/react';"],
  api: [
    {
      title: 'Descriptions',
      description:
        'The read half of a form — label and value pairs for a detail page. Takes every prop a <div> does except `title`.',
      props: [
        {
          name: 'items',
          type: 'DescriptionsItem[]',
          description: 'The label–value pairs. Required.',
        },
        {
          name: 'title',
          type: 'ReactNode',
          description: 'A heading above the table.',
        },
        {
          name: 'extra',
          type: 'ReactNode',
          description: 'Sits opposite the heading — usually an Edit button.',
        },
        {
          name: 'column',
          type: 'number',
          default: '3',
          description: 'How many columns per row.',
        },
        {
          name: 'bordered',
          type: 'boolean',
          default: 'false',
          description: 'Draws the frame and fills the label cells.',
        },
        {
          name: 'layout',
          type: "'horizontal' | 'vertical'",
          default: "'horizontal'",
          description:
            '`horizontal` puts the label beside the value, `vertical` above it.',
        },
        {
          name: 'size',
          type: "'sm' | 'default'",
          default: "'default'",
          description: 'Type density and padding.',
        },
      ],
    },
    {
      title: 'DescriptionsItem',
      props: [
        { name: 'label', type: 'ReactNode', description: 'The label.' },
        { name: 'children', type: 'ReactNode', description: 'The value.' },
        {
          name: 'span',
          type: 'number',
          default: '1',
          description: 'How many columns it spans. Clamped to `column`.',
        },
        {
          name: 'key',
          type: 'string',
          description: 'Only needed when the list gets reordered.',
        },
      ],
    },
  ],
};

/**
 * Basic
 */
export const Basic = () => (
  <Descriptions className="w-full" items={ITEMS.slice(0, 6)} />
);

/**
 * Bordered
 *
 * `bordered` sets the detail table apart from the rest of the page.
 */
export const Bordered = () => (
  <Descriptions
    className="w-full"
    bordered
    title="Student profile"
    extra={
      <Button size="sm" variant="secondary" prefix={<PencilIcon />}>
        Edit
      </Button>
    }
    items={ITEMS}
  />
);

/**
 * Columns
 *
 * A single column is the layout for a narrow panel or a phone.
 */
export const Columns = () => (
  <div className="grid w-full gap-6">
    <Descriptions column={1} bordered items={ITEMS.slice(0, 3)} />
    <Descriptions column={2} bordered items={ITEMS.slice(0, 4)} />
  </div>
);

/**
 * Labels above
 */
export const Vertical = () => (
  <Descriptions
    className="w-full"
    layout="vertical"
    bordered
    column={3}
    items={ITEMS.slice(0, 6)}
  />
);

/**
 * Values as components
 *
 * `children` takes any node — a badge, a link, or a multi-line block.
 */
export const RichValues = () => (
  <Descriptions
    className="w-full"
    bordered
    column={2}
    items={[
      {
        label: 'Status',
        children: <Badge variant="success">Active</Badge>,
      },
      {
        label: 'Tuition',
        children: <span className="font-medium">,500</span>,
      },
      {
        label: 'Contact',
        span: 2,
        children: (
          <a
            href="mailto:sarah.chen@example.com"
            className="text-primary underline underline-offset-4"
          >
            sarah.chen@example.com
          </a>
        ),
      },
    ]}
  />
);

/**
 * Small
 */
export const Small = () => (
  <Descriptions
    className="w-full"
    size="sm"
    bordered
    items={ITEMS.slice(0, 4)}
  />
);
