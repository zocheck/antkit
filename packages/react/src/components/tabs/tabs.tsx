'use client';

import type { ComponentProps } from 'react';

import { cn } from '../../utils';
import { tabsList, type TabsListVariants } from './tabs.styles';
import { Tabs as TabsPrimitive } from 'radix-ui';

/**
 * Tabbed panels.
 *
 * ```tsx
 * <Tabs defaultValue="runs">
 *   <TabsList>
 *     <TabsTrigger value="runs">Lượt chạy</TabsTrigger>
 *     <TabsTrigger value="logs">Nhật ký</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="runs">…</TabsContent>
 *   <TabsContent value="logs">…</TabsContent>
 * </Tabs>
 * ```
 */
const Tabs = ({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Root>) => {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn(
        'flex gap-2 data-[orientation=horizontal]:flex-col data-[orientation=vertical]:flex-row',
        className,
      )}
      {...props}
    />
  );
};

export type TabsListProps = ComponentProps<typeof TabsPrimitive.List> &
  TabsListVariants;

const TabsList = ({ className, variant, ...props }: TabsListProps) => {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant ?? 'default'}
      className={tabsList({ variant, className })}
      {...props}
    />
  );
};

const TabsTrigger = ({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger>) => {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        'inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap',
        'text-sm font-medium transition-colors',
        'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        '[&>svg]:pointer-events-none [&>svg]:size-4 [&>svg]:shrink-0',
        // The trigger styles itself off the list's variant so consumers only
        // pick the variant once, on `TabsList`.
        '[[data-variant=default]_&]:h-[calc(100%-1px)] [[data-variant=default]_&]:rounded-md [[data-variant=default]_&]:border [[data-variant=default]_&]:border-transparent [[data-variant=default]_&]:px-2 [[data-variant=default]_&]:py-1',
        '[[data-variant=default]_&]:data-[state=active]:border-border [[data-variant=default]_&]:data-[state=active]:bg-background [[data-variant=default]_&]:data-[state=active]:text-foreground',
        '[[data-variant=underline]_&]:flex-none [[data-variant=underline]_&]:border-transparent [[data-variant=underline]_&]:px-1 [[data-variant=underline]_&]:pb-2.5 [[data-variant=underline]_&]:hover:text-foreground',
        '[[data-variant=underline][data-orientation=horizontal]_&]:-mb-px [[data-variant=underline][data-orientation=horizontal]_&]:border-b-2',
        '[[data-variant=underline][data-orientation=vertical]_&]:-ml-px [[data-variant=underline][data-orientation=vertical]_&]:justify-start [[data-variant=underline][data-orientation=vertical]_&]:border-l-2 [[data-variant=underline][data-orientation=vertical]_&]:pt-1.5 [[data-variant=underline][data-orientation=vertical]_&]:pr-3 [[data-variant=underline][data-orientation=vertical]_&]:pb-1.5 [[data-variant=underline][data-orientation=vertical]_&]:pl-3',
        '[[data-variant=underline]_&]:data-[state=active]:border-primary [[data-variant=underline]_&]:data-[state=active]:text-foreground',
        className,
      )}
      {...props}
    />
  );
};

const TabsContent = ({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Content>) => {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        'flex-1 outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
      {...props}
    />
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
export { tabsList as tabsListStyles } from './tabs.styles';
