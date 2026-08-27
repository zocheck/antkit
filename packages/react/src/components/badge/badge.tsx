import type { ComponentProps } from 'react';

import { Slot } from 'radix-ui';

import { badge, type BadgeVariants } from './badge.styles';

export type BadgeProps = ComponentProps<'span'> &
  BadgeVariants & {
    /** Render as the child element instead of a span — e.g. a `<Link>`. */
    asChild?: boolean;
  };

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
