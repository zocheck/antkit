# Typography

Headings, paragraphs and inline text on the @antkit/styles type scale.

```tsx
import { Paragraph, Text, Title, Typography } from '@antkit/react';
```

Inline text with modifiers.

```tsx
<Text type="secondary">Updated 5 minutes ago</Text>
<Text copyable>HV-2026-0042</Text>
<Text ellipsis>{row.note}</Text>
```

`ellipsis` and `copyable` are the two that earn their keep in a table cell —
a long note that must not break the row height, and an id worth copying.


Source: `@antkit/react/src/components/typography/typography.tsx`
