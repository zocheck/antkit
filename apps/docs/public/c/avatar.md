# Avatar

A profile image with initials to fall back on.

```tsx
import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from '@antkit/react';
```

Someone's picture, falling back to initials while the image loads or when
there is none. `size` is `'sm' | 'default' | 'lg'`, read off the root by
every part, so setting it once also sizes the badge and the group count.

```tsx
<Avatar size="lg">
  <AvatarImage src={user.avatarUrl} alt="" />
  <AvatarFallback>{initials(user.name)}</AvatarFallback>
  <AvatarBadge />
</Avatar>
```

`AvatarGroup` overlaps several of them and takes an `AvatarGroupCount` for
the "+3" at the end. Use `Image` for pictures that are content rather than
identity.

`AvatarFallback` covers a missing image, not a missing `alt`. Give
`AvatarImage` an empty `alt` when the name is already beside it, or a screen
reader announces the name twice.


Source: `@antkit/react/src/components/avatar/avatar.tsx`
