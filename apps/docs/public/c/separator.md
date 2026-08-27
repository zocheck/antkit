# Separator

A horizontal or vertical rule between blocks of content.

```tsx
import { Separator } from '@antkit/react';
```

A rule between blocks of content, horizontal or vertical.

```tsx
<Separator className="my-4" />
<Separator orientation="vertical" className="h-4" />
```

A `Card` already separates itself from what is around it, and a heading
usually divides a page better than a line does.

`decorative` defaults to on, which keeps the rule out of the accessibility
tree. Turn it off only when the line is the sole thing marking the change of
section. A vertical separator has no height of its own — give it one, or put
it in a flex row with stretched items.


Source: `@antkit/react/src/components/separator/separator.tsx`
