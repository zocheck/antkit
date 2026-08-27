# Input

A single-line field: every HTML type, error state, icons and buttons attached.

```tsx
import { Input } from '@antkit/react';
```

A single-line text field. Takes every `<input>` prop, so `type`,
`placeholder`, `readOnly` and the rest behave exactly as they do natively.

```tsx
<Input type="email" placeholder="you@example.com" />
```

Use `InputNumber` for numbers — a native `type="number"` accepts `e` and
`-`, and hands back a string. `Textarea` for more than one line,
`AutoComplete` when there are suggestions to offer.

It needs no adapter inside a `Form.Item`: the item injects `value`,
`onChange`, `onBlur` and the aria props onto it.


Source: `@antkit/react/src/components/input/input.tsx`
