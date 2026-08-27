import { useMemo, useState } from 'react';

import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Table,
} from '@antkit/react';
import type { ColumnType } from '@antkit/react';
import {
  CalendarIcon,
  FileTextIcon,
  MailIcon,
  MoreVerticalIcon,
  WalletIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import type { DemoMeta } from '../lib/types';

type Row = {
  id: string;
  name: string;
  course: string;
  status: 'active' | 'paused' | 'done';
  email: string;
  phone: string;
  advisor: string;
  createdAt: string;
  note?: string;
  fee: number;
};

const ROWS: Row[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    course: 'IELTS 6.5+',
    status: 'active',
    email: 'sarah.chen@example.com',
    phone: '+1 415 555 0134',
    advisor: 'Dana Whitfield',
    createdAt: '15 Aug 2026',
    note: 'Prefers evening calls',
    fee: 12_500,
  },
  {
    id: '2',
    name: 'Marcus Alvarez',
    course: 'TOEIC 750',
    status: 'paused',
    email: 'marcus.a@example.com',
    phone: '+1 415 555 0192',
    advisor: 'Bella Nguyen',
    createdAt: '9 Aug 2026',
    fee: 8_900,
  },
  {
    id: '3',
    name: 'Priya Raghunathan',
    course: 'Beginner conversation',
    status: 'done',
    email: 'priya.r@example.com',
    phone: '+1 415 555 0177',
    advisor: 'Noah Hart',
    createdAt: '28 Jul 2026',
    fee: 4_250,
  },
  {
    id: '4',
    name: 'Tom Okafor',
    course: 'Exam preparation',
    status: 'active',
    email: 'tom.okafor@example.com',
    phone: '+1 415 555 0148',
    advisor: 'Dana Whitfield',
    createdAt: '1 Aug 2026',
    fee: 15_750,
  },
  {
    id: '5',
    name: 'Maria Bellini',
    course: 'IELTS 7.0+',
    status: 'active',
    email: 'maria.b@example.com',
    phone: '+1 415 555 0163',
    advisor: 'Bella Nguyen',
    createdAt: '19 Aug 2026',
    fee: 19_000,
  },
  {
    id: '6',
    name: 'Chloe Barnes',
    course: 'TOEIC 600',
    status: 'done',
    email: 'chloe.b@example.com',
    phone: '+1 415 555 0186',
    advisor: 'Noah Hart',
    createdAt: '4 Jul 2026',
    fee: 6_400,
  },
];

const TONE = {
  active: 'success',
  paused: 'warning',
  done: 'muted',
} as const;

const STATUS = {
  active: 'Active',
  paused: 'Paused',
  done: 'Completed',
} as const;

const BASIC: ColumnType<Row>[] = [
  { title: 'Full name', dataIndex: 'name', width: 240 },
  { title: 'Course', dataIndex: 'course', width: 180 },
  {
    title: 'Status',
    dataIndex: 'status',
    width: 140,
    render: (value) => (
      <Badge variant={TONE[value as Row['status']]}>
        {STATUS[value as Row['status']]}
      </Badge>
    ),
  },
  {
    title: 'Tuition',
    dataIndex: 'fee',
    width: 150,
    align: 'right',
    render: (value) => `$${Number(value).toLocaleString('en-US')}`,
  },
];

