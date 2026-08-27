# Collapsible

Open and close a block of content.

```tsx
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@antkit/react';
```

A section that opens and closes in place. Uncontrolled by default; pass
`open` and `onOpenChange` to drive it yourself.

```tsx
<Collapsible>
  <CollapsibleTrigger>Advanced settings</CollapsibleTrigger>
  <CollapsibleContent>Whatever is worth hiding by default.</CollapsibleContent>
</Collapsible>
```

Use `Tabs` for several panels where one is always showing, and `Sheet` or
`Modal` when the content should sit above the page rather than push it down.

The trigger renders a `<button>`; give it `asChild` to supply your own.


Source: `@antkit/react/src/components/collapsible/collapsible.tsx`
