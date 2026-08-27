import { useCallback, useEffect, useRef, useState } from 'react';
import type { ComponentProps, CSSProperties } from 'react';

import { cn } from '../../utils';

/**
 * Which edges are faded. `'top'` means there is content above the viewport, so
 * the fade sits at the top — not that the fade is hiding what is at the top.
 */
export type ScrollShadowVisibility =
  | 'both'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'none';

export type ScrollShadowProps = ComponentProps<'div'> & {
  orientation?: 'vertical' | 'horizontal';
  /** Length of the fade, in pixels. */
  size?: number;
  /** How close to an edge still counts as being at it, in pixels. */
  offset?: number;
  hideScrollBar?: boolean;
  /** Off leaves a plain scroll container, with the fade taken away entirely. */
  enabled?: boolean;
  /** Pin the fades instead of deriving them from the scroll position. */
  visibility?: ScrollShadowVisibility;
  onVisibilityChange?: (visibility: ScrollShadowVisibility) => void;
};

const read = (
  node: HTMLDivElement,
  orientation: 'vertical' | 'horizontal',
  offset: number,
): ScrollShadowVisibility => {
  const vertical = orientation === 'vertical';
  const scrolled = vertical ? node.scrollTop : node.scrollLeft;
  const visible = vertical ? node.clientHeight : node.clientWidth;
  const total = vertical ? node.scrollHeight : node.scrollWidth;

  const atStart = scrolled <= offset;
  const atEnd = scrolled + visible >= total - offset;

  if (atStart && atEnd) return 'none';
  if (atStart) return vertical ? 'bottom' : 'right';
  if (atEnd) return vertical ? 'top' : 'left';
  return 'both';
};

/**
 * The fade is a mask rather than an overlay, so it works over any background
 * — a gradient, an image, a themed surface — without having to know its
 * colour. The cost is that it clips the content it fades, which is the
 * intended effect here.
 */
const maskFor = (
  visibility: ScrollShadowVisibility,
  orientation: 'vertical' | 'horizontal',
  size: number,
) => {
  if (visibility === 'none') return undefined;

  const vertical = orientation === 'vertical';
  const fadesStart =
    visibility === 'both' || visibility === (vertical ? 'top' : 'left');
  const fadesEnd =
    visibility === 'both' || visibility === (vertical ? 'bottom' : 'right');

  return [
    `linear-gradient(${vertical ? 'to bottom' : 'to right'}`,
    fadesStart ? `transparent, #000 ${size}px` : '#000',
    fadesEnd ? `#000 calc(100% - ${size}px), transparent)` : '#000)',
  ].join(', ');
};

/**
 * A scroll container that fades its content at whichever edge has more to
 * show, so an overflowing list looks cut off rather than finished.
 *
 * ```tsx
 * <ScrollShadow className="h-72">
 *   {notifications.map((item) => (
 *     <Notice key={item.id} {...item} />
 *   ))}
 * </ScrollShadow>
 *
 * <ScrollShadow orientation="horizontal" hideScrollBar className="w-full">
 *   <div className="flex gap-2">{tabs}</div>
 * </ScrollShadow>
 * ```
 *
 * `Marquee` when the content should move on its own, `Table` when the rows
 * need sticky headers and a horizontal scroll of their own.
 *
 * It needs a bounded size to have anything to overflow — `h-72`, a flex
 * child with `min-h-0`, a grid track. Without one it grows to fit its content
 * and no fade ever appears.
 */
export const ScrollShadow = ({
  className,
  style,
  children,
  orientation = 'vertical',
  size = 40,
  offset = 0,
  hideScrollBar = false,
  enabled = true,
  visibility,
  onVisibilityChange,
  ...props
}: ScrollShadowProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState<ScrollShadowVisibility>('none');

  // Emitting from the measure callback would re-enter it through whatever the
  // caller does with the value, so the last emitted state is kept out of React.
  const emitted = useRef<ScrollShadowVisibility | null>(null);
  // Held in a ref so a caller passing an inline callback does not tear down and
  // rebuild the observers on every render.
  const notify = useRef(onVisibilityChange);
  useEffect(() => {
    notify.current = onVisibilityChange;
  }, [onVisibilityChange]);

  const measure = useCallback(() => {
    const node = ref.current;
    if (!node) return;

    const next = read(node, orientation, offset);
    setMeasured(next);

    if (emitted.current !== next) {
      emitted.current = next;
      notify.current?.(next);
    }
  }, [orientation, offset]);

  useEffect(() => {
    const node = ref.current;
    if (!node || !enabled || visibility) return;

    const resize = new ResizeObserver(measure);
    const watch = () => {
      resize.disconnect();
      resize.observe(node);
      // A child growing — an image finishing, a row expanding — changes the
      // answer without resizing the container, so each one is watched too.
      for (const child of node.children) resize.observe(child);
      measure();
    };

    // Rows appended to a list change it again, and that is neither a scroll
    // nor a resize of anything already being observed.
    const mutations = new MutationObserver(watch);
    mutations.observe(node, { childList: true, subtree: true });

    watch();
    node.addEventListener('scroll', measure, { passive: true });

    return () => {
      node.removeEventListener('scroll', measure);
      resize.disconnect();
      mutations.disconnect();
    };
  }, [measure, enabled, visibility]);

  const current = visibility ?? (enabled ? measured : 'none');
  const mask = maskFor(current, orientation, size);

  return (
    <div
      ref={ref}
      data-slot="scroll-shadow"
      data-orientation={orientation}
      data-visibility={current}
      style={
        {
          ...style,
          maskImage: mask,
          WebkitMaskImage: mask,
        } as CSSProperties
      }
      className={cn(
        orientation === 'vertical'
          ? 'overflow-y-auto overflow-x-hidden'
          : 'overflow-x-auto overflow-y-hidden',
        hideScrollBar && '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
