# Radio

Pick one of several, with an optional line of help under each label.

```tsx
import { Radio, RadioGroup, RadioGroupItem } from '@antkit/react';
```

A set of mutually exclusive choices.

```tsx
<RadioGroup defaultValue="now">
  <Radio value="now">Run now</Radio>
  <Radio value="cron" description="On the schedule you set">Schedule</Radio>
</RadioGroup>
```

Pass `orientation="horizontal"` for a row — that also switches the arrow keys
Radix listens to, so it is not only a layout change.

## Props

- `description`

Source: `@antkit/react/src/components/radio/radio.tsx`
