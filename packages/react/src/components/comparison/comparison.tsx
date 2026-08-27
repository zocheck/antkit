import { createContext, useContext, useMemo, useRef, useState } from 'react';
import type { ComponentProps, KeyboardEvent, PointerEvent } from 'react';

import { cn } from '../../utils';
import { GripVerticalIcon } from 'lucide-react';

type ComparisonContextValue = {
  /** Where the divider sits, 0–100 from the left edge. */
  position: number;
  mode: 'drag' | 'hover';
};

const ComparisonContext = createContext<ComparisonContextValue | null>(null);

const useComparison = (part: string) => {
  const context = useContext(ComparisonContext);

  if (!context) {
    throw new Error(`${part} must be rendered inside a <Comparison>`);
  }

  return context;
};

const clamp = (value: number) => Math.min(Math.max(value, 0), 100);

export type ComparisonProps = Omit<
  ComponentProps<'div'>,
  'onChange' | 'defaultValue'
> & {
  /**
   * - `'drag'` — the divider follows the pointer only while it is held down
   * - `'hover'` — it tracks the pointer as soon as it enters
   */
  mode?: 'drag' | 'hover';
  /** Uncontrolled starting split, 0–100. Ignored when `position` is passed. */
  defaultPosition?: number;
  position?: number;
  onPositionChange?: (position: number) => void;
  /** Percent the arrow keys move by. */
  step?: number;
  onDragStart?: () => void;
  onDragEnd?: () => void;
};

/**
 * Two layers stacked on top of each other, split by a divider the reader moves.
 *
 * ```tsx
 * <Comparison className="aspect-video rounded-lg border">
 *   <ComparisonItem position="left">
 *     <img src={before} alt="Before" />
 *   </ComparisonItem>
 *   <ComparisonItem position="right">
 *     <img src={after} alt="Sau" />
 *   </ComparisonItem>
 *   <ComparisonHandle />
 * </Comparison>
 * ```
 *
 * `position="left"` is the layer shown on the left of the divider — the split
 * is a single number, so the two items just clip it from opposite sides.
 *
 * Pointer events cover mouse, touch and pen in one path, and the container is a
 * real `slider`: focus it and the arrow keys, Home and End move the divider.
 */
export const Comparison = ({
  mode = 'drag',
  defaultPosition = 50,
  position,
  onPositionChange,
  step = 2,
  onDragStart,
  onDragEnd,
  className,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
  ...props
}: ComparisonProps) => {
  const [ownPosition, setOwnPosition] = useState(clamp(defaultPosition));
  const dragging = useRef(false);

  const current = position === undefined ? ownPosition : clamp(position);

  const move = (next: number) => {
    const value = clamp(next);
    if (position === undefined) setOwnPosition(value);
    onPositionChange?.(value);
  };

  const moveToPointer = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (!bounds.width) return;

    move(((event.clientX - bounds.left) / bounds.width) * 100);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    onPointerDown?.(event);
    if (mode !== 'drag') return;

    dragging.current = true;
    moveToPointer(event);
    onDragStart?.();
    // Capture so a fast drag that leaves the box keeps feeding us moves.
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    if (mode === 'hover' || dragging.current) moveToPointer(event);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    onPointerUp?.(event);
    if (!dragging.current) return;

    dragging.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    onDragEnd?.();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);

    let next: number | null = null;
    if (event.key === 'ArrowLeft') next = current - step;
    else if (event.key === 'ArrowRight') next = current + step;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = 100;

    if (next === null) return;

    move(next);
    event.preventDefault();
  };

  const context = useMemo(() => ({ position: current, mode }), [current, mode]);

  return (
    <ComparisonContext.Provider value={context}>
      <div
        data-slot="comparison"
        role="slider"
        tabIndex={0}
        aria-label="Comparison handle"
        aria-orientation="horizontal"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(current)}
        className={cn(
          'relative isolate w-full touch-none overflow-hidden select-none',
          'outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
          className,
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        {...props}
      />
    </ComparisonContext.Provider>
  );
};

export type ComparisonItemProps = ComponentProps<'div'> & {
  /** Which side of the divider this layer stays on. */
  position: 'left' | 'right';
};

export const ComparisonItem = ({
  position,
  className,
  style,
  ...props
}: ComparisonItemProps) => {
  const { position: split } = useComparison('ComparisonItem');

  return (
    <div
      data-slot="comparison-item"
      className={cn(
        'absolute inset-0 size-full',
        // Images are the common case and should fill the frame rather than
        // set it, so the split lines up whatever their intrinsic size is.
        '[&>img]:size-full [&>img]:object-cover',
        className,
      )}
      style={{
        clipPath:
          position === 'left'
            ? `inset(0 ${100 - split}% 0 0)`
            : `inset(0 0 0 ${split}%)`,
        ...style,
      }}
      {...props}
    />
  );
};

export type ComparisonHandleProps = ComponentProps<'div'>;

/** The divider itself. Pass children to replace the default bar and grip. */
export const ComparisonHandle = ({
  className,
  children,
  style,
  ...props
}: ComparisonHandleProps) => {
  const { position, mode } = useComparison('ComparisonHandle');

  return (
    <div
      data-slot="comparison-handle"
      aria-hidden
      className={cn(
        'absolute top-0 z-10 flex h-full w-10 -translate-x-1/2 items-center justify-center',
        mode === 'drag' && 'cursor-grab active:cursor-grabbing',
        className,
      )}
      style={{ left: `${position}%`, ...style }}
      {...props}
    >
      {children ?? (
        <>
          <div className="absolute left-1/2 h-full w-0.5 -translate-x-1/2 bg-background" />
          {mode === 'drag' && (
            <div className="relative flex items-center justify-center rounded-sm bg-background px-0.5 py-1 shadow-xs">
              <GripVerticalIcon className="size-4 text-muted-foreground" />
            </div>
          )}
        </>
      )}
    </div>
  );
};
