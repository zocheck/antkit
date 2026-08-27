# Dropdown Menu

A menu off a button: plain items, checkboxes, radios, groups and submenus.

```tsx
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@antkit/react';
```

A menu hanging off a button: plain items, checkboxes, radios, groups and
submenus. The content portals, so an ancestor's `overflow: hidden` cannot
clip it.

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon" aria-label="Row actions">
      <EllipsisIcon />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuItem onSelect={() => edit(row)}>Edit</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive" onSelect={() => remove(row)}>
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

`Select` when the choice is a form value, `Popover` when the panel holds
anything other than a list of commands, `Popconfirm` for a destructive item
that needs confirming.

Items fire `onSelect`, not `onClick`, and the menu closes itself afterwards.
That includes checkbox and radio items, which is rarely what you want for a
column-visibility menu — call `event.preventDefault()` in the handler to
keep it open.


Source: `@antkit/react/src/components/dropdown-menu/dropdown-menu.tsx`
