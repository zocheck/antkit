import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../utils';
import { Slider as SliderPrimitive } from 'radix-ui';
import { useState } from 'react';

export type SliderMark = {
  value: number;
  label: ReactNode;
};

type SliderRootProps = ComponentProps<typeof SliderPrimitive.Root>;

export type SliderProps = Omit<
  SliderRootProps,
  'value' | 'defaultValue' | 'onValueChange' | 'onValueCommit' | 'orientation'
> & {
  /** A number for a single handle, an array for a range. */
  value?: number | number[];
  defaultValue?: number | number[];
  /** Fires on every step while dragging. */
  onChange?: (value: number | number[]) => void;
  /** Fires once, when the handle is released. */
  onChangeComplete?: (value: number | number[]) => void;
  /**
   * Force two handles. Inferred from an array `value`/`defaultValue`, so it is
   * only needed when neither is supplied up front.
   */
  range?: boolean;
  vertical?: boolean;
  /** Either `[{ value, label }]` or the object shape `{ 0: 'Low', 100: 'High' }`. */
  marks?: SliderMark[] | Record<number, ReactNode>;
  /** `true` shows the value on hover/focus, `'always'` keeps it visible. */
  tooltip?: boolean | 'always';
  formatTooltip?: (value: number) => ReactNode;
};

const toArray = (value: number | number[] | undefined) => {
  if (value === undefined) return undefined;

  return Array.isArray(value) ? value : [value];
};

const normalizeMarks = (marks: SliderProps['marks']): SliderMark[] => {
  if (!marks) return [];
  if (Array.isArray(marks)) return marks;

  return Object.entries(marks).map(([value, label]) => ({
    value: Number(value),
    label,
  }));
};

/**
 * Pick a number, or a range of them.
 *
 * ```tsx
 * <Slider value={volume} onChange={(v) => setVolume(v as number)} />
 * <Slider range defaultValue={[20, 60]} marks={{ 0: '0%', 100: '100%' }} />
 * ```
 */
export const Slider = ({
  value,
  defaultValue,
  onChange,
  onChangeComplete,
  range,
  vertical = false,
  marks,
  tooltip = true,
  formatTooltip,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  className,
  ...props
}: SliderProps) => {
  const values = toArray(value);
  const defaults = toArray(defaultValue);
  const isRange = range ?? Array.isArray(value ?? defaultValue);
  const fallback = isRange ? [min, max] : [min];

  // Radix always works in arrays; the caller's shape decides what comes back.
  const emit = (next: number[]) => (isRange ? next : (next[0] ?? min));

  // Mirrored so an uncontrolled slider still has a live value to put in the
  // tooltip — Radix only reports changes, it doesn't expose its state.
  const [internal, setInternal] = useState(values ?? defaults ?? fallback);
  const thumbValues = values ?? internal;
  const markList = normalizeMarks(marks);
  const percent = (mark: number) => ((mark - min) / (max - min)) * 100;

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      value={values}
      defaultValue={defaults ?? fallback}
      onValueChange={(next) => {
        setInternal(next);
        onChange?.(emit(next));
      }}
      onValueCommit={
        onChangeComplete ? (next) => onChangeComplete(emit(next)) : undefined
      }
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      orientation={vertical ? 'vertical' : 'horizontal'}
      className={cn(
        'group/slider relative flex touch-none items-center select-none',
        vertical ? 'h-40 w-4 flex-col' : 'w-full',
        disabled && 'opacity-50',
        // Mark labels sit outside the track, so reserve room for them.
        markList.length > 0 && (vertical ? 'mr-10' : 'mb-6'),
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          'relative grow overflow-hidden rounded-full bg-muted',
          vertical ? 'h-full w-1.5' : 'h-1.5 w-full',
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn('absolute bg-primary', vertical ? 'w-full' : 'h-full')}
        />
      </SliderPrimitive.Track>

      {thumbValues.map((thumbValue, index) => (
        <SliderPrimitive.Thumb
          // Handles are positional — a value can repeat, so the index is the
          // only stable identity here.
          key={index}
          data-slot="slider-thumb"
          className={cn(
            'relative block size-4 shrink-0 rounded-full border-2 border-primary bg-background shadow-sm',
            'transition-[box-shadow] hover:ring-4 hover:ring-primary/15',
            'focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-primary/25',
            'disabled:pointer-events-none',
          )}
        >
          {tooltip !== false && (
            <span
              aria-hidden
              className={cn(
                'pointer-events-none absolute rounded-md bg-foreground px-1.5 py-0.5',
                'text-xs leading-4 whitespace-nowrap text-background',
                vertical
                  ? 'top-1/2 right-full mr-2 -translate-y-1/2'
                  : 'bottom-full left-1/2 mb-2 -translate-x-1/2',
                tooltip === 'always'
                  ? 'opacity-100'
                  : cn(
                      'opacity-0 transition-opacity',
                      'group-hover/slider:opacity-100 group-focus-within/slider:opacity-100',
                    ),
              )}
            >
              {formatTooltip ? formatTooltip(thumbValue) : thumbValue}
            </span>
          )}
        </SliderPrimitive.Thumb>
      ))}

      {markList.map((mark) => (
        <span
          key={mark.value}
          aria-hidden
          data-slot="slider-mark"
          // Percentages along the track can't be expressed as utilities.
          style={
            vertical
              ? { bottom: `${percent(mark.value)}%` }
              : { left: `${percent(mark.value)}%` }
          }
          className={cn(
            'pointer-events-none absolute text-xs whitespace-nowrap text-muted-foreground',
            vertical
              ? 'left-full ml-3 -translate-y-1/2'
              : 'top-full mt-2 -translate-x-1/2',
          )}
        >
          {mark.label}
        </span>
      ))}
    </SliderPrimitive.Root>
  );
};
