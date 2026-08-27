# Kanban

Columns of cards, dragged within and between columns.

```tsx
import { KanbanBoard, KanbanCard, KanbanCards, KanbanHeader, KanbanProvider } from '@antkit/react';
```

Kanban board with cards that drag within and between columns.

```tsx
<KanbanProvider columns={columns} data={items} onDataChange={setItems}>
  {(column) => (
    <KanbanBoard key={column.id} id={column.id}>
      <KanbanHeader>{column.name}</KanbanHeader>
      <KanbanCards id={column.id}>
        {(item) => <KanbanCard key={item.id} {...item} />}
      </KanbanCards>
    </KanbanBoard>
  )}
</KanbanProvider>
```


Source: `@antkit/react/src/components/kanban/kanban.tsx`
