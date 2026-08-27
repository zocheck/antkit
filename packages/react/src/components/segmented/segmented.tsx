import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../utils';
import { useState } from 'react';

export type SegmentedValue = string | number;

export type SegmentedOption = {
  label: ReactNode;
  value: SegmentedValue;
  icon?: ReactNode;
  disabled?: boolean;
};

export type SegmentedProps = Omit<
  ComponentProps<'div'>,
  'onChange' | 'defaultValue'
> & {
  /** Plain values are shorthand for `{ label: value, value }`. */
  options: (SegmentedOption | SegmentedValue)[];
  value?: SegmentedValue;
  defaultValue?: SegmentedValue;
  onChange?: (value: SegmentedValue) => void;
  size?: 'sm' | 'default' | 'lg';
  /** Stretch to the container and share the width evenly. */
  block?: boolean;
  disabled?: boolean;
};

const SIZE_CLASS = {
  sm: 'h-7 text-xs',
  default: 'h-8 text-sm',
  lg: 'h-10 text-sm',
} as const;

const normalize = (
  option: SegmentedOption | SegmentedValue,
): SegmentedOption =>
  typeof option === 'object'
    ? option
    : { label: String(option), value: option };

/**
 * A one-of-N control that shows every choice at once. Pick this over `Select`
 * when there are two to four options and over `Tabs` when it filters content
 * rather than switching panels.
 *
 * ```tsx
 * <Segmented
 *   options={['Day', 'Week', 'Month']}
 *   value={range}
 *   onChange={(value) => setRange(value as string)}
 * />
 * ```
 */
export const Segmented = ({
  options,
  value,
  defaultValue,
  onChange,
  size = 'default',
  block = false,
  disabled = false,
  className,
  ...props
}: SegmentedProps) => {
  const items = options.map(normalize);
  const [uncontrolled, setUncontrolled] = useState<SegmentedValue | undefined>(
    defaultValue ?? items[0]?.value,
  );
  const current = value ?? uncontrolled;

  const select = (next: SegmentedValue) => {
    if (value === undefined) setUncontrolled(next);
    onChange?.(next);
  };

  return (
    <div
      data-slot="segmented"
      role="radiogroup"
      aria-disabled={disabled || undefined}
      className={cn(
        'inline-flex items-center gap-0.5 rounded-lg bg-muted p-[3px] text-muted-foreground',
        block && 'flex w-full',
        disabled && 'opacity-50',
        className,
      )}
      {...props}
    >
      {items.map((item) => {
        const active = item.value === current;

        return (
          <button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled || item.disabled}
            onClick={() => select(item.value)}
            className={cn(
              'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md px-3',
              'font-medium whitespace-nowrap transition-colors',
              'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
              'disabled:pointer-events-none disabled:opacity-50',
              '[&>svg]:size-4 [&>svg]:shrink-0',
              SIZE_CLASS[size],
              block && 'flex-1',
              active
                ? 'bg-background text-foreground shadow-sm'
                : 'hover:text-foreground',
            )}
          >
            {item.icon}
            {item.label}
          </button>
        );
      })}
    </div>
  );
};
