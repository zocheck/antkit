import { useRef, useState } from 'react';

import { Button, Carousel } from '@antkit/react';
import type { CarouselHandle } from '@antkit/react';

import type { DemoMeta } from '../lib/types';

const SLIDES = [
  { id: 'a', title: 'IELTS 6.5+', tone: 'bg-blue-100 text-blue-700' },
  { id: 'b', title: 'TOEIC 750', tone: 'bg-green-100 text-green-700' },
  { id: 'c', title: 'Conversation', tone: 'bg-orange-100 text-orange-700' },
  { id: 'd', title: 'Pronunciation', tone: 'bg-purple-100 text-purple-700' },
  { id: 'e', title: 'English for kids', tone: 'bg-pink-100 text-pink-700' },
];

const Slide = ({
  title,
  tone,
  height = 'h-40',
}: {
  title: string;
  tone: string;
  height?: string;
}) => (
  <div
    className={`flex ${height} items-center justify-center rounded-xl text-lg font-medium ${tone}`}
  >
    {title}
  </div>
);

export const meta: DemoMeta = {
  imports: ['Carousel'],
  extraImports: ["import type { CarouselHandle } from '@antkit/react';"],
  api: [
    {
      title: 'Carousel',
      description:
        'Takes every prop a <div> does except `onChange` and `children`. Each child is one slide.',
      props: [
        {
          name: 'current',
          type: 'number',
          description: 'The slide index, controlled.',
        },
        {
          name: 'defaultCurrent',
          type: 'number',
          default: '0',
          description: 'Which slide it starts on when uncontrolled.',
        },
        {
          name: 'onChange',
          type: '(index: number) => void',
          description: 'Fires once the carousel has settled on a slide.',
        },
        {
          name: 'autoplay',
          type: 'boolean',
          default: 'false',
          description:
            'Advances by itself. It stops on hover, when anything inside takes focus, and when the system asks for reduced motion.',
        },
        {
          name: 'autoplaySpeed',
          type: 'number',
          default: '3000',
          description: 'Milliseconds between advances.',
        },
        {
          name: 'dots',
          type: 'boolean',
          default: 'true',
          description: 'The clickable strip of position dots.',
        },
        {
          name: 'dotPosition',
          type: "'top' | 'bottom' | 'left' | 'right'",
          default: "'bottom'",
          description: 'Which edge the dots sit on.',
        },
        {
          name: 'arrows',
          type: 'boolean',
          default: 'false',
          description: 'The two arrow buttons floating either side.',
        },
        {
          name: 'effect',
          type: "'scrollx' | 'fade'",
          default: "'scrollx'",
          description:
            '`fade` stacks the slides and cross-fades between them, and ignores `slidesToShow`.',
        },
        {
          name: 'infinite',
          type: 'boolean',
          default: 'true',
          description:
            'Wraps past either end. This jumps back to the start rather than looping seamlessly — see the note in the doc block.',
        },
        {
          name: 'slidesToShow',
          type: 'number',
          default: '1',
          description:
            'How many slides fit in the frame at once. Whole numbers only.',
        },
        {
          name: 'gap',
          type: 'number',
          default: '0',
          description: 'The gap between slides, in pixels.',
        },
        {
          name: 'ref',
          type: 'Ref<CarouselHandle>',
          description:
            'Gives you `next()`, `prev()` and `goTo(index, dontAnimate?)`.',
        },
      ],
    },
  ],
};

/**
 * Basic
 *
 * Each child is one slide. Drag sideways, click a dot, or use the arrow keys
 * while the frame has focus.
 */
export const Basic = () => (
  <Carousel className="max-w-xl" aria-label="Featured courses">
    {SLIDES.map((slide) => (
      <Slide key={slide.id} title={slide.title} tone={slide.tone} />
    ))}
  </Carousel>
);

/**
 * Several slides at once
 *
 * `slidesToShow` divides the frame; `gap` is the space between them, already
 * subtracted from each slide, so exactly that many still fit.
 */
export const SlidesToShow = () => (
  <Carousel
    slidesToShow={3}
    gap={12}
    arrows
    className="max-w-2xl"
    aria-label="Courses"
  >
    {SLIDES.map((slide) => (
      <Slide
        key={slide.id}
        title={slide.title}
        tone={slide.tone}
        height="h-28"
      />
    ))}
  </Carousel>
);

/**
 * Autoplay
 *
 * Hovering or focusing anything inside stops it. On a machine asking for
 * reduced motion it never starts.
 */
export const Autoplay = () => (
  <Carousel
    autoplay
    autoplaySpeed={2000}
    className="max-w-xl"
    aria-label="Offers"
  >
    {SLIDES.slice(0, 3).map((slide) => (
      <Slide key={slide.id} title={slide.title} tone={slide.tone} />
    ))}
  </Carousel>
);

/**
 * Cross-fade
 *
 * `effect="fade"` stacks the slides rather than scrolling sideways. Hidden
 * slides are marked `inert`, so tab cannot land in them.
 */
export const Fade = () => (
  <Carousel
    effect="fade"
    arrows
    className="max-w-xl"
    aria-label="Classroom photos"
  >
    {SLIDES.slice(0, 4).map((slide) => (
      <Slide key={slide.id} title={slide.title} tone={slide.tone} />
    ))}
  </Carousel>
);

/**
 * Dot position
 *
 * `dotPosition` moves the dots to another edge, and the frame turns its layout
 * axis to match.
 */
export const DotPosition = () => (
  <Carousel dotPosition="right" className="max-w-xl" aria-label="Courses">
    {SLIDES.slice(0, 3).map((slide) => (
      <Slide key={slide.id} title={slide.title} tone={slide.tone} />
    ))}
  </Carousel>
);

/**
 * Driving it from outside
 *
 * `ref` gives you `next()`, `prev()` and `goTo()`. `onChange` fires once the
 * carousel has settled, including after a drag.
 */
export const Controls = () => {
  const carousel = useRef<CarouselHandle>(null);
  const [index, setIndex] = useState(0);

  return (
    <div className="grid w-full max-w-xl gap-3">
      <Carousel
        ref={carousel}
        dots={false}
        onChange={setIndex}
        infinite={false}
      >
        {SLIDES.map((slide) => (
          <Slide key={slide.id} title={slide.title} tone={slide.tone} />
        ))}
      </Carousel>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => carousel.current?.prev()}
        >
          Previous
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => carousel.current?.next()}
        >
          Next
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => carousel.current?.goTo(0, true)}
        >
          Back to start
        </Button>
        <span className="ml-auto text-sm text-muted-foreground">
          {index + 1} / {SLIDES.length}
        </span>
      </div>
    </div>
  );
};
