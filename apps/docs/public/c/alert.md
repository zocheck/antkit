# Alert

An inline notice in four states — closable, with room for actions.

```tsx
import { Alert } from '@antkit/react';
```

An inline alert.

```tsx
<Alert
  type="warning"
  showIcon
  closable
  message="Contracts expiring soon"
  description="Three contracts expire this week."
  action={<Button size="sm" variant="ghost">Xem</Button>}
/>
```

Closing is handled internally — the alert removes itself and calls back. Drive
it yourself by leaving `closable` off and unmounting the component.

## Props

- `message`
- `description`
- `type`
- `showIcon`
- `icon`
- `closable`
- `onClose`
- `afterClose`
- `banner`
- `action`

Source: `@antkit/react/src/components/alert/alert.tsx`
