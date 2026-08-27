# Spinner

A spinner for buttons and for covering a block while it loads.

```tsx
import { Spinner } from '@antkit/react';
```

A spinning indicator. Sized and coloured with `className`, like any icon.

```tsx
<Spinner className="size-6 text-muted-foreground" />
```

`Button` has its own `loading` prop — never put a `Spinner` inside one.
Prefer `Skeleton` when the shape of the incoming content is already known.

It carries `role="status"` and an English `aria-label`; pass your own
`aria-label` to translate it.


Source: `@antkit/react/src/components/spinner/spinner.tsx`
