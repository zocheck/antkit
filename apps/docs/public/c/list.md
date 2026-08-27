# List

Grouped rows, dragged vertically between groups.

```tsx
import { ListGroup, ListHeader, ListItem, ListItems, ListProvider } from '@antkit/react';
```

A grouped list whose items drag between groups — the "board as rows" view
that sits next to a Kanban.

```tsx
<ListProvider onDragEnd={handleDragEnd}>
  {groups.map((group) => (
    <ListGroup key={group.id} id={group.id}>
      <ListHeader name={group.name} color={group.color} />
      <ListItems>
        {items.filter((i) => i.group === group.id).map((item, index) => (
          <ListItem key={item.id} id={item.id} name={item.name} index={index} parent={group.id} />
        ))}
      </ListItems>
    </ListGroup>
  ))}
</ListProvider>
```

`onDragEnd` gives you `active.data.current.parent` and `over.id`, which is
everything needed to move an item — the component never owns the data.


Source: `@antkit/react/src/components/list/list.tsx`
