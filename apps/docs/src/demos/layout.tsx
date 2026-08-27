import { useState } from 'react';

import {
  Avatar,
  AvatarFallback,
  Button,
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  LayoutSider,
} from '@antkit/react';
import { BellIcon, HomeIcon, ListIcon, MailIcon } from 'lucide-react';

import type { DemoMeta } from '../lib/types';

const MENU = [
  { icon: <HomeIcon className="size-4" />, label: 'Overview' },
  { icon: <ListIcon className="size-4" />, label: 'Tasks' },
  { icon: <MailIcon className="size-4" />, label: 'Campaigns' },
];

export const meta: DemoMeta = {
  imports: [
    'Layout',
    'LayoutHeader',
    'LayoutSider',
    'LayoutContent',
    'LayoutFooter',
  ],
  api: [
    {
      title: 'Layout',
      props: [
        {
          name: 'hasSider',
          type: 'boolean',
          description:
            'Lays the children out in a row. It switches on by itself when a LayoutSider is a direct child, so it rarely needs passing.',
        },
      ],
    },
    {
      title: 'LayoutSider',
      description: 'Takes every prop an <aside> does.',
      props: [
        {
          name: 'width',
          type: 'number',
          default: '220',
          description: 'The width in px while open.',
        },
        {
          name: 'collapsedWidth',
          type: 'number',
          default: '66',
          description: 'The width while collapsed. Set 0 to hide it entirely.',
        },
        {
          name: 'collapsed',
          type: 'boolean',
          description: 'The controlled collapsed state.',
        },
        {
          name: 'defaultCollapsed',
          type: 'boolean',
          default: 'false',
          description: 'The starting state when uncontrolled.',
        },
        {
          name: 'onCollapse',
          type: '(collapsed: boolean) => void',
          description: 'Called on every change.',
        },
        {
          name: 'collapsible',
          type: 'boolean',
          default: 'false',
          description: 'Shows the collapse trigger.',
        },
        {
          name: 'triggerVariant',
          type: "'edge' | 'bar'",
          default: "'edge'",
          description:
            'edge is a round chevron poking out of the border; bar is a full-width strip along the bottom.',
        },
        {
          name: 'side',
          type: "'left' | 'right'",
          default: "'left'",
          description:
            'Which edge the rail sits against, deciding the border and the arrow direction.',
        },
      ],
    },
    {
      title: 'LayoutHeader / LayoutContent / LayoutFooter',
      props: [
        {
          name: 'LayoutHeader',
          type: "ComponentProps<'header'>",
          description: 'The 50px sticky top bar, justify-between by default.',
        },
        {
          name: 'LayoutContent',
          type: "ComponentProps<'main'>",
          description: 'The body, with a 24px gutter.',
        },
        {
          name: 'LayoutFooter',
          type: "ComponentProps<'footer'>",
          description:
            'The footer. Put inside a LayoutSider it becomes a centred brand line and hides when the rail collapses.',
        },
      ],
    },
  ],
};

/**
 * The full page frame
 *
 * The sider holds 220/66px, the header 50px and the content a 24px gutter —
 * the same measurements `Sidebar` uses, so two pages side by side never differ
 * by a pixel.
 */
export const Shell = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="h-80 w-full overflow-hidden rounded-lg border">
      <LayoutSider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div
          className={`flex items-center gap-x-3 px-4 pt-4 pb-2 ${
            collapsed ? 'justify-center px-0' : ''
          }`}
        >
          <div className="size-6 shrink-0 rounded-md bg-primary" />
          {!collapsed && <span className="truncate text-base">Luma</span>}
        </div>

        <nav className="grid gap-1 p-2 text-sm">
          {MENU.map((item, index) => (
            <span
              key={item.label}
              className={`flex h-10 cursor-pointer items-center gap-2 rounded-xl font-[450] ${
                collapsed ? 'justify-center' : 'px-3'
              } ${
                index === 0
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'hover:bg-accent'
              }`}
            >
              {item.icon}
              {!collapsed && item.label}
            </span>
          ))}
        </nav>

        <LayoutFooter className="text-xs">Luma © 0.0.0</LayoutFooter>
      </LayoutSider>

      <Layout>
        <LayoutHeader>
          <span className="text-sm text-muted-foreground">Overview</span>
          <div className="flex items-center gap-x-2">
            <Button variant="ghost" size="icon-sm" aria-label="Notifications">
              <BellIcon />
            </Button>
            <Avatar className="size-8">
              <AvatarFallback>LA</AvatarFallback>
            </Avatar>
          </div>
        </LayoutHeader>
        <LayoutContent className="text-sm text-muted-foreground">
          Page content.
        </LayoutContent>
      </Layout>
    </Layout>
  );
};

/**
 * Header and content only
 *
 * With no sider, `Layout` stacks vertically and `hasSider` is unnecessary.
 */
export const HeaderContent = () => (
  <Layout className="h-64 w-full overflow-hidden rounded-lg border">
    <LayoutHeader>
      <span className="font-medium">Reports</span>
      <Button size="sm">Export to Excel</Button>
    </LayoutHeader>
    <LayoutContent className="text-sm text-muted-foreground">
      The body scrolls independently of the header.
    </LayoutContent>
    <LayoutFooter>Luma © 2026</LayoutFooter>
  </Layout>
);

/**
 * A sider on the right
 *
 * `side="right"` moves the edge, and the border and arrow direction follow.
 * It suits the properties panel of a detail page.
 */
export const RightSider = () => (
  <Layout className="h-64 w-full overflow-hidden rounded-lg border">
    <Layout>
      <LayoutHeader>
        <span className="text-sm text-muted-foreground">Order details</span>
      </LayoutHeader>
      <LayoutContent className="text-sm text-muted-foreground">
        The main content.
      </LayoutContent>
    </Layout>

    <LayoutSider side="right" width={200} collapsible triggerVariant="bar">
      <div className="grid gap-2 p-4 text-sm">
        <p className="font-medium">Properties</p>
        <p className="text-muted-foreground">Status: Processing</p>
        <p className="text-muted-foreground">Created by: Dana Whitfield</p>
      </div>
    </LayoutSider>
  </Layout>
);
