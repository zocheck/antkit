# Result

A result page for success and for 403 / 404 / 500.

```tsx
import { Result } from '@antkit/react';
```

A whole-page outcome: submitted, denied, not found, blew up. `Empty` is for a
container with nothing in it; `Alert` is for a message beside other content.

```tsx
<Result
  status="success"
  title="Campaign created"
  subTitle="Email goes out at 09:00 tomorrow."
  extra={<Button>Back to the list</Button>}
/>
```

## Props

- `status`
- `title`
- `subTitle`
- `icon`
- `extra`
- `children`

Source: `@antkit/react/src/components/result/result.tsx`
