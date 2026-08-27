# InputNumber

A number field with steppers, currency formatting and min/max bounds.

```tsx
import { InputNumber } from '@antkit/react';
```

A number field with steppers, bounds and a unit.

```tsx
<InputNumber value={fee} onChange={setFee} min={0} step={50_000} addonAfter="₫" />
```

`onChange` fires with the raw typed number, out of range included, so the
field never fights someone typing `5` on the way to `50`. Rounding to
`precision` and clamping into `min`/`max` happen on blur and on Enter.

It takes `value`/`onChange`/`onBlur` and the aria props, which is exactly
what `Form.Item` injects — so it drops into a form with no adapter.

## Props

- `value`
- `defaultValue`
- `onChange`
- `min`
- `max`
- `step`
- `precision`
- `size`
- `controls`
- `keyboard`
- `changeOnWheel`
- `formatter`
- `parser`
- `prefix`
- `suffix`
- `addonBefore`
- `addonAfter`
- `onPressEnter`
- `invalid`
- `stepUpLabel`
- `stepDownLabel`
- `className`
- `inputClassName`

Source: `@antkit/react/src/components/input-number/input-number.tsx`
