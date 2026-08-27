import { cn } from '../../utils';
import React from 'react';

/**
 * A bordered block of content. Every part is optional and every one is a plain
 * `<div>`, so a card is composed rather than configured.
 *
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Monthly report</CardTitle>
 *     <CardDescription>Generated on the first of each month.</CardDescription>
 *   </CardHeader>
 *   <CardContent>{summary}</CardContent>
 *   <CardFooter className="justify-end">
 *     <Button>Download</Button>
 *   </CardFooter>
 * </Card>
 * ```
 *
 * `Descriptions` for label/value pairs, `Statistic` for a single number,
 * `Modal` when the content should interrupt rather than sit in the page.
 *
 * The root owns the vertical padding and the parts own the horizontal, so a
 * full-bleed image inside `CardContent` wants `-mx-6` rather than a padding
 * override on the card.
 */
function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'flex min-w-0 flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm',
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn('flex flex-col gap-1.5 px-6', className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('font-medium leading-none', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-6', className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6', className)}
      {...props}
    />
  );
}

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
