# Descriptions

Label–value pairs for a detail page.

```tsx
import { Descriptions } from '@antkit/react';
```

A read-only detail panel — the "view" half of a form.

```tsx
<Descriptions
  title="Student"
  bordered
  column={2}
  items={[
    { label: 'Full name', children: 'Nguyen Thi Anh Nguyet' },
    { label: 'Course', children: 'IELTS 6.5+' },
    { label: 'Notes', children: 'Prefers evening calls', span: 2 },
  ]}
/>
```

## Props

- `items`
- `title`
- `extra`
- `column`
- `bordered`
- `layout`
- `size`

Source: `@antkit/react/src/components/descriptions/descriptions.tsx`
