# Layout

Page frame: header, collapsible sider, content and footer.

```tsx
import { LAYOUT_SIDER_COLLAPSED_WIDTH, LAYOUT_SIDER_WIDTH, Layout, LayoutContent, LayoutFooter, LayoutHeader, LayoutSider } from '@antkit/react';
```

The page shell — header, sider, content, footer — dressed like the app
itself: a 220px rail that collapses to a 66px icon strip, a 50px header, a
24px content gutter.

```tsx
<Layout className="h-dvh">
  <LayoutSider collapsible>
    <div className="px-4 pt-4 pb-2 font-medium">Luma</div>
    <nav className="grid gap-1 p-2">…</nav>
    <LayoutFooter>Luma © 0.0.0</LayoutFooter>
  </LayoutSider>
  <Layout>
    <LayoutHeader>…</LayoutHeader>
    <LayoutContent>…</LayoutContent>
  </Layout>
</Layout>
```

`Sidebar` is the full navigation rail with its own provider, mobile drawer
and menu parts — that is what the real shell is built on. `Layout` is the
plain frame for a screen that only needs regions.

## Props

- `hasSider`

Source: `@antkit/react/src/components/layout/layout.tsx`
