import type { ComponentProps } from 'react';

import { cn } from '../../utils';
import { Command as CommandPrimitive } from 'cmdk';
import { SearchIcon } from 'lucide-react';

/**
 * cmdk wrappers styled for this kit. cmdk owns the filtering and the keyboard
 * model (arrows, Home/End, Enter, typeahead); these only add appearance.
 *
 * `Select` composes them — reach for them directly to build a command palette
 * or any other filterable list.
 */

export const Command = ({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive>) => (
  <CommandPrimitive
    data-slot="command"
    className={cn(
      'flex size-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
      className,
    )}
    {...props}
  />
);

export const CommandInput = ({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Input>) => (
  <div
    data-slot="command-input-wrapper"
    className="flex h-9 items-center gap-2 border-b px-3"
  >
    <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
    <CommandPrimitive.Input
      data-slot="command-input"
      className={cn(
        'flex h-9 w-full bg-transparent py-3 text-sm outline-hidden',
        'placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  </div>
);

export const CommandList = ({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.List>) => (
  <CommandPrimitive.List
    data-slot="command-list"
    className={cn('max-h-64 scroll-py-1 overflow-y-auto p-1', className)}
    {...props}
  />
);

export const CommandEmpty = (
  props: ComponentProps<typeof CommandPrimitive.Empty>,
) => (
  <CommandPrimitive.Empty
    data-slot="command-empty"
    className="py-6 text-center text-sm text-muted-foreground"
    {...props}
  />
);

export const CommandGroup = ({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Group>) => (
  <CommandPrimitive.Group
    data-slot="command-group"
    className={cn(
      'overflow-hidden p-1 text-foreground',
      '[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5',
      '[&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
      className,
    )}
    {...props}
  />
);

export const CommandItem = ({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Item>) => (
  <CommandPrimitive.Item
    data-slot="command-item"
    className={cn(
      'relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-hidden',
      'data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground',
      'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
      className,
    )}
    {...props}
  />
);

export const CommandSeparator = ({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Separator>) => (
  <CommandPrimitive.Separator
    data-slot="command-separator"
    className={cn('-mx-1 my-1 h-px bg-border', className)}
    {...props}
  />
);
