# Notification

A card in the corner of the screen with a title, body and actions.

```tsx
import { NotificationProvider } from '@antkit/react';
```

A fixed status palette rather than the app's own tokens, so a
`notification` and a `message` read as the same family. Override on the
provider:

```tsx
<NotificationProvider className="[--notification-info:var(--primary)]" />
```


Source: `@antkit/react/src/components/notification/notification.tsx`
