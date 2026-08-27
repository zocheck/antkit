# Empty

The empty state for tables, lists and searches.

```tsx
import { Empty } from '@antkit/react';
```

The blank state for a list, a table or a search that came back with nothing.

```tsx
<Empty description="No students yet">
  <Button>Add a student</Button>
</Empty>
```

`Table`, `Select`, `TreeSelect`, `AutoComplete`, `Transfer` and `CommandMenu`
all fall back to this when they have nothing to show, so a product only has
to decide what a blank state looks like once. Each of them still takes its
own override — `empty`, `notFoundContent` — for the cases that deserve
different words or a different call to action.

Use `Result` when the whole page is the outcome — a 404, a finished flow.

## Props

- `image`
- `title`
- `description`
- `size`
- `children`

Source: `@antkit/react/src/components/empty/empty.tsx`
