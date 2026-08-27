import * as React from 'react';

import { cn } from '../../utils';

/**
 * A single-line text field. Takes every `<input>` prop, so `type`,
 * `placeholder`, `readOnly` and the rest behave exactly as they do natively.
 *
 * ```tsx
 * <Input type="email" placeholder="you@example.com" />
 * ```
 *
 * Use `InputNumber` for numbers — a native `type="number"` accepts `e` and
 * `-`, and hands back a string. `Textarea` for more than one line,
 * `AutoComplete` when there are suggestions to offer.
 *
 * It needs no adapter inside a `Form.Item`: the item injects `value`,
 * `onChange`, `onBlur` and the aria props onto it.
 */
const Input = ({
  className,
  type,
  ...props
}: React.ComponentProps<'input'>) => {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-[38px] w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30',
        'outline-hidden focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
        className,
      )}
      {...props}
    />
  );
};

export { Input };
