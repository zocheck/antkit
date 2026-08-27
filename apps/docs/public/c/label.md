# Label

A label bound to a control — clicking it focuses the control.

```tsx
import { Label } from '@antkit/react';
```

A caption bound to a form control. Clicking it moves focus to the control,
and it dims itself when that control is disabled.

```tsx
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />
```

`Form.Item` renders its own label from the `label` prop, so inside a form
you rarely reach for this directly.

The dimming keys off a `peer-disabled` sibling or a `group-data-[disabled]`
ancestor — a control that is disabled without either marker leaves the label
looking active.


Source: `@antkit/react/src/components/label/label.tsx`
