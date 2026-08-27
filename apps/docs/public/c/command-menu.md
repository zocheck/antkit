# CommandMenu

The ⌘K palette: a search box over a list of actions, opened from anywhere.

```tsx
import { Command, CommandDialog, CommandEmpty, CommandFooter, CommandGroup, CommandInput, CommandItem, CommandList, CommandMenu, CommandSeparator, CommandShortcut } from '@antkit/react';
```

The ⌘K palette: a search box over a list of actions, in a dialog that opens
from anywhere.

```tsx
<CommandMenu
  items={[
    { key: 'new', label: 'New student', icon: <PlusIcon />, shortcut: '⌘N' },
    {
      label: 'Go to',
      items: [{ key: 'courses', label: 'Courses', onSelect: goToCourses }],
    },
  ]}
  onSelect={(item) => run(item.key)}
/>
```

Uncontrolled and bound to ⌘K by default, so the snippet above is a working
palette. Pass `open` and `onOpenChange` to drive it from a button as well,
and `inline` to drop the dialog and mount the list in the page.

Rows that need more than a label and an icon are better built from the parts
— `Command`, `CommandInput`, `CommandItem` — which is what this composes.

Reach for `Select` when the result is a value in a form rather than an
action, and `DropdownMenu` when the list is short enough not to need search.

## Props

- `items`
- `open`
- `defaultOpen`
- `onOpenChange`
- `shortcut`
- `onSelect`
- `placeholder`
- `emptyText`
- `search`
- `onSearchChange`
- `filterOption`
- `loading`
- `footer`
- `inline`
- `title`
- `description`
- `className`

Source: `@antkit/react/src/components/command-menu/command-menu.tsx`
