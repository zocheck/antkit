import type { ComponentProps } from 'react';

import { cn } from '../../utils';

/**
 * Plain table elements with the project's styling. `Table` builds on these;
 * reach for them directly when a layout doesn't fit a column list.
 */

export const TableRoot = ({ className, ...props }: ComponentProps<'table'>) => (
  // The wrapper is what scrolls, so a wide table never widens the page.
  <div data-slot="table-container" className="w-full overflow-x-auto">
    <table
      data-slot="table"
      className={cn('w-full caption-bottom text-sm', className)}
      {...props}
    />
  </div>
);

export const TableHeader = ({
  className,
  ...props
}: ComponentProps<'thead'>) => (
  <thead
    data-slot="table-header"
    className={cn('[&_tr]:border-b', className)}
    {...props}
  />
);

export const TableBody = ({ className, ...props }: ComponentProps<'tbody'>) => (
  <tbody
    data-slot="table-body"
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
);

export const TableFooter = ({
  className,
  ...props
}: ComponentProps<'tfoot'>) => (
  <tfoot
    data-slot="table-footer"
    className={cn('border-t bg-muted/50 font-medium', className)}
    {...props}
  />
);

export const TableRow = ({ className, ...props }: ComponentProps<'tr'>) => (
  <tr
    data-slot="table-row"
    className={cn(
      'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
      className,
    )}
    {...props}
  />
);

export const TableHead = ({ className, ...props }: ComponentProps<'th'>) => (
  <th
    data-slot="table-head"
    className={cn(
      'h-10 whitespace-nowrap px-3 text-left align-middle text-xs font-medium uppercase tracking-wide text-muted-foreground',
      className,
    )}
    {...props}
  />
);

export const TableCell = ({ className, ...props }: ComponentProps<'td'>) => (
  <td
    data-slot="table-cell"
    className={cn('px-3 py-2.5 align-middle', className)}
    {...props}
  />
);

export const TableCaption = ({
  className,
  ...props
}: ComponentProps<'caption'>) => (
  <caption
    data-slot="table-caption"
    className={cn('mt-4 text-sm text-muted-foreground', className)}
    {...props}
  />
);
