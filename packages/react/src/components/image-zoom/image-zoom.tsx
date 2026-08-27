import { useEffect, useRef, useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '../../utils';

import { useLocale } from '../../lib/config';

export type ImageZoomProps = Omit<ComponentProps<'span'>, 'children'> & {
  /** Usually an `<img>`, but anything with a size works. */
  children: ReactNode;
  /** Gap kept between the zoomed image and the viewport edges. */
  zoomMargin?: number;
  backdropClassName?: string;
  /** Controlled state. Pair with `onZoomChange`. */
  zoomed?: boolean;
  onZoomChange?: (zoomed: boolean) => void;
  disabled?: boolean;
  zoomLabel?: string;
  unzoomLabel?: string;
};

/** Where the thumbnail sat, and how big the file behind it actually is. */
type Origin = {
  rect: DOMRect;
  naturalWidth: number;
};

const TRANSITION = 'transform 280ms cubic-bezier(0.2, 0, 0.2, 1)';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * The image's own box, not the wrapper's. As a grid or flex item the wrapper
 * stretches to the column, and animating from that box would start the zoom
 * from the wrong place and at the wrong scale.
 */
const measure = (trigger: HTMLElement): Origin => {
  const image = trigger.querySelector('img');
  const target = image ?? trigger.firstElementChild ?? trigger;

  return {
    rect: target.getBoundingClientRect(),
    naturalWidth: image?.naturalWidth ?? 0,
  };
};

/**
 * Click to lift an image out of the page and back again.
 *
 * ```tsx
 * <ImageZoom>
 *   <img src={proof} alt="Payment receipt" className="rounded-md" />
 * </ImageZoom>
 * ```
 *
 * The zoomed copy animates from wherever the thumbnail sits, so the eye keeps
 * track of which image grew — that is the whole point of the effect. It scales
 * up to the image's natural size at most, never past it into a blur.
 *
 * `Image` with `preview` is the other option: a full viewer with zoom and
 * rotate controls. Reach for this one when the image just needs to be bigger.
 */
export const ImageZoom = ({
  children,
  zoomMargin = 24,
  backdropClassName,
  zoomed: zoomedProp,
  onZoomChange,
  disabled = false,
  zoomLabel,
  unzoomLabel,
  className,
  ...props
}: ImageZoomProps) => {
  const locale = useLocale();
  const triggerRef = useRef<HTMLSpanElement>(null);
  // `origin` keeps the overlay mounted through the closing animation; `active`
  // is what the transform follows.
  const [origin, setOrigin] = useState<Origin | null>(null);
  const [active, setActive] = useState(false);

  const isControlled = zoomedProp !== undefined;

  const zoom = () => {
    if (disabled || origin) return;

    const trigger = triggerRef.current;

    if (!trigger) return;

    setOrigin(measure(trigger));
    onZoomChange?.(true);
  };

  // Open and close from the outside while controlled.
  useEffect(() => {
    if (!isControlled) return;

    if (zoomedProp) {
      const trigger = triggerRef.current;

      if (trigger) setOrigin((current) => current ?? measure(trigger));
    } else {
      setActive(false);
      // No transition means no `transitionend`, so nothing would unmount it.
      if (prefersReducedMotion()) setOrigin(null);
    }
  }, [isControlled, zoomedProp]);

  // One frame at the thumbnail's position, then the transform runs.
  useEffect(() => {
    if (!origin) return;

    const frame = requestAnimationFrame(() => setActive(true));

    return () => cancelAnimationFrame(frame);
  }, [origin]);

  useEffect(() => {
    if (!origin) return;

    const close = () => {
      onZoomChange?.(false);

      if (isControlled) return;

      setActive(false);
      if (prefersReducedMotion()) setOrigin(null);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    // Scrolling or resizing would leave the copy hanging over the wrong spot,
    // and re-measuring mid-gesture fights the animation. Closing is honest.
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [isControlled, onZoomChange, origin]);

  // Focus goes back where it came from once the overlay is gone.
  const wasOpen = useRef(false);

  useEffect(() => {
    if (origin) {
      wasOpen.current = true;
      return;
    }

    if (!wasOpen.current) return;

    wasOpen.current = false;
    triggerRef.current?.focus();
  }, [origin]);

  const close = () => {
    onZoomChange?.(false);

    if (isControlled) return;

    setActive(false);
    if (prefersReducedMotion()) setOrigin(null);
  };

  const transform = (() => {
    if (!origin || !active) return 'translate(0, 0) scale(1)';

    const { rect, naturalWidth } = origin;
    const fit = Math.min(
      (window.innerWidth - zoomMargin * 2) / rect.width,
      (window.innerHeight - zoomMargin * 2) / rect.height,
    );
    // Past its natural size the image only gets blurrier, so that is the cap.
    const natural = naturalWidth ? naturalWidth / rect.width : Infinity;
    const scale = Math.max(Math.min(fit, natural), 1);

    const dx = window.innerWidth / 2 - (rect.left + rect.width / 2);
    const dy = window.innerHeight / 2 - (rect.top + rect.height / 2);

    return `translate(${dx}px, ${dy}px) scale(${scale})`;
  })();

  return (
    <>
      <span
        ref={triggerRef}
        data-slot="image-zoom"
        data-zoomed={active || undefined}
        role={disabled ? undefined : 'button'}
        tabIndex={disabled ? undefined : 0}
        aria-label={
          disabled
            ? undefined
            : active
              ? (unzoomLabel ?? locale.image?.unzoom ?? 'Zoom out of the image')
              : (zoomLabel ?? locale.image?.zoom ?? 'Zoom in on the image')
        }
        className={cn(
          // `w-fit` keeps the hit area on the image even when the wrapper is a
          // stretched grid or flex item.
          'inline-flex w-fit max-w-full align-middle outline-none',
          !disabled && 'cursor-zoom-in',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          // The original stays in the layout, holding its space, but is not
          // drawn twice while the copy is up.
          origin && 'invisible',
          className,
        )}
        onClick={zoom}
        onKeyDown={(event) => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          zoom();
        }}
        {...props}
      >
        {children}
      </span>

      {origin &&
        createPortal(
          <div
            data-slot="image-zoom-overlay"
            role="dialog"
            aria-modal="true"
            aria-label={
              unzoomLabel ?? locale.image?.unzoom ?? 'Zoom out of the image'
            }
            className="fixed inset-0 z-50"
            onClick={close}
          >
            <div
              data-slot="image-zoom-backdrop"
              className={cn(
                'absolute inset-0 bg-background/85 backdrop-blur-sm transition-opacity duration-300',
                active ? 'opacity-100' : 'opacity-0',
                backdropClassName,
              )}
            />

            <div
              data-slot="image-zoom-image"
              className="cursor-zoom-out [&>*]:size-full [&>img]:object-contain"
              style={{
                position: 'fixed',
                left: origin.rect.left,
                top: origin.rect.top,
                width: origin.rect.width,
                height: origin.rect.height,
                transform,
                transition: prefersReducedMotion() ? undefined : TRANSITION,
                willChange: 'transform',
              }}
              onTransitionEnd={() => {
                if (!active) setOrigin(null);
              }}
            >
              {children}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};
