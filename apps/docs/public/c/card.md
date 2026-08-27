# Card

A content block with a header, description, body and footer.

```tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@antkit/react';
```

A bordered block of content. Every part is optional and every one is a plain
`<div>`, so a card is composed rather than configured.

```tsx
<Card>
  <CardHeader>
    <CardTitle>Monthly report</CardTitle>
    <CardDescription>Generated on the first of each month.</CardDescription>
  </CardHeader>
  <CardContent>{summary}</CardContent>
  <CardFooter className="justify-end">
    <Button>Download</Button>
  </CardFooter>
</Card>
```

`Descriptions` for label/value pairs, `Statistic` for a single number,
`Modal` when the content should interrupt rather than sit in the page.

The root owns the vertical padding and the parts own the horizontal, so a
full-bleed image inside `CardContent` wants `-mx-6` rather than a padding
override on the card.


Source: `@antkit/react/src/components/card/card.tsx`
