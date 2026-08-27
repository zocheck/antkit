import { Typography } from '@antkit/react';

import type { DemoMeta } from '../lib/types';

const { Text, Title, Paragraph } = Typography;

const LOREM =
  'The IELTS 6.5+ course starts on 12 September, running Monday, Wednesday and Friday evenings at the downtown campus. Tuition must be settled three working days before the first session, and students should bring photo ID when they enrol.';

export const meta: DemoMeta = {
  imports: ['Typography'],
  extraImports: ['const { Text, Title, Paragraph } = Typography;'],
  api: [
    {
      title: 'Text / Paragraph / Title',
      description:
        'Three components sharing one set of modifiers. Text renders a <span>, Paragraph a <p>, and Title an <h1>–<h5>.',
      props: [
        {
          name: 'type',
          type: "'secondary' | 'success' | 'warning' | 'danger'",
          description: 'The semantic colour of the text.',
        },
        {
          name: 'level',
          type: '1 | 2 | 3 | 4 | 5',
          default: '1',
          description:
            'Title only. It decides the h1–h5 tag, so pick it by the outline of the page rather than by type size.',
        },
        { name: 'strong', type: 'boolean', description: 'Bold.' },
        { name: 'italic', type: 'boolean', description: 'Italic.' },
        { name: 'underline', type: 'boolean', description: 'Underlined.' },
        { name: 'deleted', type: 'boolean', description: 'Struck through.' },
        { name: 'code', type: 'boolean', description: 'Set as code.' },
        {
          name: 'mark',
          type: 'boolean',
          description: 'Highlighted in yellow.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          description: 'Dimmed, with the cursor changed.',
        },
        {
          name: 'ellipsis',
          type: 'boolean | { rows?: number; expandable?: boolean }',
          description:
            'true truncates at one line; pass an object for several lines or an expand button.',
        },
        {
          name: 'copyable',
          type: 'boolean | { text?: string; onCopy?: () => void }',
          description:
            'Adds a copy button. Only string children copy themselves; otherwise pass the text.',
        },
      ],
    },
  ],
};

/**
 * Titles
 *
 * `level` picks the h1–h5 tag. Choose by where it sits in the page's outline,
 * and adjust the size with `className` if the default does not suit.
 */
export const Titles = () => (
  <div className="grid w-full gap-2">
    <Title level={1}>Student list</Title>
    <Title level={2}>Student list</Title>
    <Title level={3}>Student list</Title>
    <Title level={4}>Student list</Title>
    <Title level={5}>Student list</Title>
  </div>
);

/**
 * Semantic colours
 */
export const Types = () => (
  <div className="grid w-full gap-1">
    <Text>Default</Text>
    <Text type="secondary">Updated five minutes ago</Text>
    <Text type="success">Paid in full</Text>
    <Text type="warning">Contract expiring soon</Text>
    <Text type="danger">12 days overdue</Text>
    <Text disabled>Unavailable</Text>
  </div>
);

/**
 * Modifiers
 *
 * Several can be switched on at once on the same element.
 */
export const Modifiers = () => (
  <div className="grid w-full gap-1">
    <Text strong>Bold text</Text>
    <Text italic>Italic text</Text>
    <Text underline>Underlined</Text>
    <Text deleted>Was $15,000</Text>
    <Text code>pnpm add @antkit/react</Text>
    <Text mark>The part worth noticing</Text>
    <Text strong italic type="danger">
      Bold + italic + danger
    </Text>
  </div>
);

/**
 * Copyable
 *
 * The copy button sits right after the text. When the children are not a
 * string, say what to copy through `copyable={{ text }}`.
 */
export const Copyable = () => (
  <div className="grid w-full gap-1">
    <Text copyable>STU-2026-0042</Text>
    <Text copyable={{ text: 'sarah.chen@example.com' }}>
      The student's email
    </Text>
  </div>
);

/**
 * Truncating
 *
 * `rows` cuts at the nth line. Add `expandable` for a show-more button — right
 * for a long note in a table, where the row height must not jump.
 */
export const Ellipsis = () => (
  <div className="grid w-full max-w-md gap-4">
    <Text ellipsis>{LOREM}</Text>
    <Paragraph ellipsis={{ rows: 2 }}>{LOREM}</Paragraph>
    <Paragraph ellipsis={{ rows: 2, expandable: true }}>{LOREM}</Paragraph>
  </div>
);

/**
 * Paragraphs
 *
 * `Paragraph` is a block, and carries its own space below except on the last
 * one.
 */
export const Paragraphs = () => (
  <div className="w-full max-w-md">
    <Title level={4}>Enrolment terms</Title>
    <Paragraph>{LOREM}</Paragraph>
    <Paragraph type="secondary">
      Any change to the timetable is emailed at least 24 hours in advance.
    </Paragraph>
  </div>
);