export const meta: DemoMeta = {
  imports: ['Table'],
  extraImports: ["import type { ColumnType } from '@antkit/react';"],
  api: [
    {
      title: 'Table',
      props: [
        {
          name: 'columns',
          type: 'ColumnType<TRecord>[]',
          description: 'The column definitions. Required.',
        },
        {
          name: 'dataSource',
          type: 'TRecord[]',
          description: 'The rows for the current page. Required.',
        },
        {
          name: 'rowKey',
          type: 'keyof TRecord | ((record: TRecord) => string)',
          description: 'The row identifier. Required.',
        },
        {
          name: 'loading',
          type: 'boolean',
          default: 'false',
          description: 'Replaces the data with skeleton rows.',
        },
        {
          name: 'loadingRows',
          type: 'number',
          description: 'How many skeleton rows are drawn.',
        },
        {
          name: 'empty',
          type: 'ReactNode',
          description:
            'Replaces the empty block when there are no rows. Left out, it uses `Empty` — the circled icon, with the wording from `ConfigProvider`.',
        },
        {
          name: 'rowSelection',
          type: 'RowSelection<TRecord>',
          description: 'Adds the tick-box column at the head of the table.',
        },
        {
          name: 'expandable',
          type: 'TableExpandable<TRecord>',
          description: 'The detail panel that opens directly under a row.',
        },
        {
          name: 'rowActions',
          type: '(record: TRecord, index: number) => ReactNode',
          description: 'A column pinned to the right, rendered per row.',
        },
        {
          name: 'actionsWidth',
          type: 'number',
          default: '48',
          description: 'The width of the actions column.',
        },
        {
          name: 'scroll',
          type: '{ x?: number | string; y?: number | string }',
          description:
            '`x` is the minimum width before it scrolls sideways, `y` the maximum height before the body scrolls down.',
        },
        {
          name: 'maxHeight',
          type: 'number | string',
          description:
            'The older alias for `scroll.y`. The header sticks and the body scrolls beneath it.',
        },
        {
          name: 'stickyHeader',
          type: 'boolean',
          default: 'true',
          description:
            'Turn it off when the parent owns the scroll area instead.',
        },
        {
          name: 'sort / defaultSort / onSortChange',
          type: 'TableSort | (sort: TableSort) => void',
          description:
            'Controlled sorting — for when the sort happens on the server.',
        },
        {
          name: 'columnWidths / defaultColumnWidths / onColumnWidthsChange',
          type: 'Record<string, number>',
          description:
            'Controlled column widths, so each user’s adjustments can be stored.',
        },
        {
          name: 'minColumnWidth',
          type: 'number',
          description: 'The smallest width a drag can reach.',
        },
        {
          name: 'pagination',
          type: 'PaginationProps | false',
          description: 'The pagination bar under the table.',
        },
        {
          name: 'onRowClick',
          type: '(record: TRecord, index: number) => void',
          description: 'A click on a row.',
        },
        {
          name: 'rowClassName',
          type: '(record: TRecord, index: number) => string | undefined',
          description: 'A class per row — colouring an overdue row, say.',
        },
        {
          name: 'headerHeight',
          type: 'CSSProperties["height"]',
          default: '44',
          description: 'The height of the header row.',
        },
        {
          name: 'classNames / styles',
          type: 'TableClassNames | TableStyles',
          description:
            'Hooks for class and style per slot, for a product’s own skin.',
        },
      ],
    },
    {
      title: 'ColumnType',
      props: [
        {
          name: 'title',
          type: 'ReactNode',
          description: 'The column heading. Required.',
        },
        {
          name: 'dataIndex',
          type: 'keyof TRecord',
          description: 'Which field the value comes from.',
        },
        {
          name: 'key',
          type: 'string',
          description:
            'Defaults to `dataIndex`. Required when the column has none.',
        },
        {
          name: 'render',
          type: '(value, record, index) => ReactNode',
          description: 'Draws the cell contents yourself.',
        },
        {
          name: 'width',
          type: 'number',
          description:
            'In pixels. `table-fixed` needs a number to build the grid.',
        },
        {
          name: 'align',
          type: "'left' | 'center' | 'right'",
          default: "'left'",
          description: 'Aligns the content in the cell.',
        },
        {
          name: 'fixed',
          type: "'left' | 'right'",
          description: 'Pins the column while the table scrolls sideways.',
        },
        {
          name: 'sorter',
          type: 'boolean | ((a: TRecord, b: TRecord) => number)',
          description:
            '`true` uses the default comparator, or supply your own.',
        },
        {
          name: 'resizable',
          type: 'boolean',
          default: 'false',
          description: 'Lets the column edge be dragged to change its width.',
        },
        {
          name: 'ellipsis',
          type: 'boolean',
          default: 'true',
          description:
            'Truncates the text and adds a `title` so hovering shows it in full.',
        },
        {
          name: 'icon',
          type: 'ReactNode',
          description:
            'A small glyph before the heading, as a field-type marker.',
        },
        {
          name: 'headerClassName / cellClassName / className',
          type: 'string',
          description: 'Styling for the heading, the cells, or both.',
        },
      ],
    },
    {
      title: 'RowSelection',
      props: [
        {
          name: 'selectedRowKeys',
          type: 'string[]',
          description: 'The keys of the selected rows.',
        },
        {
          name: 'onChange',
          type: '(keys: string[], rows: TRecord[]) => void',
          description: 'Receives both the keys and the matching records.',
        },
        {
          name: 'getCheckboxProps',
          type: '(record: TRecord) => { disabled?: boolean }',
          description: 'Locks the tick box on rows that cannot be selected.',
        },
      ],
    },
    {
      title: 'TableExpandable',
      props: [
        {
          name: 'expandedRowRender',
          type: '(record, index, indent, expanded) => ReactNode',
          description: 'The contents of the detail panel. Required.',
        },
        {
          name: 'rowExpandable',
          type: '(record: TRecord) => boolean',
          description: 'Which rows can be expanded.',
        },
        {
          name: 'expandedRowKeys / defaultExpandedRowKeys / defaultExpandAllRows',
          type: 'string[] | boolean',
          description: 'Controls which rows are open.',
        },
        {
          name: 'expandRowByClick',
          type: 'boolean',
          default: 'false',
          description: 'A click anywhere on the row opens the panel too.',
        },
        {
          name: 'fixed',
          type: "boolean | 'left'",
          description:
            'Keeps the expand button visible while scrolling sideways.',
        },
        {
          name: 'onExpand / onExpandedRowsChange',
          type: '(expanded, record) => void | (keys: string[]) => void',
          description: 'Watches the open state.',
        },
      ],
    },
    {
      title: 'PaginationProps',
      props: [
        {
          name: 'page / pageSize / total',
          type: 'number',
          description: 'The current page, the rows per page and the total.',
        },
        {
          name: 'onChange',
          type: '(page: number, pageSize: number) => void',
          description: 'Called when the page or the page size changes.',
        },
        {
          name: 'pageSizeOptions',
          type: 'number[]',
          description: 'The rows-per-page options offered.',
        },
        {
          name: 'showSizeChanger / showQuickJumper / showLessItems / simple',
          type: 'boolean',
          description:
            'Switches individual parts of the pagination bar on and off.',
        },
        {
          name: 'showTotal',
          type: '(total: number, range: [number, number]) => string',
          description: 'A summary line such as "1–10 of 234".',
        },
        {
          name: 'hideOnSinglePage',
          type: 'boolean',
          default: 'false',
          description: 'Hides it entirely when there is only one page.',
        },
      ],
    },
  ],
};

