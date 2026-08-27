import { useLayoutEffect, useRef, useState } from 'react';
import type { ComponentProps } from 'react';

import { cn } from '../../utils';

export type MarqueeDirection = 'left' | 'right' | 'up' | 'down';

/**
 * Keyframes travel exactly half the track, and the track holds the content
 * twice — that is what makes the wrap invisible. React hoists and dedupes this
 * by `href`, so it lands in `<head>` once no matter how many marquees render.
 */
const MarqueeStyles = () => (
  <style href="luma-marquee" precedence="default">
    {`@keyframes luma-marquee-x{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes luma-marquee-y{from{transform:translateY(0)}to{transform:translateY(-50%)}}
@media (prefers-reduced-motion: reduce){[data-slot="marquee-track"]{animation:none!important}}`}
  </style>
);

export type MarqueeProps = ComponentProps<'div'>;

/**
 * A row of items scrolling past, for logos, testimonials, a ticker of recent
 * runs.
 *
 * ```tsx
 * <Marquee>
 *   <MarqueeFade side="left" />
 *   <MarqueeFade side="right" />
 *   <MarqueeContent speed={40}>
 *     {logos.map((logo) => (
 *       <MarqueeItem key={logo.id} className="h-10">
 *         <img src={logo.src} alt={logo.name} className="h-full" />
 *       </MarqueeItem>
 *     ))}
 *   </MarqueeContent>
 * </Marquee>
 * ```
 *
 * A vertical marquee needs a height on this element — there is nothing else to
 * bound it.
 */
export const Marquee = ({ className, ...props }: MarqueeProps) => (
  <div
    data-slot="marquee"
    className={cn('relative w-full overflow-hidden', className)}
    {...props}
  />
);

export type MarqueeContentProps = Omit<ComponentProps<'div'>, 'dir'> & {
  /** Pixels per second, so long and short lists move at the same pace. */
  speed?: number;
  direction?: MarqueeDirection;
  pauseOnHover?: boolean;
  /** Repeats the children until they fill the track — no gap on short lists. */
  autoFill?: boolean;
  /** Times to run, `0` for forever. */
  loop?: number;
};

export const MarqueeContent = ({
  speed = 50,
  direction = 'left',
  pauseOnHover = true,
  autoFill = true,
  loop = 0,
  className,
  children,
  ...props
}: MarqueeContentProps) => {
  const vertical = direction === 'up' || direction === 'down';
  const viewportRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);

  const [unit, setUnit] = useState(0);
  const [viewport, setViewport] = useState(0);
  const [paused, setPaused] = useState(false);

  const repeat =
    autoFill && unit > 0 ? Math.max(1, Math.ceil(viewport / unit)) : 1;

  // Measure one copy, not the whole group: the repeat count is derived from it,
  // so measuring the group would chase its own tail.
  useLayoutEffect(() => {
    const group = groupRef.current;
    const box = viewportRef.current;

    if (!group || !box) return;

    const measure = () => {
      const groupSize = vertical ? group.scrollHeight : group.scrollWidth;
      const boxSize = vertical ? box.clientHeight : box.clientWidth;

      setUnit(groupSize / repeat);
      setViewport(boxSize);
    };

    measure();

    const observer = new ResizeObserver(measure);

    observer.observe(group);
    observer.observe(box);

    // Changing children changes the group's size, which the observer already
    // reports — no need to depend on them here.
    return () => observer.disconnect();
  }, [repeat, vertical]);

  const distance = unit * repeat;
  const duration = distance > 0 && speed > 0 ? distance / speed : 0;

  const copies = Array.from({ length: repeat }, (_, index) => index);

  const renderGroup = (groupIndex: number) => (
    <div
      key={groupIndex}
      ref={groupIndex === 0 ? groupRef : undefined}
      // The trailing copy is the same content again; reading it out twice
      // would just be noise.
      aria-hidden={groupIndex > 0 || undefined}
      className={cn('flex shrink-0', vertical ? 'flex-col' : 'flex-row')}
    >
      {copies.map((copy) => (
        <div
          key={copy}
          aria-hidden={copy > 0 || undefined}
          className={cn('flex shrink-0', vertical ? 'flex-col' : 'flex-row')}
        >
          {children}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <MarqueeStyles />
      <div
        ref={viewportRef}
        data-slot="marquee-content"
        className={cn(
          'flex size-full overflow-hidden',
          vertical ? 'flex-col' : 'flex-row',
          className,
        )}
        onMouseEnter={pauseOnHover ? () => setPaused(true) : undefined}
        onMouseLeave={pauseOnHover ? () => setPaused(false) : undefined}
        onFocusCapture={pauseOnHover ? () => setPaused(true) : undefined}
        onBlurCapture={pauseOnHover ? () => setPaused(false) : undefined}
        {...props}
      >
        <div
          data-slot="marquee-track"
          className={cn('flex w-max shrink-0', vertical && 'h-max flex-col')}
          style={{
            animationName: vertical ? 'luma-marquee-y' : 'luma-marquee-x',
            // Zero while unmeasured, which reads as "no animation yet" rather
            // than a flash of content sliding from the wrong place.
            animationDuration: duration ? `${duration}s` : undefined,
            animationTimingFunction: 'linear',
            animationIterationCount: loop === 0 ? 'infinite' : loop,
            animationDirection:
              direction === 'right' || direction === 'down'
                ? 'reverse'
                : 'normal',
            animationPlayState: paused ? 'paused' : 'running',
            animationFillMode: 'forwards',
          }}
        >
          {renderGroup(0)}
          {renderGroup(1)}
        </div>
      </div>
    </>
  );
};

export type MarqueeItemProps = ComponentProps<'div'>;

export const MarqueeItem = ({ className, ...props }: MarqueeItemProps) => (
  <div
    data-slot="marquee-item"
    className={cn('mx-2 shrink-0 object-contain', className)}
    {...props}
  />
);

export type MarqueeFadeProps = ComponentProps<'div'> & {
  side: 'left' | 'right' | 'top' | 'bottom';
};

/** Softens the edge the items enter and leave through. */
export const MarqueeFade = ({
  side,
  className,
  ...props
}: MarqueeFadeProps) => (
  <div
    data-slot="marquee-fade"
    data-side={side}
    className={cn(
      'pointer-events-none absolute z-10 from-background to-transparent',
      side === 'left' && 'inset-y-0 left-0 w-24 bg-gradient-to-r',
      side === 'right' && 'inset-y-0 right-0 w-24 bg-gradient-to-l',
      side === 'top' && 'inset-x-0 top-0 h-24 bg-gradient-to-b',
      side === 'bottom' && 'inset-x-0 bottom-0 h-24 bg-gradient-to-t',
      className,
    )}
    {...props}
  />
);

export { MarqueeStyles };
