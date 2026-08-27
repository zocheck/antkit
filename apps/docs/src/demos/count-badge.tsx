import { Button, CountBadge } from '@antkit/react';
import { BellIcon, MailIcon, ShoppingCartIcon } from 'lucide-react';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: ['CountBadge'],
  api: [
    {
      title: 'CountBadge',
      description:
        'A dot or a number pinned to the corner of something else. With no children it stands alone as a floating count.',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          description: 'The element the badge is pinned to.',
        },
        {
          name: 'count',
          type: 'number',
          description: 'The number to show.',
        },
        {
          name: 'overflowCount',
          type: 'number',
          default: '99',
          description: 'Past this it prints as `99+`.',
        },
        {
          name: 'dot',
          type: 'boolean',
          default: 'false',
          description: 'Just a small dot, ignoring the number.',
        },
        {
          name: 'showZero',
          type: 'boolean',
          default: 'false',
          description: 'Still show it when `count` is 0.',
        },
        {
          name: 'color',
          type: 'string',
          description: 'Any colour for the badge background.',
        },
        {
          name: 'offset',
          type: '[number, number]',
          description: 'Nudge the badge along x and y, in px.',
        },
        {
          name: 'size',
          type: "'default' | 'sm'",
          default: "'default'",
          description: 'Badge size.',
        },
        {
          name: 'title',
          type: 'string',
          description:
            'Text for screen readers, when the number alone lacks context.',
        },
      ],
    },
  ],
};

/**
 * Pinned to a button
 */
export const Basic = () => (
  <>
    <CountBadge count={5}>
      <Button variant="ghost" size="icon" aria-label="Notifications">
        <BellIcon />
      </Button>
    </CountBadge>

    <CountBadge count={128}>
      <Button variant="ghost" size="icon" aria-label="Inbox">
        <MailIcon />
      </Button>
    </CountBadge>

    <CountBadge count={1200} overflowCount={999}>
      <Button variant="ghost" size="icon" aria-label="Cart">
        <ShoppingCartIcon />
      </Button>
    </CountBadge>
  </>
);

/**
 * A dot
 *
 * `dot` when all you need is "something is new" and the number does not matter.
 */
export const Dot = () => (
  <>
    <CountBadge dot>
      <Button variant="ghost" size="icon" aria-label="Notifications">
        <BellIcon />
      </Button>
    </CountBadge>

    <CountBadge dot color="#f49000">
      <Button variant="secondary" size="sm">
        Settings
      </Button>
    </CountBadge>
  </>
);

/**
 * Standing alone
 *
 * With no children the badge is just a floating number — useful beside a menu
 * label.
 */
export const Standalone = () => (
  <div className="flex items-center gap-3 text-sm">
    <span>Unread</span>
    <CountBadge count={12} />
    <CountBadge count={0} showZero />
    <CountBadge count={7} color="#16a34a" />
  </div>
);

/**
 * Nudging it
 *
 * `offset` rescues elements with a large corner radius, where the default
 * position overlaps the content.
 */
export const Offset = () => (
  <>
    <CountBadge count={3} offset={[-4, 4]}>
      <div className="size-12 rounded-xl bg-muted" />
    </CountBadge>

    <CountBadge count={3} size="sm">
      <div className="size-12 rounded-xl bg-muted" />
    </CountBadge>
  </>
);
