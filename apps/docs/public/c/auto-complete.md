# AutoComplete

A free-text field that suggests, but never forces, a value.

```tsx
import { AutoComplete } from '@antkit/react';
```

An autocomplete: a text field that suggests, but never forces,
a value.

```tsx
<AutoComplete
  options={recentSearches}
  value={query}
  onChange={setQuery}
  placeholder="Search students"
/>
```

The difference from `Select`: what the user types *is* the value. `Select`
with `mode="tags"` also accepts new entries, but it stores them as chips and
the field itself is not free text.

With a server-side list, set `filterOption={false}` and refetch on `onChange`
— otherwise the results get filtered a second time on the client.

## Props

- `options`
- `value`
- `onChange`
- `onSelect`
- `onBlur`
- `filterOption`
- `placeholder`
- `notFoundContent`
- `allowClear`
- `disabled`
- `loading`
- `id`
- `name`
- `className`
- `aria-invalid`
- `aria-describedby`

Source: `@antkit/react/src/components/auto-complete/auto-complete.tsx`
