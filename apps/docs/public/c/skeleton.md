# Skeleton

Pulsing grey blocks holding the layout while data loads.

```tsx
import { Skeleton } from '@antkit/react';
```

A pulsing placeholder in the shape of the content that is loading. It has no
size of its own — `className` gives it one.

```tsx
<div className="space-y-2">
  <Skeleton className="h-4 w-48" />
  <Skeleton className="h-4 w-32" />
</div>
```

Use `Spinner` when the shape of what is coming is not known yet, and
`Progress` when you can say how far along it is.


Source: `@antkit/react/src/components/skeleton/skeleton.tsx`
