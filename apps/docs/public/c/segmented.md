# Segmented

A row of buttons picking one value — tighter than Radio.

```tsx
import { Segmented } from '@antkit/react';
```

A one-of-N control that shows every choice at once. Pick this over `Select`
when there are two to four options and over `Tabs` when it filters content
rather than switching panels.

```tsx
<Segmented
  options={['Day', 'Week', 'Month']}
  value={range}
  onChange={(value) => setRange(value as string)}
/>
```

## Props

- `options`
- `value`
- `defaultValue`
- `onChange`
- `size`
- `block`
- `disabled`

Source: `@antkit/react/src/components/segmented/segmented.tsx`
