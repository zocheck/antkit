import { Loader2Icon } from 'lucide-react';

import { cn } from '../../utils';

/**
 * A spinning indicator. Sized and coloured with `className`, like any icon.
 *
 * ```tsx
 * <Spinner className="size-6 text-muted-foreground" />
 * ```
 *
 * `Button` has its own `loading` prop — never put a `Spinner` inside one.
 * Prefer `Skeleton` when the shape of the incoming content is already known.
 *
 * It carries `role="status"` and an English `aria-label`; pass your own
 * `aria-label` to translate it.
 */
const Spinner = ({ className, ...props }: React.ComponentProps<'svg'>) => {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  );
};

export { Spinner };
