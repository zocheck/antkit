# Sheet

A panel sliding in from an edge of the screen.

```tsx
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@antkit/react';
```

A panel that slides in from an edge of the screen. `side` on `SheetContent`
is `'top' | 'right' | 'bottom' | 'left'` and defaults to `'right'`.

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Edit profile</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Edit profile</SheetTitle>
      <SheetDescription>Changes save when you submit.</SheetDescription>
    </SheetHeader>
    {form}
  </SheetContent>
</Sheet>
```

`Modal` for a centred dialog and for the imperative `Modal.confirm`,
`Popover` for something small anchored to its trigger, `Drawer`-style
navigation belongs in `Sidebar`.

`SheetTitle` is required — Radix warns without one. Hide it with
`className="sr-only"` rather than dropping it. The close button in the
corner is `showCloseButton`, on by default, and its label is English:
translate it by passing your own close control instead.


Source: `@antkit/react/src/components/sheet/sheet.tsx`
