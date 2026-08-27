# Gantt

A schedule by day, week or month, with markers and zoom.

```tsx
import { Gantt } from '@antkit/react';
```

Timeline chart: one lane per row, bars positioned by date.

```tsx
<Gantt
  unit="day"
  rows={rows}
  markers={[{ id: 'ship', date: releaseDate, label: 'Handover' }]}
  onItemClick={(item) => open(item.id)}
/>
```

Layout runs off one number — pixels per day — so bars, ruler, grid lines,
weekend shading and markers all derive from it and can never drift apart.
`unit` picks the natural day width and how the two ruler tiers are labelled;
`zoom` scales it.

The chart renders and reads a timeline. It does not drag bars to reschedule.

## Props

- `rows`
- `markers`
- `from`
- `to`
- `unit`
- `zoom`
- `labelWidth`
- `rowHeight`
- `maxHeight`
- `sidebarTitle`
- `onItemClick`
- `onRowClick`
- `scrollToToday`
- `locale`
- `className`

Source: `@antkit/react/src/components/gantt/gantt.tsx`
