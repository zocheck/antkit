# Modal

A dialog declared in JSX or called imperatively, turning into a sheet on narrow screens.

```tsx
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, Modal } from '@antkit/react';
```

A dialog controlled by `open`, with `onOk` / `onCancel` and a
footer built for you.

```tsx
<Modal
  open={open}
  title="Delete task"
  okVariant="destructive"
  confirmLoading={remove.isPending}
  onOk={() => remove.mutate(id)}
  onCancel={() => setOpen(false)}
>
  This cannot be undone.
</Modal>
```

`variant="alert"` is the forced choice — `role="alertdialog"`, no close
button, no dismissing by Escape or by the mask, and focus landing on cancel:

```tsx
<Modal
  variant="alert"
  open={open}
  title="Delete this project?"
  okText="Delete"
  okVariant="destructive"
  onOk={() => remove(id)}
  onCancel={() => setOpen(false)}
>
  Every board and every task inside it goes with it.
</Modal>
```

`Modal.useModal().confirm` when the confirmation is imperative — awaiting a
boolean inside a handler rather than rendering an `open`. `Popconfirm` when
the question is small enough to answer next to the button that asked it.

Under 768px it opens from the bottom edge as a sheet — same dialog, same
props, reshaped for a thumb. Turn that off per dialog with
`mobileSheet={false}`; `variant="alert"` turns it off for you, because a
sheet invites the swipe-down that would dismiss it.

For a dialog that doesn't fit this shape, compose `Dialog*` directly —
`DialogContent` takes `asSheet` for the same layout, and `useIsMobile()` is
what decides when to pass it.

## Props

- `open`
- `variant`
- `title`
- `description`
- `children`
- `onOk`
- `onCancel`
- `okText`
- `cancelText`
- `okVariant`
- `confirmLoading`
- `hideCancel`
- `footer`
- `width`
- `centered`
- `mobileSheet`
- `maskClosable`
- `className`

Source: `@antkit/react/src/components/modal/modal.tsx`
