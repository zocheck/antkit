import { useState } from 'react';

import { Card, Pagination } from '@antkit/react';

import type { DemoMeta } from '../lib/types';

const TOTAL = 234;

export const meta: DemoMeta = {
  imports: ['Pagination'],
  api: [
    {
      title: 'Pagination',
      description:
        'Fully controlled — it holds no page of its own. `Table` builds one for you when you pass its `pagination` prop.',
      props: [
        {
          name: 'page',
          type: 'number',
          description: 'The current page, counting from 1.',
        },
        {
          name: 'pageSize',
          type: 'number',
          description: 'How many items per page.',
        },
        {
          name: 'total',
          type: 'number',
          description: 'The total number of items, not of pages.',
        },
        {
          name: 'onChange',
          type: '(page: number, pageSize: number) => void',
          description:
            'Reports both values. Changing `pageSize` resets the page to 1 — store both from the same call.',
        },
        {
          name: 'showSizeChanger',
          type: 'boolean',
          default: 'false',
          description: 'The rows-per-page picker.',
        },
        {
          name: 'pageSizeOptions',
          type: 'number[]',
          default: '[10, 20, 50, 100]',
          description: 'The choices offered by that picker.',
        },
        {
          name: 'showQuickJumper',
          type: 'boolean | { goButton?: ReactNode }',
          default: 'false',
          description:
            'A box to type a page number into. Pass an object with `goButton` for a confirm button.',
        },
        {
          name: 'showTotal',
          type: '(total: number, range: [number, number]) => string',
          description: 'A summary line such as "1-10 of 234".',
        },
        {
          name: 'boundaries',
          type: 'number',
          default: '2',
          description: 'Pages kept at each end of the strip.',
        },
        {
          name: 'siblings',
          type: 'number',
          default: '1',
          description:
            'Pages kept either side of the current one. With `boundaries` these two set the width of the strip, which stays the same on every page.',
        },
        {
          name: 'variant',
          type: "'outline' | 'light' | 'flat'",
          default: "'outline'",
          description:
            '`outline` gives every page a border, `light` fills only the current one, `flat` puts a muted fill behind the rest.',
        },
        {
          name: 'showLessItems',
          type: 'boolean',
          default: 'false',
          description:
            'Shorthand for `boundaries={1} siblings={0}`. An explicit `boundaries` or `siblings` wins over it.',
        },
        {
          name: 'simple',
          type: 'boolean',
          default: 'false',
          description:
            'Just the arrows and "3 / 24", with no strip of numbers.',
        },
        {
          name: 'size',
          type: "'default' | 'small'",
          default: "'default'",
          description: 'Button size.',
        },
        {
          name: 'hideOnSinglePage',
          type: 'boolean',
          default: 'false',
          description: 'Hides it entirely when there is only one page.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Locks the whole thing.',
        },
        {
          name: 'onShowSizeChange',
          type: '(page: number, pageSize: number) => void',
          description: 'Fires only when the rows-per-page choice changes.',
        },
      ],
    },
  ],
};

/**
 * Basic
 *
 * It holds no page of its own — `page` is what you are storing, and
 * `onChange` is where you store the next one.
 */
export const Basic = () => {
  const [page, setPage] = useState(1);

  return (
    <Pagination page={page} pageSize={10} total={TOTAL} onChange={setPage} />
  );
};

/**
 * Changing rows per page
 *
 * `onChange` reports both values because changing `pageSize` resets the page
 * to 1. Store both from the same call rather than one in each place.
 */
export const SizeChanger = () => {
  const [{ page, pageSize }, setState] = useState({ page: 3, pageSize: 10 });

  return (
    <Pagination
      page={page}
      pageSize={pageSize}
      total={TOTAL}
      showSizeChanger
      showTotal={(total, [from, to]) => `${from}-${to} of ${total}`}
      onChange={(nextPage, nextPageSize) =>
        setState({ page: nextPage, pageSize: nextPageSize })
      }
    />
  );
};

/**
 * Jumping to a page
 *
 * `showQuickJumper` adds a box to type a page number into. Pass
 * `{ goButton: … }` for a confirm button instead of only Enter.
 */
export const QuickJumper = () => {
  const [page, setPage] = useState(1);

  return (
    <Pagination
      page={page}
      pageSize={10}
      total={TOTAL}
      showQuickJumper={{ goButton: 'Go' }}
      onChange={setPage}
    />
  );
};

/**
 * Compact
 *
 * `simple` drops the numbers, leaving two arrows and the current position —
 * right for a sidebar or a narrow screen. `showLessItems` is the middle
 * ground: still numbered, just fewer.
 */
export const Compact = () => {
  const [simple, setSimple] = useState(2);
  const [fewer, setFewer] = useState(5);

  return (
    <div className="grid w-full gap-4">
      <Pagination
        simple
        page={simple}
        pageSize={10}
        total={TOTAL}
        onChange={setSimple}
      />
      <Pagination
        showLessItems
        size="small"
        page={fewer}
        pageSize={10}
        total={TOTAL}
        onChange={setFewer}
      />
    </div>
  );
};

/**
 * Paginating something that is not a table
 *
 * This is why it is separate from `Table`: card grids, feeds, search results.
 */
export const CardGrid = () => {
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const items = Array.from({ length: TOTAL }, (_, index) => index + 1).slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  return (
    <div className="grid w-full gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item) => (
          <Card key={item} className="p-4 text-center text-sm">
            Course {item}
          </Card>
        ))}
      </div>
      <Pagination
        page={page}
        pageSize={pageSize}
        total={TOTAL}
        showTotal={(total, [from, to]) => `${from}-${to} of ${total}`}
        onChange={setPage}
      />
    </div>
  );
};

/**
 * Variants
 *
 * `variant` changes how the pages you are not on are drawn. The current page
 * stays a solid button either way, so where you are is never ambiguous.
 */
export const Variants = () => {
  const [page, setPage] = useState(4);

  return (
    <div className="grid w-full gap-4">
      {(['outline', 'light', 'flat'] as const).map((variant) => (
        <Pagination
          key={variant}
          variant={variant}
          page={page}
          pageSize={10}
          total={TOTAL}
          onChange={setPage}
        />
      ))}
    </div>
  );
};

/**
 * Width of the strip
 *
 * `boundaries` is how many pages stay at each end, `siblings` how many stay
 * around the current one. The strip keeps the same number of slots on every
 * page: near an end the run of numbers grows into the space the second `…`
 * would have taken, so nothing beside it shifts when you click.
 */
export const Width = () => {
  const [page, setPage] = useState(12);

  return (
    <div className="grid w-full gap-4">
      {(
        [
          { boundaries: 1, siblings: 0 },
          { boundaries: 2, siblings: 1 },
          { boundaries: 2, siblings: 2 },
        ] as const
      ).map((shape) => (
        <Pagination
          key={`${shape.boundaries}-${shape.siblings}`}
          {...shape}
          page={page}
          pageSize={10}
          total={TOTAL}
          onChange={setPage}
        />
      ))}
    </div>
  );
};
