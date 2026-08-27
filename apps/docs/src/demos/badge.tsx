import { Badge } from '@antkit/react';
import { CheckIcon, ClockIcon } from 'lucide-react';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: ['Badge'],
  api: [
    {
      title: 'Badge',
      description:
        'A static status label. Reach for `CountBadge` when a dot or a number is pinned to the corner of something else, and `Tag` when the chip can be closed or ticked.',
      props: [
        {
          name: 'variant',
          type: "'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning' | 'info' | 'muted'",
          default: "'default'",
          description:
            'The first four tones are shadcn’s; the last four are the states an admin panel always needs, taken from the brand palette so they still follow the theme.',
        },
        {
          name: 'asChild',
          type: 'boolean',
          default: 'false',
          description: 'Render as the child element instead, e.g. an <a>.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Merged with tailwind-merge.',
        },
      ],
    },
  ],
};

/**
 * Tones
 */
export const Variants = () => (
  <>
    <Badge>Default</Badge>
    <Badge variant="secondary">Secondary</Badge>
    <Badge variant="outline">Outline</Badge>
    <Badge variant="destructive">Destructive</Badge>
    <Badge variant="success">Success</Badge>
    <Badge variant="warning">Warning</Badge>
    <Badge variant="info">Info</Badge>
    <Badge variant="muted">Draft</Badge>
  </>
);

/**
 * With an icon
 *
 * The icon is scaled down to 12px for you.
 */
export const WithIcon = () => (
  <>
    <Badge variant="success">
      <CheckIcon />
      Paid
    </Badge>
    <Badge variant="warning">
      <ClockIcon />
      Awaiting approval
    </Badge>
  </>
);

/**
 * In a table
 *
 * Where Badge earns its keep: the status column.
 */
export const InTable = () => (
  <div className="grid w-full max-w-sm gap-2 text-sm">
    {[
      { name: 'Sarah Chen', status: 'success', label: 'Active' },
      { name: 'Marcus Alvarez', status: 'warning', label: 'Paused' },
      { name: 'Priya Raghunathan', status: 'muted', label: 'Completed' },
    ].map((row) => (
      <div
        key={row.name}
        className="flex items-center justify-between gap-3 border-b border-border pb-2"
      >
        <span className="truncate">{row.name}</span>
        <Badge variant={row.status as 'success' | 'warning' | 'muted'}>
          {row.label}
        </Badge>
      </div>
    ))}
  </div>
);

/**
 * As a link
 */
export const AsLink = () => (
  <Badge asChild variant="outline">
    <a href="/components/badge">Read the docs</a>
  </Badge>
);
