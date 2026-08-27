# Pagination

Page numbers, with a size changer, a jump-to box and a simple mode.

```tsx
import { Pagination } from '@antkit/react';
```

Page numbers, with an optional size changer and jump-to box. Controlled:
it holds no page of its own, so `page` is whatever you last stored.

```tsx
<Pagination
  page={page}
  pageSize={size}
  total={total}
  showSizeChanger
  showTotal={(count, [from, to]) => `${from}-${to} of ${count}`}
  onChange={(nextPage, nextSize) => {
    setPage(nextPage);
    setSize(nextSize);
  }}
/>
```

`Table` renders one for you when you pass it a `pagination` prop — reach for
this directly when the paged thing is not a table: a card grid, a feed, a
list of search results.

`onChange` carries both values because changing the page size also changes
the page: picking a new size sends you back to page 1 rather than guessing
which page your old rows moved to. Store both from the same call, or you
will render page 8 of a list that now has three pages.

## Props

- `page`
- `pageSize`
- `total`
- `onChange`
- `pageSizeOptions`
- `showSizeChanger`
- `showQuickJumper`
- `showLessItems`
- `boundaries`
- `siblings`
- `simple`
- `size`
- `variant`
- `disabled`
- `hideOnSinglePage`
- `onShowSizeChange`
- `showTotal`
- `className`

Source: `@antkit/react/src/components/pagination/pagination.tsx`
