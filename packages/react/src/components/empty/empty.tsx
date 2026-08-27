import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../utils';
import { InboxIcon } from 'lucide-react';

import { useLocale } from '../../lib/config';

export type EmptyProps = Omit<ComponentProps<'div'>, 'title'> & {
  /** Replaces the default illustration; `false` drops it. */
  image?: ReactNode | false;
  /** Headline above the description. */
  title?: ReactNode;
  description?: ReactNode;
  /** `sm` fits inside a table body or a card, `default` owns the page. */
  size?: 'sm' | 'default';
  /** Call-to-action rendered under the text. */
  children?: ReactNode;
};

/**
 * The blank state for a list, a table or a search that came back with nothing.
 *
 * ```tsx
 * <Empty description="No students yet">
 *   <Button>Add a student</Button>
 * </Empty>
 * ```
 *
 * `Table`, `Select`, `TreeSelect`, `AutoComplete`, `Transfer` and `CommandMenu`
 * all fall back to this when they have nothing to show, so a product only has
 * to decide what a blank state looks like once. Each of them still takes its
 * own override — `empty`, `notFoundContent` — for the cases that deserve
 * different words or a different call to action.
 *
 * Use `Result` when the whole page is the outcome — a 404, a finished flow.
 */
export const Empty = ({
  image,
  title,
  description,
  size = 'default',
  className,
  children,
  ...props
}: EmptyProps) => {
  const locale = useLocale();
  const body = description ?? locale.common?.noData ?? 'No data';

  return (
    <div
      data-slot="empty"
      data-size={size}
      className={cn(
        'flex w-full flex-col items-center justify-center text-center',
        size === 'sm' ? 'gap-2 px-4 py-6' : 'gap-3 px-6 py-12',
        className,
      )}
      {...props}
    >
      {image === false ? null : image !== undefined ? (
        <div
          data-slot="empty-image"
          className="flex items-center justify-center text-muted-foreground [&>img]:max-h-full [&>svg]:size-full"
        >
          {image}
        </div>
      ) : (
        <div
          data-slot="empty-image"
          className={cn(
            'flex items-center justify-center rounded-full bg-muted text-muted-foreground',
            size === 'sm' ? 'size-10' : 'size-16',
          )}
        >
          <InboxIcon className={size === 'sm' ? 'size-5' : 'size-7'} />
        </div>
      )}

      {(!!title || !!body) && (
        <div className="flex flex-col gap-1">
          {!!title && (
            <p
              data-slot="empty-title"
              className={cn(
                'font-medium text-foreground',
                size === 'sm' ? 'text-sm' : 'text-base',
              )}
            >
              {title}
            </p>
          )}
          {!!body && (
            <p
              data-slot="empty-description"
              className="max-w-sm text-sm text-muted-foreground"
            >
              {body}
            </p>
          )}
        </div>
      )}

      {!!children && (
        <div
          data-slot="empty-actions"
          className="mt-1 flex flex-wrap items-center justify-center gap-2"
        >
          {children}
        </div>
      )}
    </div>
  );
};
