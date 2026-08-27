import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from '@antkit/react';

import type { DemoMeta } from '../lib/types';

const LOGOS = ['Luma', 'Antkit', 'Radix', 'Tailwind', 'Vite', 'React'];

const QUOTES = [
  'IELTS 6.5+ enrolment opens 12 Sep',
  'TOEIC 750 — 3 seats left',
  'Beginner conversation starts 20 Sep',
  'Up to 15% off tuition',
];

export const meta: DemoMeta = {
  imports: ['Marquee', 'MarqueeContent', 'MarqueeItem', 'MarqueeFade'],
  api: [
    {
      title: 'Marquee',
      description:
        'The outer frame, `relative` and `overflow-hidden`. A vertical marquee needs a height on this element — there is nothing else to bound it.',
      props: [
        {
          name: 'className',
          type: 'string',
          description: 'Height, corner radius, border.',
        },
      ],
    },
    {
      title: 'MarqueeContent',
      description: 'Takes every prop a <div> does except `dir`.',
      props: [
        {
          name: 'speed',
          type: 'number',
          default: '50',
          description:
            'Pixels per second, so long and short lists move at the same pace.',
        },
        {
          name: 'direction',
          type: "'left' | 'right' | 'up' | 'down'",
          default: "'left'",
          description: 'Which way it travels.',
        },
        {
          name: 'pauseOnHover',
          type: 'boolean',
          default: 'true',
          description: 'Stops while the pointer is over it.',
        },
        {
          name: 'autoFill',
          type: 'boolean',
          default: 'true',
          description:
            'Repeats the content until the track is full — a short list leaves no gap.',
        },
        {
          name: 'loop',
          type: 'number',
          default: '0',
          description: 'How many times round. `0` runs forever.',
        },
      ],
    },
    {
      title: 'MarqueeItem / MarqueeFade',
      props: [
        {
          name: 'MarqueeItem',
          type: "ComponentProps<'div'>",
          description: 'One item on the track.',
        },
        {
          name: 'side',
          type: "'left' | 'right' | 'top' | 'bottom'",
          description: 'On `MarqueeFade`: which edge softens. Required.',
        },
      ],
    },
  ],
};

/**
 * Basic
 *
 * Hover to pause it.
 */
export const Basic = () => (
  <Marquee className="rounded-lg border py-4">
    <MarqueeFade side="left" />
    <MarqueeFade side="right" />
    <MarqueeContent>
      {LOGOS.map((logo) => (
        <MarqueeItem
          key={logo}
          className="flex h-10 items-center rounded-md bg-muted px-6 text-sm font-medium"
        >
          {logo}
        </MarqueeItem>
      ))}
    </MarqueeContent>
  </Marquee>
);

/**
 * Speed and direction
 *
 * `speed` is pixels per second rather than the duration of a lap, so a long
 * strip and a short one drift at the same pace.
 */
export const SpeedAndDirection = () => (
  <div className="grid w-full gap-3">
    <Marquee className="rounded-lg border py-3">
      <MarqueeContent speed={30}>
        {QUOTES.map((quote) => (
          <MarqueeItem key={quote} className="px-6 text-sm">
            {quote}
          </MarqueeItem>
        ))}
      </MarqueeContent>
    </Marquee>

    <Marquee className="rounded-lg border py-3">
      <MarqueeContent speed={90} direction="right">
        {QUOTES.map((quote) => (
          <MarqueeItem key={quote} className="px-6 text-sm">
            {quote}
          </MarqueeItem>
        ))}
      </MarqueeContent>
    </Marquee>
  </div>
);

/**
 * Without pause on hover
 */
export const NoPause = () => (
  <Marquee className="rounded-lg border py-3">
    <MarqueeFade side="left" />
    <MarqueeFade side="right" />
    <MarqueeContent pauseOnHover={false}>
      {LOGOS.map((logo) => (
        <MarqueeItem key={logo} className="px-6 text-sm font-medium">
          {logo}
        </MarqueeItem>
      ))}
    </MarqueeContent>
  </Marquee>
);

/**
 * Vertical
 *
 * The outer frame needs a height, or nothing bounds the track.
 */
export const Vertical = () => (
  <Marquee className="h-48 w-full max-w-xs rounded-lg border">
    <MarqueeFade side="top" />
    <MarqueeFade side="bottom" />
    <MarqueeContent direction="up" speed={30}>
      {QUOTES.map((quote) => (
        <MarqueeItem key={quote} className="my-2 px-4 text-sm">
          {quote}
        </MarqueeItem>
      ))}
    </MarqueeContent>
  </Marquee>
);
