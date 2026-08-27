import type { ComponentProps, ReactElement, ReactNode } from 'react';

import { cn, isEmpty } from '../../utils';
import { Tooltip as TooltipPrimitive } from 'radix-ui';

/**
 * Radix wrappers. `Tooltip` composes them; use them directly for a tooltip
 * that needs controlled open state or a trigger that isn't a single element.
 */

export const TooltipProvider = ({
  delayDuration = 0,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Provider>) => (
  <TooltipPrimitive.Provider
    data-slot="tooltip-provider"
    delayDuration={delayDuration}
    {...props}
  />
);

export const TooltipRoot = (
  props: ComponentProps<typeof TooltipPrimitive.Root>,
) => <TooltipPrimitive.Root data-slot="tooltip" {...props} />;

export const TooltipTrigger = (
  props: ComponentProps<typeof TooltipPrimitive.Trigger>,
) => <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;

export const TooltipContent = ({
  className,
  sideOffset = 0,
  children,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Content>) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      data-slot="tooltip-content"
      sideOffset={sideOffset}
      className={cn(
        'z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md bg-foreground px-3 py-1.5 text-xs text-balance text-background',
        'animate-in fade-in-0 zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        className,
      )}
      {...props}
    >
      {children}
      <TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-xs bg-foreground fill-foreground" />
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
);

export type TooltipPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'leftTop'
  | 'leftBottom'
  | 'rightTop'
  | 'rightBottom';

export type RadixPlacement = {
  side: 'top' | 'bottom' | 'left' | 'right';
  align: 'start' | 'center' | 'end';
};

/**
 * A `placement` names a side and an alignment in one string; Radix wants the
 * two separately. Shared with every component here that takes one.
 */
export const PLACEMENT: Record<TooltipPlacement, RadixPlacement> = {
  top: { side: 'top', align: 'center' },
  bottom: { side: 'bottom', align: 'center' },
  left: { side: 'left', align: 'center' },
  right: { side: 'right', align: 'center' },
  topLeft: { side: 'top', align: 'start' },
  topRight: { side: 'top', align: 'end' },
  bottomLeft: { side: 'bottom', align: 'start' },
  bottomRight: { side: 'bottom', align: 'end' },
  leftTop: { side: 'left', align: 'start' },
  leftBottom: { side: 'left', align: 'end' },
  rightTop: { side: 'right', align: 'start' },
  rightBottom: { side: 'right', align: 'end' },
};

export type TooltipProps = {
  /** Nothing renders when this is empty, so an optional label needs no guard. */
  title?: ReactNode;
  placement?: TooltipPlacement;
  children: ReactElement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Milliseconds before it appears. */
  mouseEnterDelay?: number;
  className?: string;
};

/**
 * A tooltip: one wrapper, a `title`, and a `placement`.
 *
 * ```tsx
 * <Tooltip title="Delete record" placement="topRight">
 *   <Button variant="ghost" size="icon"><Trash2Icon /></Button>
 * </Tooltip>
 * ```
 *
 * The child has to forward a ref and its props — every control in this kit
 * does. Needs a `TooltipProvider` above it, which `Sidebar` and `Gantt` already
 * mount for their own subtrees; add one near the app root otherwise.
 */
export const Tooltip = ({
  title,
  placement = 'top',
  children,
  open,
  defaultOpen,
  onOpenChange,
  mouseEnterDelay,
  className,
}: TooltipProps) => {
  // Rendering the bare child when there is no title means a
  // caller can pass a maybe-empty label without branching.
  if (isEmpty(title)) return children;

  const { side, align } = PLACEMENT[placement];

  return (
    <TooltipRoot
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      delayDuration={mouseEnterDelay}
    >
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} align={align} className={className}>
        {title}
      </TooltipContent>
    </TooltipRoot>
  );
};
