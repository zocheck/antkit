# ScrollShadow

A scroll container that fades whichever edge still has content past it.

```tsx
import { ScrollShadow } from '@antkit/react';
```

A scroll container that fades its content at whichever edge has more to
show, so an overflowing list looks cut off rather than finished.

```tsx
<ScrollShadow className="h-72">
  {notifications.map((item) => (
    <Notice key={item.id} {...item} />
  ))}
</ScrollShadow>

<ScrollShadow orientation="horizontal" hideScrollBar className="w-full">
  <div className="flex gap-2">{tabs}</div>
</ScrollShadow>
```

`Marquee` when the content should move on its own, `Table` when the rows
need sticky headers and a horizontal scroll of their own.

It needs a bounded size to have anything to overflow — `h-72`, a flex
child with `min-h-0`, a grid track. Without one it grows to fit its content
and no fade ever appears.

## Props

- `orientation`
- `size`
- `offset`
- `hideScrollBar`
- `enabled`
- `visibility`
- `onVisibilityChange`

Source: `@antkit/react/src/components/scroll-shadow/scroll-shadow.tsx`
