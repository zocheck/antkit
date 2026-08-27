import { useState } from 'react';

import {
  ListGroup,
  ListHeader,
  ListItem,
  ListItems,
  ListProvider,
} from '@antkit/react';

import type { DemoMeta } from '../lib/types';

const GROUPS = [
  { id: 'high', name: 'High priority', color: '#e20d2c' },
  { id: 'normal', name: 'Normal', color: '#6b7280' },
];

const ITEMS = [
  { id: 'l1', name: 'Prepare the invoicing paperwork', group: 'high' },
  { id: 'l2', name: 'Call Nathan Hoang back', group: 'high' },
  { id: 'l3', name: 'Update the term start dates', group: 'normal' },
  { id: 'l4', name: 'Reconcile August receivables', group: 'normal' },
];

export const meta: DemoMeta = {
  imports: ['ListProvider', 'ListGroup', 'ListHeader', 'ListItems', 'ListItem'],
  api: [
    {
      title: 'ListProvider',
      description:
        'Grouped rows that drag vertically between groups. Use `Kanban` when you need columns; a plain `<ul>` is enough when nothing drags.',
      props: [
        {
          name: 'onDragEnd',
          type: '(event: DragEndEvent) => void',
          description:
            'The dnd-kit event. `event.active.id` is the item just dropped and `event.over?.id` is the group receiving it. Required — the component never changes your data itself.',
        },
        {
          name: 'children',
          type: 'ReactNode',
          description: 'The `ListGroup`s.',
        },
      ],
    },
    {
      title: 'ListGroup / ListHeader / ListItems / ListItem',
      props: [
        {
          name: 'id',
          type: 'string',
          description:
            'The group id on `ListGroup`, the item id on `ListItem`. Required.',
        },
        {
          name: 'name / color / count',
          type: 'ReactNode | string | number',
          description:
            'On `ListHeader`: the group name, its colour dot and its count. Or pass `children` to draw the whole group header yourself.',
        },
        {
          name: 'index',
          type: 'number',
          description:
            'The item’s position within its group. Required on `ListItem`.',
        },
        {
          name: 'parent',
          type: 'string',
          description:
            'The group the item currently belongs to — readable again in `onDragEnd`. Required.',
        },
        {
          name: 'children',
          type: 'ReactNode',
          description:
            'On `ListItem`: replaces the default row, keeping the drag handle.',
        },
      ],
    },
  ],
};

/**
 * Basic
 *
 * Drag a row into another group. Updating the data is yours to do — the
 * component only reports which item landed in which group.
 */
export const Basic = () => {
  const [items, setItems] = useState(ITEMS);

  return (
    <div className="w-full max-w-lg">
      <ListProvider
        onDragEnd={(event) => {
          const target = event.over?.id;
          if (!target) return;

          setItems((current) =>
            current.map((item) =>
              item.id === event.active.id
                ? { ...item, group: String(target) }
                : item,
            ),
          );
        }}
      >
        {GROUPS.map((group) => {
          const rows = items.filter((item) => item.group === group.id);

          return (
            <ListGroup key={group.id} id={group.id}>
              <ListHeader
                name={group.name}
                color={group.color}
                count={rows.length}
              />
              <ListItems>
                {rows.map((item, index) => (
                  <ListItem
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    index={index}
                    parent={group.id}
                  />
                ))}
              </ListItems>
            </ListGroup>
          );
        })}
      </ListProvider>
    </div>
  );
};

/**
 * A row of your own
 *
 * `ListItem` takes children; the component keeps the drag handle.
 */
export const CustomItem = () => {
  const [items, setItems] = useState(ITEMS);

  return (
    <div className="w-full max-w-lg">
      <ListProvider
        onDragEnd={(event) => {
          const target = event.over?.id;
          if (!target) return;

          setItems((current) =>
            current.map((item) =>
              item.id === event.active.id
                ? { ...item, group: String(target) }
                : item,
            ),
          );
        }}
      >
        {GROUPS.map((group) => {
          const rows = items.filter((item) => item.group === group.id);

          return (
            <ListGroup key={group.id} id={group.id}>
              <ListHeader
                name={group.name}
                color={group.color}
                count={rows.length}
              />
              <ListItems>
                {rows.map((item, index) => (
                  <ListItem
                    key={item.id}
                    id={item.id}
                    index={index}
                    parent={group.id}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {group.name}
                      </p>
                    </div>
                  </ListItem>
                ))}
              </ListItems>
            </ListGroup>
          );
        })}
      </ListProvider>
    </div>
  );
};

/**
 * A group header of your own
 *
 * Give `ListHeader` children to replace the header row entirely.
 */
export const CustomHeader = () => {
  const [items, setItems] = useState(ITEMS);

  return (
    <div className="w-full max-w-lg">
      <ListProvider
        onDragEnd={(event) => {
          const target = event.over?.id;
          if (!target) return;

          setItems((current) =>
            current.map((item) =>
              item.id === event.active.id
                ? { ...item, group: String(target) }
                : item,
            ),
          );
        }}
      >
        {GROUPS.map((group) => {
          const rows = items.filter((item) => item.group === group.id);

          return (
            <ListGroup key={group.id} id={group.id}>
              <ListHeader>
                <div className="flex items-center justify-between border-b border-border px-3 py-2">
                  <span className="text-sm font-medium">{group.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {rows.length} tasks
                  </span>
                </div>
              </ListHeader>
              <ListItems>
                {rows.map((item, index) => (
                  <ListItem
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    index={index}
                    parent={group.id}
                  />
                ))}
              </ListItems>
            </ListGroup>
          );
        })}
      </ListProvider>
    </div>
  );
};
