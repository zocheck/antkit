import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

export type ColumnWidths = Record<string, number>;

type UseColumnWidthsOptions = {
  /** Controlled widths, useful when a user preference is persisted externally. */
  value?: ColumnWidths;
  /** Initial widths for the uncontrolled mode. */
  defaultValue?: ColumnWidths;
  onChange?: (widths: ColumnWidths) => void;
  minWidth?: number;
};

/**
 * Column resizing with a controlled/uncontrolled API. Pointer movement is
 * batched into animation frames so a large table doesn't re-render on every
 * raw pointer event.
 */
export const useColumnWidths = ({
  value,
  defaultValue = {},
  onChange,
  minWidth = 64,
}: UseColumnWidthsOptions = {}) => {
  const [uncontrolledWidths, setUncontrolledWidths] =
    useState<ColumnWidths>(defaultValue);
  const widths = value ?? uncontrolledWidths;
  const widthsRef = useRef(widths);
  const endDrag = useRef<(() => void) | null>(null);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    widthsRef.current = widths;
  }, [widths]);

  const setWidths = useCallback(
    (next: ColumnWidths) => {
      widthsRef.current = next;

      if (value === undefined) {
        setUncontrolledWidths(next);
      }

      onChange?.(next);
    },
    [onChange, value],
  );

  const startResize = useCallback(
    (key: string, event: ReactPointerEvent, startWidth: number) => {
      event.preventDefault();
      event.stopPropagation();
      endDrag.current?.();

      const startX = event.clientX;
      let latestWidth = startWidth;

      const flushResize = () => {
        frame.current = null;
        setWidths({
          ...widthsRef.current,
          [key]: Math.max(minWidth, latestWidth),
        });
      };

      const onMove = (moveEvent: PointerEvent) => {
        latestWidth = startWidth + moveEvent.clientX - startX;

        if (frame.current === null) {
          frame.current = window.requestAnimationFrame(flushResize);
        }
      };

      const onUp = () => {
        if (frame.current !== null) {
          window.cancelAnimationFrame(frame.current);
          frame.current = null;
          flushResize();
        }

        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        endDrag.current = null;
      };

      endDrag.current = onUp;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    },
    [minWidth, setWidths],
  );

  useEffect(
    () => () => {
      endDrag.current?.();
    },
    [],
  );

  return { widths, startResize };
};
