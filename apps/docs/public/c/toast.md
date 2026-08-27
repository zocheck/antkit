# Toast

Sonner’s toast, already wired to the kit’s tokens and theme.

```tsx
import { Toaster } from '@antkit/react';
```

Sonner's toast host, wired to the kit's tokens and icon set. Render it once,
near the root of the app; `toast()` comes from `sonner` itself.

```tsx
import { toast } from 'sonner';

<Toaster position="bottom-right" />;

toast('Invoice deleted', {
  action: { label: 'Undo', onClick: () => restore(invoice) },
});
```

Use `message.success()` for a plain "it worked" pill — it needs no host in
the tree and no action. `Alert` when the notice belongs in the page rather
than over it, `Notification` for something the user has to dismiss.

A toast renders outside the React tree that called it, so it cannot read
context. Translate the text before you pass it in.


Source: `@antkit/react/src/components/sonner/sonner.tsx`
