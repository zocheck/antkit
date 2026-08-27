import * as React from 'react';
import { Separator as SeparatorPrimitive } from 'radix-ui';

import { cn } from '../../utils';

/**
 * A rule between blocks of content, horizontal or vertical.
 *
 * ```tsx
 * <Separator className="my-4" />
 * <Separator orientation="vertical" className="h-4" />
 * ```
 *
 * A `Card` already separates itself from what is around it, and a heading
 * usually divides a page better than a line does.
 *
 * `decorative` defaults to on, which keeps the rule out of the accessibility
 * tree. Turn it off only when the line is the sole thing marking the change of
 * section. A vertical separator has no height of its own — give it one, or put
 * it in a flex row with stretched items.
 */
const Separator = ({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) => {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
        className,
      )}
      {...props}
    />
  );
};

export { Separator };
