# Calendar

A calendar mounted straight into the page, for a date or a range.

```tsx
import { Calendar } from '@antkit/react';
```

A month grid with single or range selection.

```tsx
<Calendar selected={date} onSelect={setDate} min={new Date()} />

<Calendar mode="range" numberOfMonths={2} selected={range} onSelect={setRange} />
```

Arrow keys walk the grid, PageUp/PageDown change month (add Shift for a
year), and focus follows the selection across month boundaries — only the
focused day is tabbable, so tabbing past the calendar takes one press.

`DatePicker` and `DateRangePicker` wrap this with a text field; use the
calendar on its own when it should stay open on the page.


Source: `@antkit/react/src/components/date-picker/calendar.tsx`
