# Badge

A small status label in eight prebuilt tones.

```tsx
import { Badge } from '@antkit/react';
```

A small status pill. `variant` is `'default' | 'secondary' | 'destructive' |
'outline' | 'success' | 'warning' | 'info' | 'muted'`.

```tsx
<Badge variant="success">Paid</Badge>
<Badge variant="outline" asChild>
  <a href="/tags/react">react</a>
</Badge>
```

`Tag` when the user can remove it, `CountBadge` for a number pinned to the
corner of something else, `Status` for a dot-and-label state.

## Props

- `asChild`

Source: `@antkit/react/src/components/badge/badge.tsx`
