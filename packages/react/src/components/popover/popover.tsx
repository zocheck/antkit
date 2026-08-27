import type { ComponentProps } from 'react';

import { cn } from '../../utils';
import { Popover as PopoverPrimitive } from 'radix-ui';

/**
 * A floating panel anchored to a trigger. `PopoverContent` renders through a
 * portal, so `overflow: hidden` on an ancestor cannot clip it.
 *
 * ```tsx
 * <Popover>
 *   <PopoverTrigger asChild>
 *     <Button variant="outline">Filters</Button>
 *   </PopoverTrigger>
 *   <PopoverContent className="p-4">{filters}</PopoverContent>
 * </Popover>
 * ```
 *
 * `Tooltip` for a label on hover, `DropdownMenu` for a list of actions,
 * `Popconfirm` for a yes/no on a destructive click.
 *
 * The content has no padding: `Select` and `DatePicker` build on it and need
 * the edges bare. Add your own when you use it directly.
 */
export const Popover = (
  props: ComponentProps<typeof PopoverPrimitive.Root>,
) => <PopoverPrimitive.Root data-slot="popover" {...props} />;

export const PopoverTrigger = (
  props: ComponentProps<typeof PopoverPrimitive.Trigger>,
) => <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;

export const PopoverAnchor = (
  props: ComponentProps<typeof PopoverPrimitive.Anchor>,
) => <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;

export const PopoverContent = ({
  className,
  align = 'start',
  sideOffset = 4,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Content>) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      data-slot="popover-content"
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'z-50 w-72 rounded-md border bg-popover p-0 text-popover-foreground shadow-md outline-hidden',
        'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
);
