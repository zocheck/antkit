# Status

A status dot with a label and an optional pulse.

```tsx
import { Status, StatusIndicator, StatusLabel } from '@antkit/react';
```

A dot plus a label, for service or record state.

```tsx
<Status tone="online" pulse>Running</Status>
<Status color="#17a2b8">In progress</Status>
```

Compose `StatusIndicator` / `StatusLabel` directly when the dot and the text
need to sit in different places.

## Props

- `tone`
- `color`
- `pulse`

Source: `@antkit/react/src/components/status/status.tsx`
