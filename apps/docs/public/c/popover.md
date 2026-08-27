# Popover

A card anchored to an element, controls included.

```tsx
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '@antkit/react';
```

A floating panel anchored to a trigger. `PopoverContent` renders through a
portal, so `overflow: hidden` on an ancestor cannot clip it.

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Filters</Button>
  </PopoverTrigger>
  <PopoverContent className="p-4">{filters}</PopoverContent>
</Popover>
```

`Tooltip` for a label on hover, `DropdownMenu` for a list of actions,
`Popconfirm` for a yes/no on a destructive click.

The content has no padding: `Select` and `DatePicker` build on it and need
the edges bare. Add your own when you use it directly.


Source: `@antkit/react/src/components/popover/popover.tsx`