/**
 * Basic
 *
 * `columns` describes the columns, `dataSource` is the data, and `rowKey`
 * identifies a row.
 */
export const Basic = () => (
  <div className="w-full min-w-0">
    <Table rowKey="id" columns={BASIC} dataSource={ROWS.slice(0, 4)} />
  </div>
);

/**
 * Sorting
 *
 * `sorter: true` uses the default comparator; pass a function when the
 * comparison differs — tuition has to sort by the number, not by the formatted
 * string.
 */
export const Sorting = () => (
  <div className="w-full min-w-0">
    <Table
      rowKey="id"
      dataSource={ROWS}
      columns={[
        { title: 'Full name', dataIndex: 'name', width: 240, sorter: true },
        { title: 'Created', dataIndex: 'createdAt', width: 150, sorter: true },
        {
          title: 'Tuition',
          dataIndex: 'fee',
          width: 160,
          align: 'right',
          sorter: (a, b) => a.fee - b.fee,
          render: (value) => `$${Number(value).toLocaleString('en-US')}`,
        },
      ]}
    />
  </div>
);

/**
 * Selecting rows
 *
 * `getCheckboxProps` locks the rows that cannot be selected — the completed
 * courses here.
 */
export const Selection = () => {
  const [keys, setKeys] = useState<string[]>([]);

  return (
    <div className="w-full min-w-0">
      <p className="mb-3 text-sm text-muted-foreground">
        {keys.length} row(s) selected
      </p>
      <Table
        rowKey="id"
        columns={BASIC}
        dataSource={ROWS.slice(0, 4)}
        rowSelection={{
          selectedRowKeys: keys,
          onChange: setKeys,
          getCheckboxProps: (row) => ({ disabled: row.status === 'done' }),
        }}
      />
    </div>
  );
};

