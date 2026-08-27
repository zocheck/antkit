# Tag

A coloured chip — closable, or toggled like a checkbox.

```tsx
import { CheckableTag, Tag } from '@antkit/react';
```

A tag: a small label for a record's state, a filter chip, or
a keyword.

```tsx
<Tag color="success">Active</Tag>
<Tag color="#7c3aed" icon={<StarIcon />}>VIP</Tag>
<Tag closable onClose={() => removeFilter('ielts')}>IELTS 6.5+</Tag>
```

`Badge` covers the same visual ground with fixed shadcn variants; reach for
`Tag` when you need `closable`, a colour from the database, or an icon.

Closing is handled internally — the tag removes itself and calls back. To
drive it yourself, leave `closable` off and unmount the tag.

## Props

- `children`
- `color`
- `icon`
- `closable`
- `closeIcon`
- `onClose`
- `bordered`
- `onClick`
- `className`
- `style`

Source: `@antkit/react/src/components/tag/tag.tsx`
