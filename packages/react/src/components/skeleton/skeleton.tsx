import { cn } from '../../utils';

/**
 * A pulsing placeholder in the shape of the content that is loading. It has no
 * size of its own — `className` gives it one.
 *
 * ```tsx
 * <div className="space-y-2">
 *   <Skeleton className="h-4 w-48" />
 *   <Skeleton className="h-4 w-32" />
 * </div>
 * ```
 *
 * Use `Spinner` when the shape of what is coming is not known yet, and
 * `Progress` when you can say how far along it is.
 */
const Skeleton = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="skeleton"
      className={cn('animate-pulse rounded-md bg-accent', className)}
      {...props}
    />
  );
};

export { Skeleton };
