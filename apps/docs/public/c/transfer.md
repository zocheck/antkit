# Transfer

Two columns to move items between — permissions, tags, members.

```tsx
import { Transfer } from '@antkit/react';
```

A transfer: two panels and a pair of arrows, for splitting a
set into "not chosen" and "chosen".

```tsx
<Transfer
  showSearch
  dataSource={allPermissions}
  targetKeys={granted}
  onChange={setGranted}
  titles={['Available', 'Granted']}
/>
```

Worth the space over a multi-`Select` when the user needs to *see* both sides
at once — assigning permissions, picking which columns a report includes.
For a short list, a `CheckboxGroup` is lighter.

`targetKeys`/`onChange` match the `value`/`onChange` contract, so a
`Form.Item` can drive it with `valuePropName="targetKeys"`.

## Props

- `dataSource`
- `targetKeys`
- `onChange`
- `onBlur`
- `titles`
- `showSearch`
- `render`
- `listHeight`
- `disabled`
- `id`
- `className`

Source: `@antkit/react/src/components/transfer/transfer.tsx`
