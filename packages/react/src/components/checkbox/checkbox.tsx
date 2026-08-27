import type { ComponentProps } from 'react';

import { cn } from '../../utils';
import { CheckIcon, MinusIcon } from 'lucide-react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';

export type CheckedState = boolean | 'indeterminate';

export type CheckboxProps = ComponentProps<typeof CheckboxPrimitive.Root>;

/**
 * A tri-state checkbox. `checked` takes `true`, `false`, or `'indeterminate'`.
 *
 * ```tsx
 * <Checkbox
 *   id="terms"
 *   checked={agreed}
 *   onCheckedChange={(next) => setAgreed(next === true)}
 * />
 * <Label htmlFor="terms">I agree to the terms</Label>
 * ```
 *
 * `Switch` when the change commits immediately; a checkbox commits with the
 * form around it. `CheckboxGroup` when there is a list of them to manage as
 * one value.
 *
 * `checked="indeterminate"` is the "some but not all" state — a select-all box
 * over a partly selected table. Unlike a native input, it is part of the props
 * rather than something you set imperatively on the DOM node. Note the handler
 * is `onCheckedChange`, and it can hand you that third value.
 */
export const Checkbox = ({ className, ...props }: CheckboxProps) => (
  <CheckboxPrimitive.Root
    data-slot="checkbox"
    className={cn(
      'peer inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-[4px] border border-input bg-background text-primary-foreground shadow-xs transition-colors outline-none',
      'hover:border-foreground/35 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-input',
      'data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      'data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground',
      'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      data-slot="checkbox-indicator"
      className="flex size-full items-center justify-center text-current"
    >
      {props.checked === 'indeterminate' ? (
        <MinusIcon className="size-3" strokeWidth={3} aria-hidden="true" />
      ) : (
        <CheckIcon className="size-3" strokeWidth={3} aria-hidden="true" />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
);
