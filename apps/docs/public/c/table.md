# Table

The data grid: sorting, row selection, fixed and resizable columns, expandable rows, pagination.

```tsx
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRoot, TableRow } from '@antkit/react';
```

Data grid with the pieces an admin table actually needs: a sticky header over
a scrolling body, columns pinned left/right, resizing, sorting, row selection,
expandable detail rows and a pinned actions column.

```tsx
<Table
  rowKey="id"
  dataSource={rows}
  maxHeight="calc(100dvh - 14rem)"
  rowSelection={{ selectedRowKeys: selected, onChange: setSelected }}
  rowActions={(row) => <RowMenu row={row} />}
  columns={[
    { title: 'Name', dataIndex: 'name', width: 400, icon: <FileTextIcon />, resizable: true, sorter: true },
    { title: 'Date', dataIndex: 'date', width: 150, fixed: 'left' },
  ]}
/>
```

Layout is `table-fixed`: columns have stable pixel widths, while the table
can still grow to fill a wide container and scroll naturally on narrow ones.

## Props

- `columns`
- `dataSource`
- `rowKey`
- `loading`
- `loadingRows`
- `empty`
- `onRowClick`
- `rowClassName`
- `rowSelection`
- `expandable`
- `rowActions`
- `actionsWidth`
- `maxHeight`
- `scroll`
- `headerHeight`
- `classNames`
- `styles`
- `stickyHeader`
- `sort`
- `defaultSort`
- `onSortChange`
- `columnWidths`
- `defaultColumnWidths`
- `onColumnWidthsChange`
- `minColumnWidth`
- `pagination`
- `className`

Source: `@antkit/react/src/components/table/table.tsx`
