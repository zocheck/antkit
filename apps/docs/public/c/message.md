# Message

A slim notice at the top of the screen, called imperatively.

```tsx
import { MessageProvider } from '@antkit/react';
```

A fixed status palette, in light and dark values.

Deliberately not the app's own tokens: `info` is its own blue rather than
`--primary`, so a run of pills reads as one system whatever the brand colour
happens to be. Restyle by overriding these on `MessageProvider`:

```tsx
<MessageProvider className="[--message-info:var(--primary)]" />
```


Source: `@antkit/react/src/components/message/message.tsx`