/**
 * Expandable rows
 *
 * The detail panel sits directly under the row — the place for fields that do
 * not deserve a column of their own.
 */
export const Expandable = () => (
  <div className="w-full min-w-0">
    <Table
      rowKey="id"
      columns={BASIC}
      dataSource={ROWS.slice(0, 4)}
      expandable={{
        expandedRowRender: (row) => (
          <div className="grid gap-1 text-sm sm:grid-cols-2">
            <p>
              <span className="text-muted-foreground">Contact: </span>
              {row.email} · {row.phone}
            </p>
            <p>
              <span className="text-muted-foreground">Account manager: </span>
              {row.advisor}
            </p>
            <p className="sm:col-span-2">
              <span className="text-muted-foreground">Notes: </span>
              {row.note ?? 'No notes yet.'}
            </p>
          </div>
        ),
        rowExpandable: (row) => row.status !== 'done',
      }}
    />
  </div>
);

/**
 * Pinned and resizable columns
 *
 * `scroll.x` turns on horizontal scrolling, `fixed` pins a column, and
 * `resizable` lets its edge be dragged.
 */
export const FixedColumns = () => (
  <div className="w-full min-w-0">
    <Table
      rowKey="id"
      dataSource={ROWS}
      scroll={{ x: 1100, y: 320 }}
      columns={[
        {
          title: 'Full name',
          dataIndex: 'name',
          width: 240,
          icon: <FileTextIcon />,
          fixed: 'left',
          resizable: true,
        },
        {
          title: 'Course',
          dataIndex: 'course',
          width: 200,
          icon: <CalendarIcon />,
          resizable: true,
        },
        {
          title: 'Email',
          dataIndex: 'email',
          width: 240,
          icon: <MailIcon />,
          ellipsis: true,
        },
        { title: 'Phone', dataIndex: 'phone', width: 150 },
        { title: 'Account manager', dataIndex: 'advisor', width: 180 },
        { title: 'Created', dataIndex: 'createdAt', width: 150 },
        {
          title: 'Tuition',
          dataIndex: 'fee',
          width: 170,
          align: 'right',
          icon: <WalletIcon />,
          render: (value) => `${Number(value).toLocaleString('vi-VN')} ₫`,
        },
      ]}
    />
  </div>
);

/**
 * Per-row actions
 *
 * `rowActions` pins a narrow column to the right — the home of the overflow
 * menu.
 */
export const RowActions = () => (
  <div className="w-full min-w-0">
    <Table
      rowKey="id"
      columns={BASIC}
      dataSource={ROWS.slice(0, 3)}
      rowActions={(row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              aria-label="Actions"
            >
              <MoreVerticalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => toast(row.name)}>
              View details
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    />
  </div>
);

/**
 * Pagination
 *
 * The table never slices the data: `dataSource` is always exactly the current
 * page, and `pagination` only draws the controls.
 */
export const Pagination = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);

  const paged = useMemo(
    () => ROWS.slice((page - 1) * pageSize, page * pageSize),
    [page, pageSize],
  );

  return (
    <div className="w-full min-w-0">
      <Table
        rowKey="id"
        columns={BASIC}
        dataSource={paged}
        pagination={{
          page,
          pageSize,
          total: ROWS.length,
          pageSizeOptions: [3, 5, 10],
          showLessItems: true,
          showTotal: (total, [from, to]) => `${from}–${to} of ${total}`,
          onChange: (nextPage, nextSize) => {
            setPage(nextPage);
            setPageSize(nextSize);
          },
        }}
      />
    </div>
  );
};

/**
 * Loading and empty
 */
export const LoadingAndEmpty = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="grid w-full min-w-0 gap-6">
      <div>
        <Button
          size="sm"
          variant="secondary"
          className="mb-3"
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 1500);
          }}
        >
          Try loading
        </Button>
        <Table
          rowKey="id"
          columns={BASIC}
          dataSource={loading ? [] : ROWS.slice(0, 3)}
          loading={loading}
          loadingRows={3}
        />
      </div>

      <Table rowKey="id" columns={BASIC} dataSource={[]} />
    </div>
  );
};
