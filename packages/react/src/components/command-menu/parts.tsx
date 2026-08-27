import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../utils';
import { Command as CommandPrimitive } from 'cmdk';
import { SearchIcon } from 'lucide-react';

import { useLocale } from '../../lib/config';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../modal/dialog';

/**
 * cmdk wrappers styled for this kit. cmdk owns the filtering and the keyboard
 * model (arrows, Home/End, Enter, typeahead); these only add appearance.
 *
 * `CommandMenu` composes them into the palette most callers want, and `Select`
 * borrows the list. Reach for them directly when the rows need a shape neither
 * of those covers.
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

export type CommandInputProps = ComponentProps<
  typeof CommandPrimitive.Input
> & {
  /** Trailing content inside the search row — an `esc` hint, a spinner. */
  suffix?: ReactNode;
  /** Styles the row; `className` stays on the `<input>`. */
  wrapperClassName?: string;
};

export const CommandInput = ({
  className,
  suffix,
  wrapperClassName,
  ...props
}: CommandInputProps) => (
  <div
    data-slot="command-input-wrapper"
    className={cn(
      'flex h-9 items-center gap-2 border-b px-3',
      wrapperClassName,
    )}
  >
    <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
    <CommandPrimitive.Input
      data-slot="command-input"
      className={cn(
        'flex h-9 w-full min-w-0 bg-transparent py-3 text-sm outline-hidden',
        'placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
    {suffix}
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

export type CommandShortcutProps = ComponentProps<'kbd'>;

/**
 * The key hint on the trailing edge of a row. It only prints the keys — what
 * they are bound to is the app's business, and a palette row that renders a
 * shortcut it does not own is still telling the truth about the app.
 */
export const CommandShortcut = ({
  className,
  ...props
}: CommandShortcutProps) => (
  <kbd
    data-slot="command-shortcut"
    className={cn(
      'ml-auto shrink-0 rounded border border-border bg-muted px-1.5 py-0.5',
      'font-sans text-[10px] leading-none tracking-widest text-muted-foreground',
      className,
    )}
    {...props}
  />
);

export type CommandFooterProps = ComponentProps<'div'>;

/** The hint bar along the bottom edge. Compose it from `CommandShortcut`s. */
export const CommandFooter = ({ className, ...props }: CommandFooterProps) => (
  <div
    data-slot="command-footer"
    className={cn(
      'flex shrink-0 items-center gap-4 border-t border-border bg-muted/40 px-4 py-2',
      'text-[11px] text-muted-foreground',
      className,
    )}
    {...props}
  />
);

export type CommandDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  /** Read out on open. Falls back to the `dialog` label from `ConfigProvider`. */
  title?: string;
  description?: string;
  className?: string;
};

/**
 * The overlay a palette lives in: near the top of the viewport rather than
 * centred, because the list grows downwards and a centred box would walk up
 * the screen as the user types.
 *
 * The title and description are for screen readers only — a palette that
 * printed its own heading would push the input away from where the user is
 * already looking.
 */
export const CommandDialog = ({
  open,
  onOpenChange,
  children,
  title,
  description,
  className,
}: CommandDialogProps) => {
  const locale = useLocale();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          'top-[12vh] max-w-[min(36rem,calc(100vw-2rem))] translate-y-0 gap-0 overflow-hidden p-0',
          className,
        )}
      >
        <DialogTitle className="sr-only">
          {title ?? locale.common?.dialog ?? 'Dialog'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {description ?? locale.common?.dialogDescription ?? 'Dialog content'}
        </DialogDescription>

        {children}
      </DialogContent>
    </Dialog>
  );
};
