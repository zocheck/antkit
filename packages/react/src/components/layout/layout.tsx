import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../utils';
import { ChevronLeftIcon } from 'lucide-react';
import { Children, isValidElement, useState } from 'react';

/**
 * The metrics the app shell uses, so a `Layout` page and a `Sidebar` page line
 * up pixel for pixel — same rail widths, same 50px header, same 24px gutter.
 */
export const LAYOUT_SIDER_WIDTH = 220;
export const LAYOUT_SIDER_COLLAPSED_WIDTH = 66;

export type LayoutProps = ComponentProps<'div'> & {
  /**
   * Lay the children out in a row instead of a column. Auto-detected when a
   * `LayoutSider` is a direct child, so it rarely needs to be passed.
   */
  hasSider?: boolean;
};

/**
 * The page shell — header, sider, content, footer — dressed like the app
 * itself: a 220px rail that collapses to a 66px icon strip, a 50px header, a
 * 24px content gutter.
 *
 * ```tsx
 * <Layout className="h-dvh">
 *   <LayoutSider collapsible>
 *     <div className="px-4 pt-4 pb-2 font-medium">Luma</div>
 *     <nav className="grid gap-1 p-2">…</nav>
 *     <LayoutFooter>Luma © 0.0.0</LayoutFooter>
 *   </LayoutSider>
 *   <Layout>
 *     <LayoutHeader>…</LayoutHeader>
 *     <LayoutContent>…</LayoutContent>
 *   </Layout>
 * </Layout>
 * ```
 *
 * `Sidebar` is the full navigation rail with its own provider, mobile drawer
 * and menu parts — that is what the real shell is built on. `Layout` is the
 * plain frame for a screen that only needs regions.
 */
