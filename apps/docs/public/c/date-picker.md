# DatePicker

Type into dd/mm/yyyy segments or open the calendar; ranges included.

```tsx
import { Calendar, DateField, DateInputBox, DatePicker, DateRangePicker, DateSegments } from '@antkit/react';
```

A date field with a calendar attached.

```tsx
<DatePicker value={date} onChange={setDate} min={new Date()} clearable />
```

Both halves edit the same value: type into the segments, or open the
calendar and click. The popover anchors to the whole field rather than to
the button, so it lines up with the text under it.

## Props

- `open`
- `defaultOpen`
- `onOpenChange`
- `closeOnSelect`
- `calendarLabels`
- `openLabel`
- `align`
- `side`
- `prefix`
- `className`
- `calendarClassName`

Source: `@antkit/react/src/components/date-picker/date-picker.tsx`
