import { useId } from 'react';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../utils';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';

import { Label } from '../label';

export type RadioGroupProps = ComponentProps<typeof RadioGroupPrimitive.Root>;

/**
 * A set of mutually exclusive choices.
 *
 * ```tsx
 * <RadioGroup defaultValue="now">
 *   <Radio value="now">Chạy ngay</Radio>
 *   <Radio value="cron" description="Theo lịch đã đặt">Đặt lịch</Radio>
 * </RadioGroup>
 * ```
 *
 * Pass `orientation="horizontal"` for a row — that also switches the arrow keys
 * Radix listens to, so it is not only a layout change.
 */
export const RadioGroup = ({ className, ...props }: RadioGroupProps) => (
  <RadioGroupPrimitive.Root
    data-slot="radio-group"
    className={cn(
      'grid gap-2.5',
      'aria-[orientation=horizontal]:auto-cols-max aria-[orientation=horizontal]:grid-flow-col aria-[orientation=horizontal]:gap-5',
      className,
    )}
    {...props}
  />
);

export type RadioGroupItemProps = ComponentProps<
  typeof RadioGroupPrimitive.Item
>;

/**
 * The bare control, for layouts `Radio` doesn't cover — a radio sitting in its
 * own table cell, say. When the choice has a label next to it, use `Radio`.
 */
export const RadioGroupItem = ({
  className,
  ...props
}: RadioGroupItemProps) => (
  <RadioGroupPrimitive.Item
    data-slot="radio-group-item"
    className={cn(
      'peer inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full border border-input bg-background shadow-xs transition-colors outline-none',
      'hover:border-foreground/35 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-input',
      'data-[state=checked]:border-primary data-[state=checked]:text-primary',
      'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
      className,
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator
      data-slot="radio-group-indicator"
      className="flex size-full items-center justify-center"
    >
      {/* A filled dot rather than an icon — a radio has no third state to draw. */}
      <span className="size-2 rounded-full bg-current" aria-hidden="true" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
);

export type RadioProps = RadioGroupItemProps & {
  /** Secondary line under the label. */
  description?: ReactNode;
};

/**
 * One labelled choice: the control, its label, and an optional description.
 *
 * The description sits *inside* the label, so clicking it selects the option —
 * on a pricing row the description is the biggest target, and having it be dead
 * space is worse than the one cost: a screen reader reads it as part of the
 * option's name rather than as a separate hint.
 */
export const Radio = ({
  id,
  description,
  children,
  className,
  ...props
}: RadioProps) => {
  const generatedId = useId();
  const itemId = id ?? generatedId;

  return (
    <div
      data-slot="radio"
      className={cn('flex items-start gap-2.5', className)}
    >
      <RadioGroupItem id={itemId} className="mt-0.5" {...props} />
      {(children || description) && (
        // `Label` already carries `peer-disabled:`, so being the control's
        // direct sibling is what makes a group-level `disabled` dim the text.
        <Label
          htmlFor={itemId}
          className="grid cursor-pointer gap-1 font-normal"
        >
          <span>{children}</span>
          {!!description && (
            <span
              data-slot="radio-description"
              className="text-sm font-normal text-muted-foreground"
            >
              {description}
            </span>
          )}
        </Label>
      )}
    </div>
  );
};
