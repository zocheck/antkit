# Checkbox

A three-state tick box, indeterminate included.

```tsx
import { Checkbox } from '@antkit/react';
```

A tri-state checkbox. `checked` takes `true`, `false`, or `'indeterminate'`.

```tsx
<Checkbox
  id="terms"
  checked={agreed}
  onCheckedChange={(next) => setAgreed(next === true)}
/>
<Label htmlFor="terms">I agree to the terms</Label>
```

`Switch` when the change commits immediately; a checkbox commits with the
form around it. `CheckboxGroup` when there is a list of them to manage as
one value.

`checked="indeterminate"` is the "some but not all" state — a select-all box
over a partly selected table. Unlike a native input, it is part of the props
rather than something you set imperatively on the DOM node. Note the handler
is `onCheckedChange`, and it can hand you that third value.


Source: `@antkit/react/src/components/checkbox/checkbox.tsx`
