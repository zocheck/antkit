# Select

One component covering every variant: single, multiple, tags, search, groups.

```tsx
import { Select } from '@antkit/react';
```

One select covering every variant other kits split across separate
components: single, `mode="multiple"`, `mode="tags"`, with or without
`showSearch`.

```tsx
<Select
  mode="multiple"
  allowClear
  placeholder={t('pickRoles')}
  options={[
    { label: 'Admin', value: 'admin' },
    { label: 'Editor', value: 'editor', disabled: true },
  ]}
  value={roles}
  onChange={setRoles}
/>
```

It takes `value`/`onChange`/`onBlur` and the aria props, which is exactly what
`Form.Item` injects — so it drops into a form with no adapter.

Filtering and the keyboard model come from cmdk; the list is a real listbox
with arrow keys, typeahead and Enter.

## Props

- `options`
- `value`
- `defaultValue`
- `onChange`
- `onBlur`
- `mode`
- `showSearch`
- `allowClear`
- `placeholder`
- `searchPlaceholder`
- `notFoundContent`
- `disabled`
- `loading`
- `maxTagCount`
- `id`
- `name`
- `className`
- `aria-invalid`
- `aria-describedby`

Source: `@antkit/react/src/components/select/select.tsx`
