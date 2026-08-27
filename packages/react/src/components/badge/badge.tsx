import type { ComponentProps } from 'react';

import { Slot } from 'radix-ui';

import { badge, type BadgeVariants } from './badge.styles';

export type BadgeProps = ComponentProps<'span'> &
  BadgeVariants & {
    /** Render as the child element instead of a span — e.g. a `<Link>`. */
    asChild?: boolean;
  };

/**
 * A small status pill. `variant` is `'default' | 'secondary' | 'destructive' |
 * 'outline' | 'success' | 'warning' | 'info' | 'muted'`.
 *
 * ```tsx
 * <Badge variant="success">Paid</Badge>
 * <Badge variant="outline" asChild>
 *   <a href="/tags/react">react</a>
 * </Badge>
 * ```
 *
 * `Tag` when the user can remove it, `CountBadge` for a number pinned to the
 * corner of something else, `Status` for a dot-and-label state.
 */
export const Badge = ({
  className,
  variant,
  asChild = false,
  ...props
}: BadgeProps) => {
  const Comp = asChild ? Slot.Root : 'span';

  return (
    <Comp
      data-slot="badge"
      className={badge({ variant, className })}
      {...props}
    />
  );
};

export { badge as badgeStyles } from './badge.styles';
