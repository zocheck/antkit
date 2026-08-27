# Switch

An instant on/off, with a loading state for when it calls an API.

```tsx
import { Switch } from '@antkit/react';
```

An on/off toggle that commits immediately. Use `Checkbox` when the value is
only saved once the surrounding form is submitted.

```tsx
<Switch checked={active} onCheckedChange={setActive} />
<Switch defaultChecked checkedChildren="On" uncheckedChildren="Off" />
```

## Props

- `size`
- `loading`
- `checkedChildren`
- `uncheckedChildren`

Source: `@antkit/react/src/components/switch/switch.tsx`
