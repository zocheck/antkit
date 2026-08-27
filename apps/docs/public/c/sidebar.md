# Sidebar

The navigation rail: menu groups, submenus, and an icon-only collapsed mode.

```tsx
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInput, SidebarInset, SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger } from '@antkit/react';
```

The navigation rail. Twenty-three parts, so here is the whole surface and
the shape they go in — the doc block on `Sidebar` itself is further down.

`SidebarProvider` `Sidebar` `SidebarTrigger` `SidebarRail` `SidebarInset`
`SidebarInput` `SidebarHeader` `SidebarFooter` `SidebarContent`
`SidebarGroup` `SidebarGroupLabel` `SidebarGroupAction`
`SidebarGroupContent` `SidebarMenu` `SidebarMenuItem` `SidebarMenuButton`
`SidebarMenuAction` `SidebarMenuBadge` `SidebarMenuSkeleton`
`SidebarMenuSub` `SidebarMenuSubItem` `SidebarMenuSubButton`
`SidebarSeparator` `useSidebar` `sidebarMenuButton`

```tsx
<SidebarProvider>
  <Sidebar collapsible="icon">
    <SidebarHeader>{brand}</SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Workspace</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive tooltip="Inbox" asChild>
                <a href="/inbox">
                  <InboxIcon />
                  <span>Inbox</span>
                </a>
              </SidebarMenuButton>
              <SidebarMenuBadge>12</SidebarMenuBadge>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>{account}</SidebarFooter>
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />
    {page}
  </SidebarInset>
</SidebarProvider>
```

`Layout` is the simpler frame — header, sider, content, footer — when the
navigation is a plain list and none of this is needed.


Source: `@antkit/react/src/components/sidebar/sidebar.tsx`
