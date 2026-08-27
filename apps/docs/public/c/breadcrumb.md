# Breadcrumb

The trail of ancestors above the current page.

```tsx
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@antkit/react';
```

The trail of ancestors above the current page.

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Invoices</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

`Steps` for progress through a task — a breadcrumb says where a page sits,
not how far along you are.

The last crumb is a `BreadcrumbPage`, not a `BreadcrumbLink`: it carries
`aria-current="page"` and does not link to where you already are.
`BreadcrumbLink` takes `asChild` for a router link, and
`BreadcrumbEllipsis` collapses the middle of a long trail.


Source: `@antkit/react/src/components/breadcrumb/breadcrumb.tsx`
