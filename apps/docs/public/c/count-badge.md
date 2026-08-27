# CountBadge

A dot or count pinned to the corner of something else.

```tsx
import { CountBadge } from '@antkit/react';
```

The small count or dot that rides on the corner of something else.

```tsx
<CountBadge count={unread}>
  <Button variant="ghost" size="icon"><BellIcon /></Button>
</CountBadge>

<CountBadge dot color="#22c55e">
  <Avatar>…</Avatar>
</CountBadge>

// Standalone, with nothing to ride on, it just sits inline:
<CountBadge count={12} />
```

Not to be confused with this kit's `Badge`, which is a text chip — see `Tag`
for the removable version of that.

## Props

- `children`
- `count`
- `overflowCount`
- `dot`
- `showZero`
- `color`
- `offset`
- `size`
- `title`
- `className`
- `style`

Source: `@antkit/react/src/components/count-badge/count-badge.tsx`
