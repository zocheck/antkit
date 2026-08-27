import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../utils';

export type DescriptionsItem = {
  key?: string;
  label: ReactNode;
  children: ReactNode;
  /** How many columns this row occupies. Clamped to `column`. */
  span?: number;
};

export type DescriptionsProps = Omit<ComponentProps<'div'>, 'title'> & {
  items: DescriptionsItem[];
  title?: ReactNode;
  /** Rendered opposite the title — usually an edit button. */
  extra?: ReactNode;
  /** Columns per row. */
  column?: number;
  bordered?: boolean;
  /** `horizontal` puts the label beside the value, `vertical` above it. */
  layout?: 'horizontal' | 'vertical';
  size?: 'sm' | 'default';
};

/**
 * A read-only detail panel — the "view" half of a form.
 *
 * ```tsx
 * <Descriptions
 *   title="Học viên"
 *   bordered
 *   column={2}
 *   items={[
 *     { label: 'Họ tên', children: 'Nguyễn Thị Ánh Nguyệt' },
 *     { label: 'Khoá học', children: 'IELTS 6.5+' },
 *     { label: 'Ghi chú', children: 'Ưu tiên gọi buổi tối', span: 2 },
 *   ]}
 * />
 * ```
 */
export const Descriptions = ({
  items,
  title,
  extra,
  column = 1,
  bordered = false,
  layout = 'horizontal',
  size = 'default',
  className,
  ...props
}: DescriptionsProps) => {
  // When bordered, the grid lines are 1px gaps over a border-coloured backdrop
  // — the only approach that stays correct for an arbitrary column count. A
  // partly filled last row would expose that backdrop, so it gets a filler.
  const filled = items.reduce(
    (total, item) => total + Math.min(item.span ?? 1, column),
    0,
  );
  const filler = (column - (filled % column)) % column;
  const cellPadding = size === 'sm' ? 'px-3 py-2' : 'px-4 py-3';

  return (
    <div
      data-slot="descriptions"
      className={cn('flex w-full min-w-0 flex-col gap-3', className)}
      {...props}
    >
      {(!!title || !!extra) && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          {!!title && <p className="font-medium">{title}</p>}
          {!!extra && <div className="shrink-0">{extra}</div>}
        </div>
      )}

      <dl
        data-slot="descriptions-items"
        // The column count is a caller-chosen number, so the grid template has
        // to be inline — Tailwind can't emit a class for an unknown value.
        style={{ gridTemplateColumns: `repeat(${column}, minmax(0, 1fr))` }}
        className={cn(
          'grid w-full',
          bordered
            ? 'gap-px overflow-hidden rounded-lg border border-border bg-border'
            : size === 'sm'
              ? 'gap-x-6 gap-y-2'
              : 'gap-x-8 gap-y-3',
        )}
      >
        {items.map((item, index) => (
          <div
            key={item.key ?? index}
            data-slot="descriptions-item"
            // `span` is data too, for the same reason as the template above.
            style={{ gridColumn: `span ${Math.min(item.span ?? 1, column)}` }}
            className={cn(
              'flex min-w-0',
              layout === 'horizontal'
                ? 'flex-row items-baseline gap-2'
                : 'flex-col gap-1',
              bordered && cn('bg-card', cellPadding),
            )}
          >
            <dt
              className={cn(
                'shrink-0 text-muted-foreground',
                size === 'sm' ? 'text-xs' : 'text-sm',
                layout === 'horizontal' && 'after:content-[":"]',
              )}
            >
              {item.label}
            </dt>
            <dd
              className={cn(
                'min-w-0 break-words text-foreground',
                size === 'sm' ? 'text-xs' : 'text-sm',
              )}
            >
              {item.children}
            </dd>
          </div>
        ))}

        {bordered && filler > 0 && (
          <div
            aria-hidden
            style={{ gridColumn: `span ${filler}` }}
            className="bg-card"
          />
        )}
      </dl>
    </div>
  );
};
