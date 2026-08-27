# Statistic

A headline number with a prefix, suffix and trend.

```tsx
import { Statistic } from '@antkit/react';
```

One number, presented. Drop a few into a `Card` grid for a dashboard.

```tsx
<Statistic title="Revenue this month" value={125_400} prefix="$" trend="up" delta="+12.4%" />
```

## Props

- `title`
- `value`
- `precision`
- `locale`
- `formatter`
- `prefix`
- `suffix`
- `trend`
- `delta`
- `loading`
- `valueClassName`

Source: `@antkit/react/src/components/statistic/statistic.tsx`
