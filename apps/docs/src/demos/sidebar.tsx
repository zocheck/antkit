import { useState } from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '@antkit/react';
import {
  ChartBarIcon,
  HomeIcon,
  MailIcon,
  SettingsIcon,
  UsersIcon,
} from 'lucide-react';

import type { DemoMeta } from '../lib/types';

/**
 * Sidebar pins itself with `fixed inset-y-0 h-svh` to fill the window. Inside
 * a demo frame it switches to `absolute h-full` with a `relative` parent — one
 * className, because cn merges the conflict for you.
 */
const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="relative h-96 w-full overflow-hidden rounded-lg border">
    {children}
  </div>
);

export const meta: DemoMeta = {
  imports: [
    'SidebarProvider',
    'Sidebar',
    'SidebarHeader',
    'SidebarContent',
    'SidebarFooter',
    'SidebarGroup',
    'SidebarGroupLabel',
    'SidebarMenu',
    'SidebarMenuItem',
    'SidebarMenuButton',
    'SidebarMenuBadge',
    'SidebarMenuSub',
    'SidebarMenuSubItem',
    'SidebarMenuSubButton',
    'SidebarInset',
    'SidebarTrigger',
    'SidebarSeparator',
    'useSidebar',
  ],
  api: [
    {
      title: 'SidebarProvider',
      description:
        'Wraps both the rail and the content. It binds Cmd/Ctrl + B and stores the state in a cookie.',
      props: [
        {
          name: 'defaultOpen',
          type: 'boolean',
          default: 'true',
          description: 'The starting state when uncontrolled.',
        },
        {
          name: 'open',
          type: 'boolean',
          description: 'The controlled state.',
        },
        {
          name: 'onOpenChange',
          type: '(open: boolean) => void',
          description: 'Called when the rail opens or closes.',
        },
      ],
    },
    {
      title: 'Sidebar',
      props: [
        {
          name: 'side',
          type: "'left' | 'right'",
          default: "'left'",
          description: 'Which edge the rail sits against.',
        },
        {
          name: 'variant',
          type: "'sidebar' | 'floating' | 'inset'",
          default: "'sidebar'",
          description:
            'sidebar is a rail flush to the edge; floating is a bordered card standing off it; inset turns the content into a rounded card.',
        },
        {
          name: 'collapsible',
          type: "'offcanvas' | 'icon' | 'none'",
          default: "'offcanvas'",
          description:
            'offcanvas slides right out; icon shrinks to a 3rem strip of icons; none never collapses.',
        },
      ],
    },
    {
      title: 'SidebarMenuButton',
      props: [
        {
          name: 'isActive',
          type: 'boolean',
          default: 'false',
          description: 'Marks the current item.',
        },
        {
          name: 'tooltip',
          type: 'string | TooltipContentProps',
          description:
            'The hint shown once the rail has shrunk to icons. Without it, the item collapses into an unnamed glyph.',
        },
        {
          name: 'variant',
          type: "'default' | 'outline'",
          default: "'default'",
          description: 'The background style of the menu item.',
        },
        {
          name: 'size',
          type: "'default' | 'sm' | 'lg'",
          default: "'default'",
          description: 'Item height: 32, 28 or 48px.',
        },
        {
          name: 'asChild',
          type: 'boolean',
          default: 'false',
          description: 'Renders your router link instead of a <button>.',
        },
      ],
    },
    {
      title: 'useSidebar()',
      description:
        'Reads and drives the rail from anywhere inside the provider.',
      props: [
        {
          name: 'state',
          type: "'expanded' | 'collapsed'",
          description: 'The current desktop state.',
        },
        {
          name: 'open',
          type: 'boolean',
          description: 'The desktop rail is open.',
        },
        {
          name: 'setOpen',
          type: '(open: boolean) => void',
          description: 'Sets the desktop state.',
        },
        {
          name: 'openMobile',
          type: 'boolean',
          description: 'The mobile drawer is open.',
        },
        {
          name: 'setOpenMobile',
          type: '(open: boolean) => void',
          description: 'Sets the mobile drawer state.',
        },
        {
          name: 'isMobile',
          type: 'boolean',
          description: 'Currently under the 768px breakpoint.',
        },
        {
          name: 'toggleSidebar',
          type: '() => void',
          description: 'Flips the state, picking desktop or mobile for you.',
        },
      ],
    },
  ],
};

/**
 * A basic rail
 *
 * `collapsible="icon"` shrinks the rail to a 3rem strip of icons. Press
 * `SidebarTrigger`, or Cmd/Ctrl + B, to collapse it.
 */
export const Basic = () => (
  <Frame>
    <SidebarProvider className="min-h-full">
      <Sidebar collapsible="icon" className="absolute h-full">
        <SidebarHeader className="px-3 py-3 font-medium">Luma</SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>General</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive tooltip="Overview">
                  <HomeIcon />
                  <span>Overview</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Students">
                  <UsersIcon />
                  <span>Students</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Campaigns">
                  <MailIcon />
                  <span>Campaigns</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>12</SidebarMenuBadge>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-12 items-center gap-2 border-b px-3">
          <SidebarTrigger />
          <span className="text-sm text-muted-foreground">Overview</span>
        </header>
        <div className="p-4 text-sm text-muted-foreground">Page content.</div>
      </SidebarInset>
    </SidebarProvider>
  </Frame>
);

/**
 * Submenus
 *
 * `SidebarMenuSub` is the indented child branch. Opening and closing is yours
 * to hold in state — every app reads its routes differently.
 */
export const Submenu = () => {
  const [open, setOpen] = useState(true);

  return (
    <Frame>
      <SidebarProvider className="min-h-full">
        <Sidebar className="absolute h-full">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Academics</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setOpen(!open)}>
                    <ChartBarIcon />
                    <span>Reports</span>
                  </SidebarMenuButton>
                  {open && (
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton isActive>
                          Revenue
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Attendance</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Receivables</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarSeparator />

            <SidebarGroup>
              <SidebarGroupLabel>System</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <SettingsIcon />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="px-3 py-3 text-xs text-muted-foreground">
            Luma © 0.0.0
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <div className="p-4 text-sm text-muted-foreground">
            The submenu survives a page change, because the state lives in the
            app rather than in the component.
          </div>
        </SidebarInset>
      </SidebarProvider>
    </Frame>
  );
};

/**
 * variant="floating"
 *
 * The rail becomes a bordered, rounded card standing off the edge of the
 * screen.
 */
export const Floating = () => (
  <Frame>
    <SidebarProvider className="min-h-full">
      <Sidebar
        variant="floating"
        collapsible="icon"
        className="absolute h-full"
      >
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive tooltip="Overview">
                  <HomeIcon />
                  <span>Overview</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Students">
                  <UsersIcon />
                  <span>Students</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset className="m-2 rounded-xl border">
        <header className="flex h-12 items-center gap-2 border-b px-3">
          <SidebarTrigger />
          <span className="text-sm text-muted-foreground">Overview</span>
        </header>
      </SidebarInset>
    </SidebarProvider>
  </Frame>
);
