# Steps

Progress through a multi-step task, horizontally or vertically.

```tsx
import { Steps } from '@antkit/react';
```

Progress through a multi-step task — a wizard, an import,
an approval chain.

```tsx
<Steps
  current={step}
  onChange={setStep}
  items={[
    { title: 'Details', description: 'Name and contact' },
    { title: 'Course' },
    { title: 'Payment' },
  ]}
/>
```

Everything before `current` reads as finished, everything after as waiting.
Set `status="error"` to mark the current step as failed, or pin a single step
with its own `status` when the order isn't strictly linear.

## Props

- `items`
- `current`
- `status`
- `direction`
- `size`
- `onChange`
- `className`

Source: `@antkit/react/src/components/steps/steps.tsx`
