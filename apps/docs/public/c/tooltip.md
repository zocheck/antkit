# Tooltip

A short hint on hover, in twelve placements.

```tsx
import { PLACEMENT, Tooltip, TooltipContent, TooltipProvider, TooltipRoot, TooltipTrigger } from '@antkit/react';
```

A tooltip: one wrapper, a `title`, and a `placement`.

```tsx
<Tooltip title="Delete record" placement="topRight">
  <Button variant="ghost" size="icon"><Trash2Icon /></Button>
</Tooltip>
```

The child has to forward a ref and its props — every control in this kit
does. Needs a `TooltipProvider` above it, which `Sidebar` and `Gantt` already
mount for their own subtrees; add one near the app root otherwise.

## Props

- `title`
- `placement`
- `children`
- `open`
- `defaultOpen`
- `onOpenChange`
- `mouseEnterDelay`
- `className`

Source: `@antkit/react/src/components/tooltip/tooltip.tsx`
