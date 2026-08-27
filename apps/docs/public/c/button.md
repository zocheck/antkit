# Button

Six variants, five sizes, a loading state and an icon slot at each end.

```tsx
import { Button } from '@antkit/react';
```

A button. `asChild` renders it as another element — a router link, say —
while keeping the styling and the focus ring.

`variant` is `'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' |
'link'`, `size` is `'xs' | 'sm' | 'md' | 'lg' | 'xl'` plus the square
`'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg'`, and `radius` is `'none' | 'sm' |
'md' | 'lg' | 'xl' | 'full'`.

```tsx
<Button variant="outline" loading={saving} prefix={<SaveIcon />}>
  Save
</Button>

<Button asChild variant="link">
  <a href="/pricing">See pricing</a>
</Button>
```

Reach for `DropdownMenu` when the click opens a list of actions rather than
performing one, and `Popconfirm` when it needs confirming first.

`loading` implies `disabled` and takes over the `prefix` slot for the
spinner, so `suffix` is hidden while it is on. An icon-only button still
needs an accessible name — give it `aria-label`.

## Props

- `asChild`
- `prefix`
- `suffix`
- `loading`
- `loadingLabel`
- `wave`

Source: `@antkit/react/src/components/button/button.tsx`
