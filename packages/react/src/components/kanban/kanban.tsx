import { createContext, useContext, useMemo, useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '../../utils';
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Card } from '../card';

export type { DragEndEvent } from '@dnd-kit/core';

export type KanbanItem = {
  id: string;
  name: string;
  /** Id of the column the card currently sits in. */
  column: string;
} & Record<string, unknown>;

export type KanbanColumn = {
  id: string;
  name: string;
} & Record<string, unknown>;

type KanbanContextValue = {
  data: KanbanItem[];
  activeId: string | null;
};

const KanbanContext = createContext<KanbanContextValue>({
  data: [],
  activeId: null,
});

export type KanbanProviderProps<
  TItem extends KanbanItem,
  TColumn extends KanbanColumn,
> = {
  columns: TColumn[];
  data: TItem[];
  /** Called with the whole reordered array — the board never owns the data. */
  onDataChange?: (data: TItem[]) => void;
  children: (column: TColumn) => ReactNode;
  /** Card shown under the cursor while dragging. Defaults to the item's name. */
  renderOverlay?: (item: TItem) => ReactNode;
  onDragStart?: (event: DragStartEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
  className?: string;
};

/**
 * Kanban board with cards that drag within and between columns.
 *
 * ```tsx
 * <KanbanProvider columns={columns} data={items} onDataChange={setItems}>
 *   {(column) => (
 *     <KanbanBoard key={column.id} id={column.id}>
 *       <KanbanHeader>{column.name}</KanbanHeader>
 *       <KanbanCards id={column.id}>
 *         {(item) => <KanbanCard key={item.id} {...item} />}
 *       </KanbanCards>
 *     </KanbanBoard>
 *   )}
 * </KanbanProvider>
 * ```
 */
export const KanbanProvider = <
  TItem extends KanbanItem,
  TColumn extends KanbanColumn,
>({
  columns,
  data,
  onDataChange,
  children,
  renderOverlay,
  onDragStart,
  onDragEnd,
  className,
}: KanbanProviderProps<TItem, TColumn>) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    // A few pixels of travel before a drag starts, so clicking a card still
    // works on touch and with a mouse.
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor),
  );

  const activeItem = data.find((item) => item.id === activeId) ?? null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
    onDragStart?.(event);
  };

  /** Moves the card into whichever column it is hovering, mid-drag. */
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeIndex = data.findIndex((item) => item.id === active.id);
    if (activeIndex === -1) return;

    const overItem = data.find((item) => item.id === over.id);
    const targetColumn =
      overItem?.column ?? columns.find((column) => column.id === over.id)?.id;

    if (!targetColumn || data[activeIndex].column === targetColumn) return;

    const next = [...data];
    next[activeIndex] = { ...next[activeIndex], column: targetColumn };

    const overIndex = next.findIndex((item) => item.id === over.id);
    onDataChange?.(
      overIndex === -1 ? next : arrayMove(next, activeIndex, overIndex),
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    onDragEnd?.(event);

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const from = data.findIndex((item) => item.id === active.id);
    const to = data.findIndex((item) => item.id === over.id);
    if (from === -1 || to === -1) return;

    onDataChange?.(arrayMove(data, from, to));
  };

  const context = useMemo<KanbanContextValue>(
    () => ({ data, activeId }),
    [data, activeId],
  );

  return (
    <KanbanContext value={context}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div
          data-slot="kanban"
          className={cn('grid auto-cols-fr grid-flow-col gap-4', className)}
        >
          {columns.map((column) => children(column))}
        </div>

        {/*
          The overlay is portalled to the body so it isn't clipped by the
          column's own overflow while the card is dragged out of it.
        */}
        {createPortal(
          <DragOverlay>
            {activeItem && (
              <Card className="cursor-grabbing gap-4 rounded-md p-3 shadow-lg ring-2 ring-primary">
                {renderOverlay?.(activeItem as TItem) ?? (
                  <p className="text-sm font-medium">{activeItem.name}</p>
                )}
              </Card>
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </KanbanContext>
  );
};

export const KanbanBoard = ({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      data-slot="kanban-board"
      className={cn(
        'flex size-full min-h-40 flex-col divide-y overflow-hidden rounded-md border bg-muted/40 ring-2 transition-colors',
        isOver ? 'ring-primary' : 'ring-transparent',
        className,
      )}
    >
      {children}
    </div>
  );
};

export const KanbanHeader = ({
  className,
  ...props
}: ComponentProps<'div'>) => (
  <div
    data-slot="kanban-header"
    className={cn('p-3 text-sm font-medium', className)}
    {...props}
  />
);

export const KanbanCards = <TItem extends KanbanItem>({
  id,
  children,
  className,
}: {
  id: string;
  children: (item: TItem) => ReactNode;
  className?: string;
}) => {
  const { data } = useContext(KanbanContext);
  const items = data.filter((item) => item.column === id);

  return (
    <SortableContext items={items.map((item) => item.id)}>
      <div
        data-slot="kanban-cards"
        className={cn(
          'flex flex-1 flex-col gap-2 overflow-y-auto p-2',
          className,
        )}
      >
        {items.map((item) => children(item as TItem))}
      </div>
    </SortableContext>
  );
};

export const KanbanCard = ({
  id,
  name,
  children,
  className,
}: {
  id: string;
  name?: string;
  children?: ReactNode;
  className?: string;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    transform,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transition, transform: CSS.Transform.toString(transform) }}
      {...listeners}
      {...attributes}
    >
      <Card
        data-slot="kanban-card"
        className={cn(
          'cursor-grab gap-4 rounded-md p-3 shadow-xs',
          // The real card fades out while its copy rides the cursor.
          isDragging && 'pointer-events-none opacity-30',
          className,
        )}
      >
        {children ?? <p className="text-sm font-medium">{name}</p>}
      </Card>
    </div>
  );
};
