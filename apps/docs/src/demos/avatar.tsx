import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@antkit/react';

import type { DemoMeta } from '../lib/types';

const PEOPLE = [
  'Sarah Chen',
  'Marcus Alvarez',
  'Priya Raghunathan',
  'Tom Okafor',
];

const initials = (name: string) =>
  name
    .split(' ')
    .slice(-2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

export const meta: DemoMeta = {
  imports: [
    'Avatar',
    'AvatarImage',
    'AvatarFallback',
    'AvatarBadge',
    'AvatarGroup',
    'AvatarGroupCount',
  ],
  api: [
    {
      title: 'Avatar',
      description:
        'Wraps Radix Avatar. `size` is readable from every part inside, so setting it once sizes the badge and the count too. Use `Image` for pictures that are content rather than identity.',
      props: [
        {
          name: 'size',
          type: "'sm' | 'default' | 'lg'",
          default: "'default'",
          description: '24 / 32 / 40px across.',
        },
      ],
    },
    {
      title: 'AvatarImage / AvatarFallback',
      description:
        '`AvatarFallback` covers a missing image, not a missing `alt`. Give `AvatarImage` an empty `alt` when the name is already beside it, or a screen reader reads the name twice.',
      props: [
        {
          name: 'src / alt',
          type: 'string',
          description: 'As on an <img>, set on `AvatarImage`.',
        },
        {
          name: 'delayMs',
          type: 'number',
          description:
            'On `AvatarFallback`: wait this many milliseconds before showing the initials, so a fast image does not flash.',
        },
      ],
    },
    {
      title: 'AvatarBadge / AvatarGroup / AvatarGroupCount',
      props: [
        {
          name: 'AvatarBadge',
          type: "ComponentProps<'span'>",
          description:
            'The dot at the bottom right — online state. Goes inside `Avatar`.',
        },
        {
          name: 'AvatarGroup',
          type: "ComponentProps<'div'>",
          description:
            'Overlaps several avatars, each with a ring of background.',
        },
        {
          name: 'AvatarGroupCount',
          type: "ComponentProps<'div'>",
          description: 'The "+3" at the end of the group.',
        },
      ],
    },
  ],
};

/**
 * Basic
 *
 * With no image, the initials are what shows.
 */
export const Basic = () => (
  <>
    <Avatar>
      <AvatarImage src="/logo.png" alt="" />
      <AvatarFallback>SC</AvatarFallback>
    </Avatar>

    <Avatar>
      <AvatarFallback>SC</AvatarFallback>
    </Avatar>
  </>
);

/**
 * Sizes
 */
export const Sizes = () => (
  <>
    <Avatar size="sm">
      <AvatarFallback>SM</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback>MD</AvatarFallback>
    </Avatar>
    <Avatar size="lg">
      <AvatarFallback>LG</AvatarFallback>
    </Avatar>
  </>
);

/**
 * Status dot
 */
export const Badge = () => (
  <>
    <Avatar>
      <AvatarFallback>SC</AvatarFallback>
      <AvatarBadge />
    </Avatar>

    <Avatar size="lg">
      <AvatarFallback>MA</AvatarFallback>
      <AvatarBadge className="bg-orange-500" />
    </Avatar>
  </>
);

/**
 * A group
 *
 * `size` goes on each avatar; `AvatarGroupCount` follows the group's size.
 */
export const Group = () => (
  <div className="grid gap-4">
    <AvatarGroup>
      {PEOPLE.map((name) => (
        <Avatar key={name}>
          <AvatarFallback>{initials(name)}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>+3</AvatarGroupCount>
    </AvatarGroup>

    <AvatarGroup>
      {PEOPLE.slice(0, 3).map((name) => (
        <Avatar key={name} size="sm">
          <AvatarFallback>{initials(name)}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>+9</AvatarGroupCount>
    </AvatarGroup>
  </div>
);

/**
 * Beside a name
 *
 * The name is already next to it, so `alt` is empty — otherwise a screen
 * reader says it twice.
 */
export const WithName = () => (
  <div className="flex items-center gap-3">
    <Avatar>
      <AvatarImage src="/logo.png" alt="" />
      <AvatarFallback>SC</AvatarFallback>
    </Avatar>
    <div className="text-sm">
      <p className="font-medium">Sarah Chen</p>
      <p className="text-muted-foreground">Account manager</p>
    </div>
  </div>
);
