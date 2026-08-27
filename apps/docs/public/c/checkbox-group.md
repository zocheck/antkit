# CheckboxGroup

Several options sharing one array of values.

```tsx
import { CheckboxGroup, CheckboxGroupItem, CheckboxOption } from '@antkit/react';
```

Several independent checkboxes sharing one array of values.

Radix has no checkbox-group primitive — a checkbox group is not a roving
focus widget, each box is tabbable on its own — so this is a thin controlled
wrapper over `Checkbox` rather than a primitive re-export.

```tsx
<CheckboxGroup defaultValue={['email']} onValueChange={setChannels}>
  <CheckboxOption value="email">Email</CheckboxOption>
  <CheckboxOption value="sms" description="Charged per message">SMS</CheckboxOption>
</CheckboxGroup>
```

## Props

- `value`
- `defaultValue`
- `onValueChange`
- `name`
- `disabled`
- `orientation`

Source: `@antkit/react/src/components/checkbox-group/checkbox-group.tsx`
