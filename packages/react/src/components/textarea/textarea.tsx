import type { ComponentProps } from 'react';

import { cn } from '../../utils';
import { useLayoutEffect, useRef, useState } from 'react';

export type TextareaProps = ComponentProps<'textarea'> & {
  /** Grow with the content, optionally clamped to a row range. */
  autoSize?: boolean | { minRows?: number; maxRows?: number };
  /** Show `used / maxLength` under the field. */
  showCount?: boolean;
  /** Styles the wrapper that `showCount` adds; `className` stays on the field. */
  wrapperClassName?: string;
};

const LINE_HEIGHT = 20;
const VERTICAL_PADDING = 16;

/**
 * A multi-line text field.
 *
 * ```tsx
 * <Textarea placeholder="Notes" autoSize={{ minRows: 2, maxRows: 6 }} />
 * <Textarea maxLength={200} showCount />
 * ```
 */
export const Textarea = ({
  autoSize,
  showCount = false,
  wrapperClassName,
  className,
  value,
  defaultValue,
  maxLength,
  onChange,
  ...props
}: TextareaProps) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  // Mirrors the length so `showCount` still counts on an uncontrolled field.
  const [innerLength, setInnerLength] = useState(
    () => String(defaultValue ?? value ?? '').length,
  );

  const rows = autoSize === true || !autoSize ? {} : autoSize;
  const { minRows, maxRows } = rows;

  const resize = () => {
    const node = ref.current;

    if (!node || !autoSize) return;

    // Collapse first: scrollHeight only shrinks once the old height is gone.
    node.style.height = 'auto';

    const min = minRows ? minRows * LINE_HEIGHT + VERTICAL_PADDING : 0;
    const max = maxRows ? maxRows * LINE_HEIGHT + VERTICAL_PADDING : Infinity;
    const next = Math.min(Math.max(node.scrollHeight, min), max);

    node.style.height = `${next}px`;
    node.style.overflowY = node.scrollHeight > max ? 'auto' : 'hidden';
  };

  // Runs before paint so the box never flashes at the wrong height.
  useLayoutEffect(resize, [value, autoSize, minRows, maxRows]);

  const field = (
    <textarea
      ref={ref}
      data-slot="textarea"
      value={value}
      defaultValue={defaultValue}
      maxLength={maxLength}
      onChange={(event) => {
        resize();
        setInnerLength(event.target.value.length);
        onChange?.(event);
      }}
      className={cn(
        'w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs',
        'transition-[color,box-shadow] outline-none placeholder:text-muted-foreground',
        'selection:bg-primary selection:text-primary-foreground',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'md:text-sm dark:bg-input/30',
        'outline-hidden focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
        autoSize ? 'resize-none' : 'field-sizing-content min-h-16 resize-y',
        className,
      )}
      {...props}
    />
  );

  if (!showCount) return field;

  const length = value === undefined ? innerLength : String(value).length;

  return (
    <div
      data-slot="textarea-wrapper"
      className={cn('flex w-full flex-col gap-1', wrapperClassName)}
    >
      {field}
      <span className="self-end text-xs text-muted-foreground tabular-nums">
        {maxLength ? `${length} / ${maxLength}` : length}
      </span>
    </div>
  );
};