export const Layout = ({
  hasSider,
  className,
  children,
  ...props
}: LayoutProps) => {
  const row =
    hasSider ??
    Children.toArray(children).some(
      (child) => isValidElement(child) && child.type === LayoutSider,
    );

  return (
    <div
      data-slot="layout"
      className={cn(
        'flex min-h-0 flex-auto bg-background',
        row ? 'flex-row' : 'flex-col',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export type LayoutHeaderProps = ComponentProps<'header'>;

/**
 * The top bar: page context on the left, account and toggles on the right —
 * hence `justify-between` by default. It sticks, so a long page keeps it in
 * view the way the app does.
 */
export const LayoutHeader = ({ className, ...props }: LayoutHeaderProps) => (
  <header
    data-slot="layout-header"
    className={cn(
      'sticky top-0 z-30 flex h-[50px] shrink-0 items-center justify-between gap-x-4 border-b border-border bg-background px-6',
      className,
    )}
    {...props}
  />
);

export type LayoutContentProps = ComponentProps<'main'>;

/** Carries the shell's 24px gutter; pass `className` to override it. */
export const LayoutContent = ({ className, ...props }: LayoutContentProps) => (
  <main
    data-slot="layout-content"
    className={cn('flex min-h-0 min-w-0 flex-auto flex-col p-6', className)}
    {...props}
  />
);

export type LayoutFooterProps = ComponentProps<'footer'>;

/**
 * A page footer, or — dropped inside a `LayoutSider` — the centred brand and
 * version line the app shows under its menu, which steps aside when the rail
 * collapses.
 */
export const LayoutFooter = ({ className, ...props }: LayoutFooterProps) => (
  <footer
    data-slot="layout-footer"
    className={cn(
      'shrink-0 border-t border-border bg-background px-6 py-4 text-sm text-muted-foreground',
      // `mt-auto` pins it under a short menu and lets a long one scroll past.
      '[[data-slot=layout-sider]_&]:mt-auto [[data-slot=layout-sider]_&]:border-0 [[data-slot=layout-sider]_&]:bg-transparent [[data-slot=layout-sider]_&]:px-2 [[data-slot=layout-sider]_&]:pt-0 [[data-slot=layout-sider]_&]:pb-4 [[data-slot=layout-sider]_&]:text-center',
      '[[data-slot=layout-sider][data-collapsed=true]_&]:hidden',
      className,
    )}
    {...props}
  />
);

export type LayoutSiderProps = Omit<ComponentProps<'aside'>, 'onToggle'> & {
  /** Width in px when expanded. */
  width?: number;
  /** Width in px when collapsed — 0 hides the rail entirely. */
  collapsedWidth?: number;
  /** Controlled collapsed state. */
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  /** Render the toggle. */
  collapsible?: boolean;
  /**
   * `edge` is the round chevron hanging off the rail, as in the app shell.
   * `bar` is a full-width strip along the bottom, for a rail with no room to
   * spare beside it.
   */
  triggerVariant?: 'edge' | 'bar';
  /** Which edge the sider sits on — drives the border and the arrow direction. */
  side?: 'left' | 'right';
  /** Custom toggle content, or `null` to render the control without an icon. */
  trigger?: ReactNode;
  triggerLabel?: string;
};

export const LayoutSider = ({
  width = LAYOUT_SIDER_WIDTH,
  collapsedWidth = LAYOUT_SIDER_COLLAPSED_WIDTH,
  collapsed,
  defaultCollapsed = false,
  onCollapse,
  collapsible = false,
  triggerVariant = 'edge',
  side = 'left',
  trigger,
  triggerLabel = 'Thu gọn menu',
  className,
  children,
  style,
  ...props
}: LayoutSiderProps) => {
  const [uncontrolled, setUncontrolled] = useState(defaultCollapsed);
  const isCollapsed = collapsed ?? uncontrolled;
  const currentWidth = isCollapsed ? collapsedWidth : width;

  const toggle = () => {
    const next = !isCollapsed;

    if (collapsed === undefined) setUncontrolled(next);
    onCollapse?.(next);
  };

  // One chevron, rotated — the arrow always points the way the rail will move.
  const arrow = (
    <ChevronLeftIcon
      className={cn(
        'size-4 transition-transform',
        (side === 'left') === isCollapsed && 'rotate-180',
      )}
    />
  );

  return (
    <aside
      data-slot="layout-sider"
      data-collapsed={isCollapsed}
      // Width is data, not a class: callers pass arbitrary pixel values and
      // Tailwind can only ship the classes it sees at build time.
      style={{
        width: currentWidth,
        minWidth: currentWidth,
        maxWidth: currentWidth,
        ...style,
      }}
      className={cn(
        // No `overflow-hidden` here — the edge trigger hangs outside the rail.
        'relative flex shrink-0 flex-col bg-sidebar text-sidebar-foreground',
        'transition-[width,min-width,max-width] duration-200 ease-in-out',
        side === 'right' ? 'border-l border-border' : 'border-r border-border',
        className,
      )}
      {...props}
    >
      {collapsible && triggerVariant === 'edge' && (
        <button
          type="button"
          onClick={toggle}
          aria-label={triggerLabel}
          aria-expanded={!isCollapsed}
          className={cn(
            // Above the sticky header (z-30): the trigger hangs over the
            // content edge, and half of it would sit under the bar otherwise.
            'absolute top-4 z-40 flex size-6 cursor-pointer items-center justify-center rounded-md border border-border bg-background text-muted-foreground',
            'transition-shadow hover:text-foreground hover:shadow-md',
            'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
            side === 'right' ? '-left-3' : '-right-3',
          )}
        >
          {trigger === undefined ? arrow : trigger}
        </button>
      )}

      <div className="flex min-h-0 flex-auto flex-col overflow-x-hidden overflow-y-auto">
        {children}
      </div>

      {collapsible && triggerVariant === 'bar' && (
        <button
          type="button"
          onClick={toggle}
          aria-label={triggerLabel}
          aria-expanded={!isCollapsed}
          className={cn(
            'flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 border-t border-border',
            'text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
            'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
            '[&>svg]:size-4 [&>svg]:shrink-0',
          )}
        >
          {trigger === undefined ? arrow : trigger}
        </button>
      )}
    </aside>
  );
};
