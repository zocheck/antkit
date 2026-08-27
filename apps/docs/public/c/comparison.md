# Comparison

Drag a handle to compare a before and after image.

```tsx
import { Comparison, ComparisonHandle, ComparisonItem } from '@antkit/react';
```

Two layers stacked on top of each other, split by a divider the reader moves.

```tsx
<Comparison className="aspect-video rounded-lg border">
  <ComparisonItem position="left">
    <img src={before} alt="Before" />
  </ComparisonItem>
  <ComparisonItem position="right">
    <img src={after} alt="Sau" />
  </ComparisonItem>
  <ComparisonHandle />
</Comparison>
```

`position="left"` is the layer shown on the left of the divider — the split
is a single number, so the two items just clip it from opposite sides.

Pointer events cover mouse, touch and pen in one path, and the container is a
real `slider`: focus it and the arrow keys, Home and End move the divider.

## Props

- `mode`
- `defaultPosition`
- `position`
- `onPositionChange`
- `step`
- `onDragStart`
- `onDragEnd`

Source: `@antkit/react/src/components/comparison/comparison.tsx`
