# Rate

Star rating, with half stars and a character of your choosing.

```tsx
import { Rate } from '@antkit/react';
```

A star rating.

```tsx
<Rate value={score} onChange={setScore} allowHalf />
<Rate value={4} readOnly size="sm" />
```

It takes `value`/`onChange`/`onBlur` and the aria props, so it drops straight
into a `Form.Item` with no adapter.

The whole control is one radiogroup with arrow-key support rather than N
focusable stars — tabbing through five stars to set one number is tedious.

## Props

- `count`
- `value`
- `defaultValue`
- `onChange`
- `onBlur`
- `allowHalf`
- `allowClear`
- `disabled`
- `readOnly`
- `character`
- `size`
- `tooltips`
- `id`
- `name`
- `className`
- `aria-invalid`
- `aria-describedby`

Source: `@antkit/react/src/components/rate/rate.tsx`
