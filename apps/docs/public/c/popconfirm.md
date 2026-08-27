# Popconfirm

A confirmation asked right next to the button just pressed.

```tsx
import { Popconfirm } from '@antkit/react';
```

A confirmation bubble: the light-touch alternative to a
modal, anchored to the control that triggered it.

```tsx
<Popconfirm
  title="Delete this student?"
  description="This cannot be undone."
  okVariant="destructive"
  onConfirm={() => remove.mutateAsync(id)}
>
  <Button variant="ghost" size="icon"><Trash2Icon /></Button>
</Popconfirm>
```

Use it for a single reversible-ish row action. When the consequence needs
real explanation, or the user must read something before agreeing, use
`Modal.confirm` from `useModal` instead.

An async `onConfirm` keeps the bubble open and the buttons busy until it
resolves, so a failed request can leave the bubble up rather than closing
over an error the user never sees.

## Props

- `title`
- `description`
- `children`
- `onConfirm`
- `onCancel`
- `okText`
- `cancelText`
- `okVariant`
- `icon`
- `placement`
- `disabled`
- `open`
- `onOpenChange`
- `className`

Source: `@antkit/react/src/components/popconfirm/popconfirm.tsx`
