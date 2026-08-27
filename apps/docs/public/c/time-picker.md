# TimePicker

Pick a time by column, 12h or 24h, ranges included.

```tsx
import { TimeField, TimePanel, TimePicker, TimeRangePicker, TimeSegments } from '@antkit/react';
```

A time field with a list of times attached.

```tsx
<TimePicker value={time} onChange={setTime} format="HH:mm" minuteStep={15} />
```

Both halves edit the same value: type into the segments, or open the panel
and click down the columns. Each click commits and `OK` only closes the
panel, so a picked time is never lost by clicking away.

The date half of the value is preserved, which is what lets this sit beside
a `DatePicker` over one `Date` without either of them fighting the other.

## Props

- `onChange`
- `open`
- `defaultOpen`
- `onOpenChange`
- `showNow`
- `nowText`
- `okText`
- `openLabel`
- `align`
- `side`
- `prefix`
- `className`
- `panelClassName`

Source: `@antkit/react/src/components/time-picker/time-picker.tsx`
