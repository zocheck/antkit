import { Button, Empty } from '@antkit/react';
import { InboxIcon, PlusIcon, SearchXIcon } from 'lucide-react';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: ['Empty'],
  api: [
    {
      title: 'Empty',
      description:
        'The empty state of a list, a table, a set of search results. `Table`, `Select`, `TreeSelect`, `AutoComplete`, `Transfer` and `CommandMenu` all fall back to this component when there is nothing to show, so the product decides once what an empty block looks like. Use `Result` when the whole page is empty — a 404, or the end of a flow.',
      props: [
        {
          name: 'image',
          type: 'ReactNode | false',
          description:
            'Replaces the default illustration, or `false` to drop the image entirely.',
        },
        {
          name: 'title',
          type: 'ReactNode',
          description: 'The bold line above the description.',
        },
        {
          name: 'description',
          type: 'ReactNode',
          description:
            'The explanation. Left out, it takes the `noData` key from `ConfigProvider`.',
        },
        {
          name: 'size',
          type: "'sm' | 'default'",
          default: "'default'",
          description: '`sm` for an empty block inside a narrow panel.',
        },
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Sits under the description — usually an action button.',
        },
      ],
    },
  ],
};

/**
 * Basic
 */
export const Basic = () => (
  <div className="w-full rounded-lg border border-border">
    <Empty description="No students yet" />
  </div>
);

/**
 * With an action
 *
 * A good empty state always points at the next step.
 */
export const WithAction = () => (
  <div className="w-full rounded-lg border border-border">
    <Empty
      title="No students yet"
      description="Add the first student to start tracking this class."
    >
      <Button size="sm" prefix={<PlusIcon />}>
        Add student
      </Button>
    </Empty>
  </div>
);

/**
 * Nothing found
 *
 * Different from "no data yet": here there is data, the filter is just too
 * narrow.
 */
export const NoResults = () => (
  <div className="w-full rounded-lg border border-border">
    <Empty
      image={<SearchXIcon className="size-10 text-muted-foreground" />}
      title="No results"
      description="Try removing a filter or changing the search term."
    >
      <Button size="sm" variant="secondary">
        Clear filters
      </Button>
    </Empty>
  </div>
);

/**
 * Small
 *
 * `sm` for an empty block inside a narrow panel or a card.
 */
export const Small = () => (
  <div className="w-full max-w-xs rounded-lg border border-border">
    <Empty size="sm" description="No notes yet" />
  </div>
);

/**
 * Changing or dropping the image
 */
export const CustomImage = () => (
  <div className="grid w-full gap-4 sm:grid-cols-2">
    <div className="rounded-lg border border-border">
      <Empty
        image={<InboxIcon className="size-10 text-muted-foreground" />}
        description="Inbox is empty"
      />
    </div>
    <div className="rounded-lg border border-border">
      <Empty image={false} description="No image, just a line of text" />
    </div>
  </div>
);
