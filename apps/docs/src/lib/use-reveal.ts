import { useEffect, useRef, useState } from 'react';

/** Everything here is decoration — honour the setting that asks for none. */
export const prefersReducedMotion = () =>
  globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

/**
 * True once the element has scrolled into view, and true forever after: a
 * section that faded in should not fade back out when it leaves the screen.
 * Returns `true` immediately when motion is turned down, so nothing sits at
 * `opacity: 0` waiting for an animation that will never run.
 */
export const useReveal = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(prefersReducedMotion);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      // Fires a little before the element's top edge clears the fold, so the
      // animation is already running by the time it is properly in view.
      { rootMargin: '0px 0px -12% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, shown };
};
