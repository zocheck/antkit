import { useState } from 'react';

import {
  Avatar,
  AvatarFallback,
  Badge,
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from '@antkit/react';
import type { KanbanItem } from '@antkit/react';

import type { DemoMeta } from '../lib/types';

const COLUMNS = [
  { id: 'todo', name: 'Not started' },
  { id: 'doing', name: 'In progress' },
  { id: 'done', name: 'Done' },
];

type Task = KanbanItem & { owner: string; priority: 'high' | 'normal' };

const BOARD: Task[] = [
  {
    id: 'k1',
    name: 'Follow up with Maya Vu',
    column: 'todo',
    owner: 'Chloe Barnes',
    priority: 'high',
  },
  {
    id: 'k2',
    name: 'Send the 1,000km service reminder',
    column: 'todo',
    owner: 'Dana Whitfield',
    priority: 'normal',
  },
  {
    id: 'k3',
    name: 'Walk through the 12-month finance plan',
    column: 'doing',
    owner: 'Noah Hart',
    priority: 'high',
  },
  {
    id: 'k4',
    name: 'Confirm the delivery date',
    column: 'done',
    owner: 'Bella Nguyen',
    priority: 'normal',
  },
];

export const meta: DemoMeta = {
  imports: [
    'KanbanProvider',
    'KanbanBoard',
    'KanbanHeader',
    'KanbanCards',
    'KanbanCard',
  ],
  extraImports: ["import type { KanbanItem } from '@antkit/react';"],
  api: [
    {
      title: 'KanbanProvider',
      description:
        'The board never owns the data: every completed drag calls `onDataChange` with the whole reordered array, and where that goes is your decision.',
      props: [
        {
          name: 'columns',
          type: 'TColumn[]',
          description:
            'The columns — each needs an `id` and a `name`. Required.',
        },
        {
          name: 'data',
          type: 'TItem[]',
          description:
            'Every card; each carries `column`, the id of the column it is in. Required.',
        },
        {
          name: 'onDataChange',
          type: '(data: TItem[]) => void',
          description: 'Receives the new array after every drag.',
        },
        {
          name: 'children',
          type: '(column: TColumn) => ReactNode',
          description: 'A function that builds one column. Required.',
        },
        {
          name: 'renderOverlay',
          type: '(item: TItem) => ReactNode',
          description:
            'The card that flies with the pointer during a drag. By default it shows only the item name.',
        },
        {
          name: 'onDragStart / onDragEnd',
          type: '(event: DragEvent) => void',
          description:
            'The raw dnd-kit drag events, for when something extra has to happen.',
        },
      ],
    },
    {
      title: 'KanbanBoard / KanbanHeader / KanbanCards / KanbanCard',
      props: [
        {
          name: 'id',
          type: 'string',
          description:
            'The column id on `KanbanBoard` and `KanbanCards`; the card id on `KanbanCard`. Required.',
        },
        {
          name: 'children',
          type: 'ReactNode | ((item: TItem) => ReactNode)',
          description:
            '`KanbanCards` takes a function that builds a card; the other parts take ordinary nodes.',
        },
        {
          name: 'name',
          type: 'string',
          description:
            'On `KanbanCard`: the default contents when no children are passed.',
        },
      ],
    },
  ],
};

/**
 * Basic
 *
 * Drag a card within a column to reorder it, or into another column to change
 * its state.
 */
export const Basic = () => {
  const [board, setBoard] = useState<KanbanItem[]>(BOARD);

  return (
    <div className="w-full min-w-0">
      <KanbanProvider
        columns={COLUMNS}
        data={board}
        onDataChange={setBoard}
        className="min-h-56"
      >
        {(column) => (
          <KanbanBoard key={column.id} id={column.id}>
            <KanbanHeader>{column.name}</KanbanHeader>
            <KanbanCards id={column.id}>
              {(item) => (
                <KanbanCard key={item.id} id={item.id} name={item.name} />
              )}
            </KanbanCards>
          </KanbanBoard>
        )}
      </KanbanProvider>
    </div>
  );
};

/**
 * A card of your own
 *
 * `KanbanCard` takes children, so a card can carry an owner, a priority, a due
 * date — anything at all.
 */
export const CustomCard = () => {
  const [board, setBoard] = useState<Task[]>(BOARD);

  return (
    <div className="w-full min-w-0">
      <KanbanProvider
        columns={COLUMNS}
        data={board}
        onDataChange={setBoard}
        className="min-h-64"
      >
        {(column) => (
          <KanbanBoard key={column.id} id={column.id}>
            <KanbanHeader>
              <div className="flex items-center justify-between gap-2 bg-muted/50 px-3 py-2">
                <span className="text-sm font-medium">{column.name}</span>
                <span className="text-xs text-muted-foreground">
                  {board.filter((item) => item.column === column.id).length}
                </span>
              </div>
            </KanbanHeader>
            <KanbanCards id={column.id}>
              {(item: Task) => (
                <KanbanCard key={item.id} id={item.id}>
                  <div className="grid gap-2">
                    <p className="text-sm font-medium">{item.name}</p>
                    <div className="flex items-center justify-between gap-2">
                      <Badge
                        variant={item.priority === 'high' ? 'warning' : 'muted'}
                      >
                        {item.priority}
                      </Badge>
                      <Avatar size="sm">
                        <AvatarFallback>
                          {item.owner
                            .split(' ')
                            .at(-1)
                            ?.slice(0, 1)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </KanbanCard>
              )}
            </KanbanCards>
          </KanbanBoard>
        )}
      </KanbanProvider>
    </div>
  );
};

/**
 * The card being dragged
 *
 * `renderOverlay` decides what flies with the pointer — make it match the real
 * card and the drag feels continuous.
 */
export const Overlay = () => {
  const [board, setBoard] = useState<KanbanItem[]>(BOARD);

  return (
    <div className="w-full min-w-0">
      <KanbanProvider
        columns={COLUMNS.slice(0, 2)}
        data={board.filter((item) => item.column !== 'done')}
        onDataChange={setBoard}
        className="min-h-56"
        renderOverlay={(item) => (
          <div className="rounded-md border border-primary bg-background p-3 text-sm font-medium shadow-lg">
            {item.name}
          </div>
        )}
      >
        {(column) => (
          <KanbanBoard key={column.id} id={column.id}>
            <KanbanHeader>{column.name}</KanbanHeader>
            <KanbanCards id={column.id}>
              {(item) => (
                <KanbanCard key={item.id} id={item.id} name={item.name} />
              )}
            </KanbanCards>
          </KanbanBoard>
        )}
      </KanbanProvider>
    </div>
  );
};
