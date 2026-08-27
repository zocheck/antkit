# Cascader

Drill through a fixed-depth hierarchy one column at a time.

```tsx
import { Cascader } from '@antkit/react';
```

A cascader: drill through a fixed-depth hierarchy one column
at a time — country / region / city, or any fixed set of levels.

```tsx
<Cascader
  options={regions}
  value={area}
  onChange={setArea}
  placeholder="Choose an area"
  allowClear
/>
```

By default only a leaf commits a value, so a half-finished path leaves the
field alone. `changeOnSelect` commits at every level instead, which is what
you want when a whole branch is a legitimate answer.

It takes `value`/`onChange`/`onBlur` and the aria props, so it drops straight
into a `Form.Item`. For an arbitrary-depth hierarchy, use `TreeSelect`.

## Props

- `options`
- `value`
- `onChange`
- `onBlur`
- `changeOnSelect`
- `expandTrigger`
- `displayRender`
- `placeholder`
- `allowClear`
- `disabled`
- `id`
- `name`
- `className`
- `aria-invalid`
- `aria-describedby`

Source: `@antkit/react/src/components/cascader/cascader.tsx`
