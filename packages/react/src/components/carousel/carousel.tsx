import {
  Children,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type { ComponentProps, ReactNode, Ref } from 'react';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { useLocale } from '../../lib/config';
import { cn } from '../../utils';
import {
  carousel,
  carouselArrow,
  carouselDot,
  carouselDots,
} from './carousel.styles';

export type CarouselEffect = 'scrollx' | 'fade';
export type CarouselDotPosition = 'top' | 'bottom' | 'left' | 'right';

/** What a `ref` on the carousel gives you. */
export type CarouselHandle = {
  next: () => void;
  prev: () => void;
  goTo: (index: number, dontAnimate?: boolean) => void;
};

// `ref` is omitted along with the rest: the handle below replaces the div's
// own ref, and an intersection would ask for both at once.
export type CarouselProps = Omit<
  ComponentProps<'div'>,
  'onChange' | 'children' | 'ref'
> & {
  /** One slide per child. */
  children?: ReactNode;
  /** Controlled slide index. */
  current?: number;
  /** Uncontrolled starting slide. */
  defaultCurrent?: number;
  /** Fires once the carousel has settled on a slide. */
  onChange?: (index: number) => void;
  autoplay?: boolean;
  /** Milliseconds between advances. */
  autoplaySpeed?: number;
  dots?: boolean;
  dotPosition?: CarouselDotPosition;
  arrows?: boolean;
  /** `'fade'` cross-fades one slide at a time and ignores `slidesToShow`. */
  effect?: CarouselEffect;
  /** Wrap past the ends instead of stopping there. */
  infinite?: boolean;
  /** How many slides fit the frame at once. Whole numbers only. */
  slidesToShow?: number;
  /** Gap between slides, in pixels. */
  gap?: number;
  ref?: Ref<CarouselHandle>;
};

const clamp = (value: number, count: number) =>
  Math.min(Math.max(value, 0), Math.max(count - 1, 0));

/**
 * A caller who asked for reduced motion gets the same slide, without the
 * travel — the position is what carries the meaning, not the animation.
 */
const reducedMotion = () =>
  typeof matchMedia === 'function' &&
  matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * A row of slides that snaps, with dots, arrows and autoplay.
 *
 * ```tsx
 * <Carousel autoplay slidesToShow={3} gap={16} aria-label="Featured courses">
 *   {courses.map((course) => (
 *     <CourseCard key={course.id} course={course} />
 *   ))}
 * </Carousel>
 * ```
 *
 * Reach for `Marquee` when the row should scroll on its own forever and
 * nobody needs to land on a particular item, and for `Tabs` when the panels
 * are destinations rather than a sequence.
 *
 * Scrolling is CSS scroll-snap on a real scroll container, so touch and
 * trackpad gestures are the browser's, not ours. That is also why `infinite`
 * jumps back to the first slide at the end rather than looping seamlessly —
 * a seamless loop needs cloned slides, and cloned slides break the scrollbar
 * and the reading order.
 */
export const Carousel = ({
  children,
  current,
  defaultCurrent = 0,
  onChange,
  autoplay = false,
  autoplaySpeed = 3000,
  dots = true,
  dotPosition = 'bottom',
  arrows = false,
  effect = 'scrollx',
  infinite = true,
  slidesToShow = 1,
  gap = 0,
  className,
  ref,
  ...props
}: CarouselProps) => {
  const locale = useLocale();
  const viewport = useRef<HTMLDivElement>(null);
  const [uncontrolled, setUncontrolled] = useState(defaultCurrent);
  const [paused, setPaused] = useState(false);

  const slides = Children.toArray(children);
  const count = slides.length;
  const index = clamp(current ?? uncontrolled, count);
  // With three slides in frame the last two can never be first, so there is
  // nothing to page to past that point.
  const lastPage = Math.max(count - (effect === 'fade' ? 1 : slidesToShow), 0);

  const settle = useCallback(
    (next: number) => {
      setUncontrolled(next);
      onChange?.(next);
    },
    [onChange],
  );

  const goTo = useCallback(
    (to: number, dontAnimate = false) => {
      const next = clamp(to, count);

      if (effect === 'fade') {
        settle(next);
        return;
      }

      const node = viewport.current;
      const slide = node?.children[next];
      if (!node || !slide) return;

      // Rect maths rather than `offsetLeft`, which is relative to whichever
      // ancestor happens to be positioned.
      const left =
        slide.getBoundingClientRect().left -
        node.getBoundingClientRect().left +
        node.scrollLeft;

      node.scrollTo({
        left,
        behavior: dontAnimate || reducedMotion() ? 'auto' : 'smooth',
      });
    },
    [count, effect, settle],
  );

  const step = useCallback(
    (delta: number) => {
      const next = index + delta;

      if (next < 0) {
        if (!infinite) return;
        goTo(lastPage);
        return;
      }
      if (next > lastPage) {
        if (!infinite) return;
        goTo(0);
        return;
      }

      goTo(next);
    },
    [goTo, index, infinite, lastPage],
  );

  useImperativeHandle(
    ref,
    () => ({
      next: () => step(1),
      prev: () => step(-1),
      goTo,
    }),
    [goTo, step],
  );

  /**
   * The scroll position is the source of truth once a gesture starts, so the
   * index follows the scroller rather than the other way around. Reading the
   * nearest slide by rect keeps this honest whatever the gap or slide width.
   */
  const onScroll = () => {
    const node = viewport.current;
    if (!node || effect === 'fade') return;

    const origin = node.getBoundingClientRect().left;
    let nearest = 0;
    let best = Infinity;

    for (const [position, slide] of [...node.children].entries()) {
      const distance = Math.abs(slide.getBoundingClientRect().left - origin);
      if (distance < best) {
        best = distance;
        nearest = position;
      }
    }

    if (nearest !== index) settle(nearest);
  };

  // A controlled `current` has to move the scroller; an uncontrolled one was
  // moved by the gesture that set it.
  useEffect(() => {
    if (current !== undefined) goTo(current);
  }, [current, goTo]);

  useEffect(() => {
    if (!autoplay || paused || count < 2 || reducedMotion()) return;

    const timer = setInterval(() => step(1), autoplaySpeed);
    return () => clearInterval(timer);
  }, [autoplay, autoplaySpeed, count, paused, step]);

  const atStart = index === 0;
  const atEnd = index >= lastPage;

  return (
    <div
      data-slot="carousel"
      role="region"
      aria-roledescription={locale.carousel?.label ?? 'Carousel'}
      className={carousel({ dotPosition, className })}
      // Autoplay that keeps moving under a reader's cursor is the classic
      // carousel failure, so any attention at all stops it.
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setPaused(false);
      }}
      {...props}
    >
      <div className="relative min-w-0 flex-1">
        <div
          ref={viewport}
          data-slot="carousel-viewport"
          tabIndex={0}
          aria-live={autoplay && !paused ? 'off' : 'polite'}
          onScroll={onScroll}
          onKeyDown={(event) => {
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
            event.preventDefault();
            step(event.key === 'ArrowRight' ? 1 : -1);
          }}
          className={cn(
            'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
            'rounded-md focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            effect === 'fade'
              ? 'relative isolate'
              : [
                  'flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain',
                  // A scrollbar under a carousel is noise; the dots and the
                  // snap points already say where you are.
                  '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
                ],
          )}
          style={effect === 'fade' ? undefined : { gap }}
        >
          {slides.map((slide, position) => (
            <div
              // Slides are positional by nature — the caller's own keys live on
              // whatever they render inside.
              key={position}
              data-slot="carousel-slide"
              role="group"
              aria-roledescription={locale.carousel?.slide ?? 'Slide'}
              aria-label={`${position + 1} / ${count}`}
              aria-hidden={effect === 'fade' && position !== index}
              inert={effect === 'fade' && position !== index}
              className={cn(
                effect === 'fade'
                  ? [
                      'transition-opacity duration-500 motion-reduce:transition-none',
                      position === index
                        ? 'opacity-100'
                        : 'pointer-events-none absolute inset-0 opacity-0',
                    ]
                  : 'min-w-0 shrink-0 snap-start',
              )}
              style={
                effect === 'fade'
                  ? undefined
                  : {
                      // The gap is shared between the slides on screen, so the
                      // frame still holds exactly `slidesToShow` of them.
                      flexBasis: `calc((100% - ${(slidesToShow - 1) * gap}px) / ${slidesToShow})`,
                    }
              }
            >
              {slide}
            </div>
          ))}
        </div>

        {arrows && count > 1 && (
          <>
            <button
              type="button"
              data-slot="carousel-previous"
              aria-label={locale.carousel?.previousSlide ?? 'Previous slide'}
              disabled={!infinite && atStart}
              onClick={() => step(-1)}
              className={carouselArrow({ side: 'previous' })}
            >
              <ChevronLeftIcon />
            </button>
            <button
              type="button"
              data-slot="carousel-next"
              aria-label={locale.carousel?.nextSlide ?? 'Next slide'}
              disabled={!infinite && atEnd}
              onClick={() => step(1)}
              className={carouselArrow({ side: 'next' })}
            >
              <ChevronRightIcon />
            </button>
          </>
        )}
      </div>

      {dots && count > 1 && (
        <div
          data-slot="carousel-dots"
          role="tablist"
          aria-label={locale.carousel?.label ?? 'Carousel'}
          className={carouselDots({ dotPosition })}
        >
          {Array.from({ length: lastPage + 1 }, (_, position) => (
            <button
              key={position}
              type="button"
              role="tab"
              aria-selected={position === index}
              aria-label={`${locale.carousel?.goToSlide ?? 'Go to slide'} ${position + 1}`}
              onClick={() => goTo(position)}
              className={carouselDot({
                active: position === index,
                dotPosition,
              })}
            />
          ))}
        </div>
      )}
    </div>
  );
};
