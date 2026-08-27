import type { ReactNode } from 'react';

import { cn } from '../../utils';
import {
  DndContext,
  rectIntersection,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { GripVerticalIcon } from 'lucide-react';

export type { DragEndEvent } from '@dnd-kit/core';

/**
 * A grouped list whose items drag between groups — the "board as rows" view
 * that sits next to a Kanban.
 *
 * ```tsx
 * <ListProvider onDragEnd={handleDragEnd}>
 *   {groups.map((group) => (
 *     <ListGroup key={group.id} id={group.id}>
 *       <ListHeader name={group.name} color={group.color} />
 *       <ListItems>
 *         {items.filter((i) => i.group === group.id).map((item, index) => (
 *           <ListItem key={item.id} id={item.id} name={item.name} index={index} parent={group.id} />
 *         ))}
 *       </ListItems>
 *     </ListGroup>
 *   ))}
 * </ListProvider>
 * ```
 *
 * `onDragEnd` gives you `active.data.current.parent` and `over.id`, which is
 * everything needed to move an item — the component never owns the data.
 */
export const ListProvider = ({
  children,
  onDragEnd,
  className,
}: {
  children: ReactNode;
  onDragEnd: (event: DragEndEvent) => void;
  className?: string;
}) => (
  <DndContext
    collisionDetection={rectIntersection}
    // Rows only move up and down, so the drag is locked to one axis.
    modifiers={[restrictToVerticalAxis]}
    onDragEnd={onDragEnd}
  >
    <div
      data-slot="list"
      className={cn(
        'flex size-full flex-col divide-y overflow-auto rounded-md border',
        className,
      )}
    >
      {children}
    </div>
  </DndContext>
);

export const ListGroup = ({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      data-slot="list-group"
      className={cn('transition-colors', isOver && 'bg-accent/50', className)}
    >
      {children}
    </div>
  );
};

export type ListHeaderProps =
  | { children: ReactNode; className?: string }
  | { name: ReactNode; color?: string; count?: number; className?: string };

export const ListHeader = (props: ListHeaderProps) => {
  if ('children' in props) return props.children;

  return (
    <div
      data-slot="list-header"
      className={cn(
        'flex shrink-0 items-center gap-2 bg-muted/50 px-3 py-2',
        props.className,
      )}
    >
      {!!props.color && (
        <span
          aria-hidden
          className="size-2 shrink-0 rounded-full"
          style={{ backgroundColor: props.color }}
        />
      )}
      <p className="text-sm font-medium">{props.name}</p>
      {props.count !== undefined && (
        <span className="text-xs text-muted-foreground">{props.count}</span>
      )}
    </div>
  );
};

export const ListItems = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    data-slot="list-items"
    className={cn('flex flex-1 flex-col gap-2 p-3', className)}
  >
    {children}
  </div>
);

export const ListItem = ({
  id,
  name,
  index,
  parent,
  children,
  className,
}: {
  id: string;
  name?: ReactNode;
  index: number;
  /** Group the item currently belongs to — read back in `onDragEnd`. */
  parent: string;
  children?: ReactNode;
  className?: string;
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id, data: { index, parent } });

  return (
    <div
      ref={setNodeRef}
      data-slot="list-item"
      className={cn(
        'flex cursor-grab items-center gap-2 rounded-md border bg-background p-2 shadow-xs',
        isDragging && 'cursor-grabbing opacity-70',
        className,
      )}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        // Lifted rows must sit above their neighbours while moving.
        zIndex: isDragging ? 10 : undefined,
      }}
      {...listeners}
      {...attributes}
    >
      <GripVerticalIcon className="size-4 shrink-0 text-muted-foreground" />
      {children ?? <p className="text-sm font-medium">{name}</p>}
    </div>
  );
};
